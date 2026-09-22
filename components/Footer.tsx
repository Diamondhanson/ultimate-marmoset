import Link from "next/link";
import { Logo } from "./Logo";
import { Frond } from "./Leaf";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";

const explore = [
  { href: "/monkeys", label: "Available Monkeys" },
  { href: "/about", label: "About Us" },
  { href: "/care-guide", label: "Care Guide" },
  { href: "/reviews", label: "Reviews" },
];

const info = [
  { href: "/delivery-and-visits", label: "Delivery & Visits" },
  { href: "/health-guarantee", label: "Health Guarantee" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-canopy-900 text-mist-200">
      <div className="texture-canopy absolute inset-0" aria-hidden />
      <Frond
        aria-hidden
        className="animate-sway pointer-events-none absolute -right-10 -top-8 h-56 w-44 text-fern-500/10"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="font-display text-lg font-semibold text-mist-50">
              {site.shortName}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-200/80">
            A small, hands-on primate nursery. Every baby here is bottle-raised
            in our home, vet-checked, and placed only with families ready for a
            twenty-year companion.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {explore.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-mist-200/85 transition-colors hover:text-gold-300"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
            Monkeys for sale
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  className="text-mist-200/85 transition-colors hover:text-gold-300"
                  href={`/${c.slug}`}
                >
                  {c.name} for sale
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
            Before you buy
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {info.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-mist-200/85 transition-colors hover:text-gold-300"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
            Talk to us
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-mist-200/85">
            <li>
              <a className="transition-colors hover:text-gold-300" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                {site.phone}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-gold-300" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li className="pt-1 text-mist-200/65">{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-canopy-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-mist-200/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Primate ownership is regulated and varies by state. We confirm the
            rules where you live before accepting any reservation.
          </p>
        </div>
      </div>
    </footer>
  );
}
