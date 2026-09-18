/**
 * Decorative monstera-style frond used to break up sections. Purely visual,
 * so callers always render it aria-hidden.
 */
export function Frond({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      style={style}
      aria-hidden
      role="presentation"
      fill="none"
    >
      <path
        d="M60 158V44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M60 44c0-24 14-40 34-44 4 22-6 40-22 50-4 3-9 0-12-6zM60 44c0-24-14-40-34-44-4 22 6 40 22 50 4 3 9 0 12-6zM60 80c0-20 12-33 29-36 4 18-5 33-19 41-4 3-8 0-10-5zM60 80c0-20-12-33-29-36-4 18 5 33 19 41 4 3 8 0 10-5zM60 116c0-17 10-28 25-31 3 15-5 28-16 35-4 2-7 0-9-4zM60 116c0-17-10-28-25-31-3 15 5 28 16 35 4 2 7 0 9-4z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Slim hanging vine, anchored at the top edge of a section. */
export function Vine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 220"
      className={className}
      aria-hidden
      role="presentation"
      fill="none"
    >
      <path
        d="M20 0c0 40-12 56-12 84s14 40 14 68-10 40-10 68"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <ellipse cx="9" cy="58" rx="8" ry="5" fill="currentColor" opacity="0.85" transform="rotate(-24 9 58)" />
      <ellipse cx="29" cy="104" rx="9" ry="5.5" fill="currentColor" opacity="0.85" transform="rotate(20 29 104)" />
      <ellipse cx="12" cy="152" rx="7.5" ry="4.5" fill="currentColor" opacity="0.85" transform="rotate(-18 12 152)" />
      <ellipse cx="26" cy="196" rx="6.5" ry="4" fill="currentColor" opacity="0.85" transform="rotate(16 26 196)" />
    </svg>
  );
}
