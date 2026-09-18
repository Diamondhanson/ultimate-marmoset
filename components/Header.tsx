"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { site } from "@/lib/site";

const primary = [
  { href: "/monkeys", label: "Available Monkeys" },
  { href: "/about", label: "About" },
  { href: "/care-guide", label: "Care Guide" },
  { href: "/delivery-and-visits", label: "Delivery & Visits" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

const secondary = [
  { href: "/health-guarantee", label: "Health Guarantee" },
  { href: "/faq", label: "FAQ" },
];

const all = [{ href: "/", label: "Home" }, ...primary, ...secondary];

export function Header() {
  const pathname = usePathname();
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-canopy-800/60 bg-canopy-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-18 sm:gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <Logo className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:rotate-6 sm:h-11 sm:w-11" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-semibold tracking-tight text-mist-50 sm:text-xl">
                {site.shortName}
              </span>
              <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 sm:block">
                &amp; Capuchin Monkeys Home
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {primary.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-gold-400 after:transition-all after:duration-300 ${
                  pathname === link.href
                    ? "text-gold-300 after:w-full"
                    : "text-mist-200 after:w-0 hover:text-mist-50 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/reserve"
              onClick={() => setOpen(false)}
              className="relative shrink-0 whitespace-nowrap rounded-full bg-gold-400 px-4 py-2.5 text-sm font-bold text-canopy-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-gold-300 active:scale-95 sm:px-5"
            >
              My list
              {items.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-canopy-700 text-[11px] font-bold text-mist-50 ring-2 ring-canopy-900">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-canopy-700 text-mist-100 transition-colors hover:bg-canopy-800 xl:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                {open ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="animate-fade-in grid gap-1 pb-5 xl:hidden">
            {all.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "bg-canopy-700 text-gold-300"
                    : "text-mist-200 hover:bg-canopy-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
