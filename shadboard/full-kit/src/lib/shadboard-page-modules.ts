/**
 * Shadboard sidebar modules whose UI payload is stored in `shadboard_page_content` (Supabase).
 * Add new keys here when wiring additional areas (e.g. ecosystra) to the same table.
 */
export const SHADBOARD_PAGE_MODULES = [
  "analytics",
  "crm",
  "ecommerce",
  "email",
  "chat",
  "calendar",
  "kanban",
] as const

export type ShadboardPageModule = (typeof SHADBOARD_PAGE_MODULES)[number]

export function isShadboardPageModule(s: string): s is ShadboardPageModule {
  return (SHADBOARD_PAGE_MODULES as readonly string[]).includes(s)
}
