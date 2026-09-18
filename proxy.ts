import { createHash } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_COOKIE = "um_preview_admin";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function previewToken(): string {
  const password = process.env.ADMIN_PREVIEW_PASSWORD || "preview";
  return createHash("sha256")
    .update(`ultimate-marmoset:${password}`)
    .digest("hex");
}

/**
 * Protects /admin: refreshes the Supabase session cookie and redirects
 * unauthenticated visitors to the login page. While Supabase is not
 * configured, a signed preview cookie (set by the preview login) is accepted.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  let response = NextResponse.next({ request });
  let authenticated = false;

  if (isSupabaseConfigured()) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const allowed = process.env.ADMIN_EMAIL;
    authenticated = Boolean(
      user && (!allowed || user.email?.toLowerCase() === allowed.toLowerCase())
    );
  } else {
    authenticated =
      request.cookies.get(PREVIEW_COOKIE)?.value === previewToken();
  }

  if (!authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
