import type { MetadataRoute } from "next";
import { getMonkeys } from "@/lib/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let monkeyPages: MetadataRoute.Sitemap = [];
  try {
    const monkeys = await getMonkeys();
    monkeyPages = monkeys.map((monkey) => ({
      url: `${site.url}/monkeys/${monkey.slug}`,
      lastModified: new Date(monkey.created_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // sitemap still serves the static pages if the DB is unreachable
  }

  const staticPages: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "daily" as const },
    { path: "/monkeys", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/care-guide", priority: 0.7, changeFrequency: "monthly" as const },
    {
      path: "/delivery-and-visits",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/health-guarantee",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    { path: "/reviews", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  return [...staticPages, ...monkeyPages];
}
