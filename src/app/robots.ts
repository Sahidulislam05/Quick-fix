import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/auth", "/payment"],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}