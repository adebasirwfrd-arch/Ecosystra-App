"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Sparkles } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DuePriorityLabel } from "./hooks/use-ecosystra-board-apollo"
import { BoardLabelCustomizer, BoardLabelList } from "./board-label-editor"
import bookmark from "./ecosystra-board-bookmark.module.css"

export type BoardColumnLabelVariant = "status" | "priority" | "notesCategory"

function resolveActiveLabel(
  value: string,
  labels: DuePriorityLabel[]
): DuePriorityLabel {
  const byId = labels.find((l) => l.id === value)
  if (byId) return byId
  const byLabel = labels.find((l) => l.label === value)
  if (byLabel) return byLabel
  return labels[0] ?? { id: "_", label: "—", color: "#C4C4C4" }
}

export function BoardColumnLabelPicker({
  variant,
  labels,
  value,
  onSelect,
  onUpdateLabels,
  ariaLabel,
  editLabelsText = "Edit Labels",
  trailing,
}: {
  variant: BoardColumnLabelVariant
  labels: DuePriorityLabel[]
  value: string
  /** Persisted cell value — matched by `label` or `id`. */
  onSelect: (storedLabel: string) => void
  onUpdateLabels: (next: DuePriorityLabel[]) => void
  ariaLabel: string
  editLabelsText?: string
  trailing?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const active = useMemo(
    () => resolveActiveLabel(value, labels),
    [value, labels]
  )

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setIsEditing(false)
  }

  const commitPick = (id: string) => {
    const hit = labels.find((l) => l.id === id)
    onSelect(hit?.label ?? id)
    setOpen(false)
  }

  const triggerClass =
    variant === "notesCategory"
      ? cn(
          bookmark.bookmarkSelectTrigger,
          "max-w-[200px] truncate border-0 font-semibold shadow-none ring-0 hover:opacity-95 focus-visible:ring-0",
          "flex h-8 items-center justify-center gap-1.5 px-3 py-1 text-[13px]"
        )
      : cn(
          "flex h-8 min-w-[120px] max-w-[200px] flex-1 items-center justify-center gap-1.5 truncate rounded-full border-0 px-3 text-[13px] font-semibold shadow-none ring-0 hover:opacity-95 focus-visible:ring-0",
          variant === "priority" && "w-[120px]"
        )

  const showSparkles = variant === "notesCategory"

  return (
    <div className="flex min-w-0 max-w-full items-center gap-1">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={triggerClass}
            style={{
              backgroundColor: active.color,
              color: "#ffffff",
            }}
            aria-label={ariaLabel}
          >
            <span className="truncate">{active.label || "—"}</span>
            {showSparkles ? (
              <Sparkles className="size-3 shrink-0 opacity-90" aria-hidden />
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[240px] border-muted p-0 shadow-lg"
          align="center"
        >
          {!isEditing ? (
            <BoardLabelList
              labels={labels}
              selectedValue={value}
              onSelect={commitPick}
              onEditClick={() => setIsEditing(true)}
              editLabelsText={editLabelsText}
            />
          ) : (
            <BoardLabelCustomizer
              labels={labels}
              onBack={() => setIsEditing(false)}
              onUpdateLabels={onUpdateLabels}
            />
          )}
        </PopoverContent>
      </Popover>
      {trailing}
    </div>
  )
}
