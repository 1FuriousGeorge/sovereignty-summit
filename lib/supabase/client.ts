import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser client for public/anonymous operations (e.g. insert with RLS for anon).
 * Session persistence is disabled so we never read stale refresh tokens from
 * localStorage—otherwise Supabase Auth can throw "Invalid Refresh Token" on
 * requests even when you are not signing users in.
 */
export function createSupabaseBrowserClient() {
  if (!url || !anonKey) {
    return null;
  }
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
