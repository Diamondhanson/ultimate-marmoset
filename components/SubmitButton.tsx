"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
