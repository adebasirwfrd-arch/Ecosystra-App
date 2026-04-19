/**
 * Query key factory for the email domain.
 * Email UI uses Context + reducer today; this factory is ready if you adopt TanStack Query.
 */
export const emailQueryKeys = {
  all: ["email"] as const,
  lists: () => [...emailQueryKeys.all, "list"] as const,
  list: (filter: string) => [...emailQueryKeys.lists(), filter] as const,
  details: () => [...emailQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...emailQueryKeys.details(), id] as const,
  counts: () => [...emailQueryKeys.all, "counts"] as const,
}
