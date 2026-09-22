import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { getApprovedReviews } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: "Reviews from Our Families",
  description:
    "Read reviews from families who bought a hand-raised marmoset, capuchin or spider monkey from our nursery, and how the whole process went.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            In their words
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Reviews from our families
          </h1>
          {reviews.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Stars rating={Math.round(average)} />
              <span className="text-sm font-semibold text-mist-200/80">
                {average.toFixed(1)} average from {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-mist-200 bg-white p-14 text-center">
            <p className="font-display text-2xl font-semibold text-canopy-900">
              No reviews published yet
            </p>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
              If you’ve brought one of our monkeys home, we’d love to hear how
              it’s going.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 110} className="h-full">
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        )}

        <section className="mt-20 border-t border-mist-200 pt-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Leave a review
            </h2>
            <p className="mt-3 leading-relaxed text-bark-500">
              Bought from us? Tell other families how it went, the good and
              the awkward parts. Reviews are read by us before they appear.
            </p>
            <div className="mt-8">
              <ReviewForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
