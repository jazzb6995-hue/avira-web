"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Share2, MessageCircle, Truck, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calcDiscountPct } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { BackInStockButton } from "@/components/ui/BackInStockButton";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ProductInfoProps {
  product: any;
  avgRating: number;
  reviewCount: number;
}

export function ProductInfo({ product, avgRating, reviewCount }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  const selectedVariant = product.variants.find((v: any) => v.id === selectedVariantId);
  const effectivePrice = Number(
    selectedVariant?.price ?? product.salePrice ?? product.mrp
  );
  const mrp = Number(product.mrp);
  const discountPct = calcDiscountPct(mrp, effectivePrice);
  const stock = selectedVariant?.stock ?? product.inventory?.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAdding(true);
    const firstMedia = selectedVariant?.media[0]?.url ?? product.media[0]?.url ?? "/placeholder-product.jpg";
    addItem({
      id: `${product.id}-${selectedVariantId ?? "default"}`,
      productId: product.id,
      variantId: selectedVariantId ?? undefined,
      title: product.title,
      slug: product.slug,
      imageUrl: firstMedia,
      colour: selectedVariant?.colourName,
      mrp,
      price: effectivePrice,
      quantity,
      sku: selectedVariant?.sku ?? product.sku,
    });
    setTimeout(() => setAdding(false), 600);
  };

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMsg({ text: "Please enter a valid 6-digit pincode.", ok: false });
      return;
    }
    setPincodeMsg({ text: `Delivery to ${pincode} in 3–5 business days.`, ok: true });
  };

  const whatsappMsg = encodeURIComponent(`Hi AVIRA! I have a question about ${product.title}.`);

  return (
    <div className="space-y-6 py-2">
      {/* Title Block */}
      <div>
        {product.emotionalName && (
          <p className="text-xs text-[var(--color-warm-grey)] tracking-widest uppercase mb-2">
            {product.emotionalName}
          </p>
        )}
        <h1 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-charcoal)] leading-snug">
          {product.title}
        </h1>

        {/* Rating */}
        {reviewCount > 0 && (
          <button
            onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(avgRating)
                      ? "fill-[var(--color-rose-gold)] text-[var(--color-rose-gold)]"
                      : "text-[var(--color-border)]"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-[var(--color-warm-grey)]">
              {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </button>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-[var(--color-charcoal)]">
          {formatPrice(effectivePrice)}
        </span>
        {discountPct > 0 && (
          <>
            <span className="text-base text-[var(--color-warm-grey)] line-through">
              {formatPrice(mrp)}
            </span>
            <span className="text-sm font-medium text-[var(--color-plum)] bg-[var(--color-blush)] px-2 py-0.5">
              -{discountPct}%
            </span>
          </>
        )}
      </div>

      {/* Colour variants */}
      {product.hasMultipleColours && product.variants.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--color-charcoal)] mb-3">
            Colour:{" "}
            <span className="font-medium">
              {selectedVariant?.colourName ?? "Select"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                title={variant.colourName}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all",
                  selectedVariantId === variant.id
                    ? "border-[var(--color-plum)] scale-110"
                    : "border-[var(--color-border)] hover:scale-105"
                )}
                style={{ backgroundColor: variant.hexValue ?? "#ccc" }}
                aria-label={variant.colourName}
                aria-pressed={selectedVariantId === variant.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <div>
        {isOutOfStock ? (
          <span className="text-sm text-red-500 font-medium">Out of Stock</span>
        ) : isLowStock ? (
          <span className="text-sm text-orange-500 font-medium">Only {stock} left</span>
        ) : (
          <span className="text-sm text-green-600 font-medium">In Stock</span>
        )}
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-[var(--color-border)] w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-12 flex items-center justify-center hover:bg-[var(--color-blush)] transition-colors text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="w-10 h-12 flex items-center justify-center hover:bg-[var(--color-blush)] transition-colors text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          loading={adding}
          className="flex-1"
        >
          {isOutOfStock ? "Out of Stock" : adding ? "Added!" : "Add to Cart"}
        </Button>

        <button
          onClick={() => toggle(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "w-12 h-12 border flex items-center justify-center transition-colors",
            isWishlisted
              ? "border-[var(--color-plum)] bg-[var(--color-blush)]"
              : "border-[var(--color-border)] hover:border-[var(--color-plum)] hover:bg-[var(--color-blush)]"
          )}
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-[var(--color-plum)] text-[var(--color-plum)]" : ""}
          />
        </button>
      </div>

      {isOutOfStock && (
        <BackInStockButton
          productId={product.id}
          variantId={selectedVariant?.id}
        />
      )}

      {/* Shipping & Trust */}
      <div className="space-y-2.5 border-t border-[var(--color-border)] pt-5">
        <div className="flex items-center gap-2.5 text-sm text-[var(--color-warm-grey)]">
          <Truck size={15} className="text-[var(--color-plum)] flex-shrink-0" />
          Free shipping on orders above ₹500
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[var(--color-warm-grey)]">
          <ShieldCheck size={15} className="text-[var(--color-plum)] flex-shrink-0" />
          Secure prepaid checkout · No COD
        </div>
      </div>

      {/* Pincode Checker */}
      <div>
        <p className="text-xs text-[var(--color-charcoal)] font-medium mb-2 uppercase tracking-wider">
          Check Delivery
        </p>
        <div className="flex gap-0 max-w-xs">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter pincode"
            className="flex-1 border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] transition-colors"
          />
          <button
            onClick={checkPincode}
            className="border border-l-0 border-[var(--color-border)] px-4 text-xs tracking-widest uppercase hover:bg-[var(--color-blush)] transition-colors"
          >
            Check
          </button>
        </div>
        {pincodeMsg && (
          <p className={cn("text-xs mt-1.5", pincodeMsg.ok ? "text-green-600" : "text-red-500")}>
            {pincodeMsg.text}
          </p>
        )}
      </div>

      {/* Share & WhatsApp */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-warm-grey)]">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-[var(--color-charcoal)] transition-colors"
        >
          <MessageCircle size={14} /> Ask on WhatsApp
        </a>
        <button
          onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
          className="flex items-center gap-1.5 hover:text-[var(--color-charcoal)] transition-colors"
        >
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  );
}
