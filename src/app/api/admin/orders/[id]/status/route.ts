import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { sendShippedEmail } from "@/lib/emails";

const schema = z.object({
  status: z.enum(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  trackingNumber: z.string().optional(),
  courier: z.string().optional(),
  note: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ message: "Invalid data." }, { status: 400 });

  const { status, trackingNumber, courier, note } = parsed.data;

  try {
    await db.$transaction(async (tx: any) => {
      await tx.order.update({ where: { id }, data: { status } });
      await tx.orderStatusHistory.create({
        data: { orderId: id, status, note: note ?? null },
      });

      if (status === "SHIPPED" && (trackingNumber || courier)) {
        await tx.shipment.upsert({
          where: { orderId: id },
          create: {
            orderId: id,
            courier: courier ?? "",
            trackingNumber: trackingNumber ?? null,
            shippedAt: new Date(),
          },
          update: {
            courier: courier ?? "",
            trackingNumber: trackingNumber ?? null,
            shippedAt: new Date(),
          },
        });
      }
    });

    if (status === "SHIPPED") {
      db.order.findUnique({
        where: { id },
        include: { user: { select: { email: true, name: true } } },
      }).then(async (order) => {
        if (!order) return;
        const customerEmail = order.guestEmail ?? (order as any).user?.email;
        if (!customerEmail) return;
        const shippingAddr = order.shippingAddress as Record<string, string> | null;
        const firstName = shippingAddr?.name?.split(" ")[0]
          ?? order.guestName
          ?? (order as any).user?.name?.split(" ")[0]
          ?? "there";
        await sendShippedEmail(customerEmail, {
          firstName,
          orderNumber: order.orderNumber,
          carrier: courier ?? "",
          trackingNumber: trackingNumber ?? "",
        }).catch(() => {});
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/orders/status]", err);
    return NextResponse.json({ message: "Failed to update order." }, { status: 500 });
  }
}
