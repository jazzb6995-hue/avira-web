import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  try {
    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { emotionalName: { contains: q, mode: "insensitive" } },
            { longDescription: { contains: q, mode: "insensitive" } },
            { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
          ],
        },
        take: 8,
        select: {
          id: true, title: true, slug: true, mrp: true, salePrice: true,
          media: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } },
        },
      }),
      db.category.findMany({
        where: { active: true, name: { contains: q, mode: "insensitive" } },
        take: 4,
        select: { id: true, name: true, slug: true },
      }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id, title: p.title, slug: p.slug,
        mrp: Number(p.mrp),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        imageUrl: p.media[0]?.url ?? null,
      })),
      categories,
    });
  } catch (err) {
    console.error("[search]", err);
    return NextResponse.json({ products: [], categories: [] });
  }
}
