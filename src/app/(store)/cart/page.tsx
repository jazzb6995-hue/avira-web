"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { MotifDivider } from "@/components/ui/AviraMotif";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, couponCode, couponDiscount, setCoupon, clearCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const sub = subtotal();
  const shippingFee = sub >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.FLAT_RATE;
  const total = sub + shippingFee - (couponDiscount ?? 0);
  const toFreeShipping = SHIPPING.FREE_THRESHOLD - sub;

  const applyCoupon = async () => {
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, cartItems: items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.message ?? "Invalid coupon code.");
      } else {
        setCoupon(couponInput, data.discount);
      }
    } catch {
      setCouponError("Could not apply coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-20 text-center">
        <ShoppingBag size={64} className="text-[var(--color-warm-grey-light)] mx-auto mb-6" />
        <h1 className="font-[var(--font-display)] text-3xl mb-3">Your cart is empty</h1>
        <p className="text-[var(--color-warm-grey)] text-sm mb-8">
          Discover little things that make everyday moments beautiful.
        </p>
        <Link href="/new-arrivals">
          <Button variant="primary" size="lg">Shop New Arrivals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-10">
        <MotifDivider className="mb-6 max-w-xs mx-auto" />
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-5 border-b border-[var(--color-border)] pb-6">
              <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={100}
                  height={125}
                  className="object-cover bg-[var(--color-cream)] w-24 h-32"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-sm hover:text-[var(--color-plum)] transition-colors line-clamp-2">
                  {item.title}
                </Link>
                {item.colour && <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">{item.colour}</p>}
                <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">SKU: {item.sku}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-[var(--color-border)]">
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-blush)]" aria-label="Decrease">
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-blush)]" aria-label="Increase">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.productId, item.variantId)} aria-label="Remove" className="self-start p-1.5 text-[var(--color-warm-grey)] hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-cream)] p-6 sticky top-24">
            <h2 className="font-[var(--font-display)] text-xl mb-5">Order Summary</h2>

            {/* Free shipping bar */}
            {toFreeShipping > 0 && (
              <div className="mb-5">
                <p className="text-xs text-[var(--color-charcoal)] mb-2">
                  Add <strong>{formatPrice(toFreeShipping)}</strong> for free shipping
                </p>
                <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-plum)] rounded-full transition-all" style={{ width: `${Math.min((sub / SHIPPING.FREE_THRESHOLD) * 100, 100)}%` }} />
                </div>
              </div>
            )}

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-0">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  placeholder="Coupon code"
                  className="flex-1 border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-plum)] uppercase"
                />
                <button
                  onClick={applyCoupon}
                  disabled={applyingCoupon || !couponInput}
                  className="border border-l-0 border-[var(--color-border)] px-4 text-xs tracking-widest uppercase hover:bg-[var(--color-blush)] transition-colors disabled:opacity-50"
                >
                  {applyingCoupon ? "…" : "Apply"}
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              {couponCode && !couponError && (
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-green-600 font-medium">✓ {couponCode} applied</p>
                  <button onClick={() => { clearCoupon(); setCouponInput(""); }} className="text-xs text-[var(--color-warm-grey)] underline">Remove</button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-warm-grey)]">Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-warm-grey)]">Shipping</span>
                <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-[var(--color-border)] pt-3">
                <span>Total</span>
                <span>{formatPrice(Math.max(0, total))}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-5">
              <Button variant="primary" size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>

            <Link href="/new-arrivals" className="block text-center text-xs text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)] mt-3 underline underline-offset-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
