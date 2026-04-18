"use client"

import { useMemo, useState } from "react"
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

interface DuePriorityPickerProps {
  value: string
  labels: DuePriorityLabel[]
  onSelect: (labelId: string) => void
  onUpdateLabels: (newLabels: DuePriorityLabel[]) => void
}

export function DuePriorityPicker({
  value,
  labels,
  onSelect,
  onUpdateLabels,
}: DuePriorityPickerProps) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const activeLabel = useMemo(() => {
    return (
      labels.find((l) => l.id === value || l.label === value) ??
      labels[labels.length - 1]
    )
  }, [labels, value])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setIsEditing(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            bookmark.bookmarkSelectTrigger,
            "max-w-[220px] truncate shadow-none ring-0 focus-visible:ring-0",
            "flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold"
          )}
          style={{
            backgroundColor: activeLabel?.color || "#C4C4C4",
            color: "#fff",
          }}
        >
          <span className="truncate">{activeLabel?.label || "—"}</span>
          <Sparkles className="size-3 shrink-0 opacity-90" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] border-muted p-0 shadow-lg" align="center">
        {!isEditing ? (
          <BoardLabelList
            labels={labels}
            selectedValue={value}
            onSelect={(id) => {
              onSelect(id)
              setOpen(false)
            }}
            onEditClick={() => setIsEditing(true)}
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
  )
}
