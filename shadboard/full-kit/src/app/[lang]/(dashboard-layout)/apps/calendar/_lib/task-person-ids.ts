import { readAssigneeUserIdsFromDynamic } from "@/components/ecosystra/hooks/use-ecosystra-board-apollo"

/** Owner + assignees (board “person” column / People). */
export function collectTaskPersonUserIds(
  snapshot: Record<string, unknown>
): string[] {
  const assignees = readAssigneeUserIdsFromDynamic(snapshot)
  const owner =
    typeof snapshot.ownerUserId === "string" && snapshot.ownerUserId.trim()
      ? snapshot.ownerUserId.trim()
      : null
  const out: string[] = []
  const seen = new Set<string>()
  for (const id of assignees) {
    if (!seen.has(id)) {
      seen.add(id)
      out.push(id)
    }
  }
  if (owner && !seen.has(owner)) out.push(owner)
  return out
}
