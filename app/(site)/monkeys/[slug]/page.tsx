import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Gallery } from "@/components/Gallery";
import { MonkeyCard } from "@/components/MonkeyCard";
import { StatusBadge } from "@/components/StatusBadge";
import { getMonkeyBySlug, getMonkeys } from "@/lib/data";
import { formatPrice, site } from "@/lib/site";
import { formatAge, formatDate } from "@/lib/utils";

// Served from cache and refreshed in the background; admin edits bust it
// instantly via revalidatePath.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const monkey = await getMonkeyBySlug(slug);
  if (!monkey) return { title: "Monkey not found" };

  const title = `${monkey.name} | ${monkey.species} for Sale`;
  const description = `Meet ${monkey.name}, a ${formatAge(
    monkey.date_of_birth
  )} ${monkey.species.toLowerCase()} (${monkey.markings}). ${formatPrice(
    monkey.price
  )}, hand-raised, vet-checked, and backed by our written health guarantee.`;

  return {
    title,
    description,
    alternates: { canonical: `/monkeys/${monkey.slug}` },
    openGraph: {
      title,
      description,
      url: `/monkeys/${monkey.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function MonkeyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monkey = await getMonkeyBySlug(slug);
  if (!monkey) notFound();

  const all = await getMonkeys();
  const alsoMeet = all
    .filter((m) => m.id !== monkey.id && m.status === "available")
    .slice(0, 3);

  const facts: [string, string][] = [
    ["Species", monkey.species],
    ["Sex", monkey.gender === "female" ? "Female" : "Male"],
    ["Markings", monkey.markings || "Not recorded"],
    [
      "Born",
      `${formatDate(monkey.date_of_birth)} · ${formatAge(monkey.date_of_birth)}`,
    ],
    ["Temperament", monkey.temperament || "Not recorded"],
    ["Hand-raised", monkey.hand_raised ? "Yes, bottle-fed by us" : "Parent-reared"],
    ["Vaccinations", monkey.vaccinated ? "Up to date for age" : "Not yet due"],
    ["Diaper trained", monkey.diaper_trained ? "Yes" : "In progress"],
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Available Monkeys",
        item: `${site.url}/monkeys`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: monkey.name,
        item: `${site.url}/monkeys/${monkey.slug}`,
      },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${monkey.name} the ${monkey.species}`,
    description: monkey.description,
    image: monkey.images,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: monkey.price,
      priceCurrency: site.currency,
      availability:
        monkey.status === "available"
          ? "https://schema.org/InStock"
          : monkey.status === "reserved"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/SoldOut",
      url: `${site.url}/monkeys/${monkey.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="text-sm text-bark-400">
          <Link href="/monkeys" className="transition-colors hover:text-canopy-700">
            Available monkeys
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-bark-700">{monkey.name}</span>
        </nav>

        <div className="mt-7 grid gap-12 lg:grid-cols-2">
          <Gallery
            images={monkey.images}
            alt={`${monkey.name}, a ${monkey.species}`}
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-semibold text-canopy-900 sm:text-5xl">
                {monkey.name}
              </h1>
              <StatusBadge status={monkey.status} />
            </div>

            <p className="mt-3 text-base font-semibold text-fern-600">
              {monkey.species}
            </p>
            <p className="mt-1 text-bark-400">
              {monkey.gender === "female" ? "Female" : "Male"} ·{" "}
              {formatAge(monkey.date_of_birth)} · {monkey.markings}
            </p>

            <p className="mt-6 font-display text-4xl font-semibold text-gold-600">
              {formatPrice(monkey.price)}
            </p>

            <p className="mt-6 leading-relaxed text-bark-700">
              {monkey.description}
            </p>

            <dl className="mt-8 divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 bg-white">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-6 px-6 py-3.5 text-sm"
                >
                  <dt className="font-bold text-bark-400">{label}</dt>
                  <dd className="text-right font-medium text-bark-700">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {monkey.health_notes && (
              <div className="mt-6 rounded-3xl border border-fern-200 bg-fern-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-fern-700">
                  Health record
                </p>
                <p className="mt-3 text-sm leading-relaxed text-bark-700">
                  {monkey.health_notes}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AddToCartButton monkey={monkey} size="lg" goToList />
              <Link
                href="/contact"
                className="rounded-xl border border-mist-300 bg-white px-7 py-3.5 font-bold text-bark-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-fern-300 hover:text-canopy-800"
              >
                Ask about {monkey.name}
              </Link>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-bark-400">
              Reserving is free and not binding. No payment is taken on this
              site. We reply within 24 hours to talk through legality where you
              live, your setup, and whether you’d like{" "}
              <Link
                href="/delivery-and-visits"
                className="font-bold text-canopy-700 underline underline-offset-2"
              >
                delivery or a pickup appointment
              </Link>
              .
            </p>
          </div>
        </div>

        {alsoMeet.length > 0 && (
          <section className="mt-20 border-t border-mist-200 pt-14">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Also looking for a home
            </h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {alsoMeet.map((other) => (
                <MonkeyCard key={other.id} monkey={other} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
