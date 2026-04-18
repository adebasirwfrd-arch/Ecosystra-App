/**
 * Verifies PostgREST column names + ordering for `shadboard_content.crm_deal`.
 *
 *   pnpm exec dotenv -e .env.local -- tsx scripts/probe-crm-postgrest.ts
 *
 * Requires: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and Dashboard
 * → API → Expose schema `shadboard_content`.
 */
import { createClient } from "@supabase/supabase-js"

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .schema("shadboard_content")
    .from("crm_deal")
    .select("*")
    .order("updatedAt", { ascending: false })
    .limit(1)

  if (error) {
    console.error("PostgREST error:", error.message, error)
    process.exit(1)
  }

  const row = data?.[0]
  if (!row) {
    console.log("No rows in crm_deal (empty table is OK). Probe: order(updatedAt) succeeded.")
    return
  }

  console.log("Sample row keys:", Object.keys(row as object).sort().join(", "))
  console.log("Sample row:", JSON.stringify(row, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
