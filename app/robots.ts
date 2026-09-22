import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or pointless for search. The ?species= filter views are left
      // crawlable on purpose: they carry a noindex tag, and Google has to be
      // able to fetch a page to see that tag.
      disallow: ["/admin", "/reserve", "/brand-assets"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
