import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrderAmount: z.number().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  perCustomerLimit: z.number().int().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
  isFirstOrderOnly: z.boolean(),
  stackable: z.boolean(),
  singleUse: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { code, type, value, minOrderAmount, usageLimit, perCustomerLimit, expiresAt, isActive, isFirstOrderOnly, stackable, singleUse } = parsed.data;
  const upperCode = code.toUpperCase();

  try {
    const promotion = await db.promotion.create({
      data: {
        name: upperCode,
        internalCode: upperCode,
        discountType: type,
        discountValue: value,
        minimumSpend: minOrderAmount ?? null,
        usageLimit: usageLimit ?? null,
        perCustomerLimit: perCustomerLimit ?? 1,
        firstOrderOnly: isFirstOrderOnly,
        stackable,
        active: isActive,
        endsAt: expiresAt ? new Date(expiresAt) : null,
        coupons: {
          create: {
            code: upperCode,
            singleUse,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            active: isActive,
          },
        },
      },
      include: { coupons: true },
    });
    return NextResponse.json({ id: promotion.coupons[0]?.id ?? promotion.id });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
