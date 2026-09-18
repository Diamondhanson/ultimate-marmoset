import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export const PREVIEW_COOKIE = "um_preview_admin";

/**
 * Token stored in the preview-mode admin cookie. Derived from the preview
 * password so changing the password invalidates existing sessions. Preview
 * login is only honored while Supabase is NOT configured.
 */
export function previewToken(): string {
  const password = process.env.ADMIN_PREVIEW_PASSWORD || "preview";
  return createHash("sha256")
    .update(`ultimate-marmoset:${password}`)
    .digest("hex");
}

export interface AdminSession {
  isAdmin: boolean;
  email: string | null;
  mode: "supabase" | "preview";
}

export async function getAdminSession(): Promise<AdminSession> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const allowed = process.env.ADMIN_EMAIL;
    const isAdmin = Boolean(
      user && (!allowed || user.email?.toLowerCase() === allowed.toLowerCase())
    );
    return { isAdmin, email: user?.email ?? null, mode: "supabase" };
  }

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(PREVIEW_COOKIE)?.value === previewToken();
  return { isAdmin, email: isAdmin ? "preview@localhost" : null, mode: "preview" };
}

/** Guard for admin server actions; throws unless the caller is the admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session.isAdmin) throw new Error("Not authorized");
  return session;
}
