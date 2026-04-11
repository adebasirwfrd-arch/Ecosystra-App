import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { EllipsisVertical, Star } from "lucide-react"

import type { KeyboardEvent } from "react"
import type { EmailType } from "../types"

import { formatStandardEmailLabel } from "../_lib/email-label-ui"
import { cn, ensureWithSuffix, formatDate, getInitials } from "@/lib/utils"

import { useEmailContext } from "../_hooks/use-email-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"

interface EmailListContentRowDesktopProps {
  email: EmailType
  isSelected: boolean
}

export function EmailListContentRowDesktop({
  email,
  isSelected,
}: EmailListContentRowDesktopProps) {
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
    <TableRow
      key={email.id}
      className={cn(
        "cursor-pointer",
        email.read && "bg-muted",
        navPending && "opacity-80"
      )}
      onClick={goToDetail}
      onKeyDown={handleOnKeyDown}
      onMouseEnter={() => router.prefetch(detailHref)}
      tabIndex={0}
    >
      <TableCell className="w-10 text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => handleToggleSelectEmail(email)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select email"
        />
      </TableCell>
      <TableCell className="w-10 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleStarEmail(email)
          }}
          aria-label={isStarred ? "Unstar email" : "Star email"}
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
      </TableCell>
      <TableCell className="w-44">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={email.sender?.avatar} alt="Avatar" />
            <AvatarFallback>{getInitials(email.sender.name)}</AvatarFallback>
          </Avatar>
          <span className="font-bold line-clamp-1 break-all">
            {email.sender.name}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-muted-foreground line-clamp-1 break-all">
            {email.subject}
          </span>
          {labelText ? (
            <Badge variant="secondary" className="shrink-0 text-xs font-normal capitalize">
              {labelText}
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="w-28">
        <span className="text-sm text-muted-foreground">
          {formatDate(email.createdAt)}
        </span>
      </TableCell>
      <TableCell className="w-10">
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
      </TableCell>
    </TableRow>
  )
}
