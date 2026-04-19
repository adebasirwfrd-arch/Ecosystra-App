import Dexie, { type Table } from "dexie"

/**
 * Local-first board: snapshot in IndexedDB + mutation outbox for
 * `UpdateItemDynamicData` (HSE / indicators) with Apollo cache + Dexie persistence.
 */

const DB_NAME = "ecosystra-board-v1"

export type BoardLocalSnapshotRow = {
  id: "singleton"
  boardId: string
  workspaceId: string
  /** Same shape as `GetOrCreateBoard.getOrCreateBoard` */
  payload: unknown
  savedAt: number
}

export type MutationOutboxStatus = "pending" | "syncing"

export type MutationOutboxRow = {
  id: string
  type: "UpdateItemDynamicData"
  variables: { id: string; dynamicData: Record<string, unknown> }
  status: MutationOutboxStatus
  createdAt: number
  /** `Item.updatedAt` when the change was queued — compared to server on sync (conflict if server is newer). */
  baseItemUpdatedAt?: string | null
  /** Consecutive failed sync attempts (exponential backoff). */
  syncFailureCount?: number
  /** Do not send before this time (epoch ms). */
  nextAttemptAtMs?: number | null
}

class EcosystraBoardLocalDexie extends Dexie {
  currentBoard!: Table<BoardLocalSnapshotRow, string>
  mutations!: Table<MutationOutboxRow, string>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      currentBoard: "id",
    })
    this.version(2).stores({
      currentBoard: "id",
      mutations: "id, createdAt, type, status",
    })
    this.version(3).stores({
      currentBoard: "id",
      mutations: "id, createdAt, type, status, nextAttemptAtMs",
    })
  }
}

let db: EcosystraBoardLocalDexie | null = null

function getDb(): EcosystraBoardLocalDexie {
  if (!db) db = new EcosystraBoardLocalDexie()
  return db
}

function cloneForStorage(board: unknown): unknown {
  try {
    return structuredClone(board)
  } catch {
    try {
      return JSON.parse(JSON.stringify(board)) as unknown
    } catch {
      return board
    }
  }
}

export function isBoardLocalDbAvailable(): boolean {
  return typeof indexedDB !== "undefined"
}

/** Tab crash / reload while a row was `syncing` — make it drainable again. */
export async function reviveSyncingMutationsAsPending(): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  try {
    await getDb().mutations.where("status").equals("syncing").modify({ status: "pending" })
  } catch {
    /* noop */
  }
}

export async function peekNextPendingMutation(): Promise<MutationOutboxRow | null> {
  if (!isBoardLocalDbAvailable()) return null
  const now = Date.now()
  try {
    const rows = await getDb()
      .mutations.filter(
        (m) =>
          m.status === "pending" &&
          (m.nextAttemptAtMs == null || m.nextAttemptAtMs <= now)
      )
      .sortBy("createdAt")
    return rows[0] ?? null
  } catch {
    return null
  }
}

export type DynamicDataOutboxCoalesce = {
  rowId: string
  /** Merged `dynamicData` keys to send in one `updateItemDynamicData` call. */
  cumulativeDynamicData: Record<string, unknown>
}

/**
 * Coalesce rapid patches: merge `patch` into an existing **pending** row for the
 * same item, or append a new row. Runs in a Dexie transaction.
 */
export async function addOrMergeDynamicDataOutbox(
  itemId: string,
  patch: Record<string, unknown>,
  baseItemUpdatedAt: string | null
): Promise<DynamicDataOutboxCoalesce | null> {
  if (!isBoardLocalDbAvailable()) return null
  const d = getDb()
  try {
    return await d.transaction("rw", d.mutations, async () => {
      const existing = await d.mutations
        .filter(
          (m) =>
            m.type === "UpdateItemDynamicData" &&
            m.status === "pending" &&
            (m.variables as { id: string }).id === itemId
        )
        .first()
      if (existing) {
        const v = existing.variables as { id: string; dynamicData: Record<string, unknown> }
        const mergedDyn = { ...v.dynamicData, ...patch }
        await d.mutations.update(existing.id, {
          variables: { id: itemId, dynamicData: mergedDyn },
          syncFailureCount: 0,
          nextAttemptAtMs: null,
        })
        return { rowId: existing.id, cumulativeDynamicData: mergedDyn }
      }
      const rowId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      const cumulative = { ...patch }
      await d.mutations.add({
        id: rowId,
        type: "UpdateItemDynamicData",
        variables: { id: itemId, dynamicData: cumulative },
        status: "pending",
        createdAt: Date.now(),
        baseItemUpdatedAt: baseItemUpdatedAt ?? null,
        syncFailureCount: 0,
        nextAttemptAtMs: null,
      })
      return { rowId, cumulativeDynamicData: cumulative }
    })
  } catch {
    return null
  }
}

export async function setMutationStatus(id: string, status: MutationOutboxStatus): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  try {
    await getDb().mutations.update(id, { status })
  } catch {
    /* noop */
  }
}

export async function applyMutationSyncFailureBackoff(
  id: string,
  syncFailureCount: number,
  nextAttemptAtMs: number
): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  try {
    await getDb().mutations.update(id, {
      status: "pending",
      syncFailureCount,
      nextAttemptAtMs,
    })
  } catch {
    /* noop */
  }
}

export async function deleteMutation(id: string): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  try {
    await getDb().mutations.delete(id)
  } catch {
    /* noop */
  }
}

/** Last persisted board tree (or null if none / unavailable). */
export async function loadCachedBoardPayload(): Promise<unknown | null> {
  if (!isBoardLocalDbAvailable()) return null
  try {
    const row = await getDb().currentBoard.get("singleton")
    return row?.payload ?? null
  } catch {
    return null
  }
}

/** Persist successful server snapshot for instant paint on next visit. */
export async function saveBoardPayloadToLocal(board: unknown): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  const b = board as { id?: string; workspaceId?: string }
  if (!b?.id) return
  try {
    await getDb().currentBoard.put({
      id: "singleton",
      boardId: b.id,
      workspaceId: String(b.workspaceId ?? ""),
      payload: cloneForStorage(board),
      savedAt: Date.now(),
    })
  } catch {
    /* quota exceeded, private mode, etc. */
  }
}

/** Clear IndexedDB board cache and pending mutations (e.g. sign-out). */
export async function clearBoardLocalCache(): Promise<void> {
  if (!isBoardLocalDbAvailable()) return
  try {
    await getDb().currentBoard.clear()
    await getDb().mutations.clear()
  } catch {
    /* noop */
  }
}
