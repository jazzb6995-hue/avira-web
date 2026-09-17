export const SITE_NAME = "AVIRA";
export const SITE_TAGLINE = "Little Things. Beautiful You.";
export const SITE_DESCRIPTION =
  "Jewellery for everyday moments, little celebrations and everything in between.";

export const BRAND_COLORS = {
  plum: "#54283C",
  ivory: "#FBF7F2",
} as const;

export const SHIPPING = {
  FREE_THRESHOLD: 500,
  FLAT_RATE: 49,
  CURRENCY: "INR",
} as const;

export const FIRST_ORDER_DISCOUNT_PCT = 10;
export const EXIT_INTENT_DISCOUNT_PCT = 10;
export const ABANDONED_CART_DISCOUNT_PCT = 10;
export const ABANDONED_CART_MIN_ELIGIBLE = 1000;

export const CATEGORY_LINKS = [
  { label: "Earrings", href: "/category/earrings" },
  { label: "Bracelets", href: "/category/bracelets" },
  { label: "Necklaces", href: "/category/necklaces" },
  { label: "Rings", href: "/category/rings" },
  { label: "Sets", href: "/category/sets" },
] as const;

export const NAV_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Category", href: "/category/earrings" },
  { label: "AVIRA Edit", href: "/edit" },
  { label: "About AVIRA", href: "/about" },
] as const;

export const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Order Received",
  CONFIRMED: "Order Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PAYMENT_FAILED: "Payment Failed",
};

export const CAMPAIGN_TEMPLATES = [
  "editorial",
  "festive",
  "minimal",
  "plum-luxury",
  "warm-ivory",
  "image-led",
  "split",
  "full-bleed",
  "countdown",
] as const;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
