"use client"

import { useMemo } from "react"

import type { GqlBoardItem } from "./hooks/use-ecosystra-board-apollo"

import { cn } from "@/lib/utils"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function itemPriority(d: Record<string, unknown>): "Low" | "Medium" | "High" {
  const pr = String(d.priority ?? "Medium")
  return pr === "Low" || pr === "Medium" || pr === "High" ? pr : "Medium"
}

export type KanbanLabels = Record<string, string>

export function EcosystraBoardKanbanView({
  flatItems,
  onChangePriority,
  t,
  cardScalePercent = 100,
}: {
  flatItems: GqlBoardItem[]
  onChangePriority: (itemId: string, priority: string) => void
  t: KanbanLabels
  /** 58 — Virtualized-style column: scale cards; scroll clips long columns. */
  cardScalePercent?: number
}) {
  const buckets = useMemo(() => {
    const o: Record<"High" | "Medium" | "Low", GqlBoardItem[]> = {
      High: [],
      Medium: [],
      Low: [],
    }
    for (const it of flatItems) {
      o[itemPriority(it.dynamicData || {})].push(it)
    }
    return o
  }, [flatItems])

  const cols: { id: "High" | "Medium" | "Low"; title: string }[] = [
    { id: "High", title: t.kanbanColHigh },
    { id: "Medium", title: t.kanbanColMedium },
    { id: "Low", title: t.kanbanColLow },
  ]

  return (
    <div
      className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4"
      role="region"
      aria-label={t.kanbanRegionLabel}
    >
      {cols.map((c) => (
        <section
          key={c.id}
          className="max-h-[min(70vh,560px)] overflow-y-auto overflow-x-hidden rounded-lg border border-border/60 bg-card/80 p-2 sm:p-3 [contain:content]"
          aria-labelledby={`eco-kanban-${c.id}`}
        >
          <h2
            id={`eco-kanban-${c.id}`}
            className="mb-3 m-0 text-sm font-semibold text-foreground"
          >
            {c.title}
          </h2>
          <ul className="flex flex-col gap-2">
            {buckets[c.id].map((it) => (
              <li
                key={it.id}
                className={cn(
                  "rounded-md border border-border/60 bg-background p-3 shadow-sm transition-transform",
                  "origin-top"
                )}
                style={{
                  transform: `scale(${cardScalePercent / 100})`,
                }}
              >
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {it.name}
                </h3>
                <Select
                  value={itemPriority(it.dynamicData || {})}
                  onValueChange={(v) => onChangePriority(it.id, v)}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-8"
                    aria-label={`${t.colPriority}: ${it.name}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
          {buckets[c.id].length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.kanbanEmptyColumn}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  )
}
