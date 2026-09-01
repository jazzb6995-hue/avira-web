import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1).max(50),
  cartItems: z.array(
    z.object({
      productId: z.string(),
      price: z.number(),
      mrp: z.number(),
      quantity: z.number().int().positive(),
    })
  ),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const { code, cartItems, userId } = parsed.data;

  try {
    const coupon = await db.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        promotion: {
          include: {
            eligibleProducts: true,
            excludedProducts: true,
          },
        },
        redemptions: true,
      },
    });

    if (!coupon) {
      return NextResponse.json({ message: "This coupon code is not valid or has expired." }, { status: 400 });
    }

    const { promotion } = coupon;

    if (!promotion.active) {
      return NextResponse.json({ message: "This coupon is no longer active." }, { status: 400 });
    }

    if (promotion.endsAt && promotion.endsAt < new Date()) {
      return NextResponse.json({ message: "This coupon has expired." }, { status: 400 });
    }

    if (promotion.usageLimit !== null && promotion.usageCount >= promotion.usageLimit) {
      return NextResponse.json({ message: "This coupon has reached its usage limit." }, { status: 400 });
    }

    if (userId) {
      const userRedemptions = coupon.redemptions.filter((r) => r.userId === userId);
      if (userRedemptions.length >= promotion.perCustomerLimit) {
        return NextResponse.json({ message: "You have already used this coupon." }, { status: 400 });
      }

      if (promotion.firstOrderOnly) {
        const orderCount = await db.order.count({
          where: { userId, paymentStatus: "PAID" },
        });
        if (orderCount > 0) {
          return NextResponse.json({ message: "This coupon is valid for first orders only." }, { status: 400 });
        }
      }
    }

    // Calculate eligible subtotal (non-discounted products only, per spec)
    const excludedProductIds = new Set(promotion.excludedProducts.map((p: { productId: string }) => p.productId));
    const eligibleProductIds = promotion.eligibleProducts.length > 0
      ? new Set(promotion.eligibleProducts.map((p: { productId: string }) => p.productId))
      : null;

    // Get all product records to check discount status
    const productIds = cartItems.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, salePrice: true },
    });
    const productMap = new Map(products.map((p: { id: string; salePrice: any }) => [p.id, p]));

    let eligibleSubtotal = 0;
    let totalSubtotal = 0;

    for (const item of cartItems) {
      const lineTotal = item.price * item.quantity;
      totalSubtotal += lineTotal;

      const product = productMap.get(item.productId) as { id: string; salePrice: any } | undefined;
      if (!product) continue;

      // Skip if excluded
      if (excludedProductIds.has(item.productId)) continue;

      // Skip if limited to specific products and this isn't one
      if (eligibleProductIds && !eligibleProductIds.has(item.productId)) continue;

      // Skip if product already has sale price (already discounted), unless stacking is on
      const alreadyDiscounted = product.salePrice !== null && product.salePrice !== undefined;
      if (alreadyDiscounted && !promotion.stackable) continue;

      eligibleSubtotal += lineTotal;
    }

    const minEligible = Number(promotion.minimumEligibleSpend ?? promotion.minimumSpend ?? 0);
    const minSpend = Number(promotion.minimumSpend ?? 0);

    if (minSpend > 0 && totalSubtotal < minSpend) {
      return NextResponse.json({
        message: `Minimum order value of ${formatINR(minSpend)} is required for this coupon.`,
      }, { status: 400 });
    }

    if (minEligible > 0 && eligibleSubtotal < minEligible) {
      const shortfall = minEligible - eligibleSubtotal;
      return NextResponse.json({
        message: `This offer applies only to non-discounted products. Your eligible cart value is ${formatINR(eligibleSubtotal)}. Add ${formatINR(shortfall)} more in eligible products to unlock this discount.`,
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promotion.discountType === "PERCENTAGE") {
      discountAmount = Math.round((eligibleSubtotal * Number(promotion.discountValue)) / 100);
    } else {
      discountAmount = Math.min(Number(promotion.discountValue), eligibleSubtotal);
    }

    if (discountAmount <= 0) {
      return NextResponse.json({ message: "This coupon cannot be applied to your current cart." }, { status: 400 });
    }

    return NextResponse.json({
      discount: discountAmount,
      eligibleSubtotal,
      message: `${promotion.discountType === "PERCENTAGE" ? `${promotion.discountValue}%` : formatINR(Number(promotion.discountValue))} discount applied.`,
    });
  } catch (err) {
    console.error("[coupon]", err);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
