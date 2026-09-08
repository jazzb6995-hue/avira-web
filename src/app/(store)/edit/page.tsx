import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AVIRA Edit | AVIRA",
  description: "Our curated selection, the pieces our team loves most right now.",
  alternates: { canonical: "/edit" },
};

export default async function AvirEdit() {
  let products: any[] = [];
  try {
    products = await db.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 24,
      include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
    });
  } catch { /* DB not connected */ }

  const mapped = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    emotionalName: p.emotionalName,
    imageUrl: p.media[0]?.url ?? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop",
    hoverImageUrl: p.media[1]?.url ?? null,
    mrp: Number(p.mrp),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
  }));

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-5xl">The AVIRA Edit</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mt-3 max-w-md mx-auto">
          Our team's current obsessions. Pieces we'd gift, wear, and treasure, curated for you.
        </p>
      </div>

      {mapped.length === 0 ? (
        <p className="text-center text-[var(--color-warm-grey)] py-16">Coming soon, our edit is being curated.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {mapped.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 8} />
          ))}
        </div>
      )}
    </div>
  );
}
