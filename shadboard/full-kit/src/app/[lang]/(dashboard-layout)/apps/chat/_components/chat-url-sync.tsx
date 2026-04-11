"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"

import { useChatContext } from "../_hooks/use-chat-context"

/** Keeps `selectedChat` aligned with `/apps/chat/[id]` after navigation or initial load. */
export function ChatUrlSync() {
  const params = useParams()
  const routeId = Array.isArray(params?.id) ? params.id[0] : undefined
  const { chatState, handleSelectChat } = useChatContext()

  useEffect(() => {
    if (!routeId) return
    const c = chatState.chats.find((x) => x.id === routeId)
    if (c && c.id !== chatState.selectedChat?.id) {
      handleSelectChat(c)
    }
  }, [routeId, chatState.chats, chatState.selectedChat?.id, handleSelectChat])

  return null
}
