import type { Metadata } from "next";
import Link from "next/link";
import { MonkeyCard } from "@/components/MonkeyCard";
import { Reveal } from "@/components/Reveal";
import { getMonkeys, getSpeciesList } from "@/lib/data";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}): Promise<Metadata> {
  const { species } = await searchParams;
  const title = species
    ? `${species}s for Sale`
    : "Available Monkeys for Sale";
  const description = species
    ? `Hand-raised ${species.toLowerCase()}s for sale from our in-home primate nursery. Bottle-fed, vet-checked, and placed with a written health guarantee. See photos, temperaments and prices.`
    : "Browse the hand-raised marmosets, capuchins, spider monkeys and squirrel monkeys available now. Photos, temperaments, health records and prices for every baby in our nursery.";
  const canonical = species
    ? `/monkeys?species=${encodeURIComponent(species)}`
    : "/monkeys";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function MonkeysPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const { species } = await searchParams;
  const [monkeys, speciesList] = await Promise.all([
    getMonkeys(species),
    getSpeciesList(),
  ]);

  const available = monkeys.filter((m) => m.status === "available").length;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: species ? `${species}s for sale` : "Monkeys for sale",
    numberOfItems: monkeys.length,
    itemListElement: monkeys.map((monkey, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${monkey.name} the ${monkey.species}`,
      url: `${site.url}/monkeys/${monkey.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-18">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            The nursery
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            {species ? `${species}s for sale` : "Available monkeys"}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-mist-200/80">
            Every baby below was born and bottle-raised here. Open a profile to
            read their temperament, health record and full photo set, then
            add them to your list. Reserving is free and nothing is charged online.
          </p>
          <p className="mt-6 text-sm font-semibold text-gold-300">
            {available} available now · {monkeys.length} listed
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Species filter */}
        <div className="scrollbar-slim -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          <Link
            href="/monkeys"
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
              !species
                ? "bg-canopy-800 text-mist-50 shadow-sm"
                : "border border-mist-300 bg-white text-bark-500 hover:border-fern-300 hover:text-canopy-800"
            }`}
          >
            All species
          </Link>
          {speciesList.map((s) => (
            <Link
              key={s}
              href={`/monkeys?species=${encodeURIComponent(s)}`}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                species === s
                  ? "bg-canopy-800 text-mist-50 shadow-sm"
                  : "border border-mist-300 bg-white text-bark-500 hover:border-fern-300 hover:text-canopy-800"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {monkeys.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-mist-200 bg-white p-14 text-center">
            <p className="font-display text-2xl font-semibold text-canopy-900">
              Nothing in this species right now
            </p>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
              New babies arrive through the year and the good ones go quickly.
              Join the waitlist and we’ll message you first.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-block rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
            >
              Join the waitlist
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {monkeys.map((monkey, i) => (
              <Reveal key={monkey.id} delay={(i % 3) * 110} className="h-full">
                <MonkeyCard monkey={monkey} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
