import Link from "next/link"
import { useParams } from "next/navigation"
import { ListTodo, VolumeX } from "lucide-react"

import type { LocaleType } from "@/types"
import type { ChatType } from "../../types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, formatDistance, getInitials } from "@/lib/utils"

import { useChatContext } from "../../_hooks/use-chat-context"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ChatAvatar } from "../chat-avatar"

export function ChatSidebarItem({ chat }: { chat: ChatType }) {
  const { setIsChatSidebarOpen } = useChatContext()
  const params = useParams()

  const chatIdParam = params.id?.[0]
  const locale = params.lang as LocaleType

  const handleOnCLick = () => {
    // Close the sidebar when a chat is selected
    setIsChatSidebarOpen(false)
  }

  return (
    <Link
      href={ensureLocalizedPathname(`/apps/chat/${chat.id}`, locale)}
      prefetch={false}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        chatIdParam === chat.id && "bg-accent", // Highlight the current chat box
        "h-fit w-full"
      )}
      aria-current={chatIdParam === chat.id ? "true" : undefined}
      onClick={handleOnCLick}
    >
      <li className="w-full flex items-start gap-2 py-1">
        <ChatAvatar
          src={chat.avatar}
          fallback={getInitials(chat.name)}
          status={chat.status}
          size={1.75}
          className="shrink-0"
        />
        <div className="min-h-11 w-full grid grid-cols-3 gap-x-4">
          <div className="col-span-2 grid min-w-0 gap-0.5">
            <span className="truncate">{chat.name}</span>
            {chat.linkedTask ? (
              <span className="flex items-center gap-1 text-[11px] leading-tight text-muted-foreground truncate">
                <ListTodo className="size-3 shrink-0 opacity-80" aria-hidden />
                <span className="truncate font-medium">
                  {chat.linkedTask.name}
                  {chat.linkedTask.boardName
                    ? ` · ${chat.linkedTask.boardName}`
                    : ""}
                </span>
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground font-semibold truncate">
              {chat.lastMessage?.content || "No messages yet..."}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground font-semibold">
              {chat.muted && (
                <VolumeX
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-label="Muted"
                />
              )}
              {formatDistance(chat.lastMessage?.createdAt ?? new Date())}
            </span>
            {/* Display unread count if available */}
            {!!chat?.unreadCount && (
              <Badge className="hover:bg-primary">{chat.unreadCount}</Badge>
            )}
          </div>
        </div>
      </li>
    </Link>
  )
}
