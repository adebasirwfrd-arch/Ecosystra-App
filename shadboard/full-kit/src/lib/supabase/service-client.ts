import { createClient } from "@supabase/supabase-js"

import type { SupabaseClient } from "@supabase/supabase-js"

/** Server-only: Storage uploads. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (never expose to client). */
export function getSupabaseServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) return null

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
