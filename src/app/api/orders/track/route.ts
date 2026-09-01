import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json({ message: "Order number and email are required." }, { status: 400 });
  }

  try {
    const order = await db.order.findFirst({
      where: {
        orderNumber,
        OR: [
          { guestEmail: email },
          { user: { email } },
        ],
      },
      include: {
        items: { select: { id: true, snapshotTitle: true, quantity: true, lineTotal: true } },
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "No order found with those details." }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
      createdAt: order.createdAt,
      items: order.items.map((i) => ({ ...i, lineTotal: Number(i.lineTotal) })),
      shipment: order.shipment ?? null,
    });
  } catch (err) {
    console.error("[orders/track]", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
