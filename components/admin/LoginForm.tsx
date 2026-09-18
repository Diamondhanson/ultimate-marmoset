"use client";

import { useActionState } from "react";
import { login, type AuthFormState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-bark-900 transition-shadow placeholder:text-bark-300 focus:border-fern-400 focus:outline-none focus:ring-3 focus:ring-fern-100";
const labelClass = "mb-1.5 block text-sm font-bold text-bark-700";

export function LoginForm({ previewMode }: { previewMode: boolean }) {
  const [state, action] = useActionState<AuthFormState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-semibold text-gold-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>

      {previewMode && (
        <p className="rounded-xl bg-mist-100 px-4 py-3 text-sm leading-relaxed text-bark-500">
          <strong className="text-bark-700">Preview mode.</strong> Supabase
          isn’t connected yet, so any email works with the preview password
          (default <code className="font-mono">preview</code>). Real
          email/password login switches on automatically once the keys are in.
        </p>
      )}
    </form>
  );
}
