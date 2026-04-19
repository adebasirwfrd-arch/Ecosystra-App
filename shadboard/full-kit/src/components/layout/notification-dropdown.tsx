"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Bell, UserPlus } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"
import {
  ECOSYSTRA_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
} from "@/lib/ecosystra/board-gql"
import { boardHrefFromNotificationLink } from "@/lib/ecosystra/notification-board-link"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, formatDistance, formatUnreadCount } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

type GqlNotificationRow = {
  id: string
  title: string
  message: string
  isRead: boolean
  type?: string | null
  link?: string | null
  createdAt: string
}

export function NotificationDropdown({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const params = useParams()
  const router = useRouter()
  const locale = params.lang as LocaleType
  const nav = dictionary.navigation.notifications as Record<string, string>

  const client = useMemo(() => createEcosystraGraphqlClient(), [])

  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<GqlNotificationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [trayCleared, setTrayCleared] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const { data } = await client.query<{
        notifications: GqlNotificationRow[]
      }>({
        query: ECOSYSTRA_NOTIFICATIONS,
        fetchPolicy: "network-only",
      })
      setRows(data?.notifications ?? [])
    } catch {
      setRows([])
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [client])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setTrayCleared(false)
      void load()
    }
  }

  const effectiveRows = trayCleared ? [] : rows
  const unreadCount = trayCleared ? 0 : rows.filter((n) => !n.isRead).length
  const badge = formatUnreadCount(unreadCount)

  const seeAllHref = ensureLocalizedPathname(
    "/apps/ecosystra/notifications",
    locale
  )

  const markRead = async (id: string) => {
    try {
      await client.mutate({
        mutation: MARK_NOTIFICATION_READ,
        variables: { id },
      })
      setRows((prev) =>
        prev.map((x) => (x.id === id ? { ...x, isRead: true } : x))
      )
    } catch {
      /* optional read state */
    }
  }

  const openTaskFromNotification = async (n: GqlNotificationRow) => {
    const href = boardHrefFromNotificationLink(n.link, locale)
    if (!href) return
    await markRead(n.id)
    setOpen(false)
    router.push(href)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">{nav.notifications}</span>
          {!!badge && (
            <Badge
              className="absolute -top-1 -end-1 h-4 max-w-8 flex justify-center"
              aria-live="polite"
              aria-atomic="true"
              role="status"
              aria-label={`${badge} unread`}
            >
              {badge}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Card className="border-0">
          <div className="flex items-center justify-between border-b border-border p-3">
            <h3 className="text-sm font-semibold">{nav.notifications}</h3>
            <Button
              type="button"
              variant="link"
              className="text-primary h-auto p-0"
              disabled={rows.length === 0}
              onClick={() => setTrayCleared(true)}
            >
              {nav.dismissAll}
            </Button>
          </div>
          <ul className="max-h-[min(70vh,420px)] overflow-y-auto">
            {loading && effectiveRows.length === 0 && !trayCleared ? (
              <li className="space-y-2 px-6 py-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </li>
            ) : loadError ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                {nav.trayLoadError ?? "Could not load notifications."}
              </li>
            ) : effectiveRows.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                {trayCleared
                  ? (nav.trayDismissed ?? "Notifications cleared.")
                  : (nav.trayEmpty ?? "No notifications yet.")}
              </li>
            ) : (
              effectiveRows.map((n) => {
                const href = boardHrefFromNotificationLink(n.link, locale)
                const Icon = n.type === "task_assigned" ? UserPlus : Bell
                const primary = n.title?.trim() || n.message
                const secondary =
                  n.title?.trim() && n.message?.trim() && n.title !== n.message
                    ? n.message
                    : null
                return (
                  <li key={n.id}>
                    {href ? (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-6 py-4 text-start hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        onClick={() => void openTaskFromNotification(n)}
                      >
                        <Badge className="h-10 w-10 shrink-0 p-0">
                          <Icon className="m-auto size-5" aria-hidden />
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {primary}
                          </p>
                          {secondary ? (
                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                              {secondary}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDistance(new Date(n.createdAt))}
                          </p>
                        </div>
                        {!n.isRead ? (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        ) : null}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-6 py-4 opacity-80">
                        <Badge className="h-10 w-10 shrink-0 p-0">
                          <Icon className="m-auto size-5" aria-hidden />
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {primary}
                          </p>
                          {secondary ? (
                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                              {secondary}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDistance(new Date(n.createdAt))}
                          </p>
                        </div>
                        {!n.isRead ? (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        ) : null}
                      </div>
                    )}
                  </li>
                )
              })
            )}
          </ul>
          <CardFooter className="justify-center border-t border-border p-0">
            <Link
              href={seeAllHref}
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-primary text-center"
              )}
              onClick={() => setOpen(false)}
            >
              {nav.seeAllNotifications}
            </Link>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
