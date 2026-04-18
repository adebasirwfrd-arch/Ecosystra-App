"use client"

import { useCallback, useRef } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Vertical drag handle on the trailing edge of a column header — drag **horizontally**
 * to change column width (Monday / Vibe “Resize column”).
 */
export function TableColumnResizeHandle({
  minPx,
  maxPx,
  startWidthPx,
  onResize,
  onResizeCommit,
  ariaLabel,
  className,
}: {
  minPx: number
  maxPx: number
  startWidthPx: number
  onResize: (nextWidthPx: number) => void
  /** Called once on pointer up with the final width (persist / server). */
  onResizeCommit?: (finalWidthPx: number) => void
  ariaLabel: string
  className?: string
}) {
  const dragRef = useRef<{ startX: number; startW: number } | null>(null)
  const lastWRef = useRef(startWidthPx)

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      dragRef.current = { startX: e.clientX, startW: startWidthPx }
      lastWRef.current = startWidthPx
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [startWidthPx]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (!d) return
      const delta = e.clientX - d.startX
      const next = Math.min(maxPx, Math.max(minPx, d.startW + delta))
      lastWRef.current = next
      onResize(next)
    },
    [maxPx, minPx, onResize]
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      dragRef.current = null
      onResizeCommit?.(lastWRef.current)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [onResizeCommit]
  )

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            "absolute end-0 top-0 z-[60] flex h-full w-3 -translate-x-1/2 cursor-col-resize touch-none items-center justify-center px-1 select-none",
            "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent after:transition-colors hover:after:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {ariaLabel}
      </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
