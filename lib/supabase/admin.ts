import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client; bypasses RLS. Server-only; used by admin dashboard
 * actions (monkey CRUD, storage uploads, reading orders/messages) after the
 * caller has been verified as the admin, and for public reservation/contact
 * inserts.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
