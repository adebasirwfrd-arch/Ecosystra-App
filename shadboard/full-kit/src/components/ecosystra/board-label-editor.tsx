"use client"

import { useEffect, useRef, useState } from "react"
import {
  Check,
  ChevronLeft,
  GripVertical,
  PaintBucket,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { DuePriorityLabel } from "./hooks/use-ecosystra-board-apollo"

const PALETTE = [
  ["#00C875", "#9CD326", "#CAB641", "#FFCB00", "#FFAD00"],
  ["#FDAB3D", "#FF642E", "#E2445C", "#FF5AC4", "#C63FA5"],
  ["#A25DDC", "#784BD1", "#66ADFF", "#3399FF", "#007FFF"],
  ["#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688"],
  ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107"],
  ["#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"],
  ["#579BFC", "#B78AFF", "#FF7AD1", "#FF9AD5", "#FFCCFF"],
  ["#0086C0", "#579BFC", "#66CCFF", "#BB3354", "#C4C4C4"],
]

export function ColorGridPicker({
  selectedColor,
  onSelect,
}: {
  selectedColor: string
  onSelect: (color: string) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {PALETTE.flat().map((c, i) => (
        <button
          key={`sw-${i}-${c}`}
          type="button"
          onClick={() => onSelect(c)}
          className={cn(
            "size-6 rounded-md transition-all hover:scale-110",
            selectedColor === c && "ring-2 ring-ring ring-offset-1"
          )}
          style={{ backgroundColor: c }}
          aria-label={c}
        />
      ))}
    </div>
  )
}

/** List + “Edit Labels” footer — shared by Due priority and other board dropdown columns. */
export function BoardLabelList({
  labels,
  selectedValue,
  onSelect,
  onEditClick,
  editLabelsText = "Edit Labels",
}: {
  labels: DuePriorityLabel[]
  selectedValue: string
  onSelect: (id: string) => void
  onEditClick: () => void
  /** i18n override */
  editLabelsText?: string
}) {
  return (
    <div className="flex flex-col py-1">
      <div className="space-y-0.5 px-1">
        {labels.map((l) => {
          const isSelected =
            selectedValue === l.id || selectedValue === l.label
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelect(l.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent/50",
                isSelected && "bg-accent/30 font-medium"
              )}
            >
              <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                <div
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                <span className="truncate">{l.label || "(Empty)"}</span>
              </div>
              {isSelected ? (
                <Check className="size-4 shrink-0 text-primary" />
              ) : null}
            </button>
          )
        })}
      </div>
      <Separator className="my-1" />
      <button
        type="button"
        onClick={onEditClick}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="size-3.5 shrink-0" />
        <span>{editLabelsText}</span>
      </button>
    </div>
  )
}

export function BoardLabelCustomizer({
  labels,
  onBack,
  onUpdateLabels,
}: {
  labels: DuePriorityLabel[]
  onBack: () => void
  onUpdateLabels: (newLabels: DuePriorityLabel[]) => void
}) {
  const [localLabels, setLocalLabels] = useState(labels)
  const localLabelsRef = useRef(localLabels)
  localLabelsRef.current = localLabels

  useEffect(() => {
    setLocalLabels(labels)
  }, [labels])

  const updateOne = (id: string, patch: Partial<DuePriorityLabel>) => {
    const next = localLabels.map((l) => (l.id === id ? { ...l, ...patch } : l))
    setLocalLabels(next)
    onUpdateLabels(next)
  }

  const addLabel = () => {
    const next: DuePriorityLabel = {
      id: crypto.randomUUID().slice(0, 8),
      label: "New Label",
      color: "#579BFC",
    }
    const newList = [...localLabels, next]
    setLocalLabels(newList)
    onUpdateLabels(newList)
  }

  const removeLabel = (id: string) => {
    const next = localLabels.filter((l) => l.id !== id)
    setLocalLabels(next)
    onUpdateLabels(next)
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b p-2">
        <Button variant="ghost" size="icon" className="size-7" onClick={onBack}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold">Customize Labels</span>
      </div>
      <div className="max-h-[300px] space-y-2 overflow-y-auto p-2">
        {localLabels.map((l) => (
          <div key={l.id} className="group flex items-center gap-2">
            <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground/30" />

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex size-6 shrink-0 items-center justify-center rounded-md border transition-transform hover:scale-110"
                  style={{ backgroundColor: l.color }}
                >
                  <PaintBucket className="size-3 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="right" align="start">
                <ColorGridPicker
                  selectedColor={l.color}
                  onSelect={(c) => updateOne(l.id, { color: c })}
                />
              </PopoverContent>
            </Popover>

            <Input
              value={l.label}
              onChange={(e) => {
                const v = e.target.value
                setLocalLabels((prev) =>
                  prev.map((x) => (x.id === l.id ? { ...x, label: v } : x))
                )
              }}
              onBlur={() => {
                // Never call `onUpdateLabels` inside a `setState` updater — it triggers Apollo/parent
                // updates during render and React throws (see react.dev/link/setstate-in-render).
                const cur = localLabelsRef.current
                const localRow = cur.find((x) => x.id === l.id)
                if (!localRow) return
                const parentRow = labels.find((o) => o.id === l.id)
                const unchanged =
                  parentRow != null &&
                  parentRow.label === localRow.label &&
                  parentRow.color === localRow.color
                if (!unchanged) onUpdateLabels(cur)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
                if (e.key === "Escape") {
                  const parentRow = labels.find((o) => o.id === l.id)
                  if (parentRow) {
                    setLocalLabels((prev) =>
                      prev.map((x) =>
                        x.id === l.id ? { ...x, label: parentRow.label } : x
                      )
                    )
                  }
                  e.currentTarget.blur()
                }
              }}
              className="h-8 border-transparent px-2 py-1 text-sm transition-colors hover:border-muted focus:border-input focus-visible:ring-1"
              placeholder="Label name..."
            />

            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              onClick={() => removeLabel(l.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="mt-1 flex h-9 w-full justify-start gap-2 text-muted-foreground hover:text-primary"
          onClick={addLabel}
        >
          <Plus className="size-4" />
          <span>Add new label</span>
        </Button>
      </div>
    </div>
  )
}
