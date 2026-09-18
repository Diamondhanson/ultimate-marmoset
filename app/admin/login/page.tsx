import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="texture-canopy flex flex-1 items-center justify-center bg-canopy-900 px-4 py-20">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3">
          <Logo className="h-12 w-12" />
          <span className="font-display text-xl font-semibold text-mist-50">
            {site.shortName}
          </span>
        </div>

        <div className="mt-8 rounded-3xl border border-mist-200 bg-white p-8 shadow-2xl shadow-canopy-950/40">
          <h1 className="font-display text-2xl font-semibold text-canopy-900">
            Dashboard sign in
          </h1>
          <p className="mt-2 text-sm text-bark-500">
            For the nursery owner only.
          </p>
          <div className="mt-7">
            <LoginForm previewMode={!isSupabaseConfigured()} />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-mist-200/70">
          <Link href="/" className="hover:text-gold-300">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
