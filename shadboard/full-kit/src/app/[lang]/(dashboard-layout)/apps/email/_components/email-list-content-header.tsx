"use client"

import { EllipsisVertical } from "lucide-react"

import type { CheckedState } from "@radix-ui/react-checkbox"
import type { EmailType } from "../types"

import { useEmailContext } from "../_hooks/use-email-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EmailListContentHeader({
  filteredEmails,
}: {
  filteredEmails: EmailType[]
}) {
  const {
    emailState,
    handleToggleSelectAllFiltered,
    handleBulkArchive,
    handleBulkMarkSpam,
    handleBulkDelete,
  } = useEmailContext()

  const selected = emailState.selectedEmails
  const allFilteredSelected =
    filteredEmails.length > 0 &&
    filteredEmails.every((e) => selected.some((s) => s.id === e.id))

  let isCheckboxChecked: CheckedState
  if (filteredEmails.length === 0) {
    isCheckboxChecked = false
  } else if (allFilteredSelected) {
    isCheckboxChecked = true
  } else if (selected.some((s) => filteredEmails.some((f) => f.id === s.id))) {
    isCheckboxChecked = "indeterminate"
  } else {
    isCheckboxChecked = false
  }

  const noSelection = selected.length === 0

  return (
    <div className="flex items-center justify-between p-1 ps-3 border-b border-border md:p-2 md:ps-4">
      <Checkbox
        checked={isCheckboxChecked}
        onCheckedChange={() => handleToggleSelectAllFiltered(filteredEmails)}
        aria-label="Select all emails in this view"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Email actions"
            disabled={noSelection}
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              void handleBulkArchive()
            }}
          >
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void handleBulkMarkSpam()
            }}
          >
            Mark as spam
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void handleBulkDelete()
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
