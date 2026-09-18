import { Stars } from "./Stars";
import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-mist-200 bg-white p-7 shadow-[0_1px_2px_rgba(23,33,28,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_-20px_rgba(15,52,35,0.4)]">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-bark-700">
        “{review.message}”
      </blockquote>
      <figcaption className="mt-5 border-t border-mist-200 pt-4">
        <p className="font-display text-base font-semibold text-canopy-900">
          {review.name}
        </p>
        {review.location && (
          <p className="text-sm text-bark-400">{review.location}</p>
        )}
      </figcaption>
    </figure>
  );
}
