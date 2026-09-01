"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SHIPPING } from "@/lib/constants";

export function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const sub = subtotal();
  const shippingFee = sub >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.FLAT_RATE;
  const total = sub + shippingFee;
  const toFreeShipping = SHIPPING.FREE_THRESHOLD - sub;

  // Trap focus
  useEffect(() => {
    if (isOpen) drawerRef.current?.focus();
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
      aria-modal="true"
      role="dialog"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={cn(
          "absolute right-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col shadow-[var(--shadow-modal)] transition-transform duration-300 ease-[var(--ease-avira)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[var(--color-plum)]" />
            <h2 className="font-[var(--font-display)] text-lg">
              Your Cart
              {itemCount() > 0 && (
                <span className="ml-2 text-sm text-[var(--color-warm-grey)] font-sans">
                  ({itemCount()} {itemCount() === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 hover:bg-[var(--color-blush)] transition-colors rounded-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {sub > 0 && (
          <div className="px-6 py-3 bg-[var(--color-ivory)]">
            {toFreeShipping > 0 ? (
              <>
                <p className="text-xs text-[var(--color-charcoal)] mb-2">
                  You're{" "}
                  <strong className="text-[var(--color-plum)]">
                    {formatPrice(toFreeShipping)}
                  </strong>{" "}
                  away from free shipping
                </p>
                <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-plum)] transition-all duration-500"
                    style={{ width: `${Math.min((sub / SHIPPING.FREE_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-[var(--color-plum)] font-medium">
                🎉 You've unlocked free shipping!
              </p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-[var(--color-warm-grey-light)] mb-4" />
              <p className="font-[var(--font-display)] text-xl mb-2">Your cart is empty</p>
              <p className="text-sm text-[var(--color-warm-grey)] mb-6">
                Discover little things that make you beautiful.
              </p>
              <Button variant="primary" onClick={closeCart} size="sm">
                <Link href="/new-arrivals">Shop New Arrivals</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                <Link href={`/products/${item.slug}`} onClick={closeCart} className="flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={80}
                    height={100}
                    className="object-cover bg-[var(--color-cream)] w-20 h-24"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-medium leading-snug hover:text-[var(--color-plum)] transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  {item.colour && (
                    <p className="text-xs text-[var(--color-warm-grey)] mt-0.5">{item.colour}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[var(--color-border)]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-blush)] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-blush)] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  aria-label="Remove item"
                  className="self-start p-1 text-[var(--color-warm-grey)] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-warm-grey)]">Subtotal</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-warm-grey)]">Shipping</span>
              <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t border-[var(--color-border)] pt-3">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" size="lg" className="w-full mt-1">
                Checkout
              </Button>
            </Link>
            <Link href="/cart" onClick={closeCart} className="block text-center text-xs text-[var(--color-warm-grey)] hover:text-[var(--color-charcoal)] transition-colors underline underline-offset-2">
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
