"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import {
  columnKindIcon,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import type { HidableBoardColumnId } from "./hooks/use-ecosystra-board-apollo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function EcosystraBoardHideSuiteContent({
  dict,
  columns,
  hiddenColumnIds,
  onToggleColumn,
  onSetAllHidableVisible,
  onSaveView,
}: {
  dict: Record<string, string>
  columns: BoardFilterColumnMeta[]
  hiddenColumnIds: readonly HidableBoardColumnId[]
  onToggleColumn: (id: HidableBoardColumnId) => void
  onSetAllHidableVisible: (visible: boolean) => void
  onSaveView: () => void
}) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const hidden = useMemo(
    () => new Set(hiddenColumnIds),
    [hiddenColumnIds]
  )

  const filteredColumns = useMemo(() => {
    if (!q) return columns
    return columns.filter((c) => c.title.toLowerCase().includes(q))
  }, [columns, q])

  const visibleCount = useMemo(
    () => columns.filter((c) => !hidden.has(c.id as HidableBoardColumnId)).length,
    [columns, hidden]
  )
  const allVisible = visibleCount === columns.length && columns.length > 0
  const noneVisible = visibleCount === 0 && columns.length > 0
  const masterChecked: boolean | "indeterminate" = allVisible
    ? true
    : noneVisible
      ? false
      : "indeterminate"

  return (
    <div className="flex w-[min(100vw-32px,22rem)] flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 pb-2">
        <span className="text-sm font-semibold text-foreground">
          {dict.hideSuiteTitle}
        </span>
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

      <div className="relative">
        <Search
          className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.hideSuiteSearchPlaceholder}
          className="h-9 ps-9 text-xs"
          aria-label={dict.hideSuiteSearchPlaceholder}
        />
      </div>

      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <Checkbox
          id="eco-hide-master"
          checked={masterChecked}
          onCheckedChange={(v) => {
            if (v === true) onSetAllHidableVisible(true)
            else onSetAllHidableVisible(false)
          }}
          aria-label={dict.hideSuiteSelectAllAria}
        />
        <Label
          htmlFor="eco-hide-master"
          className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {dict.hideSuiteItemColumns}
        </Label>
      </div>

      <ul
        className="max-h-[min(50vh,20rem)] space-y-1 overflow-y-auto pe-0.5"
        role="listbox"
        aria-label={dict.hideSuiteItemColumns}
      >
        {filteredColumns.map((c) => {
          const id = c.id as HidableBoardColumnId
          const isShown = !hidden.has(id)
          const { Icon, iconClass } = columnKindIcon(c.kind)
          const rowId = `eco-hide-row-${c.id}`
          return (
            <li key={c.id}>
              <div className="flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-muted/50">
                <Checkbox
                  id={rowId}
                  checked={isShown}
                  onCheckedChange={() => onToggleColumn(id)}
                  aria-label={c.title}
                />
                <Label
                  htmlFor={rowId}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 font-normal"
                >
                  <span
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded text-white",
                      iconClass
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="truncate text-sm text-foreground">
                    {c.title}
                  </span>
                </Label>
              </div>
            </li>
          )
        })}
      </ul>
      {filteredColumns.length === 0 ? (
        <p className="text-xs text-muted-foreground">{dict.hideSuiteNoMatch}</p>
      ) : null}
    </div>
  )
}
