import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { requireSupabasePublicEnv } from "@/lib/supabase/env"

import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Supabase server client for Server Components, Server Actions, and Route Handlers.
 * Respects RLS for the user whose session cookies are on the request.
 */
export async function createSupabaseServerClient(): Promise<
  SupabaseClient<Database>
> {
  const { url, anonKey } = requireSupabasePublicEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          /* Server Component tree may forbid set — Route Handlers / Actions should set instead */
        }
      },
    },
  })
}
