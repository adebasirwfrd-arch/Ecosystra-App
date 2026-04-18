"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/** Monday-like group palette (GRANDBOOK color picker reference). */
export const BOARD_GROUP_COLOR_SWATCHES = [
  "#037f4c",
  "#00c875",
  "#9cd326",
  "#cab641",
  "#ffcb00",
  "#401694",
  "#5559df",
  "#579bfc",
  "#66ccff",
  "#df2f4a",
  "#ff158a",
  "#ff5ac4",
  "#ff642e",
  "#fdab3d",
  "#7f5347",
  "#c4c4c4",
  "#676879",
  "#323338",
] as const

export function EcosystraBoardGroupColorButton({
  color,
  onPick,
  ariaLabel,
}: {
  color: string | null
  onPick: (hex: string) => void
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const fill = color ?? "#579bfc"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="size-6 shrink-0 rounded border border-border shadow-sm outline-none ring-offset-2 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring"
          style={{ backgroundColor: fill }}
          aria-label={ariaLabel}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          className="grid w-[200px] grid-cols-5 gap-1.5"
          role="list"
          aria-label={ariaLabel}
        >
          {BOARD_GROUP_COLOR_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              role="listitem"
              className={cn(
                "size-8 rounded-md border border-border shadow-sm outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring",
                hex === fill && "ring-2 ring-[color:var(--eco-brand)]"
              )}
              style={{ backgroundColor: hex }}
              aria-label={hex}
              onClick={() => {
                onPick(hex)
                setOpen(false)
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Inline editable group name (GRANDBOOK EditableHeading — click to edit, Enter / blur save).
 */
/** Fallback when `groupColor` is null — matches default swatch (`EcosystraBoardGroupColorButton`). */
const DEFAULT_GROUP_ACCENT = "#579bfc"

export function EcosystraBoardGroupEditableName({
  name,
  onCommit,
  /** Group theme color — title text matches this (Monday-style). */
  groupColor,
  className,
}: {
  name: string
  onCommit: (next: string) => void
  groupColor?: string | null
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(name)
  }, [name, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = useCallback(() => {
    const next = draft.trim()
    if (next) onCommit(next)
    else setDraft(name)
    setEditing(false)
  }, [draft, name, onCommit])

  const accent = groupColor?.trim() || DEFAULT_GROUP_ACCENT

  if (editing) {
    return (
      <Input
        ref={inputRef}
        className={cn(
          "h-8 min-w-[8rem] max-w-[min(100%,20rem)] border-2 bg-background px-2 py-1 text-sm font-semibold",
          className
        )}
        style={{
          color: accent,
          borderColor: accent,
        }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === "Enter") {
            e.preventDefault()
            save()
          }
          if (e.key === "Escape") {
            e.preventDefault()
            setDraft(name)
            setEditing(false)
          }
        }}
        onBlur={() => save()}
      />
    )
  }

  return (
    <button
      type="button"
      className={cn(
        "min-w-0 max-w-full truncate rounded px-1 py-0.5 text-start text-sm font-semibold hover:bg-muted/50",
        className
      )}
      style={{ color: accent }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        setEditing(true)
      }}
    >
      {name}
    </button>
  )
}
