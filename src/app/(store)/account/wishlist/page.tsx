import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { ProductCard } from "@/components/ui/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Wishlist | AVIRA" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let products: any[] = [];
  try {
    const wishlist = await db.wishlist.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { media: { take: 2, orderBy: { sortOrder: "asc" } } },
            },
          },
        },
      },
    });

    products = (wishlist?.items ?? [])
      .filter((i: any) => i.product.status === "PUBLISHED")
      .map((i: any) => ({
        id: i.product.id,
        slug: i.product.slug,
        title: i.product.title,
        emotionalName: i.product.emotionalName,
        imageUrl: i.product.media[0]?.url ?? "/placeholder-product.jpg",
        hoverImageUrl: i.product.media[1]?.url ?? null,
        mrp: Number(i.product.mrp),
        salePrice: i.product.salePrice ? Number(i.product.salePrice) : null,
        isNewArrival: i.product.isNewArrival,
        isBestSeller: i.product.isBestSeller,
      }));
  } catch { /* db not connected */ }

  return (
    <div>
      <MotifDivider className="mb-5 max-w-xs" />
      <h1 className="font-[var(--font-display)] text-2xl md:text-3xl mb-6">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="text-[var(--color-warm-grey-light)] mx-auto mb-4" />
          <p className="text-[var(--color-warm-grey)] mb-4">Your wishlist is empty</p>
          <Link href="/new-arrivals" className="text-[var(--color-plum)] underline text-sm">Discover pieces you love</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
