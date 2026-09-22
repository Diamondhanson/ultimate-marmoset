import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MonkeyCard } from "@/components/MonkeyCard";
import { Reveal } from "@/components/Reveal";
import { categories, getCategory, monkeysInCategory } from "@/lib/categories";
import { getMonkeys } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

// Served from cache and refreshed in the background; admin edits bust it
// instantly via revalidatePath.
export const revalidate = 300;

// Only the slugs in lib/categories.ts exist. Anything else at the top level
// is a 404, exactly as before this route was added.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMeta({
    title: category.title,
    description: category.description,
    path: `/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const monkeys = monkeysInCategory(await getMonkeys(), category);
  const available = monkeys.filter((m) => m.status === "available").length;
  const others = categories.filter((c) => c.slug !== category.slug);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.h1,
    numberOfItems: monkeys.length,
    itemListElement: monkeys.map((monkey, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${monkey.name}, ${monkey.species}`,
      url: `${site.url}/monkeys/${monkey.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Monkeys for sale",
        item: `${site.url}/monkeys`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${site.url}/${category.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {[itemListJsonLd, breadcrumbJsonLd, faqJsonLd].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* Hero */}
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-18">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-mist-200/70">
              <Link href="/monkeys" className="transition-colors hover:text-gold-300">
                Monkeys for sale
              </Link>
              <span className="mx-2">/</span>
              <span className="text-mist-100">{category.name}</span>
            </nav>
            <h1 className="mt-4 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
              {category.h1}
            </h1>
            {category.intro.map((p) => (
              <p key={p} className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
                {p}
              </p>
            ))}
            <p className="mt-6 text-sm font-semibold text-gold-300">
              {available > 0
                ? `${available} available now`
                : "None available right now. Join the waitlist below."}
            </p>
          </div>
          <div className="relative hidden aspect-4/5 overflow-hidden rounded-[2rem] shadow-2xl shadow-canopy-950/40 ring-1 ring-mist-50/15 lg:block">
            <Image
              src={category.image}
              alt={category.h1}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Listings */}
        {monkeys.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {monkeys.map((monkey, i) => (
              <Reveal key={monkey.id} delay={(i % 3) * 110} className="h-full">
                <MonkeyCard monkey={monkey} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-mist-200 bg-white p-12 text-center">
            <p className="font-display text-2xl font-semibold text-canopy-900">
              No {category.name.toLowerCase()} available right now
            </p>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
              New babies arrive through the year and they go quickly. Get in
              touch and we will let you know first.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-block rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
            >
              Join the waitlist
            </Link>
          </div>
        )}

        {/* Facts + FAQ */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <section>
              <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
                {category.name} at a glance
              </h2>
              <dl className="mt-6 divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 bg-white">
                {category.facts.map((f) => (
                  <div key={f.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <dt className="text-sm font-bold text-bark-400">{f.label}</dt>
                    <dd className="text-sm font-medium text-bark-700">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-bark-500">
                Owning a primate is regulated differently in every state. We
                check the rules where you live before accepting a reservation.
              </p>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section>
              <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
                Common questions about {category.name.toLowerCase()}
              </h2>
              <div className="mt-6 space-y-3">
                {category.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-3xl border border-mist-200 bg-white open:border-fern-200"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-display text-lg font-semibold text-canopy-900 marker:content-none">
                      {f.q}
                      <span aria-hidden className="text-bark-400 transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="px-6 pb-5 leading-relaxed text-bark-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        {/* Internal links */}
        <section className="mt-20 rounded-3xl border border-mist-200 bg-mist-100 p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-canopy-900">
            Other monkeys we raise
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-full border border-mist-300 bg-white px-5 py-2.5 text-sm font-bold text-bark-600 transition-all duration-300 hover:border-fern-300 hover:text-canopy-800"
              >
                {c.name} for sale
              </Link>
            ))}
            <Link
              href="/monkeys"
              className="rounded-full bg-canopy-800 px-5 py-2.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-900"
            >
              All monkeys for sale
            </Link>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-bark-500">
            Before you choose, read our{" "}
            <Link href="/care-guide" className="font-bold text-canopy-700 underline underline-offset-2">
              pet monkey care guide
            </Link>{" "}
            and{" "}
            <Link href="/health-guarantee" className="font-bold text-canopy-700 underline underline-offset-2">
              health guarantee
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
