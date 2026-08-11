import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and returns both
 * the (possibly redirected) response and the signed-in user, if any.
 * Used by middleware.js to gate the /admin area.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase not configured yet — don't crash the whole /admin area.
  // Treat every request as signed-out so /admin/login still renders,
  // and every other /admin/* route safely redirects to it.
  if (!url || !anonKey) {
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
