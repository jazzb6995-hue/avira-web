import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/emails";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payment data." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = parsed.data;

  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ message: "Payment verification failed." }, { status: 400 });
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ orderNumber: order.orderNumber });
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          payment: {
            create: {
              gatewayOrderId: razorpay_order_id,
              gatewayPaymentId: razorpay_payment_id,
              gatewaySignature: razorpay_signature,
              amount: order.total,
              currency: "INR",
              status: "PAID",
              method: "razorpay",
            },
          },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "CONFIRMED",
          note: `Payment captured. Razorpay payment ID: ${razorpay_payment_id}`,
        },
      });

      if (order.couponCode) {
        const coupon = await tx.coupon.findFirst({ where: { code: order.couponCode } });
        if (coupon) {
          await tx.promotion.update({
            where: { id: coupon.promotionId },
            data: { usageCount: { increment: 1 } },
          });
          if (order.userId) {
            await tx.couponRedemption.create({
              data: { couponId: coupon.id, userId: order.userId, orderId },
            });
          }
        }
      }

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

    try {
      const fullOrder = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true, user: { select: { email: true, name: true } } },
      });
      if (fullOrder) {
        const customerEmail = fullOrder.guestEmail ?? fullOrder.user?.email;
        const shippingAddr = fullOrder.shippingAddress as Record<string, string> | null;
        const firstName = shippingAddr?.name?.split(" ")[0]
          ?? fullOrder.guestName
          ?? fullOrder.user?.name?.split(" ")[0]
          ?? "there";
        if (customerEmail) {
          await sendOrderConfirmationEmail(customerEmail, {
            orderNumber: fullOrder.orderNumber,
            firstName,
            items: fullOrder.items.map((i) => ({
              title: i.snapshotTitle,
              qty: i.quantity,
              price: Number(i.snapshotPrice),
            })),
            subtotal: Number(fullOrder.subtotal),
            shipping: Number(fullOrder.shippingAmount),
            discount: Number(fullOrder.discountAmount),
            total: Number(fullOrder.total),
          });
        }
      }
    } catch {
      // Email errors must never block payment confirmation
    }

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[verify-payment]", err);
    return NextResponse.json({ message: "Payment verified but order update failed. Contact support." }, { status: 500 });
  }
}
