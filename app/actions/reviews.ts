"use server";

import { createReview } from "@/lib/data";

export interface ReviewFormState {
  success?: boolean;
  error?: string;
}

export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  // Honeypot: real visitors never see this field, bots fill it in. Pretend
  // success so the bot moves on, but save nothing.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { success: true };
  }

  const review = {
    name: String(formData.get("name") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    rating: Number(formData.get("rating") ?? 0),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!review.name || !review.message) {
    return { error: "Please fill in your name and your review." };
  }
  if (review.message.length < 10) {
    return {
      error:
        "Could you tell us a little more? A sentence or two helps other families.",
    };
  }
  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) {
    return { error: "Please pick a star rating." };
  }

  try {
    await createReview(review);
  } catch (err) {
    console.error("Review submission failed:", err);
    return {
      error: "Something went wrong while sending your review. Please try again.",
    };
  }

  return { success: true };
}
