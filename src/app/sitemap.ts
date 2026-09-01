import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = process.env.SITE_URL ?? "https://avira.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/new-arrivals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/best-sellers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/jewellery-care`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      db.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.category.findMany({ where: { active: true }, select: { slug: true } }),
    ]);

    productRoutes = products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    categoryRoutes = categories.map((c) => ({
      url: `${BASE}/category/${c.slug}`,
      changeFrequency: "daily",
      priority: 0.7,
    }));
  } catch { /* db not connected during build */ }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
