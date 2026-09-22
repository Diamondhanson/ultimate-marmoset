import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact Our Monkey Nursery",
  description:
    "Call, text or email Ultimate Marmoset about a monkey, a visit or delivery. We answer every message ourselves, usually within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  const channels = [
    {
      label: "Call or text",
      value: site.phone,
      href: `tel:${site.phone.replace(/[^+\d]/g, "")}`,
    },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            Contact us about a monkey
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
            Whether you’re ready to reserve or just working out whether a
            primate is realistic for your home, we’d rather have the
            conversation. {site.hours}.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-20">
        <div>
          <h2 className="font-display text-2xl font-semibold text-canopy-900">
            Send us a message
          </h2>
          <p className="mt-2 leading-relaxed text-bark-500">
            Tell us where you live and a little about your home. That way we
            can give you a useful answer the first time.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <aside className="h-fit space-y-4">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="block rounded-3xl border border-mist-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fern-300 hover:shadow-[0_14px_32px_-20px_rgba(15,52,35,0.45)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-fern-600">
                {channel.label}
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-canopy-900">
                {channel.value}
              </p>
            </a>
          ))}

          <div className="rounded-3xl border border-gold-200 bg-gold-100/60 p-6">
            <p className="font-display text-lg font-semibold text-canopy-900">
              Booking a visit?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bark-600">
              Appointments are held with a fully refundable deposit. Read how it
              works before you write to us.
            </p>
            <Link
              href="/delivery-and-visits"
              className="mt-4 inline-block text-sm font-bold text-canopy-700 underline underline-offset-2 hover:text-fern-600"
            >
              Delivery &amp; visits policy →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
