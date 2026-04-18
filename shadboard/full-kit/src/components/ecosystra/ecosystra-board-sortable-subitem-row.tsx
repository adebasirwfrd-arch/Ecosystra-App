"use client"

import { useSortable } from "@dnd-kit/sortable"

import type { RowSize } from "@/components/ui/ecosystra-table"
import type { DraggableSyntheticListeners } from "@dnd-kit/core"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { TableRow } from "@/components/ui/ecosystra-table"

/** One sub-item row in the nested table; `id` is the sub-item item id (globally unique). */
export function SortableSubitemTableRow({
  id,
  size,
  highlighted,
  children,
}: {
  id: string
  size: RowSize
  highlighted?: boolean
  children: (listeners: DraggableSyntheticListeners | undefined) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id })

  return (
    <TableRow
      ref={setNodeRef}
      size={size}
      highlighted={highlighted}
      className={cn("group/row", isDragging && "opacity-60")}
      {...attributes}
      role={undefined}
    >
      {children(listeners)}
    </TableRow>
  )
}
