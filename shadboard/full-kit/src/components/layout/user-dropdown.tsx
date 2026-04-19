"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { LogOut, User, UserCog } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { clearBoardLocalCache } from "@/lib/ecosystra/board-local-db"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserDropdown({
  dictionary,
  locale,
}: {
  dictionary: DictionaryType
  locale: LocaleType
}) {
  const { data: session, status } = useSession()
  const u = session?.user
  const displayEmail = u?.email?.trim() ?? ""
  const emailLocalPart = (() => {
    if (!displayEmail) return ""
    const at = displayEmail.indexOf("@")
    return at > 0 ? displayEmail.slice(0, at).trim() : displayEmail
  })()
  const displayName = u?.name?.trim() || emailLocalPart || "User"
  const avatarSrc = u?.avatar?.trim() || undefined
  const initialsSource = u?.name?.trim() || displayEmail || "User"
  const rawInitials = getInitials(initialsSource)
  const initials =
    status === "loading"
      ? "…"
      : rawInitials.slice(0, 2) ||
        (displayEmail ? displayEmail.charAt(0).toUpperCase() : "?")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label={displayName}
        >
          <Avatar className="size-9">
            {avatarSrc ? (
              <AvatarImage
                src={avatarSrc}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="bg-transparent text-xs font-semibold">
              {status === "loading" ? "…" : initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DropdownMenuLabel className="flex gap-2">
          <Avatar className="size-10 shrink-0">
            {avatarSrc ? (
              <AvatarImage
                src={avatarSrc}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="bg-transparent text-sm font-semibold">
              {status === "loading" ? "…" : initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <p className="truncate text-sm font-medium">{displayName}</p>
            {displayEmail ? (
              <p className="truncate text-xs font-semibold text-muted-foreground">
                {displayEmail}
              </p>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-w-48">
          <DropdownMenuItem asChild>
            <Link
              href={ensureLocalizedPathname("/apps/ecosystra/profile", locale)}
            >
              <User className="me-2 size-4" />
              {dictionary.navigation.userNav.profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ensureLocalizedPathname("/apps/ecosystra/settings", locale)}
            >
              <UserCog className="me-2 size-4" />
              {dictionary.navigation.userNav.settings}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void clearBoardLocalCache()
            void signOut({
              callbackUrl: ensureLocalizedPathname("/sign-in", locale),
            })
          }}
        >
          <LogOut className="me-2 size-4" />
          {dictionary.navigation.userNav.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
