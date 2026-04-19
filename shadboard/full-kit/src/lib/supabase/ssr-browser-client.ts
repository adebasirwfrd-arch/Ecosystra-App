"use client"

import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

let singleton: SupabaseClient<Database> | null = null

/**
 * Browser client aligned with `@supabase/ssr` and server cookie refresh.
 * Prefer this for user session + RLS-bound queries from the client.
 */
export function getSupabaseSsrBrowserClient(): SupabaseClient<Database> | null {
  if (typeof window === "undefined") return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon) return null

  if (!singleton) {
    singleton = createBrowserClient<Database>(url, anon)
  }
  return singleton
}
