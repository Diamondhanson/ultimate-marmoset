"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PREVIEW_COOKIE, previewToken } from "@/lib/auth";

export interface AuthFormState {
  error?: string;
}

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: "Invalid email or password." };

    const allowed = process.env.ADMIN_EMAIL;
    if (allowed && data.user.email?.toLowerCase() !== allowed.toLowerCase()) {
      await supabase.auth.signOut();
      return { error: "This account is not authorized for the dashboard." };
    }
  } else {
    // Preview mode: Supabase keys not set yet. Any email, preview password.
    const expected = process.env.ADMIN_PREVIEW_PASSWORD || "preview";
    if (password !== expected) {
      return { error: "Wrong preview password." };
    }
    const cookieStore = await cookies();
    cookieStore.set(PREVIEW_COOKIE, previewToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_COOKIE);
  redirect("/admin/login");
}
