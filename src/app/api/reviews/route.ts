import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { auth } from "@/auth";

const schema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: (parsed.error.issues ?? [])[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const { productId, rating, title, body: reviewBody } = parsed.data;

  try {
    const product = await db.product.findUnique({ where: { id: productId, status: "PUBLISHED" } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const review = await db.review.create({
      data: {
        productId,
        userId: session?.user?.id ?? null,
        rating,
        title: title ?? null,
        body: reviewBody,
        status: "PENDING",
      },
    });

    return NextResponse.json({ id: review.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
