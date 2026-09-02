import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } }).catch(() => null);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at AVIRA`,
    alternates: { canonical: `/category/${slug}` },
  };
}

const PAGE_SIZE = 24;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const sort = sp.sort ?? "newest";
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;

  let category;
  let products: any[] = [];
  let total = 0;

  try {
    category = await db.category.findUnique({ where: { slug, active: true } });
    if (!category) notFound();

    const orderBy =
      sort === "price-asc"
        ? { mrp: "asc" as const }
        : sort === "price-desc"
        ? { mrp: "desc" as const }
        : sort === "best-selling"
        ? { updatedAt: "desc" as const }
        : { publishedAt: "desc" as const };

    const priceFilter: any = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;

    [products, total] = await Promise.all([
      db.product.findMany({
        where: {
          categoryId: category.id,
          status: "PUBLISHED",
          ...(Object.keys(priceFilter).length > 0 ? { mrp: priceFilter } : {}),
        },
        orderBy,
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
      }),
      db.product.count({
        where: {
          categoryId: category.id,
          status: "PUBLISHED",
          ...(Object.keys(priceFilter).length > 0 ? { mrp: priceFilter } : {}),
        },
      }),
    ]);
  } catch {
    notFound();
  }

  const displayProducts = products.map((p) => ({
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

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-charcoal)]">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-[var(--color-warm-grey)] text-sm mt-3 max-w-md mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-xs text-[var(--color-warm-grey)] mt-2">{total} pieces</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="md:w-56 flex-shrink-0">
          <CategoryFilters currentSort={sort} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-display)] text-xl text-[var(--color-charcoal)] mb-2">
                No pieces found
              </p>
              <p className="text-sm text-[var(--color-warm-grey)]">
                Try adjusting your filters or browse all collections.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {displayProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 8} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <a
                      key={i}
                      href={`?page=${i + 1}&sort=${sort}`}
                      className={
                        i + 1 === page
                          ? "w-9 h-9 flex items-center justify-center bg-[var(--color-plum)] text-white text-sm"
                          : "w-9 h-9 flex items-center justify-center border border-[var(--color-border)] text-sm hover:border-[var(--color-plum)] transition-colors"
                      }
                      aria-current={i + 1 === page ? "page" : undefined}
                    >
                      {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
