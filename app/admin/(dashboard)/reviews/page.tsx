import {
  removeReview,
  setReviewApproval,
  setReviewFeatured,
} from "@/app/actions/admin";
import { Stars } from "@/components/Stars";
import { getAllReviews } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-canopy-900">
        Reviews
      </h1>
      <p className="mt-2 text-bark-500">
        Nothing appears on the website until you approve it.
        {pending > 0 && (
          <span className="ml-1 font-semibold text-fern-600">
            {pending} waiting.
          </span>
        )}
      </p>

      <div className="mt-8 space-y-5">
        {reviews.map((review) => (
          <article
            key={review.id}
            className={`rounded-3xl border bg-white p-6 ${
              review.approved
                ? "border-mist-200"
                : "border-fern-200 ring-1 ring-fern-100"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-canopy-900">
                    {review.name}
                  </h2>
                  <Stars rating={review.rating} />
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      review.approved
                        ? "bg-mist-200 text-bark-500"
                        : "bg-fern-100 text-fern-700"
                    }`}
                  >
                    {review.approved ? "published" : "pending"}
                  </span>
                  {review.featured && (
                    <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-700">
                      featured
                    </span>
                  )}
                </div>
                {review.location && (
                  <p className="mt-1.5 text-sm text-bark-400">
                    {review.location}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-xs text-bark-400">
                {formatDateTime(review.created_at)}
              </p>
            </div>

            <p className="mt-4 rounded-2xl bg-mist-100 p-4 text-sm leading-relaxed text-bark-600">
              {review.message}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-mist-200 pt-4">
              <form action={setReviewApproval}>
                <input type="hidden" name="id" value={review.id} />
                <input
                  type="hidden"
                  name="approved"
                  value={review.approved ? "false" : "true"}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-canopy-700 px-4 py-1.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-800"
                >
                  {review.approved ? "Unpublish" : "Approve & publish"}
                </button>
              </form>
              <form action={setReviewFeatured}>
                <input type="hidden" name="id" value={review.id} />
                <input
                  type="hidden"
                  name="featured"
                  value={review.featured ? "false" : "true"}
                />
                <button
                  type="submit"
                  className="rounded-lg border border-mist-300 px-4 py-1.5 text-sm font-bold text-bark-500 transition-colors hover:border-gold-400"
                >
                  {review.featured ? "Remove from home page" : "Feature on home page"}
                </button>
              </form>
              <form action={removeReview} className="ml-auto">
                <input type="hidden" name="id" value={review.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-gold-100 px-4 py-1.5 text-sm font-bold text-gold-700 transition-colors hover:bg-gold-200"
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-3xl border border-mist-200 bg-white p-12 text-center text-bark-400">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
