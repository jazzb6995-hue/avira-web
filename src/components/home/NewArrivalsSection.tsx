import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { db } from "@/lib/db";

async function getNewArrivals() {
  try {
    return await db.product.findMany({
      where: { isNewArrival: true, status: "PUBLISHED" },
      take: 8,
      orderBy: { publishedAt: "desc" },
      include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
    });
  } catch {
    return [];
  }
}

export async function NewArrivalsSection() {
  const products = await getNewArrivals();

  // Placeholder data when DB not available
  const displayProducts =
    products.length > 0
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
      : PLACEHOLDER_PRODUCTS;

  return (
    <section className="pt-16 md:pt-24 pb-8 md:pb-10 px-4 md:px-8 max-w-[var(--container-max)] mx-auto">
      <div className="text-center mb-12">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <p className="text-xs tracking-[0.3em] text-[var(--color-warm-grey)] uppercase mb-3">
          Just Landed
        </p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)]">
          New at AVIRA
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/new-arrivals"
          className="inline-block text-xs tracking-widest uppercase border-b border-[var(--color-charcoal)] pb-0.5 hover:text-[var(--color-plum)] hover:border-[var(--color-plum)] transition-colors"
        >
          View All New Arrivals
        </Link>
      </div>
    </section>
  );
}

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9519f94c5eb8?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80&auto=format&fit=crop",
];

const PLACEHOLDER_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  slug: `product-${i + 1}`,
  title: ["Meher Earrings", "Lila Bracelet", "Zara Necklace", "Aria Ring", "Pearl Drop Studs", "Gold Huggies", "Layered Chain", "Charm Bangle"][i],
  emotionalName: "A little colour for your everyday",
  imageUrl: PRODUCT_IMAGES[i],
  hoverImageUrl: null,
  mrp: [999, 1299, 1499, 799, 899, 1099, 1599, 699][i],
  salePrice: i % 3 === 0 ? [799, null, 1199, null, 699, null, 1299, null][i] : null,
  isNewArrival: true,
  isBestSeller: i % 4 === 0,
}));
