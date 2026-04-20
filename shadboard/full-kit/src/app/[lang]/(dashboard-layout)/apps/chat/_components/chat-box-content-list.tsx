"use client"

import { useEffect, useMemo, useRef } from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import type { ChatType, UserType } from "../types"

import { cn } from "@/lib/utils"

import { useChatContext } from "../_hooks/use-chat-context"
import { useSettings } from "@/hooks/use-settings"
import { MessageBubble } from "./message-bubble"

export function ChatBoxContentList({
  user,
  chat,
}: {
  user: UserType
  chat: ChatType
}) {
  const { chatState, handleSelectChat, handleMarkThreadRead } = useChatContext()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { settings } = useSettings()

  // Synchronize chat selection and scroll to the bottom on updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }

    if (chat && chat !== chatState.selectedChat) {
      handleSelectChat(chat)
    }
  }, [chat, chatState.selectedChat, handleSelectChat])

  useEffect(() => {
    if (!chat?.id) return
    void handleMarkThreadRead(chat.id)
  }, [chat?.id, handleMarkThreadRead])

  // A map of chat users for quick lookup
  const userMap = useMemo(
    () => new Map(chat?.users.map((user) => [user.id, user])),
    [chat?.users]
  )

  return (
    <ScrollAreaPrimitive.Root
      className={cn(
        "relative h-[calc(100vh-16.5rem)]",
        settings.layout === "horizontal" && "md:h-[calc(100vh-20rem)]"
      )}
    >
      <ScrollAreaPrimitive.Viewport
        ref={scrollAreaRef}
        className="h-full w-full"
      >
        <ul className="flex flex-col-reverse gap-y-1.5 px-6 py-3">
          {chat.messages.map((message) => {
            const sender =
              userMap.get(message.senderId) ??
              ({
                id: message.senderId,
                name: "Unknown",
                status: "Active",
              } satisfies UserType)
            const isByCurrentUser = message.senderId === user.id

            const replyToMessage = message.replyToMessageId
              ? chat.messages.find((m) => m.id === message.replyToMessageId)
              : undefined
            const replySenderName = replyToMessage
              ? userMap.get(replyToMessage.senderId)?.name
              : undefined

            return (
              <MessageBubble
                key={message.id}
                threadId={chat.id}
                sender={sender}
                message={message}
                isByCurrentUser={isByCurrentUser}
                replyToMessage={replyToMessage}
                replySenderName={replySenderName}
              />
            )
          })}
        </ul>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="vertical"
        className="flex h-full w-2.5 touch-none select-none border-l border-l-transparent p-[1px] transition-colors"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
