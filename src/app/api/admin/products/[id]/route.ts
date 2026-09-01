import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  emotionalName: z.string().optional(),
  longDescription: z.string().optional(),
  careInstructions: z.string().optional(),
  categoryId: z.string().min(1, "Category required"),
  mrp: z.number().positive(),
  salePrice: z.number().optional(),
  costPrice: z.number().optional(),
  stock: z.number().int().min(0).default(0),
  weightGrams: z.number().optional(),
  material: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()).default([]),
  mediaUrls: z.array(z.string()).default([]),
});

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { tags, mediaUrls, salePrice, costPrice, weightGrams, stock, ...data } = parsed.data;

  try {
    await db.$transaction([
      db.productTag.deleteMany({ where: { productId: id } }),
      db.productMedia.deleteMany({ where: { productId: id } }),
      db.product.update({
        where: { id },
        data: {
          ...data,
          salePrice: salePrice ?? null,
          costPrice: costPrice ?? 0,
          weightGrams: weightGrams ?? null,
          inventory: {
            upsert: {
              create: { stock },
              update: { stock },
            },
          },
          tags: tags.length > 0 ? { create: tags.map((tagId) => ({ tagId })) } : undefined,
          media: mediaUrls.length > 0 ? {
            create: mediaUrls.map((url, i) => ({ url, sortOrder: i, mediaType: "image" })),
          } : undefined,
        },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { id } = await params;
  try {
    await db.product.update({ where: { id }, data: { status: "ARCHIVED" } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to archive product" }, { status: 500 });
  }
}
