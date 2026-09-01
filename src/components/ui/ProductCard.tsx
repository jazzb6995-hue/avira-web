"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn, formatPrice, calcDiscountPct } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  emotionalName?: string | null;
  imageUrl: string;
  hoverImageUrl?: string | null;
  mrp: number;
  salePrice?: number | null;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isInDiscountSection?: boolean;
  colour?: string | null;
}

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  const effectivePrice = product.salePrice ?? product.mrp;
  const discountPct = product.salePrice
    ? calcDiscountPct(product.mrp, product.salePrice)
    : 0;

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-[var(--color-cream)] aspect-[3/4]">
        <Image
          src={hovered && product.hoverImageUrl ? product.hoverImageUrl : product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-[var(--duration-slow)] object-center",
            hovered ? "scale-105" : "scale-100"
          )}
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-[var(--color-charcoal)] text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              New
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-[var(--color-plum)] text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              -{discountPct}%
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-[var(--color-rose-gold)] text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-200",
            "opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100",
            "hover:bg-white active:scale-90"
          )}
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors",
              isWishlisted
                ? "fill-[var(--color-plum)] text-[var(--color-plum)]"
                : "text-[var(--color-charcoal)]"
            )}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-2">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-xs text-[var(--color-warm-grey)] tracking-widest uppercase mb-0.5 truncate">
            {product.emotionalName ?? "AVIRA"}
          </p>
          <h3 className="text-sm font-medium text-[var(--color-charcoal)] leading-snug line-clamp-2 group-hover:text-[var(--color-plum)] transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-semibold text-[var(--color-charcoal)]">
              {formatPrice(effectivePrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-[var(--color-warm-grey)] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </article>
  );
}
