import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductDetails } from "@/components/product/ProductDetails";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ReviewsPanel } from "@/components/product/ReviewsPanel";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return db.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      collections: { include: { collection: true } },
      media: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { status: "PUBLISHED" },
        include: { media: { orderBy: { sortOrder: "asc" } } },
        orderBy: { colourName: "asc" },
      },
      inventory: true,
      reviews: {
        where: { status: "APPROVED" },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      wearItWith: {
        include: {
          target: {
            include: { media: { take: 1, orderBy: { sortOrder: "asc" } } },
          },
        },
      },
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const image = product.media[0]?.url;
  const price = Number(product.salePrice ?? product.mrp);

  return {
    title: product.seoTitle ?? product.title,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: {
      title: product.seoTitle ?? product.title,
      description: product.seoDescription ?? product.shortDescription ?? undefined,
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.title }] : [],
      type: "website",
    },
    alternates: { canonical: absoluteUrl(`/products/${product.slug}`) },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "INR",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch {
    product = null;
  }

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription ?? product.longDescription ?? undefined,
    sku: product.sku,
    brand: { "@type": "Brand", name: "AVIRA" },
    image: product.media.slice(0, 5).map((m) => m.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Number(product.salePrice ?? product.mrp),
      availability:
        (product.inventory?.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.slug}`),
      priceValidUntil: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-4 md:px-8 py-3 text-xs text-[var(--color-warm-grey)] max-w-[var(--container-max)] mx-auto">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><a href="/" className="hover:text-[var(--color-plum)]">Home</a></li>
          <li aria-hidden="true">/</li>
          <li><a href={`/category/${product.category.slug}`} className="hover:text-[var(--color-plum)]">{product.category.name}</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--color-charcoal)]">{product.title}</li>
        </ol>
      </nav>

      {/* Main Product Grid */}
      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <ProductGallery
            media={product.media.map((m) => ({ url: m.url, altText: m.altText ?? product.title, mediaType: m.mediaType }))}
            variants={product.variants.map((v) => ({
              id: v.id,
              colourName: v.colourName,
              hexValue: v.hexValue,
              media: v.media.map((m) => ({ url: m.url, altText: m.altText ?? v.colourName })),
            }))}
          />
          <ProductInfo product={product} avgRating={avgRating} reviewCount={product.reviews.length} />
        </div>

        {/* Below fold sections */}
        <MotifDivider className="my-12 max-w-xs mx-auto" />
        <ProductDetails product={product} />

        {product.wearItWith.length > 0 && (
          <>
            <MotifDivider className="my-12 max-w-xs mx-auto" />
            <RelatedProducts
              heading="Style It With"
              products={product.wearItWith.map((w) => ({
                id: w.target.id,
                slug: w.target.slug,
                title: w.target.title,
                emotionalName: w.target.emotionalName,
                imageUrl: w.target.media[0]?.url ?? "/placeholder-product.jpg",
                mrp: Number(w.target.mrp),
                salePrice: w.target.salePrice ? Number(w.target.salePrice) : null,
                isNewArrival: w.target.isNewArrival,
                isBestSeller: w.target.isBestSeller,
              }))}
            />
          </>
        )}

        <MotifDivider className="my-12 max-w-xs mx-auto" />
        <ReviewsPanel reviews={product.reviews} avgRating={avgRating} productId={product.id} />
      </div>
    </>
  );
}
