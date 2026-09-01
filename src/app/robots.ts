import { MetadataRoute } from "next";

const BASE = process.env.SITE_URL ?? "https://avira.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/checkout/", "/order-confirmation/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
