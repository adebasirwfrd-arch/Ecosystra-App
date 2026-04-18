"use client"

/**
 * In-product Vibe / GRANDBOOK building blocks for Ecosystra (no lab route).
 * Each export maps to numbered VIBE_68 tasks — see Bluprint/monday/VIBE_68_COMPONENT_TASKLIST.md.
 */
import { useEffect, useState } from "react"
import { Info } from "lucide-react"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const TIPSEEN_STORAGE_KEY = "eco-grandbook-tipseen-toolbar-v1"

/** 44 — Tipseen: first-run dismissible product hint (GRANDBOOK: onboarding callout). */
export function EcosystraGrandbookTipseen({
  title,
  body,
  dismissLabel,
}: {
  title: string
  body: string
  dismissLabel: string
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        !localStorage.getItem(TIPSEEN_STORAGE_KEY)
      ) {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [])
  if (!open) return null
  return (
    <div
      className="rounded-lg border border-primary/30 bg-primary/[0.06] p-[var(--vibe-space-12)] text-sm shadow-sm"
      role="status"
    >
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{body}</p>
      <Button
        type="button"
        size="sm"
        className="mt-3"
        onClick={() => {
          try {
            localStorage.setItem(TIPSEEN_STORAGE_KEY, "1")
          } catch {
            /* ignore quota / private mode */
          }
          setOpen(false)
        }}
      >
        {dismissLabel}
      </Button>
    </div>
  )
}

/** 50 — Empty state (GRANDBOOK: primary + supporting copy + optional action). */
export function EcosystraGrandbookEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/80 bg-muted/20 p-[var(--vibe-space-24)] text-center"
      role="status"
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

/** 51 — Info (GRANDBOOK: inline guidance; Radix Alert semantics). */
export function EcosystraGrandbookInfo({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <Alert className="border-border/80 bg-muted/30">
      <Info className="size-4" aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{body}</AlertDescription>
    </Alert>
  )
}

/** 61 — Steps (GRANDBOOK: ordered steps for flows such as create / settings). */
export function EcosystraGrandbookSteps({
  labels,
  current,
  ariaLabel,
}: {
  labels: string[]
  current: number
  ariaLabel: string
}) {
  return (
    <ol
      className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground"
      aria-label={ariaLabel}
    >
      {labels.map((label, i) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-2 rounded-full border px-2 py-1",
            i === current
              ? "border-foreground text-foreground"
              : "border-transparent"
          )}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px]">
            {i + 1}
          </span>
          {label}
        </li>
      ))}
    </ol>
  )
}

/** 62 — Multi-step indicator (GRANDBOOK: progress within a wizard). */
export function EcosystraGrandbookMultiStepIndicator({
  current,
  total,
  ariaLabel,
}: {
  current: number
  total: number
  ariaLabel: string
}) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div
      className="flex items-center gap-2 text-xs text-muted-foreground"
      role="status"
      aria-label={ariaLabel}
    >
      <span className="font-medium tabular-nums text-foreground">
        {current}
      </span>
      <span>/</span>
      <span className="tabular-nums">{total}</span>
      <div className="ms-2 h-1 max-w-[120px] flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/** 53–54 — Legacy list container (GRANDBOOK list + list item spacing). */
export function EcosystraGrandbookLegacyList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ul
      role="list"
      data-eco-grandbook-list="legacy"
      className={cn("space-y-1", className)}
    >
      {children}
    </ul>
  )
}

/** 55–56 — New list container (GRANDBOOK “new list” density for palettes / pickers). */
export function EcosystraGrandbookNewList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ul
      role="list"
      data-eco-grandbook-list="new"
      className={cn("divide-y divide-border/60", className)}
    >
      {children}
    </ul>
  )
}

/** 57 — Virtualized list window: bounded scroll + content-visibility on rows (long API results). */
export function EcosystraGrandbookVirtualizedListWindow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ScrollArea
      className={cn(
        "h-40 w-full rounded-md border border-border/60",
        className
      )}
    >
      <div className="p-1">{children}</div>
    </ScrollArea>
  )
}

/** 67 — Chips: compact removable-style tokens (Vibe chips → Badge pill). */
export function EcosystraGrandbookChip({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full px-2 py-0.5 font-normal", className)}
    >
      {children}
    </Badge>
  )
}

/** 68 — Icon wrapper: consistent hit target + optional SR label for decorative icons. */
export function EcosystraGrandbookIcon({
  label,
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className
      )}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      {children}
    </span>
  )
}

/** 38 — Dialog content container (GRANDBOOK: grouped body inside modal). */
export function EcosystraGrandbookDialogBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      data-eco-dialog-content-container
      className={cn(
        "rounded-lg border border-border/60 bg-card/40 p-[var(--vibe-space-12)]",
        className
      )}
    >
      {children}
    </div>
  )
}
