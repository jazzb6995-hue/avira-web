import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import Razorpay from "razorpay";
import { generateOrderNumber } from "@/lib/utils";
import { auth } from "@/auth";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? "placeholder",
  });
}

const schema = z.object({
  email: z.string().email(),
  address: z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\d{10}$/),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    title: z.string(),
    slug: z.string(),
    imageUrl: z.string(),
    sku: z.string(),
    colour: z.string().optional(),
    mrp: z.number(),
    price: z.number(),
    quantity: z.number().int().positive(),
  })),
  couponCode: z.string().nullable().optional(),
  couponDiscount: z.number().optional(),
  shippingFee: z.number(),
  total: z.number(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Please sign in to place an order." }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request data." }, { status: 400 });
  }

  const { email, address, items, couponCode, couponDiscount, shippingFee, total } = parsed.data;

  if (items.length === 0) {
    return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
  }

  const clientSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const clientTotal = Math.max(0, clientSubtotal + shippingFee - (couponDiscount ?? 0));
  const diff = Math.abs(clientTotal - total);
  if (diff > 1) {
    return NextResponse.json({ message: "Order total mismatch. Please refresh your cart." }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ message: "Account not found. Please sign in again." }, { status: 401 });
    }

    // Fetch current cost prices from DB for snapshot
    const productIds = items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, status: "PUBLISHED" },
      select: { id: true, costPrice: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const orderNumber = generateOrderNumber();
    const amountPaise = Math.round(clientTotal * 100);

    // Create Razorpay order
    const rzpOrder = await (getRazorpay().orders.create as any)({
      amount: amountPaise,
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber, email },
    });

    // Save delivery address for reference
    const savedAddress = await db.address.create({
      data: {
        userId: user.id,
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 ?? null,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: "India",
        isDefault: false,
      },
    });

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: user.id,
        guestEmail: email,
        guestName: address.name,
        guestPhone: address.phone,
        addressId: savedAddress.id,
        shippingAddress: address,
        shippingAmount: shippingFee,
        discountAmount: couponDiscount ?? 0,
        couponCode: couponCode ?? null,
        couponDiscount: couponDiscount ?? null,
        subtotal: clientSubtotal,
        total: clientTotal,
        paymentStatus: "PENDING",
        status: "NEW",
        items: {
          create: items.map((item) => {
            const dbProd = productMap.get(item.productId);
            return {
              productId: item.productId,
              variantId: item.variantId ?? null,
              quantity: item.quantity,
              snapshotTitle: item.title,
              snapshotSku: item.sku,
              snapshotColour: item.colour ?? null,
              snapshotPrice: item.price,
              snapshotMrp: item.mrp,
              snapshotCost: dbProd?.costPrice ? Number(dbProd.costPrice) : 0,
              snapshotImageUrl: item.imageUrl,
              lineTotal: item.price * item.quantity,
              discountAmount: 0,
            };
          }),
        },
        statusHistory: {
          create: { status: "NEW", note: "Order created, awaiting payment." },
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
    });
  } catch (err) {
    console.error("[orders/create]", err);
    return NextResponse.json({ message: "Failed to create order. Please try again." }, { status: 500 });
  }
}
