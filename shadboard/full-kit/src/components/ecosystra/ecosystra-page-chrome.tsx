"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, type ReactNode } from "react"
import {
  Bell,
  BriefcaseBusiness,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  User,
  Users,
  ListTodo,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { useEcosystraDictionary } from "./ecosystra-dictionary-context"
import { viewFromPathname, VIEW_TO_RELATIVE } from "./ecosystra-routes"

function labelForView(d: DictionaryType, viewId: string): string {
  const eco = d.ecosystraApp
  const nav = d.navigation
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

const NAV_DEF: { id: string; icon: typeof LayoutGrid }[] = [
  { id: "board", icon: LayoutGrid },
  { id: "dashboard", icon: LayoutDashboard },
  { id: "tasks", icon: ListTodo },
  { id: "inbox", icon: Inbox },
  { id: "notifications", icon: Bell },
  { id: "members", icon: Users },
  { id: "profile", icon: User },
  { id: "settings", icon: Settings },
]

export function EcosystraPageChrome({ children }: { children: ReactNode }) {
  const dictionary = useEcosystraDictionary()
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"
  const currentView = useMemo(() => viewFromPathname(pathname), [pathname])

  const dashboardsHref = ensureLocalizedPathname(
    "/dashboards/analytics",
    locale as LocaleType
  )
  const ecoRootHref = ensureLocalizedPathname(
    "/apps/ecosystra/board",
    locale as LocaleType
  )

  const navAria =
    dictionary.navigation.apps + " — " + dictionary.navigation.ecosystra

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={dashboardsHref}>
                  {dictionary.navigation.dashboards}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={ecoRootHref}
                  className="inline-flex items-center gap-1.5"
                >
                  <BriefcaseBusiness className="size-3.5 opacity-70" aria-hidden />
                  {dictionary.navigation.ecosystra}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {labelForView(dictionary, currentView)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {dictionary.navigation.ecosystra}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dictionary.ecosystraApp.pageDescription}
          </p>
        </div>

        <ScrollArea className="w-full pb-1">
          <nav
            className="flex w-max min-w-full gap-1 rounded-xl border border-border/60 bg-muted/50 p-1 shadow-sm"
            aria-label={navAria}
          >
            {NAV_DEF.map(({ id, icon: Icon }) => {
              const rel = VIEW_TO_RELATIVE[id] ?? "/apps/ecosystra/board"
              const href = ensureLocalizedPathname(rel, locale as LocaleType)
              const active = currentView === id
              return (
                <Link
                  key={id}
                  href={href}
                  scroll={false}
                  prefetch
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 opacity-80" aria-hidden />
                  {labelForView(dictionary, id)}
                </Link>
              )
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <Separator className="bg-border/60" />

      <Card className="flex min-h-[min(100%,calc(100svh-14rem))] min-w-0 flex-1 flex-col overflow-hidden border-border/60 bg-card shadow-sm">
        <CardContent className="flex min-h-0 min-w-0 flex-1 flex-col p-0">
          {children}
        </CardContent>
      </Card>
    </section>
  )
}
