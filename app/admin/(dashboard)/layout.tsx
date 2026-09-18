import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getAdminSession } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { site } from "@/lib/site";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/monkeys", label: "Monkeys" },
  { href: "/admin/orders", label: "Reservations" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/contacts", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The proxy already gates /admin, but layouts and actions verify again.
  const session = await getAdminSession();
  if (!session.isAdmin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen w-full flex-col bg-mist-100 lg:flex-row">
      <aside className="shrink-0 border-b border-canopy-800 bg-canopy-900 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 p-5 lg:block">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-base font-semibold text-mist-50">
              {site.shortName}
            </span>
          </Link>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 lg:mt-1.5 lg:block">
            Dashboard
          </p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:pb-0">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-mist-200/80 transition-colors hover:bg-canopy-800 hover:text-mist-50"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-mist-200/60 transition-colors hover:bg-canopy-800 lg:hidden"
          >
            Website
          </Link>
          <form action={logout} className="shrink-0 lg:hidden">
            <button
              type="submit"
              className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-mist-200/60 transition-colors hover:bg-canopy-800"
            >
              Sign out
            </button>
          </form>
        </nav>

        <div className="mt-6 hidden space-y-1 px-3 pb-6 lg:block">
          <Link
            href="/"
            className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-mist-200/60 transition-colors hover:bg-canopy-800"
          >
            View website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-mist-200/60 transition-colors hover:bg-canopy-800"
            >
              Sign out
            </button>
          </form>
          {session.email && (
            <p className="px-4 pt-4 text-xs text-mist-200/40">{session.email}</p>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {session.mode === "preview" && (
          <div className="border-b border-gold-200 bg-gold-100 px-6 py-3 text-sm font-semibold text-gold-700">
            Preview mode: Supabase isn’t connected yet, so you’re seeing sample
            data and saving is disabled. Follow SETUP.md to plug in the keys.
          </div>
        )}
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
