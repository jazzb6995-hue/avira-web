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

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { code, type, value, minOrderAmount, usageLimit, perCustomerLimit, expiresAt, isActive, isFirstOrderOnly, stackable, singleUse } = parsed.data;

  try {
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.$transaction([
      db.coupon.update({
        where: { id },
        data: {
          code: code.toUpperCase(),
          singleUse,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          active: isActive,
        },
      }),
      db.promotion.update({
        where: { id: coupon.promotionId },
        data: {
          discountType: type,
          discountValue: value,
          minimumSpend: minOrderAmount ?? null,
          usageLimit: usageLimit ?? null,
          perCustomerLimit: perCustomerLimit ?? 1,
          firstOrderOnly: isFirstOrderOnly,
          stackable,
          active: isActive,
          endsAt: expiresAt ? new Date(expiresAt) : null,
        },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}
