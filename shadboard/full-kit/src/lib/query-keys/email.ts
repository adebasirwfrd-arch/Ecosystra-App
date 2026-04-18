/**
 * Query key factory untuk domain email (modal.md §2.5 — konsistensi invalidasi).
 * Email UI saat ini memakai Context + reducer; factory ini siap dipakai saat migrasi ke TanStack Query.
 */
export const emailQueryKeys = {
  all: ["email"] as const,
  lists: () => [...emailQueryKeys.all, "list"] as const,
  list: (filter: string) => [...emailQueryKeys.lists(), filter] as const,
  details: () => [...emailQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...emailQueryKeys.details(), id] as const,
  counts: () => [...emailQueryKeys.all, "counts"] as const,
}
