"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { DraggableSyntheticListeners } from "@dnd-kit/core"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * One logical board row: `<tbody>` may contain the main `<tr>` plus an optional
 * second `<tr>` (e.g. expanded subitems). Sortable unit is the whole `<tbody>`.
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: disabled ?? false,
    data: groupId ? { groupId } : undefined,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tbody
      ref={setNodeRef}
      style={style}
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
