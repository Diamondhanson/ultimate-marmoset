/**
 * Brand mark: a gold monkey silhouette inside a canopy-green roundel. Drawn
 * inline so it stays crisp at any size and picks up currentColor-free theme
 * tokens directly.
 */
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden role="presentation">
      <circle cx="24" cy="24" r="24" className="fill-canopy-800" />
      <circle
        cx="24"
        cy="24"
        r="21"
        className="fill-none stroke-gold-400"
        strokeWidth="1"
        opacity="0.55"
      />
      {/* ears */}
      <circle cx="13.5" cy="21" r="5.6" className="fill-gold-400" />
      <circle cx="34.5" cy="21" r="5.6" className="fill-gold-400" />
      <circle cx="13.5" cy="21" r="2.9" className="fill-canopy-800" opacity="0.5" />
      <circle cx="34.5" cy="21" r="2.9" className="fill-canopy-800" opacity="0.5" />
      {/* head */}
      <ellipse cx="24" cy="23" rx="10.5" ry="10" className="fill-gold-400" />
      {/* face */}
      <ellipse cx="24" cy="26" rx="7.4" ry="7" className="fill-gold-200" />
      {/* brow */}
      <path
        d="M16.9 19.6c2-2.2 4.4-3.3 7.1-3.3s5.1 1.1 7.1 3.3"
        className="stroke-canopy-800"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      {/* eyes */}
      <circle cx="20.9" cy="24.2" r="1.65" className="fill-canopy-900" />
      <circle cx="27.1" cy="24.2" r="1.65" className="fill-canopy-900" />
      <circle cx="21.4" cy="23.7" r="0.5" className="fill-mist-50" />
      <circle cx="27.6" cy="23.7" r="0.5" className="fill-mist-50" />
      {/* muzzle */}
      <path
        d="M21.6 29.4c1.5 1.3 3.3 1.3 4.8 0"
        className="stroke-canopy-900"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22.8" cy="27.6" r="0.55" className="fill-canopy-900" opacity="0.6" />
      <circle cx="25.2" cy="27.6" r="0.55" className="fill-canopy-900" opacity="0.6" />
    </svg>
  );
}
