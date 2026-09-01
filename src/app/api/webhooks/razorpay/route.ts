import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSig !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try { event = JSON.parse(body); } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event.event;

  try {
    if (eventType === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      if (!payment) return NextResponse.json({ ok: true });

      // Find order via the orderNumber stored in Razorpay notes
      const orderNumber: string | undefined = payment.notes?.orderNumber;
      if (!orderNumber) return NextResponse.json({ ok: true });

      const order = await db.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (!order || order.paymentStatus === "PAID") {
        return NextResponse.json({ ok: true });
      }

      await db.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            payment: {
              upsert: {
                create: {
                  gatewayOrderId: payment.order_id,
                  gatewayPaymentId: payment.id,
                  amount: order.total,
                  currency: "INR",
                  status: "PAID",
                  method: payment.method ?? "razorpay",
                },
                update: { status: "PAID" },
              },
            },
          },
        });

        await tx.orderStatusHistory.create({
          data: { orderId: order.id, status: "CONFIRMED", note: "Payment confirmed via webhook." },
        });

        for (const item of order.items) {
          if (item.variantId) {
            await tx.variantInventory.updateMany({
              where: { variantId: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            await tx.inventory.updateMany({
              where: { productId: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      });
    }

    if (eventType === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      if (!payment) return NextResponse.json({ ok: true });

      const orderNumber: string | undefined = payment.notes?.orderNumber;
      if (!orderNumber) return NextResponse.json({ ok: true });

      const order = await db.order.findUnique({ where: { orderNumber } });

      if (order && order.paymentStatus === "PENDING") {
        await db.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED", status: "PAYMENT_FAILED" },
        });
        await db.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "PAYMENT_FAILED",
            note: `Payment failed: ${payment.error_description ?? "Unknown error"}`,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[razorpay-webhook]", err);
    return NextResponse.json({ ok: true });
  }
}
