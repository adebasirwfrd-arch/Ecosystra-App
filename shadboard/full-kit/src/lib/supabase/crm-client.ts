import "server-only"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-client"

import type { SupabaseClient } from "@supabase/supabase-js"

/** PostgREST schema for Prisma `@@schema("shadboard_content")` CRM models. */
export const CRM_POSTGREST_SCHEMA = "shadboard_content" as const

/**
 * Supabase client for `/api/crm/*` when `CRM_USE_SUPABASE=1`.
 * - `service_role` (default): server Route Handler after `requireApiSession` — bypasses RLS until policies ship.
 * - `user_session`: `createSupabaseServerClient()` — respects RLS once Supabase Auth matches the viewer.
 */
export async function getCrmSupabaseClient(): Promise<SupabaseClient | null> {
  if (process.env.CRM_USE_SUPABASE !== "1") {
    return null
  }

  const mode = (process.env.CRM_SUPABASE_MODE ?? "service_role").trim()

  if (mode === "user_session") {
    return (await createSupabaseServerClient()) as unknown as SupabaseClient
  }

  const service = getSupabaseServiceRoleClient()
  if (service) return service

  return (await createSupabaseServerClient()) as unknown as SupabaseClient
}
