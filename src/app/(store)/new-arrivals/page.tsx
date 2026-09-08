import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals | AVIRA",
  description: "The latest additions to AVIRA, fresh styles, little beauties, just in.",
  alternates: { canonical: "/new-arrivals" },
};

export default async function NewArrivalsPage() {
  let products: any[] = [];
  try {
    const data = await db.product.findMany({
      where: { status: "PUBLISHED", isNewArrival: true },
      orderBy: { publishedAt: "desc" },
      include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
    });
    products = data.map((p) => ({
      id: p.id, slug: p.slug, title: p.title, emotionalName: p.emotionalName,
      imageUrl: p.media[0]?.url ?? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop",
      hoverImageUrl: p.media[1]?.url ?? null,
      mrp: Number(p.mrp), salePrice: p.salePrice ? Number(p.salePrice) : null,
      isNewArrival: true, isBestSeller: p.isBestSeller,
    }));
  } catch { /* db not connected */ }

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">New Arrivals</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-2">Fresh styles, just in</p>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-[var(--color-warm-grey)] py-20">Coming soon, check back shortly.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 8} />
          ))}
        </div>
      )}
    </div>
  );
}
