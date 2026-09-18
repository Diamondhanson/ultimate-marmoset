import Link from "next/link";
import { ReviewCard } from "./ReviewCard";
import { Reveal } from "./Reveal";
import { Stars } from "./Stars";
import type { Review } from "@/lib/types";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const featured = reviews.filter((r) => r.featured);
  const shown = (featured.length >= 3 ? featured : reviews).slice(0, 3);
  const average =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="texture-fronds border-y border-mist-200 bg-mist-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fern-600">
                From our families
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-canopy-900 sm:text-4xl">
                Twenty years is a long time to trust someone
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <Stars rating={Math.round(average)} />
                <span className="text-sm font-semibold text-bark-500">
                  {average.toFixed(1)} average · {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
            <Link
              href="/reviews"
              className="group font-bold text-canopy-700 transition-colors hover:text-fern-600"
            >
              Read every review{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {shown.map((review, i) => (
            <Reveal key={review.id} delay={i * 120} className="h-full">
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
