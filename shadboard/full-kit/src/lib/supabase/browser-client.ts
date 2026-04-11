import { createClient } from "@supabase/supabase-js"

import type { SupabaseClient } from "@supabase/supabase-js"

let singleton: SupabaseClient | null = null

/** Browser-only Realtime client (anon key). Returns null if env not configured. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon) return null

  if (!singleton) {
    singleton = createClient(url, anon, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return singleton
}
