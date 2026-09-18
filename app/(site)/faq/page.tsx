import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to the questions families ask most: legality, price, delivery, deposits, diet, lifespan, and whether a monkey is right for your home.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "Is it legal for me to own a monkey?",
    a: "It depends entirely on where you live. Primate ownership is regulated at state level and often at county or city level too. Some states ban all primates, others allow smaller species only, and several require a permit before you buy. We check the rules where you live before accepting any reservation. If the answer is no, we will tell you.",
  },
  {
    q: "How much does a monkey cost?",
    a: "Our marmosets start around $3,800 and capuchins and spider monkeys run from roughly $8,000 to $12,000, depending on species, age and temperament. Every price is listed openly on the animal’s own page. What you pay up front is the smallest part of the lifetime cost. Our care guide sets out a realistic budget.",
  },
  {
    q: "Why do you charge a deposit just to visit?",
    a: `We receive a very high volume of messages daily, and some people book visits purely to photograph themselves with our monkeys. The ${formatPrice(site.appointmentDeposit)} deposit is fully refundable, comes off your balance if you go ahead, and means genuine families get our full attention. The complete policy is on our delivery & visits page.`,
  },
  {
    q: "Do you deliver, and how much does it cost?",
    a: "Yes. We deliver, and the arrangements, timing and any transport fee are agreed with you in advance, never added at the last minute. All deliveries are subject to approval and to the laws that apply where you live.",
  },
  {
    q: "How old are the babies when they go home?",
    a: "It varies by species and by individual. We never release a baby before it is feeding reliably and stable in weight, and we would rather hold one back a few weeks than send it early. Each animal’s page lists their current age.",
  },
  {
    q: "Are they diaper trained?",
    a: "Most of our capuchins and spider monkeys are wearing diapers comfortably before they go home, and we send you the routine we use. Marmosets and squirrel monkeys are generally not diapered. They are small and quick, so washable fabrics and a well-placed cage work better.",
  },
  {
    q: "How long will a monkey live?",
    a: "Marmosets 12 to 18 years, squirrel monkeys 15 to 20, spider monkeys 25 to 35, and capuchins commonly 25 to 40. Buying a capuchin in your thirties means planning who cares for them in your sixties. We ask every family to think that through, and many name a guardian in their will.",
  },
  {
    q: "Can a monkey live alone, or do they need a companion?",
    a: "Marmosets do markedly better in pairs and we encourage families to take two. Capuchins and spider monkeys bond so closely with people that one on its own can do well in a home where someone is around most of the day. No monkey of any species does well left alone all day.",
  },
  {
    q: "What do they eat?",
    a: "Fresh produce twice a day, a commercial biscuit made for their species, and protein: insects for the small species, eggs and lean cooked meat for the larger ones. Vitamin D3 and calcium supplementation is essential for indoor primates. You go home with our exact schedule and two weeks of their current food.",
  },
  {
    q: "What if it doesn’t work out?",
    a: "Come back to us. At any point in your monkey’s life, whatever the reason, we would far rather take one of ours back than see it passed to a stranger or surrendered to a sanctuary.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Straight answers
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
            The ten questions we answer most often, answered properly. If yours
            isn’t here, just ask us.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 6) * 60}>
              <details className="group overflow-hidden rounded-3xl border border-mist-200 bg-white transition-colors duration-300 open:border-fern-200 open:bg-fern-50/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-7 py-5 font-display text-lg font-semibold text-canopy-900 marker:content-none">
                  {item.q}
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-100 text-bark-500 transition-all duration-300 group-open:rotate-45 group-open:bg-fern-100 group-open:text-fern-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="px-7 pb-6 leading-relaxed text-bark-600">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-3xl border border-mist-200 bg-mist-100 p-8 text-center sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900">
              Something we haven’t covered?
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-bark-500">
              Send it over. We answer every message ourselves, usually the same
              day.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-block rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
            >
              Ask us anything
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
