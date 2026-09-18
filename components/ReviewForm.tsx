"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewFormState } from "@/app/actions/reviews";
import { SubmitButton } from "./SubmitButton";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-bark-900 transition-shadow placeholder:text-bark-300 focus:border-fern-400 focus:outline-none focus:ring-3 focus:ring-fern-100";
const labelClass = "mb-1.5 block text-sm font-bold text-bark-700";

export function ReviewForm() {
  const [state, action] = useActionState<ReviewFormState, FormData>(
    submitReview,
    {}
  );
  const [rating, setRating] = useState(5);

  if (state.success) {
    return (
      <div className="rounded-3xl border border-fern-200 bg-fern-50 p-10 text-center">
        <p className="font-display text-2xl font-semibold text-canopy-900">
          Thank you
        </p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
          Your review has been sent to us and will appear here once we’ve had a
          chance to read it. It means a great deal.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {/* Honeypot: hidden from people, but bots fill it in. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className={labelClass}>
            Your name *
          </label>
          <input id="review-name" name="name" required className={inputClass} placeholder="Jordan E." />
        </div>
        <div>
          <label htmlFor="review-location" className={labelClass}>
            Where you’re from
          </label>
          <input id="review-location" name="location" className={inputClass} placeholder="Austin, TX" />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Your rating *</legend>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              aria-pressed={n === rating}
              className="transition-transform duration-200 hover:scale-115"
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden
                className={`h-8 w-8 ${n <= rating ? "text-gold-400" : "text-mist-300"}`}
                fill="currentColor"
              >
                <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.6z" />
              </svg>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-message" className={labelClass}>
          Your review *
        </label>
        <textarea
          id="review-message"
          name="message"
          required
          rows={5}
          className={inputClass}
          placeholder="How did the process go? How is your monkey settling in?"
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-semibold text-gold-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Sending…">Share your review</SubmitButton>
      <p className="text-sm text-bark-400">
        Reviews are read by us before they appear on the site.
      </p>
    </form>
  );
}
