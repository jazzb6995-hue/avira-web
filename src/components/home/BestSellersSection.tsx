import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { db } from "@/lib/db";

async function getBestSellers() {
  try {
    return await db.product.findMany({
      where: { isBestSeller: true, status: "PUBLISHED" },
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
    });
  } catch {
    return [];
  }
}

export async function BestSellersSection() {
  const products = await getBestSellers();
  const displayProducts = products.length > 0
    ? products.map((p) => ({
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
      }))
    : PLACEHOLDER_BEST_SELLERS;

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-[var(--color-cream)]">
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="text-center mb-12">
          <MotifDivider className="mb-6 max-w-xs mx-auto" />
          <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-3">
            Most Loved
          </p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)]">
            Best Sellers
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/best-sellers"
            className="inline-block text-xs tracking-widest uppercase border-b border-[var(--color-charcoal)] pb-0.5 hover:text-[var(--color-plum)] hover:border-[var(--color-plum)] transition-colors"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}

const PLACEHOLDER_BEST_SELLERS = [
  {
    id: "bs-0", slug: "bestseller-1", title: "Pearl Hoop Earrings", emotionalName: "Timeless",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop",
    hoverImageUrl: null, mrp: 1199, salePrice: null, isNewArrival: false, isBestSeller: true,
  },
  {
    id: "bs-1", slug: "bestseller-2", title: "Twisted Gold Bangle", emotionalName: "Timeless",
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80&auto=format&fit=crop",
    hoverImageUrl: null, mrp: 1499, salePrice: null, isNewArrival: false, isBestSeller: true,
  },
  {
    id: "bs-2", slug: "bestseller-3", title: "Delicate Layered Chain", emotionalName: "Timeless",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop",
    hoverImageUrl: null, mrp: 1299, salePrice: null, isNewArrival: false, isBestSeller: true,
  },
  {
    id: "bs-3", slug: "bestseller-4", title: "Statement Ring", emotionalName: "Timeless",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80&auto=format&fit=crop",
    hoverImageUrl: null, mrp: 899, salePrice: null, isNewArrival: false, isBestSeller: true,
  },
];
