import { jsonError, jsonOk } from "@/lib/api/http"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Thin health/session probe for Supabase cookie auth (modal.md §2.4).
 * Does not replace NextAuth — use during migration to verify SSR wiring.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured", 503)
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      return jsonOk({
        configured: true,
        authenticated: false,
        message: error.message,
      })
    }
    return jsonOk({
      configured: true,
      authenticated: !!data.user,
      userId: data.user?.id ?? null,
      email: data.user?.email ?? null,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase session error"
    return jsonError(message, 500)
  }
}
