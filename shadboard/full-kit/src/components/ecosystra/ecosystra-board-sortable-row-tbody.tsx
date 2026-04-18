"use client"

import { useSortable } from "@dnd-kit/sortable"

import type { DraggableSyntheticListeners } from "@dnd-kit/core"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * One logical board row: `<tbody>` may contain the main `<tr>` plus an optional
 * second `<tr>` (e.g. expanded subitems). Sortable unit is the whole `<tbody>`.
 *
 * **Do not** put `transform` / `transition` on this `<tbody>`. `@dnd-kit` sortable
 * normally applies CSS `transform` here for reorder animation, but **any**
 * `transform` on an ancestor of `<td>` / `<th>` breaks `position: sticky` for
 * pinned columns during horizontal scroll — while `<thead>` stays outside this
 * `<tbody>`, only header cells looked sticky. Row order still updates on drag end.
 */
export function SortableBoardRowTbody({
  id,
  disabled,
  groupId,
  children,
}: {
  id: string
  disabled?: boolean
  /** Passed to `@dnd-kit` for multi-list row drag (board-level `DndContext`). */
  groupId?: string
  children: (args: { listeners: DraggableSyntheticListeners }) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
    disabled: disabled ?? false,
    data: groupId ? { groupId } : undefined,
  })

  return (
    <tbody
      ref={setNodeRef}
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child>td]:border-b-0",
        isDragging && "opacity-60"
      )}
      {...attributes}
      // useSortable sets role="button" on the sortable node; <tbody> must stay table semantics.
      role={undefined}
    >
      {children({ listeners })}
    </tbody>
  )
}
