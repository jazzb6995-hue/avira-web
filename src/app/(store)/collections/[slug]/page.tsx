import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { MotifDivider } from "@/components/ui/AviraMotif";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findUnique({ where: { slug } }).catch(() => null);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: `${collection.name} | AVIRA`,
    description: collection.description ?? `Shop ${collection.name} at AVIRA`,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  let collection: any = null;
  let products: any[] = [];

  try {
    collection = await db.collection.findUnique({
      where: { slug, active: true },
      include: {
        products: {
          include: {
            product: {
              include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!collection) notFound();

    products = collection.products
      .filter((pc: any) => pc.product.status === "PUBLISHED")
      .map((pc: any) => ({
        id: pc.product.id,
        slug: pc.product.slug,
        title: pc.product.title,
        emotionalName: pc.product.emotionalName,
        imageUrl: pc.product.media[0]?.url ?? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop",
        hoverImageUrl: pc.product.media[1]?.url ?? null,
        mrp: Number(pc.product.mrp),
        salePrice: pc.product.salePrice ? Number(pc.product.salePrice) : null,
        isNewArrival: pc.product.isNewArrival,
        isBestSeller: pc.product.isBestSeller,
      }));
  } catch {
    notFound();
  }

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">{collection.name}</h1>
        {collection.description && (
          <p className="text-[var(--color-warm-grey)] text-sm mt-2 max-w-md mx-auto">{collection.description}</p>
        )}
        <p className="text-xs text-[var(--color-warm-grey)] mt-2">{products.length} pieces</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-[var(--color-warm-grey)] py-16">No products in this collection yet.</p>
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
