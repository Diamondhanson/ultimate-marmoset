import Image from "next/image";
import Link from "next/link";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MonkeyCard } from "@/components/MonkeyCard";
import { Reveal } from "@/components/Reveal";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Frond, Vine } from "@/components/Leaf";
import { getApprovedReviews, getMonkeys } from "@/lib/data";
import { formatPrice, site } from "@/lib/site";

// Served from cache and refreshed in the background; admin edits bust it
// instantly via revalidatePath.
export const revalidate = 300;

const heroImages = [
  "/monkeys/spider-monkey-portrait.jpg",
  "/monkeys/marmoset-twins.jpg",
  "/monkeys/white-faced-capuchins.jpg",
  "/monkeys/capuchin-trio.jpg",
];

const heroPortrait = "/monkeys/capuchin-baby.jpg";

const pillars = [
  {
    title: "Bottle-raised indoors",
    text: "Every baby is hand-reared in our living room from a few weeks old. Never in a barn, never behind wire.",
    icon: (
      <path d="M12 21c-4.5-3-7.5-6.2-7.5-10A5.5 5.5 0 0 1 12 7a5.5 5.5 0 0 1 7.5 4c0 3.8-3 7-7.5 10z" />
    ),
  },
  {
    title: "Exotic-vet checked",
    text: "Wellness exams, age-appropriate vaccinations, negative TB tests, and full records that travel home with them.",
    icon: (
      <>
        <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z" />
        <path d="M16 5h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2" />
        <path d="M9 13l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Written health guarantee",
    text: "A guarantee you can hold in your hand, plus a 72-hour vet window and lifetime support by phone.",
    icon: <path d="M6 3h12v18l-6-4-6 4V3z" />,
  },
  {
    title: "Honest about the work",
    text: "We will talk you out of a monkey if it isn’t right. A twenty-year companion deserves an honest conversation first.",
    icon: (
      <path d="M21 12a9 9 0 1 1-3.2-6.9M21 5l-9 9-3-3" />
    ),
  },
];

const species = [
  {
    name: "Marmosets",
    blurb:
      "Palm-sized, chirpy, and the most manageable primate we raise. Best for a calm home with time to spare.",
    span: "Lives 12 to 18 years",
    image: "/monkeys/marmoset-portrait.jpg",
    href: "/monkeys?species=Common+Marmoset",
  },
  {
    name: "Capuchins",
    blurb:
      "The clever ones. Quick to learn, quick to cause trouble, and a commitment for life.",
    span: "Lives 25 to 40 years",
    image: "/monkeys/capuchin-baby.jpg",
    href: "/monkeys?species=Brown+Capuchin",
  },
  {
    name: "Spider monkeys",
    blurb:
      "All limbs and prehensile tail. Deeply affectionate, and they need serious vertical space to be happy.",
    span: "Lives 25 to 35 years",
    image: "/monkeys/spider-monkey-bag.jpg",
    href: "/monkeys?species=Spider+Monkey",
  },
  {
    name: "Squirrel monkeys",
    blurb:
      "Small, bright and permanently busy. Wonderful for a lively household that is home most of the day.",
    span: "Lives 15 to 20 years",
    image: "/monkeys/monkeys-and-dog.jpg",
    href: "/monkeys?species=Squirrel+Monkey",
  },
];

const steps = [
  {
    step: "01",
    title: "Meet them online",
    text: "Age, temperament, health record and price are on every profile. Add the ones you like to your list.",
  },
  {
    step: "02",
    title: "Send a reservation",
    text: "Tell us about your home. Nothing is charged on this website; the form simply reaches us instantly.",
  },
  {
    step: "03",
    title: "Book a visit or pickup",
    text: `We reply within 24 hours. Appointments are held with a fully refundable ${formatPrice(site.appointmentDeposit)} deposit.`,
  },
  {
    step: "04",
    title: "Delivery or collection",
    text: "Collect in person, or let us arrange transport with a health certificate and a travel crate.",
  },
];

export default async function HomePage() {
  const [monkeys, reviews] = await Promise.all([
    getMonkeys(),
    getApprovedReviews(),
  ]);
  const available = monkeys.filter((m) => m.status === "available");
  const speciesCount = new Set(monkeys.map((m) => m.species)).size;
  const featured = monkeys.filter((m) => m.featured && m.status === "available");
  const spotlight = (featured.length > 0 ? featured : available).slice(0, 3);

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: site.name,
    url: site.url,
    image: `${site.url}/monkeys/marmoset-twins.jpg`,
    email: site.email,
    telephone: site.phone,
    sameAs: [site.facebook, site.instagram],
    openingHours: "Mo-Sa 09:00-18:00",
    priceRange: "$$$",
    description:
      "A small in-home primate nursery raising hand-fed marmosets, capuchins, spider monkeys and squirrel monkeys.",
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <HeroSlideshow images={heroImages} />

        <Vine
          aria-hidden
          className="animate-sway pointer-events-none absolute left-[8%] top-0 hidden h-56 w-10 text-fern-400/30 lg:block"
        />
        <Vine
          aria-hidden
          className="animate-sway pointer-events-none absolute right-[4%] top-0 hidden h-72 w-10 text-fern-400/20 lg:block [animation-delay:2s]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="max-w-2xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-fern-400/30 bg-canopy-800/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-300 backdrop-blur">
              Hand-reared in our home · Not a broker
            </p>

            <h1 className="animate-fade-up mt-7 font-display text-4xl leading-[1.08] font-semibold text-mist-50 [animation-delay:120ms] sm:text-5xl lg:text-6xl">
              Tiny hands that will
              <br className="hidden sm:block" />{" "}
              <span className="text-sheen">hold on for decades</span>
            </h1>

            <p className="animate-fade-up mt-7 max-w-lg text-lg leading-relaxed text-mist-200/85 [animation-delay:240ms]">
              We bottle-feed every baby ourselves, from the 4am formula to the
              first climb up a curtain. When one of them goes home with you,
              you get the whole story, and us on the end of the phone for
              life.
            </p>

            <div className="animate-fade-up mt-9 flex flex-wrap gap-4 [animation-delay:360ms]">
              <Link
                href="/monkeys"
                className="rounded-xl bg-gold-400 px-8 py-4 font-bold text-canopy-900 shadow-lg shadow-canopy-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0"
              >
                See who’s available
              </Link>
              <Link
                href="/care-guide"
                className="rounded-xl border border-mist-50/25 bg-mist-50/5 px-8 py-4 font-bold text-mist-50 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-mist-50/12 active:translate-y-0"
              >
                Is a monkey right for me?
              </Link>
            </div>

            <dl className="animate-fade-up mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 [animation-delay:480ms]">
              {[
                { n: String(available.length), label: "babies available now" },
                { n: String(speciesCount), label: "species raised here" },
                { n: "100%", label: "bottle-fed by hand" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold text-gold-300">
                      {stat.n}
                    </span>
                    <span className="text-sm font-semibold text-mist-200/70">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up relative [animation-delay:240ms]">
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] shadow-2xl shadow-canopy-950/50 ring-1 ring-mist-50/15 transition-transform duration-700 lg:rotate-2 lg:hover:rotate-0">
              <Image
                src={heroPortrait}
                alt="A hand-raised baby capuchin curled up with a soft toy"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-canopy-950/85 to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 text-sm font-semibold text-mist-50">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
                  In the nursery today
                </span>
                Mango, 18 weeks. He already opens the treat tin by himself
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────────────────── */}
      <section className="border-b border-mist-200 bg-mist-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-20">
          {pillars.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="flex h-full flex-col">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fern-100 text-fern-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {item.icon}
                  </svg>
                </span>
                <h2 className="mt-5 font-display text-lg font-semibold text-canopy-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-bark-500">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fern-600">
                In the nursery
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-canopy-900 sm:text-4xl">
                Looking for their family
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-bark-500">
                A few of the babies with us right now. Every profile is written
                the week it goes up, by the person feeding them.
              </p>
            </div>
            <Link
              href="/monkeys"
              className="group font-bold text-canopy-700 transition-colors hover:text-fern-600"
            >
              See all {available.length} available{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {spotlight.map((monkey, i) => (
            <Reveal key={monkey.id} delay={i * 120} className="h-full">
              <MonkeyCard monkey={monkey} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Species explorer ─────────────────────────────────────────── */}
      <section className="texture-canopy relative overflow-hidden bg-canopy-900">
        <Frond
          aria-hidden
          className="animate-sway pointer-events-none absolute -left-16 top-10 h-72 w-56 text-fern-400/8"
        />
        <Frond
          aria-hidden
          className="animate-sway pointer-events-none absolute -right-14 bottom-0 h-64 w-52 text-gold-400/8 [animation-delay:3s]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
                Know before you choose
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-mist-50 sm:text-4xl">
                Four very different animals
              </h2>
              <p className="mt-4 leading-relaxed text-mist-200/80">
                People come to us wanting “a monkey” and leave knowing exactly
                which one suits their life. The difference between a marmoset
                and a capuchin is the difference between a decade and half a
                lifetime.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {species.map((item, i) => (
              <Reveal key={item.name} delay={i * 110} className="h-full">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-canopy-700/70 bg-canopy-800/60 transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/50 hover:bg-canopy-800"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-canopy-950/75 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold text-mist-50">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-400">
                      {item.span}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-200/75">
                      {item.blurb}
                    </p>
                    <span className="mt-5 text-sm font-bold text-gold-300">
                      Browse {item.name.toLowerCase()}{" "}
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="texture-fronds bg-mist-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fern-600">
                How it works
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-canopy-900 sm:text-4xl">
                From first click to homecoming
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, i) => (
              <Reveal key={item.step} delay={i * 110} className="h-full">
                <div className="relative h-full rounded-3xl border border-mist-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-20px_rgba(15,52,35,0.4)]">
                  <span className="font-display text-4xl font-semibold text-fern-200">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-canopy-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bark-500">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-col items-start gap-5 rounded-3xl border border-gold-200 bg-gold-100/70 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xl font-semibold text-canopy-900">
                  Why we ask for a {formatPrice(site.appointmentDeposit)} deposit
                  to hold an appointment
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bark-600">
                  It’s fully refundable, it comes off your balance if you go
                  ahead, and it means every family who books gets our undivided
                  attention instead of a queue.
                </p>
              </div>
              <Link
                href="/delivery-and-visits"
                className="shrink-0 rounded-xl bg-canopy-800 px-6 py-3 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-900"
              >
                Read the policy
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <ReviewsSection reviews={reviews} />

      {/* ── SEO copy ─────────────────────────────────────────────────── */}
      <section className="bg-mist-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Hand-raised marmosets and capuchin monkeys for sale
            </h2>
            <p className="mt-5 leading-relaxed text-bark-500">
              {site.name} is a small, licensed in-home primate nursery. We raise
              common marmosets, pygmy marmosets (often called finger monkeys),
              brown and white-faced capuchins, spider monkeys and squirrel
              monkeys. All of them are bottle-fed by hand, raised around our
              own family and house dog, and examined by an exotic-animal
              veterinarian before they go anywhere.
            </p>
            <p className="mt-4 leading-relaxed text-bark-500">
              Owning a primate is regulated differently in every state, and some
              species are restricted outright. We check your local rules with
              you before a reservation is ever accepted. If the answer is no,
              we’ll tell you straight. Start with our{" "}
              <Link
                href="/care-guide"
                className="font-bold text-canopy-700 underline underline-offset-2 hover:text-fern-600"
              >
                care guide
              </Link>
              , read the{" "}
              <Link
                href="/health-guarantee"
                className="font-bold text-canopy-700 underline underline-offset-2 hover:text-fern-600"
              >
                health guarantee
              </Link>
              , then{" "}
              <Link
                href="/monkeys"
                className="font-bold text-canopy-700 underline underline-offset-2 hover:text-fern-600"
              >
                meet the babies
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6">
        <Reveal>
          <div className="texture-canopy relative overflow-hidden rounded-[2rem] bg-canopy-800 px-8 py-14 text-center shadow-xl shadow-canopy-950/20 sm:px-16">
            <Frond
              aria-hidden
              className="animate-sway pointer-events-none absolute -left-10 -top-6 h-48 w-40 text-gold-400/10"
            />
            <Frond
              aria-hidden
              className="animate-sway pointer-events-none absolute -bottom-10 -right-8 h-48 w-40 text-fern-400/10 [animation-delay:2.5s]"
            />
            <h2 className="relative font-display text-3xl font-semibold text-mist-50 sm:text-4xl">
              Come and meet them
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-mist-200/80">
              Ask us anything: whether they are legal where you live, cage
              size, diet, what twenty years of care costs. No question is too
              basic, and we’d rather answer it now. {site.hours}.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/monkeys"
                className="rounded-xl bg-gold-400 px-8 py-4 font-bold text-canopy-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0"
              >
                Browse available monkeys
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-mist-50/30 px-8 py-4 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-mist-50/10 active:translate-y-0"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
