"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLineItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  slug: string;
  imageUrl: string;
  colour?: string;
  mrp: number;
  price: number;
  quantity: number;
  sku: string;
}

interface CartState {
  items: CartLineItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartLineItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: "",
      couponDiscount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, item], isOpen: true });
        }
      },

      removeItem: (productId, variantId) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, variantId, qty) => {
        if (qty < 1) {
          get().removeItem(productId, variantId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      setCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),

      clearCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "avira-cart",
      partialize: (s) => ({
        items: s.items,
        couponCode: s.couponCode,
        couponDiscount: s.couponDiscount,
      }),
    }
  )
);
