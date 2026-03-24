/** Shared options for anon Supabase clients (browser + server) — no session persistence. */
export const SUPABASE_ANON_OPTIONS = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
} as const;
