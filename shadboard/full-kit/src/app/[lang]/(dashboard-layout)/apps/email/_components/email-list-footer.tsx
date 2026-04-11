"use client"

import { PAGE_SIZE } from "../constants"
import { CardFooter } from "@/components/ui/card"

interface EmailListFooterProps {
  filteredCount: number
  page: number
  totalPages: number
}

export function EmailListFooter({
  filteredCount,
  page,
  totalPages,
}: EmailListFooterProps) {
  const rangeStart =
    filteredCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd =
    filteredCount === 0 ? 0 : Math.min(page * PAGE_SIZE, filteredCount)

  return (
    <CardFooter className="justify-center py-3 border-t border-border">
      <p className="text-muted-foreground" role="status" aria-live="polite">
        {filteredCount === 0
          ? "No emails available"
          : `${rangeStart}-${rangeEnd} of ${filteredCount.toLocaleString()}${
              totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""
            }`}
      </p>
    </CardFooter>
  )
}
