import type { Metadata } from "next";
import { ReserveForm } from "@/components/ReserveForm";

export const metadata: Metadata = {
  title: "Your Reservation List",
  description: "Review the monkeys on your list and send your reservation request.",
  robots: { index: false, follow: false },
};

export default function ReservePage() {
  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Almost there
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Send your reservation
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-mist-200/80">
            Nothing is charged here. This reaches us instantly and we reply
            within 24 hours to talk everything through personally.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <ReserveForm />
      </div>
    </>
  );
}
