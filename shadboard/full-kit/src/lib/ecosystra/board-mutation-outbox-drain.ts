import type { ApolloClient } from "@apollo/client"
import { toast } from "sonner"

import {
  isServerItemNewerThanBase,
  readItemUpdatedAtFromBoard,
} from "@/lib/ecosystra/board-dynamic-data-cache"
import { GET_OR_CREATE_BOARD, UPDATE_ITEM_DYNAMIC_DATA } from "@/lib/ecosystra/board-gql"

import {
  applyMutationSyncFailureBackoff,
  deleteMutation,
  peekNextPendingMutation,
  reviveSyncingMutationsAsPending,
  setMutationStatus,
} from "@/lib/ecosystra/board-local-db"

/** After this many failed attempts, drop the row to avoid hammering the server. */
const MAX_SYNC_FAILURES = 10

let drainTail: Promise<void> = Promise.resolve()

function syncBackoffMs(failureOrdinal: number): number {
  const i = Math.max(0, Math.min(failureOrdinal - 1, 6))
  return Math.min(60_000, 1000 * 2 ** i)
}

async function fetchServerItemUpdatedAt(
  client: ApolloClient<object>,
  itemId: string
): Promise<string | null> {
  try {
    const { data } = await client.query<{ getOrCreateBoard: unknown }>({
      query: GET_OR_CREATE_BOARD,
      fetchPolicy: "network-only",
    })
    return readItemUpdatedAtFromBoard(data?.getOrCreateBoard, itemId)
  } catch {
    return null
  }
}

/**
 * Process every pending `UpdateItemDynamicData` row until the queue is empty,
 * a sync error triggers backoff (stop until `nextAttemptAtMs`), or max retries exceeded.
 */
export async function recoverPendingMutationOutbox(
  client: ApolloClient<object>
): Promise<void> {
  await reviveSyncingMutationsAsPending()

  while (true) {
    const next = await peekNextPendingMutation()
    if (!next || next.status !== "pending") return

    if (next.type !== "UpdateItemDynamicData") {
      await deleteMutation(next.id)
      continue
    }

    const variables = next.variables as { id: string; dynamicData: Record<string, unknown> }
    const itemId = variables.id
    const baseAt = next.baseItemUpdatedAt

    if (baseAt) {
      const serverAt = await fetchServerItemUpdatedAt(client, itemId)
      if (isServerItemNewerThanBase(serverAt, baseAt)) {
        await deleteMutation(next.id)
        toast.warning(
          "Conflict detected: this task was updated elsewhere. Your queued change was not applied."
        )
        try {
          await client.refetchQueries({ include: [GET_OR_CREATE_BOARD] })
        } catch {
          /* noop */
        }
        continue
      }
    }

    await setMutationStatus(next.id, "syncing")
    try {
      await client.mutate({
        mutation: UPDATE_ITEM_DYNAMIC_DATA,
        variables,
      })
      await deleteMutation(next.id)
    } catch {
      const failures = (next.syncFailureCount ?? 0) + 1

      if (failures >= MAX_SYNC_FAILURES) {
        await deleteMutation(next.id)
        toast.error(
          "Could not sync this change after several attempts — it was removed from the queue."
        )
        continue
      }

      const delayMs = syncBackoffMs(failures)
      await applyMutationSyncFailureBackoff(next.id, failures, Date.now() + delayMs)

      if (failures === 1) {
        try {
          await client.refetchQueries({ include: [GET_OR_CREATE_BOARD] })
        } catch {
          /* noop */
        }
      }

      toast.error(
        `Sync failed — will retry in ${Math.max(1, Math.ceil(delayMs / 1000))}s (backoff).`
      )
      continue
    }
  }
}

/**
 * Serializes recovery with other callers (e.g. `patchItemField` error retry).
 */
export function scheduleUpdateItemDynamicDataDrain(
  client: ApolloClient<object>
): void {
  drainTail = drainTail
    .then(() => recoverPendingMutationOutbox(client))
    .catch(() => {})
}
