"use client"

import { Archive, Clock, MoreVertical, Star, Tag, Trash2 } from "lucide-react"

import type { EmailType } from "../types"
import type { IconType } from "@/types"
import type { ComponentProps } from "react"

import { useEmailContext } from "../_hooks/use-email-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LABEL_OPTIONS = [
  { value: "personal" as const, title: "Personal" },
  { value: "work" as const, title: "Work" },
  { value: "important" as const, title: "Important" },
]

interface ActionButtonProps extends ComponentProps<typeof Button> {
  icon: IconType
  label: string
}

export function ActionButton({
  icon: Icon,
  label,
  ...props
}: ActionButtonProps) {
  return (
    <Button variant="ghost" size="icon" aria-label={label} type="button" {...props}>
      <Icon className="h-4 w-4" />
    </Button>
  )
}

export function EmailViewContentActions({
  email,
  onAfterDestructiveAction,
  onAfterDetailMutation,
}: {
  email: EmailType
  onAfterDestructiveAction?: () => void
  /** When detail was loaded only via GraphQL (not in folder list), refresh local detail state after mutations. */
  onAfterDetailMutation?: () => void | Promise<void>
}) {
  const {
    handleDeleteEmail,
    handleArchiveEmail,
    handleToggleStarEmail,
    handleMarkEmailUnread,
    handleMarkEmailSpam,
    handleSetEmailLabel,
    handleToggleMuteEmail,
  } = useEmailContext()

  const after = onAfterDestructiveAction
  const isStarred = email.starred || email.isStarred

  async function runStarToggle() {
    await handleToggleStarEmail(email)
    await onAfterDetailMutation?.()
  }

  async function runMarkUnread() {
    await handleMarkEmailUnread(email)
    await onAfterDetailMutation?.()
  }

  async function applyLabel(label: string) {
    await handleSetEmailLabel(email, label)
    await onAfterDetailMutation?.()
  }

  async function runMuteToggle() {
    await handleToggleMuteEmail(email)
    await onAfterDetailMutation?.()
  }

  const isMuted = email.muted === true

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <ActionButton
          icon={Trash2}
          label="Delete email"
          onClick={async () => {
            await handleDeleteEmail(email)
            after?.()
          }}
        />
        <ActionButton
          icon={Archive}
          label="Archive email"
          onClick={async () => {
            await handleArchiveEmail(email)
            after?.()
          }}
        />
        <ActionButton icon={Clock} label="Snooze email" disabled />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Label email"
            >
              <Tag className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {LABEL_OPTIONS.map(({ value, title }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => {
                  void applyLabel(value)
                }}
              >
                {title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                void applyLabel("")
              }}
            >
              Remove label
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={isStarred ? "Unstar email" : "Star email"}
          onClick={() => {
            void runStarToggle()
          }}
        >
          <Star
            className={cn(
              "h-4 w-4",
              isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionButton icon={MoreVertical} label="More actions" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                void runMarkUnread()
              }}
            >
              Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void runStarToggle()
              }}
            >
              Star thread
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await handleMarkEmailSpam(email)
                after?.()
              }}
            >
              Report spam
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {LABEL_OPTIONS.map(({ value, title }) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => {
                      void applyLabel(value)
                    }}
                  >
                    {title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void applyLabel("")
                  }}
                >
                  Remove label
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => {
                void runMuteToggle()
              }}
            >
              {isMuted ? "Unmute thread" : "Mute thread"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
