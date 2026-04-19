/**
 * Serializes `patchItemField` work per `itemId` so rapid patches + Dexie coalesce
 * do not interleave mutates/deletes for the same task.
 */

const tails = new Map<string, Promise<void>>()

/**
 * Runs `task` after any prior task for the same `itemId` finishes (FIFO per item).
 */
export function withPerItemDynamicPatchQueue(
  itemId: string,
  task: () => Promise<void>
): Promise<void> {
  const prev = tails.get(itemId) ?? Promise.resolve()
  const job = prev
    .then(() => task())
    .catch(() => {
      /* errors handled inside task */
    })
  tails.set(itemId, job)
  void job.finally(() => {
    if (tails.get(itemId) === job) {
      tails.delete(itemId)
    }
  })
  return job
}
