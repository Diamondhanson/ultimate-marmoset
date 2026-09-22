import type { Metadata } from "next";
import { site } from "./site";

/**
 * One place to build a page's search and social tags.
 *
 * Next merges metadata per top-level key, so a page that sets `title` but not
 * `openGraph` inherits the root layout's og:title. That made every inner page
 * share with the home page's title. Building all of them together here keeps
 * the Google title, the Facebook/WhatsApp title and the canonical URL in step.
 *
 * Keep `title` under ~40 characters: the root template appends
 * " | Ultimate Marmoset", and Google shows roughly 60. Keep `description`
 * between ~120 and 155 characters so it isn't cut off in results.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is, without the " | Ultimate Marmoset" suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.shortName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
