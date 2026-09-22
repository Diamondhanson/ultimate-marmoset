import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getMonkeys } from "@/lib/data";
import { site } from "@/lib/site";

// Rebuilt at most every hour, so new listings reach Google without a deploy.
export const revalidate = 3600;

const abs = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: abs("/monkeys"), changeFrequency: "daily", priority: 0.9 },
  ].map((e) => ({ ...e, lastModified: now }) as MetadataRoute.Sitemap[number]);

  // Species landing pages: the pages built to rank for "... for sale".
  const speciesPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: abs(`/${c.slug}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
    images: [abs(c.image)],
  }));

  const infoPages: MetadataRoute.Sitemap = [
    { path: "/care-guide", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/delivery-and-visits", priority: 0.6 },
    { path: "/health-guarantee", priority: 0.6 },
    { path: "/reviews", priority: 0.6 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: abs(path),
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));

  let monkeyPages: MetadataRoute.Sitemap = [];
  try {
    const monkeys = await getMonkeys();
    monkeyPages = monkeys.map((m) => ({
      url: abs(`/monkeys/${m.slug}`),
      lastModified: new Date(m.created_at),
      changeFrequency: "weekly",
      // Rehomed listings stay reachable but matter less than live ones.
      priority: m.status === "available" ? 0.8 : 0.4,
      images: m.images.slice(0, 5).map(abs),
    }));
  } catch {
    // Still serve the static pages if the database is unreachable.
  }

  return [...core, ...speciesPages, ...infoPages, ...monkeyPages];
}
