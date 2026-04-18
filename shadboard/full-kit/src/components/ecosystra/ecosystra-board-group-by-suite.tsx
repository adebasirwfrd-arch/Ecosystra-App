"use client"

import { useCallback, useMemo } from "react"
import { HelpCircle, MessageCircle } from "lucide-react"

import {
  columnKindIcon,
  GROUP_FACET_COLUMN_ID,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import {
  coerceGroupByOrder,
  defaultGroupByOrderForColumn,
  groupByOrderOptionsForColumn,
  type BoardGroupBySuite,
} from "./ecosystra-board-group-by-engine"
import type { TableCustomColumnDef } from "./hooks/use-ecosystra-board-apollo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const NO_COLUMN = "__eco_group_by_none__"

export function EcosystraBoardGroupBySuiteContent({
  dict,
  columns,
  suite,
  tableCustomColumns,
  onSuiteChange,
  onSaveView,
}: {
  dict: Record<string, string>
  columns: BoardFilterColumnMeta[]
  suite: BoardGroupBySuite | null
  tableCustomColumns: Record<string, TableCustomColumnDef>
  onSuiteChange: (next: BoardGroupBySuite | null) => void
  onSaveView: () => void
}) {
  const groupColumns = useMemo(
    () => columns.filter((c) => c.id !== GROUP_FACET_COLUMN_ID),
    [columns]
  )

  const selectedCol = useMemo(
    () => groupColumns.find((c) => c.id === suite?.columnId),
    [groupColumns, suite?.columnId]
  )

  const orderOptions = useMemo(
    () =>
      selectedCol
        ? groupByOrderOptionsForColumn(selectedCol, tableCustomColumns, dict)
        : [],
    [selectedCol, tableCustomColumns, dict]
  )

  const onColumnChange = useCallback(
    (value: string) => {
      if (value === NO_COLUMN) {
        onSuiteChange(null)
        return
      }
      const col = groupColumns.find((c) => c.id === value)
      if (!col) return
      const prevOrder = suite?.order
      const order =
        prevOrder != null
          ? coerceGroupByOrder(col, tableCustomColumns, prevOrder)
          : defaultGroupByOrderForColumn(col, tableCustomColumns)
      onSuiteChange({
        columnId: col.id,
        order,
        showEmpty: suite?.showEmpty ?? false,
      })
    },
    [groupColumns, onSuiteChange, suite?.order, suite?.showEmpty, tableCustomColumns]
  )

  const onOrderChange = useCallback(
    (value: string) => {
      if (!suite || !selectedCol) return
      const order = coerceGroupByOrder(
        selectedCol,
        tableCustomColumns,
        value
      )
      onSuiteChange({
        columnId: selectedCol.id,
        order,
        showEmpty: suite.showEmpty,
      })
    },
    [onSuiteChange, selectedCol, suite, tableCustomColumns]
  )

  const onShowEmptyChange = useCallback(
    (checked: boolean) => {
      if (!suite || !selectedCol) return
      onSuiteChange({ ...suite, showEmpty: checked })
    },
    [onSuiteChange, selectedCol, suite]
  )

  const colChip = selectedCol ? columnKindIcon(selectedCol.kind) : null
  const ColChipIcon = colChip?.Icon

  const selectedOrder =
    suite && selectedCol
      ? coerceGroupByOrder(selectedCol, tableCustomColumns, suite.order)
      : null

  return (
    <div className="w-[min(100vw-32px,26rem)] space-y-3 p-1">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 pb-2">
        <div className="flex min-w-0 items-center gap-1">
          <span className="text-sm font-semibold text-foreground">
            {dict.groupBySuiteTitle}
          </span>
          <button
            type="button"
            className="inline-flex text-muted-foreground hover:text-foreground"
            aria-label={dict.groupBySuiteHelpAria}
          >
            <HelpCircle className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-8 px-1 text-xs"
            onClick={() => onSuiteChange(null)}
          >
            {dict.groupBySuiteClear}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 text-xs"
            onClick={onSaveView}
          >
            {dict.saveAsNewView}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Select
          value={suite?.columnId ?? NO_COLUMN}
          onValueChange={onColumnChange}
        >
          <SelectTrigger className="h-9 w-full text-start text-sm">
            <span className="flex min-w-0 items-center gap-2">
              {colChip && ColChipIcon ? (
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded text-white",
                    colChip.iconClass
                  )}
                >
                  <ColChipIcon className="size-3.5" aria-hidden />
                </span>
              ) : null}
              <SelectValue placeholder={dict.groupBySuitePickColumn} />
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-[min(50vh,18rem)]">
            <SelectGroup>
              <SelectLabel className="text-xs font-normal text-muted-foreground">
                {dict.groupBySuiteColumnOptions}
              </SelectLabel>
              <SelectItem value={NO_COLUMN} className="text-muted-foreground">
                {dict.groupByNone}
              </SelectItem>
              {groupColumns.map((c) => {
                const chip = columnKindIcon(c.kind)
                const Icon = chip.Icon
                return (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex size-6 shrink-0 items-center justify-center rounded text-white",
                          chip.iconClass
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <span className="truncate">{c.title}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedOrder ?? undefined}
          onValueChange={onOrderChange}
          disabled={!suite || !selectedCol}
        >
          <SelectTrigger className="h-9 w-full text-start text-sm">
            <SelectValue placeholder={dict.groupBySuitePickOrder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xs font-normal text-muted-foreground">
                {dict.groupBySuiteSortOptions}
              </SelectLabel>
              {orderOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="eco-gb-show-empty"
          checked={!!suite?.showEmpty}
          disabled={!suite}
          onCheckedChange={(v) => onShowEmptyChange(v === true)}
        />
        <Label htmlFor="eco-gb-show-empty" className="text-sm font-normal">
          {dict.groupByShowEmpty}
        </Label>
      </div>

      <Separator />

      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="size-3.5" aria-hidden />
        {dict.groupBySuiteFeedback}
      </button>
    </div>
  )
}
