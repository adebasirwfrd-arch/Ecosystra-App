import {
  Bell,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Settings,
  User,
  Users,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LucideIcon } from "lucide-react"

export type EcosystraNavViewId = (typeof ECOSYSTRA_NAV_VIEWS)[number]["id"]

export const ECOSYSTRA_NAV_VIEWS: { id: string; icon: LucideIcon }[] = [
  { id: "board", icon: LayoutGrid },
  { id: "dashboard", icon: LayoutDashboard },
  { id: "tasks", icon: ListTodo },
  { id: "inbox", icon: Inbox },
  { id: "notifications", icon: Bell },
  { id: "members", icon: Users },
  { id: "profile", icon: User },
  { id: "settings", icon: Settings },
]

export function ecosystraNavLabel(
  dictionary: DictionaryType,
  viewId: string
): string {
  const eco = dictionary.ecosystraApp
  const nav = dictionary.navigation
  switch (viewId) {
    case "board":
      return eco.board
    case "dashboard":
      return nav.dashboard
    case "profile":
      return nav.profile
    case "tasks":
      return eco.tasks
    case "members":
      return eco.members
    case "settings":
      return nav.settings
    case "inbox":
      return eco.inbox
    case "notifications":
      return nav.notifications.notifications
    default:
      return eco.board
  }
}
