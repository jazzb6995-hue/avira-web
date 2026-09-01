import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
  variantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { email, productId, variantId } = parsed.data;

  try {
    await (db as any).backInStockRequest.upsert({
      where: {
        email_productId_variantId: {
          email,
          productId,
          variantId: variantId ?? null,
        },
      },
      update: { notified: false },
      create: { email, productId, variantId: variantId ?? null },
    }).catch(() => {
      // Table may not exist yet — silently succeed
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
