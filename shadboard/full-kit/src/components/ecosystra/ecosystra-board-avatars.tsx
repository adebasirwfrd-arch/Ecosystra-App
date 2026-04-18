"use client"

/**
 * Board cell avatars aligned with Vibe Design System Avatar / AvatarGroup patterns.
 * Reference: Bluprint/monday/GRANDBOOK.md → components-avatar, components-avatargroup
 * (sizes, stacked ring, max + counter, dashed pending).
 */

import { useEffect, useState } from "react"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"
import { Mail, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"

/** Table density: Vibe “small” / dense board (~28px). */
const sizeBoard =
  "h-7 w-7 min-h-[1.75rem] min-w-[1.75rem] text-[10px] [&_[data-slot=avatar-fallback]]:text-[10px]"

/** Separates stacked avatars (Vibe AvatarGroup overlap). */
const stackRing = "ring-2 ring-background"

export type BoardAssigneeFace = {
  id: string
  name: string
  avatarUrl?: string | null
}

/** Single person: photo, initials on muted ground, or empty “person” glyph. */
export function EcosystraBoardAvatar({
  name,
  avatarUrl,
  className,
  title,
  "aria-label": ariaLabel,
}: {
  name: string
  avatarUrl?: string | null
  className?: string
  title?: string
  "aria-label"?: string
}) {
  const label = name.trim()
  const hasIdentity = Boolean(label) || Boolean(avatarUrl)

  if (!hasIdentity) {
    return (
      <div
        className={cn("flex justify-center", className)}
        title={title}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-border/90 bg-background text-muted-foreground",
            sizeBoard
          )}
          aria-label={ariaLabel ?? title ?? "Empty"}
        >
          <User className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn("flex justify-center", className)}
      title={title ?? label}
    >
      <Avatar
        className={cn(
          "shrink-0 rounded-full border border-border/80 bg-muted font-medium text-foreground",
          sizeBoard
        )}
        aria-label={ariaLabel ?? label}
      >
        {avatarUrl ? (
          <AvatarImage
            src={avatarUrl}
            alt=""
            className="rounded-full object-cover"
          />
        ) : null}
        <AvatarFallback className="rounded-full bg-muted/95 font-medium">
          {getInitials(label)}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

const MAX_STACK = 3

/**
 * Stacked group (AvatarGroup): overlap, background ring, optional +N, pending = dashed + Mail.
 */
export function EcosystraBoardAvatarGroup({
  assignees,
  pendingInvites,
  max = MAX_STACK,
  className,
}: {
  assignees: BoardAssigneeFace[]
  pendingInvites: { email: string }[]
  max?: number
  className?: string
}) {
  const shown = assignees.slice(0, max)
  const extra = Math.max(0, assignees.length - shown.length)
  const hasPeople =
    assignees.length > 0 || pendingInvites.length > 0
  const pendingTitle =
    pendingInvites.length > 0
      ? pendingInvites.map((p) => p.email).join(", ")
      : undefined

  if (!hasPeople) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-border/90 bg-background text-muted-foreground",
          sizeBoard
        )}
        aria-hidden
      >
        <User className="size-4 shrink-0" strokeWidth={1.75} />
      </span>
    )
  }

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      aria-label={
        pendingTitle
          ? `${assignees.length} people, ${pendingInvites.length} pending invite(s)`
          : `${assignees.length} people`
      }
    >
      <div className="flex items-center ps-0.5">
        {shown.map((a, i) => (
          <Avatar
            key={a.id}
            className={cn(
              "rounded-full border border-border/80 bg-muted font-medium text-foreground",
              stackRing,
              sizeBoard,
              i > 0 && "-ms-2"
            )}
            title={a.name}
          >
            {a.avatarUrl ? (
              <AvatarImage
                src={a.avatarUrl}
                alt=""
                className="rounded-full object-cover"
              />
            ) : null}
            <AvatarFallback className="rounded-full bg-muted/95 font-medium">
              {getInitials(a.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {extra > 0 ? (
          <span
            className={cn(
              "-ms-2 inline-flex items-center justify-center rounded-full border border-border/80 bg-muted px-1 text-[10px] font-semibold leading-none text-foreground",
              stackRing,
              sizeBoard
            )}
            title={`${extra} more`}
          >
            +{extra}
          </span>
        ) : null}
        {pendingInvites.length > 0 ? (
          <span
            className={cn(
              "-ms-2 inline-flex items-center justify-center rounded-full border border-dashed border-muted-foreground/45 bg-muted/45 text-muted-foreground",
              stackRing,
              sizeBoard
            )}
            title={pendingTitle}
          >
            <Mail className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            {pendingInvites.length > 1 ? (
              <span className="sr-only">
                {pendingInvites.length} pending invitations
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Real-time relative time label (e.g., "5m ago").
 * Refreshes every 60 seconds to maintain "realtime" feel.
 */
export function EcosystraRelativeTime({
  date,
  className,
}: {
  date: string | Date | undefined
  className?: string
}) {
  const [label, setLabel] = useState<string>("—")

  useEffect(() => {
    if (!date) {
      setLabel("—")
      return
    }

    const d = typeof date === "string" ? parseISO(date) : date
    if (!isValid(d)) {
      setLabel("—")
      return
    }

    const update = () => {
      // Vibe/Monday style: "5m ago", "1h ago", etc.
      // formatDistanceToNow provides "about 5 minutes ago", etc.
      // For a professional feel, we keep it standard but concise.
      setLabel(formatDistanceToNow(d, { addSuffix: true }))
    }

    update()
    const timer = setInterval(update, 60000) // refresh every minute
    return () => clearInterval(timer)
  }, [date])

  return <span className={className}>{label}</span>
}

/** Optional wrapper for last-updated row: avatar + trailing text. */
export function EcosystraBoardLastUpdatedCell({
  byName,
  avatarUrl,
  updatedAt,
  className,
}: {
  byName: string
  avatarUrl?: string | null
  updatedAt?: string | null
  className?: string
}) {
  const by = byName.trim() || "User"
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <EcosystraBoardAvatar name={by} avatarUrl={avatarUrl} title={by} />
      <EcosystraRelativeTime
        date={updatedAt ?? undefined}
        className="truncate text-xs text-muted-foreground"
      />
    </div>
  )
}
