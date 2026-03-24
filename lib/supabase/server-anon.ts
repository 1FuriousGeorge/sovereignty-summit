import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_OPTIONS } from "./options";

/**
 * Server-side anon client (e.g. Route Handlers after Turnstile verification).
 */
export function createSupabaseServerAnonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return null;
  }
  return createClient(url, anonKey, SUPABASE_ANON_OPTIONS);
}
