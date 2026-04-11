import { db } from "@/lib/prisma"

import {
  type ShadboardPageModule,
  isShadboardPageModule,
} from "./shadboard-page-modules"

export type { ShadboardPageModule }
export { isShadboardPageModule }

/**
 * Loads the JSON payload for a Shadboard module from Supabase. No in-app fallback —
 * run `pnpm db:seed-page-content` after `db:push` if rows are missing.
 */
export async function getShadboardPageContent(
  module: ShadboardPageModule
): Promise<Record<string, unknown>> {
  const row = await db.shadboardPageContent.findUnique({
    where: { module },
  })
  if (
    row?.payload &&
    typeof row.payload === "object" &&
    row.payload !== null &&
    !Array.isArray(row.payload)
  ) {
    return row.payload as Record<string, unknown>
  }
  throw new Error(
    `Missing Shadboard page content for module "${module}". Seed the database (pnpm db:seed-page-content).`
  )
}
