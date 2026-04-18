"use client"

import { ListChecks } from "lucide-react"

import {
  columnKindIcon,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type BoardPinColumnRow = {
  id: string
  title: string
  kind: BoardFilterColumnMeta["kind"]
  locked: boolean
}

export function EcosystraBoardPinColumnsContent({
  dict,
  itemRows,
  subitemRows,
  pinnedItemIds,
  pinnedSubitemIds,
  onToggleItemPin,
  onToggleSubitemPin,
  onSaveView,
}: {
  dict: Record<string, string>
  itemRows: BoardPinColumnRow[]
  subitemRows: BoardPinColumnRow[]
  pinnedItemIds: readonly string[]
  pinnedSubitemIds: readonly string[]
  onToggleItemPin: (columnId: string, checked: boolean) => void
  onToggleSubitemPin: (columnId: string, checked: boolean) => void
  onSaveView: () => void
}) {
  const itemSet = new Set(pinnedItemIds)
  const subSet = new Set(pinnedSubitemIds)

  const renderRow = (
    row: BoardPinColumnRow,
    pinSet: Set<string>,
    onToggle: (id: string, checked: boolean) => void
  ) => {
    const chip =
      row.id === "select"
        ? ({ Icon: ListChecks, iconClass: "bg-zinc-600" } as const)
        : columnKindIcon(row.kind)
    const Icon = chip.Icon
    const checked = row.locked || pinSet.has(row.id)
    return (
      <div
        key={row.id}
        className={cn(
          "flex items-center gap-3 rounded-md px-2 py-2",
          checked && "bg-primary/5"
        )}
      >
        <Checkbox
          id={`eco-pin-${row.id}`}
          checked={checked}
          disabled={row.locked}
          onCheckedChange={(v) => onToggle(row.id, v === true)}
          aria-label={row.title}
        />
        <Label
          htmlFor={`eco-pin-${row.id}`}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-normal"
        >
          <span
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded text-white",
              chip.iconClass
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </span>
          <span className="truncate">{row.title}</span>
        </Label>
      </div>
    )
  }

  return (
    <div className="flex max-h-[min(70vh,28rem)] flex-col gap-3 overflow-y-auto p-1">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {dict.pinColumnsItemSection}
        </p>
        <div className="space-y-0.5">
          {itemRows.map((row) => renderRow(row, itemSet, onToggleItemPin))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {dict.pinColumnsSubitemSection}
        </p>
        <div className="space-y-0.5">
          {subitemRows.map((row) => renderRow(row, subSet, onToggleSubitemPin))}
        </div>
      </div>

      <Separator />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full shrink-0"
        onClick={onSaveView}
      >
        {dict.saveAsNewView}
      </Button>
    </div>
  )
}
