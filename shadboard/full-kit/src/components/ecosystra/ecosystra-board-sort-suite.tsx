"use client"

import { useCallback, useMemo } from "react"
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  HelpCircle,
  Plus,
  X,
} from "lucide-react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  columnKindIcon,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import type { BoardTableSortRule } from "./hooks/use-ecosystra-board-apollo"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const EMPTY_COLUMN_VALUE = "__eco_sort_none__"

/** Prefix sort-rule drag ids so they never collide with board row ids in a parent `DndContext`. */
const DND_SORT_PREFIX = "eco-sort-suite:"

function dndSortId(rawId: string): string {
  return `${DND_SORT_PREFIX}${rawId}`
}

function parseDndSortId(composite: string | number): string | null {
  const s = String(composite)
  if (!s.startsWith(DND_SORT_PREFIX)) return null
  return s.slice(DND_SORT_PREFIX.length)
}

function newSortRuleId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID()
  return `sr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function SortRuleRow({
  rule,
  columns,
  dict,
  onPatch,
  onRemove,
}: {
  rule: BoardTableSortRule
  columns: BoardFilterColumnMeta[]
  dict: Record<string, string>
  onPatch: (id: string, patch: Partial<BoardTableSortRule>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndSortId(rule.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const colById = useMemo(
    () => new Map(columns.map((c) => [c.id, c])),
    [columns]
  )
  const columnSelectValue =
    rule.columnId && colById.has(rule.columnId)
      ? rule.columnId
      : EMPTY_COLUMN_VALUE
  const selectedCol =
    columnSelectValue === EMPTY_COLUMN_VALUE
      ? undefined
      : colById.get(columnSelectValue)
  const colChip = selectedCol ? columnKindIcon(selectedCol.kind) : null
  const ColChipIcon = colChip?.Icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-background/90 p-2",
        isDragging && "z-10 opacity-80 shadow-md"
      )}
    >
      <button
        type="button"
        className="inline-flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded border border-transparent text-muted-foreground hover:bg-muted/60 active:cursor-grabbing"
        aria-label={dict.sortSuiteDragAria}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden />
      </button>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
        <Select
          value={columnSelectValue}
          onValueChange={(v) =>
            onPatch(rule.id, {
              columnId: v === EMPTY_COLUMN_VALUE ? null : v,
            })
          }
        >
          <SelectTrigger className="h-9 min-w-[10rem] flex-1 text-start text-xs sm:max-w-[14rem]">
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
              <SelectValue placeholder={dict.sortSuiteChooseColumn} />
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-[min(60vh,20rem)]">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {dict.sortSuiteItemColumns}
            </div>
            <SelectItem value={EMPTY_COLUMN_VALUE} className="text-xs">
              {dict.sortSuiteChooseColumn}
            </SelectItem>
            {columns.map((c) => {
              const { Icon, iconClass } = columnKindIcon(c.kind)
              return (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex size-6 shrink-0 items-center justify-center rounded text-white",
                        iconClass
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="truncate">{c.title}</span>
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Select
          value={rule.direction}
          onValueChange={(v) =>
            onPatch(rule.id, {
              direction: v === "desc" ? "desc" : "asc",
            })
          }
        >
          <SelectTrigger className="h-9 w-[9.5rem] shrink-0 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc" className="text-xs">
              <span className="flex items-center gap-2">
                <ArrowUp className="size-3.5 text-muted-foreground" aria-hidden />
                {dict.sortSuiteAscending}
              </span>
            </SelectItem>
            <SelectItem value="desc" className="text-xs">
              <span className="flex items-center gap-2">
                <ArrowDown
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
                {dict.sortSuiteDescending}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={dict.sortSuiteRemoveRuleAria}
        onClick={() => onRemove(rule.id)}
      >
        <X className="size-4" aria-hidden />
      </Button>
    </div>
  )
}

export function EcosystraBoardSortSuiteContent({
  dict,
  columns,
  sortRules,
  onSortRulesChange,
  onSaveView,
}: {
  dict: Record<string, string>
  columns: BoardFilterColumnMeta[]
  sortRules: BoardTableSortRule[]
  onSortRulesChange: (next: BoardTableSortRule[]) => void
  onSaveView: () => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const ids = useMemo(
    () => sortRules.map((r) => dndSortId(r.id)),
    [sortRules]
  )

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e
      if (!over || active.id === over.id) return
      const rawA = parseDndSortId(active.id)
      const rawO = parseDndSortId(over.id)
      if (!rawA || !rawO) return
      const oldI = sortRules.findIndex((r) => r.id === rawA)
      const newI = sortRules.findIndex((r) => r.id === rawO)
      if (oldI < 0 || newI < 0) return
      onSortRulesChange(arrayMove(sortRules, oldI, newI))
    },
    [sortRules, onSortRulesChange]
  )

  const patchRule = useCallback(
    (id: string, patch: Partial<BoardTableSortRule>) => {
      onSortRulesChange(
        sortRules.map((r) => (r.id === id ? { ...r, ...patch } : r))
      )
    },
    [sortRules, onSortRulesChange]
  )

  const removeRule = useCallback(
    (id: string) => {
      onSortRulesChange(sortRules.filter((r) => r.id !== id))
    },
    [sortRules, onSortRulesChange]
  )

  const addRule = useCallback(() => {
    onSortRulesChange([
      ...sortRules,
      { id: newSortRuleId(), columnId: null, direction: "asc" },
    ])
  }, [sortRules, onSortRulesChange])

  return (
    <div className="w-[min(100vw-32px,26rem)] space-y-3 p-1">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 pb-2">
        <div className="flex min-w-0 items-center gap-1">
          <span className="text-sm font-semibold text-foreground">
            {dict.sortSuiteTitle}
          </span>
          <button
            type="button"
            className="inline-flex text-muted-foreground hover:text-foreground"
            aria-label={dict.sortSuiteHelpAria}
          >
            <HelpCircle className="size-3.5" aria-hidden />
          </button>
        </div>
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

      {sortRules.length === 0 ? (
        <p className="text-xs text-muted-foreground">{dict.sortSuiteEmpty}</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="max-h-[min(50vh,22rem)] space-y-2 overflow-y-auto pe-0.5">
              <Label className="sr-only">{dict.sortSuiteTitle}</Label>
              {sortRules.map((rule) => (
                <SortRuleRow
                  key={rule.id}
                  rule={rule}
                  columns={columns}
                  dict={dict}
                  onPatch={patchRule}
                  onRemove={removeRule}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto px-0 py-1 text-xs"
        onClick={addRule}
      >
        <Plus className="me-1 size-3.5" aria-hidden />
        {dict.sortSuiteNewSort}
      </Button>
    </div>
  )
}
