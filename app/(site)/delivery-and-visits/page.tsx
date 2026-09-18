import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery, Pickup & Visit Appointment Policy",
  description:
    "How delivery, pickup and visit appointments work at our primate nursery, including the fully refundable $500 appointment deposit, what it covers, and how to schedule.",
  alternates: { canonical: "/delivery-and-visits" },
};

const deposit = formatPrice(site.appointmentDeposit);

const options = [
  {
    label: "Option 1",
    title: "Delivery",
    lede: "We bring your monkey to you.",
    points: [
      "Delivery is available for every monkey in our nursery.",
      "Arrangements, timing and any transport fees are agreed in advance. Nothing is added at the end.",
      "All deliveries are subject to approval and to compliance with the laws that apply where you live.",
    ],
    deposit: false,
  },
  {
    label: "Option 2",
    title: "Pickup",
    lede: "You collect in person, by appointment.",
    points: [
      "You are welcome to collect your monkey from us instead of using delivery.",
      `A ${deposit} deposit is required to reserve a pickup appointment.`,
      "Once the deposit is received we confirm your date and time immediately.",
    ],
    deposit: true,
  },
  {
    label: "Option 3",
    title: "Visit before deciding",
    lede: "Meet them first, then make up your mind.",
    points: [
      "If you would like to visit before making a decision, you may book an appointment.",
      `A ${deposit} deposit is required to secure your visit.`,
      "The deposit is fully refundable if you decide a monkey isn’t right for you.",
    ],
    deposit: true,
  },
];

const terms = [
  {
    term: "Fully refundable",
    detail: `The ${deposit} deposit is fully refundable if you change your mind.`,
  },
  {
    term: "Applied to your balance",
    detail:
      "If you decide to proceed, the deposit comes off your final balance. It is not an extra charge.",
  },
  {
    term: "Confirms your slot",
    detail:
      "Your pickup or visit appointment is not confirmed until the deposit is received.",
  },
  {
    term: "Same-day refunds",
    detail:
      "Refunds are processed the same day, using the original payment method.",
  },
  {
    term: "Changes and cancellations",
    detail: `If you need to cancel or reschedule, please let us know at least ${site.rescheduleNotice} in advance so we can adjust our schedule.`,
  },
];

export default function DeliveryAndVisitsPage() {
  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Our policy
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Delivery, pickup &amp; visit appointments
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
            We want every family to have a clear, respectful and professional
            experience. Please read this page before scheduling a pickup or a
            visit. It takes two minutes and answers almost every question
            people ask us.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        {/* ── At a glance ─────────────────────────────────────────────── */}
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { k: "Delivery", v: "No deposit. Fees quoted in advance" },
              { k: "Pickup", v: `${deposit} refundable deposit` },
              { k: "Visit", v: `${deposit} refundable deposit` },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-2xl border border-mist-200 bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-fern-600">
                  {item.k}
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-bark-700">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── The three options ───────────────────────────────────────── */}
        <div className="mt-14 space-y-6">
          {options.map((option, i) => (
            <Reveal key={option.title} delay={i * 110}>
              <section className="overflow-hidden rounded-3xl border border-mist-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist-200 bg-mist-100 px-7 py-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-fern-600">
                      {option.label}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold text-canopy-900">
                      {option.title}
                    </h2>
                  </div>
                  <p className="text-sm font-semibold text-bark-500">
                    {option.lede}
                  </p>
                </div>
                <ul className="space-y-3.5 px-7 py-6">
                  {option.points.map((point) => (
                    <li key={point} className="flex gap-3.5">
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
                      <span className="leading-relaxed text-bark-600">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        {/* ── Why the deposit ─────────────────────────────────────────── */}
        <Reveal>
          <section className="mt-14 rounded-3xl border border-gold-200 bg-gold-100/60 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Why the deposit is required
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-bark-600">
              <p>
                We receive a very high volume of messages every day, and many
                families tell us they would like to visit. Our time and our
                schedule are limited, and some people book a visit purely to
                take photographs of themselves with our monkeys.
              </p>
              <p>
                The {deposit} deposit helps us identify serious families and
                makes sure we can give each genuine client the attention they
                deserve. It lets us manage demand fairly and reserve appointment
                times for the people who are ready to move forward.
              </p>
            </div>
          </section>
        </Reveal>

        {/* ── Deposit terms ───────────────────────────────────────────── */}
        <Reveal>
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Deposit terms
            </h2>
            <dl className="mt-6 divide-y divide-mist-200 overflow-hidden rounded-3xl border border-mist-200 bg-white">
              {terms.map((item) => (
                <div
                  key={item.term}
                  className="grid gap-1.5 px-7 py-5 sm:grid-cols-[210px_1fr] sm:gap-6"
                >
                  <dt className="font-bold text-canopy-900">{item.term}</dt>
                  <dd className="leading-relaxed text-bark-600">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        {/* ── Scheduling ──────────────────────────────────────────────── */}
        <Reveal>
          <section className="mt-14 rounded-3xl border border-fern-200 bg-fern-50 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Scheduling
            </h2>
            <p className="mt-4 leading-relaxed text-bark-600">
              Appointments are subject to availability. Once your deposit is
              received, we contact you immediately to confirm your date and
              time.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
              >
                Request an appointment
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="rounded-xl border border-fern-300 bg-white px-7 py-3.5 font-bold text-canopy-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-fern-500"
              >
                Email us
              </a>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
