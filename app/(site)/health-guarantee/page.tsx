import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Health Guarantee & Policies",
  description:
    "Our written health guarantee: what every monkey leaves with, the 72-hour veterinary window, the one-year congenital cover, and what the guarantee does not include.",
  alternates: { canonical: "/health-guarantee" },
};

const included = [
  "A documented exotic-vet wellness examination within 10 days of going home",
  "Age-appropriate vaccinations and a completed deworming schedule",
  "A negative tuberculosis test where the species and age require one",
  "Complete written health records, feeding schedule, and current formula or diet",
  "Microchipping before collection or delivery, where species-appropriate",
  "A health certificate for transport when your monkey travels interstate",
];

const guarantee = [
  {
    title: "72-hour veterinary window",
    text: "Have your monkey examined by a licensed veterinarian within 72 hours of arrival. If that exam finds a pre-existing, life-threatening condition, we will replace your monkey or refund you in full, on receipt of the vet’s written diagnosis.",
  },
  {
    title: "One year on congenital defects",
    text: "For twelve months from the date you take your monkey home, we cover life-threatening congenital or hereditary defects confirmed in writing by a licensed veterinarian.",
  },
  {
    title: "Support for life",
    text: "Diet, housing, behaviour and veterinary questions. For as long as you have your monkey, you can call us. There is no expiry date on that.",
  },
];

const excluded = [
  "Conditions caused by poor diet, housing, or missed supplements, metabolic bone disease in particular",
  "Injury, accident, escape, or attack by another animal",
  "Illness contracted after arrival from another animal in your home",
  "Parasites and minor conditions that are routine in young primates and readily treatable",
  "Any claim without a written diagnosis from a licensed veterinarian",
];

export default function HealthGuaranteePage() {
  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            In writing, every time
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Health guarantee &amp; policies
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
            Every monkey leaves here with a signed copy of this guarantee. It is
            written in plain English. You should not need a lawyer to
            understand what you are covered for.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <Reveal>
          <section>
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              What every monkey goes home with
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl border border-mist-200 bg-white p-4"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-5 w-5 shrink-0 text-fern-500"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm leading-relaxed text-bark-600">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              What the guarantee covers
            </h2>
            <div className="mt-6 space-y-4">
              {guarantee.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-fern-200 bg-fern-50 p-7"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-fern-700">
                    {`0${i + 1}`}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-canopy-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-bark-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              What it does not cover
            </h2>
            <p className="mt-3 leading-relaxed text-bark-500">
              We would rather be clear about this up front than argue about it
              later.
            </p>
            <ul className="mt-6 divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 bg-white">
              {excluded.map((item) => (
                <li
                  key={item}
                  className="px-7 py-4 text-sm leading-relaxed text-bark-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-14 rounded-3xl border border-mist-200 bg-mist-100 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900">
              Deposits, payment &amp; returns
            </h2>
            <div className="mt-4 space-y-3.5 leading-relaxed text-bark-600">
              <p>
                No payment is ever taken through this website. Reservations are
                free, and we confirm every detail with you directly before any
                money changes hands.
              </p>
              <p>
                Pickup and visit appointments are held with a fully refundable
                deposit. The full terms are on our{" "}
                <Link
                  href="/delivery-and-visits"
                  className="font-bold text-canopy-700 underline underline-offset-2"
                >
                  delivery &amp; visits page
                </Link>
                .
              </p>
              <p>
                If your circumstances change at any point in your monkey’s life,
                come back to us first. We will always take one of ours back
                rather than see it rehomed to a stranger.
              </p>
            </div>
            <p className="mt-6 text-sm text-bark-400">
              Questions about any of this? Call {site.phone}, or{" "}
              <Link
                href="/contact"
                className="font-bold text-canopy-700 underline underline-offset-2"
              >
                send us a message
              </Link>
              .
            </p>
          </section>
        </Reveal>
      </div>
    </>
  );
}
