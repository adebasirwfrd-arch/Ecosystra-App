"use client"

import { useCallback, useState, type ReactNode } from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  formatTimelineRange,
  parseTimelineRange,
} from "@/lib/ecosystra/board-timeline-format"

const STORAGE_PREFIX = "ecosystra:draft:timeline:"

function readDraftFromStorage(key: string): DateRange | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return undefined
    const j = JSON.parse(raw) as { from?: string; to?: string | null }
    if (!j?.from) return undefined
    const from = new Date(j.from)
    const to = j.to ? new Date(j.to) : undefined
    if (Number.isNaN(from.getTime())) return undefined
    if (to && Number.isNaN(to.getTime())) return { from, to: undefined }
    return { from, to }
  } catch {
    return undefined
  }
}

function writeDraftToStorage(key: string, range: DateRange | undefined) {
  if (typeof window === "undefined") return
  try {
    if (!range?.from) {
      sessionStorage.removeItem(key)
      return
    }
    sessionStorage.setItem(
      key,
      JSON.stringify({
        from: range.from.toISOString(),
        to: range.to ? range.to.toISOString() : null,
      })
    )
  } catch {
    /* quota / private mode */
  }
}

function removeDraftFromStorage(key: string) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

/**
 * Timeline range picker: calendar updates local state only (instant UI).
 * Server persists when the user clicks **Apply**; **Cancel** discards.
 * Optional `sessionStorage` draft survives refresh / flaky network until Apply or Cancel.
 */
export function BoardTimelineRangeCommitPopover({
  /** Unique key fragment, e.g. `${itemId}:timeline` or `${itemId}:${customFieldKey}` */
  draftStorageId,
  timelineLabel,
  onCommit,
  applyLabel,
  cancelLabel,
  children,
}: {
  draftStorageId: string
  timelineLabel: string
  onCommit: (formattedRange: string) => void
  applyLabel: string
  cancelLabel: string
  children: ReactNode
}) {
  const storageKey = `${STORAGE_PREFIX}${draftStorageId}`
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(() =>
    parseTimelineRange(timelineLabel)
  )

  const resetDraftForOpen = useCallback(() => {
    const fromServer = parseTimelineRange(timelineLabel)
    const fromLocal = readDraftFromStorage(storageKey)
    setDraft(fromLocal ?? fromServer)
  }, [timelineLabel, storageKey])

  const handleSelect = (next: DateRange | undefined) => {
    setDraft(next)
    writeDraftToStorage(storageKey, next)
  }

  const handleApply = () => {
    if (!draft?.from) return
    removeDraftFromStorage(storageKey)
    onCommit(formatTimelineRange(draft))
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      removeDraftFromStorage(storageKey)
      setDraft(parseTimelineRange(timelineLabel))
    } else {
      resetDraftForOpen()
    }
    setOpen(next)
  }

  const canApply = Boolean(draft?.from)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col p-0" align="start">
        <Calendar mode="range" selected={draft} onSelect={handleSelect} />
        <div className="flex justify-end gap-2 border-t p-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canApply}
            onClick={handleApply}
          >
            {applyLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
