import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { EllipsisVertical, Star } from "lucide-react"

import type { KeyboardEvent } from "react"
import type { EmailType } from "../types"

import { formatStandardEmailLabel } from "../_lib/email-label-ui"
import { cn, ensureWithSuffix, formatDate } from "@/lib/utils"

import { useEmailContext } from "../_hooks/use-email-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EmailListContentItemMoblieProps {
  email: EmailType
  isSelected: boolean
}

export function EmailListContentItemMoblie({
  email,
  isSelected,
}: EmailListContentItemMoblieProps) {
  const {
    handleToggleSelectEmail,
    handleToggleStarEmail,
    handleSetRead,
    handleArchiveEmail,
    handleMarkEmailSpam,
    handleDeleteEmail,
  } = useEmailContext()
  const router = useRouter()
  const pathname = usePathname()
  const [navPending, startTransition] = useTransition()
  const detailHref = ensureWithSuffix(pathname, "/") + email.id
  const labelText = formatStandardEmailLabel(email.label)

  const isStarred = email.starred

  function goToDetail() {
    handleSetRead(email)
    startTransition(() => {
      router.push(detailHref)
    })
  }

  function handleOnKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      goToDetail()
    }
  }

  return (
    <li
      key={email.id}
      className={cn(
        "flex items-center justify-between gap-1.5 p-1 ps-3 cursor-pointer",
        email.read && "bg-muted",
        navPending && "opacity-80"
      )}
      onClick={goToDetail}
      onKeyDown={handleOnKeyDown}
      onMouseEnter={() => router.prefetch(detailHref)}
      tabIndex={0}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => handleToggleSelectEmail(email)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select email"
      />

      <div className="flex-1 px-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold line-clamp-1 break-all">
            {email.subject}
          </span>
          {labelText ? (
            <Badge variant="secondary" className="shrink-0 text-xs font-normal capitalize">
              {labelText}
            </Badge>
          ) : null}
        </div>
        <span className="text-muted-foreground line-clamp-1 break-all">
          From {email.sender.name}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatDate(email.createdAt)}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4"
        onClick={(e) => {
          e.stopPropagation()
          handleToggleStarEmail(email)
        }}
        aria-label={isStarred ? `Unstar email` : `Star email`}
        aria-live="polite"
      >
        <Star
          className={`h-4 w-4 ${
            isStarred
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            aria-label="More actions"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              void handleArchiveEmail(email)
            }}
          >
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              void handleMarkEmailSpam(email)
            }}
          >
            Mark as spam
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              void handleDeleteEmail(email)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
