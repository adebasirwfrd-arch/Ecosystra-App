import type { NavigationType } from "@/types"

/** Sidebar + command palette: only primary app areas (no template dashboards / design system). */
export const navigationsData: NavigationType[] = [
  {
    title: "Apps",
    items: [
      {
        title: "Ecosystra",
        href: "/apps/ecosystra",
        iconName: "BriefcaseBusiness",
      },
      {
        title: "Email",
        href: "/apps/email",
        iconName: "AtSign",
      },
      {
        title: "Chat",
        href: "/apps/chat",
        iconName: "MessageCircle",
      },
      {
        title: "Calendar",
        href: "/apps/calendar",
        iconName: "Calendar",
      },
    ],
  },
]
