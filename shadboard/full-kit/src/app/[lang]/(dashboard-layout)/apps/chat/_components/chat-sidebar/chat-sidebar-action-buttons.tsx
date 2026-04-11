"use client"

import { useState } from "react"
import { ListFilter, MoreVertical, SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatBlockedChatsDialog } from "../chat-blocked-chats-dialog"
import { ChatCreateThreadDialog } from "../chat-create-thread-dialog"
import { ChatSidebarNotificationDropdown } from "./chat-sidebar-notification-dropdown"
import { ChatSidebarStatusDropdown } from "./chat-sidebar-status-dropdown"

export function ChatSidebarActionButtons() {
  const [notifications, setNotifications] = useState<string>("ALL_MESSAGES")
  const [status, setStatus] = useState<string>("ONLINE")
  const [blockedOpen, setBlockedOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="New chat"
        onClick={() => setCreateOpen(true)}
      >
        <SquarePen className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Filter chat list">
        <ListFilter className="h-4 w-4" />
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <ChatSidebarNotificationDropdown
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <ChatSidebarStatusDropdown status={status} setStatus={setStatus} />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setBlockedOpen(true)
            }}
          >
            Blocked chats
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChatBlockedChatsDialog open={blockedOpen} onOpenChange={setBlockedOpen} />
      <ChatCreateThreadDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
