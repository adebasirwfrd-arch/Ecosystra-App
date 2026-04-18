"use client"

import { useState, useMemo } from "react"
import { 
  Sparkles, 
  Pencil, 
  Check, 
  ChevronLeft, 
  GripVertical, 
  Plus, 
  Trash2, 
  PaintBucket 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { DuePriorityLabel } from "./hooks/use-ecosystra-board-apollo"
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
    return labels.find((l) => l.id === value || l.label === value) ?? labels[labels.length - 1]
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
          className={cn(
            bookmark.bookmarkSelectTrigger,
            "max-w-[220px] truncate shadow-none border-0 ring-0 focus-visible:ring-0",
            "flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold"
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
      <PopoverContent className="w-[240px] p-0 shadow-lg border-muted" align="center">
        {!isEditing ? (
          <DueLabelList
            labels={labels}
            selectedValue={value}
            onSelect={(id) => {
              onSelect(id)
              setOpen(false)
            }}
            onEditClick={() => setIsEditing(true)}
          />
        ) : (
          <DueLabelCustomizer
            labels={labels}
            onBack={() => setIsEditing(false)}
            onUpdateLabels={onUpdateLabels}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

function DueLabelList({
  labels,
  selectedValue,
  onSelect,
  onEditClick,
}: {
  labels: DuePriorityLabel[]
  selectedValue: string
  onSelect: (id: string) => void
  onEditClick: () => void
}) {
  return (
    <div className="flex flex-col py-1">
      <div className="px-1 space-y-0.5">
        {labels.map((l) => {
          const isSelected = selectedValue === l.id || selectedValue === l.label
          return (
            <button
              key={l.id}
              onClick={() => onSelect(l.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm transition-colors hover:bg-accent/50 group",
                isSelected && "bg-accent/30 font-medium"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div 
                  className="size-3 rounded-full shrink-0" 
                  style={{ backgroundColor: l.color }}
                />
                <span className="truncate">{l.label || "(Empty)"}</span>
              </div>
              {isSelected && <Check className="size-4 text-primary shrink-0" />}
            </button>
          )
        })}
      </div>
      <Separator className="my-1" />
      <button
        onClick={onEditClick}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <Pencil className="size-3.5" />
        <span>Edit Labels</span>
      </button>
    </div>
  )
}

function DueLabelCustomizer({
  labels,
  onBack,
  onUpdateLabels,
}: {
  labels: DuePriorityLabel[]
  onBack: () => void
  onUpdateLabels: (newLabels: DuePriorityLabel[]) => void
}) {
  const [localLabels, setLocalLabels] = useState(labels)

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
      <div className="flex items-center gap-2 p-2 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-7" 
          onClick={onBack}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold">Customize Labels</span>
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
        {localLabels.map((l) => (
          <div key={l.id} className="flex items-center gap-2 group">
            <GripVertical className="size-4 text-muted-foreground/30 cursor-grab shrink-0" />
            
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="size-6 rounded-md border flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                  style={{ backgroundColor: l.color }}
                >
                  <PaintBucket className="size-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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
              onChange={(e) => updateOne(l.id, { label: e.target.value })}
              className="h-8 py-1 px-2 text-sm focus-visible:ring-1 border-transparent hover:border-muted focus:border-input transition-colors"
              placeholder="Label name..."
            />

            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => removeLabel(l.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 h-9 text-muted-foreground hover:text-primary mt-1"
          onClick={addLabel}
        >
          <Plus className="size-4" />
          <span>Add new label</span>
        </Button>
      </div>
    </div>
  )
}

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

function ColorGridPicker({ 
  selectedColor, 
  onSelect 
}: { 
  selectedColor: string
  onSelect: (color: string) => void 
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {PALETTE.flat().map((c) => (
        <button
          key={c}
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
