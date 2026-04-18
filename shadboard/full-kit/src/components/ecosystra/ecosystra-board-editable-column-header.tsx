"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"

/**
 * Monday-style editable column title: read view → click → inline edit → blur / Enter to save (GRANDBOOK EditableHeading / EditableText).
 */
export function EcosystraBoardEditableColumnHeader({
  label,
  fallbackLabel,
  ariaLabel,
  onCommit,
  disabled,
  className,
}: {
  label: string
  /** Dictionary default — commit clears metadata override when equal */
  fallbackLabel: string
  ariaLabel: string
  onCommit: (next: string) => void
  disabled?: boolean
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(label)
  }, [label, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = useCallback(() => {
    const next = draft.trim()
    onCommit(next === "" ? fallbackLabel : next)
    setEditing(false)
  }, [draft, fallbackLabel, onCommit])

  const cancel = useCallback(() => {
    setDraft(label)
    setEditing(false)
  }, [label])

  if (disabled) {
    return (
      <span className={cn("font-medium text-muted-foreground", className)}>
        {label}
      </span>
    )
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        className={cn(
          "h-8 min-w-[6rem] max-w-[min(100%,14rem)] border-primary px-2 py-1 text-xs font-medium",
          className
        )}
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
            cancel()
          }
        }}
        onBlur={() => save()}
      />
    )
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        "max-w-full truncate rounded px-1 py-0.5 text-left font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        className
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        setEditing(true)
      }}
    >
      {label}
    </button>
  )
}
