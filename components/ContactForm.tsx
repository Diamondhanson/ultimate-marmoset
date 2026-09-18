"use client";

import { useActionState, useEffect } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";
import { SubmitButton } from "./SubmitButton";
import { ADS_CONTACT_LABEL, track, trackAdsConversion } from "@/lib/gtag";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-bark-900 transition-shadow placeholder:text-bark-300 focus:border-fern-400 focus:outline-none focus:ring-3 focus:ring-fern-100";
const labelClass = "mb-1.5 block text-sm font-bold text-bark-700";

export function ContactForm() {
  const [state, action] = useActionState<ContactFormState, FormData>(
    submitContact,
    {}
  );

  useEffect(() => {
    if (state.success) {
      track("contact_submitted");
      trackAdsConversion(ADS_CONTACT_LABEL);
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div className="rounded-3xl border border-fern-200 bg-fern-50 p-10 text-center">
        <p className="font-display text-2xl font-semibold text-canopy-900">
          Message sent
        </p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
          Thank you for reaching out. We answer every message personally, and we
          usually reply within 24 hours, often much sooner.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name *
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Jordan Ellis" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input id="phone" name="phone" className={inputClass} placeholder="(555) 000-0000" />
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <input id="subject" name="subject" className={inputClass} placeholder="Question about Pip" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={inputClass}
          placeholder="Tell us a little about your home, your experience with animals, and which monkey caught your eye."
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-semibold text-gold-700">
          {state.error}
        </p>
      )}

      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
