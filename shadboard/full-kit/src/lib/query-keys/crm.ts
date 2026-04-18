/** TanStack Query key factory — CRM /api/crm (modal.md §2.5). */
export const crmQueryKeys = {
  all: ["crm"] as const,
  deals: {
    all: ["crm", "deals"] as const,
    list: () => [...crmQueryKeys.deals.all, "list"] as const,
  },
  projects: {
    all: ["crm", "projects"] as const,
    list: () => [...crmQueryKeys.projects.all, "list"] as const,
  },
  activities: {
    all: ["crm", "activities"] as const,
    list: () => [...crmQueryKeys.activities.all, "list"] as const,
  },
  feedback: {
    all: ["crm", "feedback"] as const,
    list: () => [...crmQueryKeys.feedback.all, "list"] as const,
  },
  reps: {
    all: ["crm", "reps"] as const,
    list: () => [...crmQueryKeys.reps.all, "list"] as const,
  },
} as const
