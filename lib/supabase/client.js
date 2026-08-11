import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in the browser (client components).
 * Reads the public URL + anon key from environment variables.
 * These are safe to expose to the browser — write access is controlled
 * by row-level security (RLS) policies, not by hiding this key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
