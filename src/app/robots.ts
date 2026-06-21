import type { MetadataRoute } from "next";

import { legalConfig } from "@/lib/legal";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/mentions-legales",
        "/politique-de-confidentialite",
      ],
      disallow: [
        "/admin",
        "/api",
        "/dashboard",
        "/meal-plan",
        "/profile",
        "/recipes",
        "/shopping-list",
        "/auth/reset-password",
        "/auth/verify-email/confirm",
      ],
    },
    sitemap: `${legalConfig.siteUrl}/sitemap.xml`,
  };
}
