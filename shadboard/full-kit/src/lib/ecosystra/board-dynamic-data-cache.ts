/**
 * Pure helpers to merge `dynamicData` patches into the in-memory board tree
 * (`GetOrCreateBoard` shape) for optimistic / local-first updates.
 */

function cloneBoard(board: unknown): unknown {
  try {
    return structuredClone(board)
  } catch {
    try {
      return JSON.parse(JSON.stringify(board)) as unknown
    } catch {
      return null
    }
  }
}

/**
 * Returns a deep-cloned board with `patch` shallow-merged into `dynamicData`
 * for the item or subitem matching `itemId`. Returns null if the id was not found.
 */
export function mergeDynamicDataPatchIntoBoard(
  board: unknown,
  itemId: string,
  patch: Record<string, unknown>
): unknown | null {
  const b = cloneBoard(board)
  if (!b || typeof b !== "object") return null
  const root = b as {
    groups?: Array<{
      items?: Array<{
        id: string
        dynamicData?: Record<string, unknown>
        subitems?: Array<{ id: string; dynamicData?: Record<string, unknown> }>
      }>
    }>
  }
  if (!Array.isArray(root.groups)) return null
  for (const g of root.groups) {
    if (!Array.isArray(g.items)) continue
    for (const it of g.items) {
      if (it.id === itemId) {
        it.dynamicData = { ...(it.dynamicData ?? {}), ...patch }
        return b
      }
      if (Array.isArray(it.subitems)) {
        for (const sub of it.subitems) {
          if (sub.id === itemId) {
            sub.dynamicData = { ...(sub.dynamicData ?? {}), ...patch }
            return b
          }
        }
      }
    }
  }
  return null
}

/** Read merged `dynamicData` for an item or subitem after a board clone (e.g. for `optimisticResponse`). */
export function readItemDynamicDataFromBoard(
  board: unknown,
  itemId: string
): Record<string, unknown> | null {
  if (!board || typeof board !== "object") return null
  const root = board as {
    groups?: Array<{
      items?: Array<{
        id: string
        dynamicData?: Record<string, unknown>
        subitems?: Array<{ id: string; dynamicData?: Record<string, unknown> }>
      }>
    }>
  }
  if (!Array.isArray(root.groups)) return null
  for (const g of root.groups) {
    if (!Array.isArray(g.items)) continue
    for (const it of g.items) {
      if (it.id === itemId) {
        return { ...(it.dynamicData ?? {}) }
      }
      if (Array.isArray(it.subitems)) {
        for (const sub of it.subitems) {
          if (sub.id === itemId) {
            return { ...(sub.dynamicData ?? {}) }
          }
        }
      }
    }
  }
  return null
}

/** `Item.updatedAt` (ISO) from the embedded board tree, for conflict detection. */
export function readItemUpdatedAtFromBoard(board: unknown, itemId: string): string | null {
  if (!board || typeof board !== "object") return null
  const root = board as {
    groups?: Array<{
      items?: Array<{
        id: string
        updatedAt?: string
        subitems?: Array<{ id: string; updatedAt?: string }>
      }>
    }>
  }
  if (!Array.isArray(root.groups)) return null
  for (const g of root.groups) {
    if (!Array.isArray(g.items)) continue
    for (const it of g.items) {
      if (it.id === itemId) {
        return typeof it.updatedAt === "string" && it.updatedAt.trim() ? it.updatedAt : null
      }
      if (Array.isArray(it.subitems)) {
        for (const sub of it.subitems) {
          if (sub.id === itemId) {
            return typeof sub.updatedAt === "string" && sub.updatedAt.trim() ? sub.updatedAt : null
          }
        }
      }
    }
  }
  return null
}

/** True if server `updatedAt` is strictly newer than the baseline captured when the user queued the change. */
export function isServerItemNewerThanBase(
  serverUpdatedAtIso: string | null | undefined,
  baseUpdatedAtIso: string | null | undefined
): boolean {
  if (!serverUpdatedAtIso?.trim() || !baseUpdatedAtIso?.trim()) return false
  const s = Date.parse(serverUpdatedAtIso)
  const b = Date.parse(baseUpdatedAtIso)
  return Number.isFinite(s) && Number.isFinite(b) && s > b
}
