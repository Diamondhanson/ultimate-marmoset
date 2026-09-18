import type { Metadata } from "next";
import Link from "next/link";
import { ReservationComplete } from "@/components/ReservationComplete";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservation Received",
  robots: { index: false, follow: false },
};

const next = [
  {
    step: "Within 24 hours",
    text: "We read your message and reply ourselves, usually much sooner than a day.",
  },
  {
    step: "We check your area",
    text: "Before anything else, we confirm that the species you’ve chosen is legal where you live.",
  },
  {
    step: "Delivery or appointment",
    text: `Then we arrange transport, or book your pickup or visit with the refundable ${formatPrice(site.appointmentDeposit)} deposit.`,
  },
];

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
      <ReservationComplete />

      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-fern-100 text-fern-600">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>

      <h1 className="mt-7 font-display text-4xl font-semibold text-canopy-900 sm:text-5xl">
        Your reservation is with us
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-bark-500">
        Thank you. A copy has gone to your inbox, and we’ll be in touch shortly.
        If you’d rather talk right away, call us on {site.phone}.
      </p>

      <ol className="mx-auto mt-12 grid gap-4 text-left sm:grid-cols-3">
        {next.map((item) => (
          <li
            key={item.step}
            className="rounded-3xl border border-mist-200 bg-white p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-fern-600">
              {item.step}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bark-500">
              {item.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/monkeys"
          className="rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
        >
          Keep browsing
        </Link>
        <Link
          href="/care-guide"
          className="rounded-xl border border-mist-300 bg-white px-7 py-3.5 font-bold text-bark-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-fern-300"
        >
          Read the care guide
        </Link>
      </div>
    </div>
  );
}
