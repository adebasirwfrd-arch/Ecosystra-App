import { ListTodo } from "lucide-react"

import type { ChatType } from "../types"

import { getInitials } from "@/lib/utils"

import { CardTitle } from "@/components/ui/card"
import { ChatAvatar } from "./chat-avatar"

export function ChatHeaderInfo({ chat }: { chat: ChatType }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <ChatAvatar
        src={chat.avatar}
        fallback={getInitials(chat.name)}
        status={chat.status}
        size={2}
      />
      <div className="min-w-0">
        <CardTitle className="truncate text-base leading-tight">
          {chat.name}
        </CardTitle>
        {chat.linkedTask ? (
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <ListTodo className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              <span className="font-medium text-foreground/90">
                {chat.linkedTask.name}
              </span>
              {chat.linkedTask.boardName ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {chat.linkedTask.boardName}
                </span>
              ) : null}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
