/** URL segment after `/ecosystra/` → internal view id (must stay in sync with embedded `App`). */
export const SUB_PATH_TO_VIEW: Record<string, string> = {
  "": "board",
  board: "board",
  dashboard: "dashboard",
  profile: "profile",
  tasks: "tasks",
  members: "members",
  settings: "settings",
  inbox: "inbox",
  notifications: "notifications",
}

export const VIEW_TO_RELATIVE: Record<string, string> = {
  board: "/apps/ecosystra/board",
  dashboard: "/apps/ecosystra/dashboard",
  profile: "/apps/ecosystra/profile",
  tasks: "/apps/ecosystra/tasks",
  members: "/apps/ecosystra/members",
  settings: "/apps/ecosystra/settings",
  inbox: "/apps/ecosystra/inbox",
  notifications: "/apps/ecosystra/notifications",
}

export function viewFromPathname(pathname: string): string {
  const segments = pathname.split("/")
  const ecoIdx = segments.findIndex((segment) => segment === "ecosystra")
  const subView = ecoIdx >= 0 ? segments[ecoIdx + 1] || "" : ""
  return SUB_PATH_TO_VIEW[subView] ?? "board"
}
