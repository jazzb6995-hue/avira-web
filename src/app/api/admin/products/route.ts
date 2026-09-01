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

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", issues: parsed.error.issues }, { status: 400 });
  }

  const { tags, mediaUrls, salePrice, costPrice, weightGrams, stock, ...data } = parsed.data;

  try {
    const product = await db.product.create({
      data: {
        ...data,
        salePrice: salePrice ?? null,
        costPrice: costPrice ?? 0,
        weightGrams: weightGrams ?? null,
        inventory: { create: { stock } },
        tags: tags.length > 0 ? { create: tags.map((tagId) => ({ tagId })) } : undefined,
        media: mediaUrls.length > 0 ? {
          create: mediaUrls.map((url, i) => ({ url, sortOrder: i, mediaType: "image" })),
        } : undefined,
      },
    });
    return NextResponse.json({ id: product.id });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
