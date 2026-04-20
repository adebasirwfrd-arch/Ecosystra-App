"use client"

import { createContext, useCallback, useReducer, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import type { FileType, LocaleType } from "@/types"
import type { ReactNode } from "react"
import type {
  ChatContextType,
  ChatType,
  MessageType,
  UserType,
} from "../types"

import { toast } from "sonner"

import { uploadBlobAttachments } from "@/lib/chat-attachments-upload"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { reviveChatsFromJson } from "@/lib/chat-client"
import { ChatReducer } from "../_reducers/chat-reducer"

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({
  chatsData,
  currentUser,
  children,
}: {
  chatsData: ChatType[]
  currentUser: UserType
  children: ReactNode
}) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.lang as LocaleType) ?? "en"
  const routeThreadId = Array.isArray(params?.id) ? params.id[0] : undefined

  const [chatState, dispatch] = useReducer(ChatReducer, {
    chats: chatsData,
    selectedChat: null,
  })

  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null)

  const refreshChats = useCallback(async () => {
    const res = await fetch("/api/chat")
    if (!res.ok) return
    const data = (await res.json()) as { chats?: unknown }
    dispatch({
      type: "hydrateChats",
      chats: reviveChatsFromJson(data.chats),
    })
  }, [])

  const handleMarkThreadRead = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/chat/${threadId}/read`, { method: "POST" })
    if (!res.ok) return
    const data = (await res.json()) as { chats?: unknown }
    dispatch({
      type: "hydrateChats",
      chats: reviveChatsFromJson(data.chats),
    })
  }, [])

  const sendToThread = useCallback(
    async (payload: {
      text?: string
      attachments?: FileType[]
      replyToMessageId?: string
      forwardedFromMessageId?: string
    }): Promise<boolean> => {
      const threadId = chatState.selectedChat?.id ?? routeThreadId
      if (!threadId) return false

      let body = payload
      if (payload.attachments?.length) {
        try {
          const uploaded = await uploadBlobAttachments(threadId, payload.attachments)
          body = { ...payload, attachments: uploaded }
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Upload failed")
          return false
        }
      }

      const res = await fetch(`/api/chat/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        let msg = "Could not send message"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return false
      }
      const data = (await res.json()) as { chats?: unknown }
      dispatch({
        type: "hydrateChats",
        chats: reviveChatsFromJson(data.chats),
      })
      return true
    },
    [chatState.selectedChat?.id, routeThreadId]
  )

  const handleAddTextMessage = useCallback(
    async (text: string) => {
      const replyToMessageId = replyingTo?.id
      const ok = await sendToThread({ text, replyToMessageId })
      if (ok) setReplyingTo(null)
    },
    [replyingTo?.id, sendToThread]
  )

  const handleAddImagesMessage = useCallback(
    async (images: FileType[]) => {
      const replyToMessageId = replyingTo?.id
      const ok = await sendToThread({
        text: "",
        attachments: images,
        replyToMessageId,
      })
      if (ok) setReplyingTo(null)
    },
    [replyingTo?.id, sendToThread]
  )

  const handleAddFilesMessage = useCallback(
    async (files: FileType[]) => {
      const replyToMessageId = replyingTo?.id
      const ok = await sendToThread({
        text: "",
        attachments: files,
        replyToMessageId,
      })
      if (ok) setReplyingTo(null)
    },
    [replyingTo?.id, sendToThread]
  )

  const handleEditMessage = useCallback(
    async (threadId: string, messageId: string, text: string) => {
      const res = await fetch(`/api/chat/${threadId}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        let msg = "Could not update message"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return
      }
      const data = (await res.json()) as { chats?: unknown }
      dispatch({
        type: "hydrateChats",
        chats: reviveChatsFromJson(data.chats),
      })
      toast.success("Message updated")
    },
    []
  )

  const handleDeleteMessage = useCallback(async (threadId: string, messageId: string) => {
    const res = await fetch(`/api/chat/${threadId}/messages/${messageId}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      let msg = "Could not delete message"
      try {
        const err = (await res.json()) as { error?: string }
        if (err?.error) msg = err.error
      } catch {
        /* ignore */
      }
      toast.error(msg)
      return
    }
    const data = (await res.json()) as { chats?: unknown }
    dispatch({
      type: "hydrateChats",
      chats: reviveChatsFromJson(data.chats),
    })
    toast.success("Message deleted")
  }, [])

  const handleForwardMessage = useCallback(
    async (sourceThreadId: string, messageId: string, targetThreadId: string) => {
      const res = await fetch(
        `/api/chat/${sourceThreadId}/messages/${messageId}/forward`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetThreadId }),
        }
      )
      if (!res.ok) {
        let msg = "Could not forward message"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return
      }
      const data = (await res.json()) as { chats?: unknown }
      dispatch({
        type: "hydrateChats",
        chats: reviveChatsFromJson(data.chats),
      })
      toast.success("Message forwarded")
    },
    []
  )

  const copyMessageToClipboard = useCallback(async (message: MessageType) => {
    const parts: string[] = []
    if (message.text?.trim()) parts.push(message.text.trim())
    if (message.images?.length) {
      for (const img of message.images) {
        parts.push(img.url ? `${img.name}\n${img.url}` : img.name)
      }
    }
    if (message.files?.length) {
      for (const f of message.files) {
        parts.push(f.url ? `${f.name}\n${f.url}` : f.name)
      }
    }
    if (message.voiceMessage?.url) {
      parts.push(message.voiceMessage.url)
    }
    const out = parts.join("\n\n")
    if (!out) {
      toast.error("Nothing to copy")
      return
    }
    try {
      await navigator.clipboard.writeText(out)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Clipboard not available")
    }
  }, [])

  const updateThreadPreferences = useCallback(
    async (
      threadId: string,
      prefs: { muted?: boolean; blocked?: boolean }
    ): Promise<boolean> => {
      const res = await fetch(`/api/chat/${threadId}/preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      })
      if (!res.ok) {
        let msg = "Could not update chat"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return false
      }
      const data = (await res.json()) as { chats?: unknown }
      dispatch({
        type: "hydrateChats",
        chats: reviveChatsFromJson(data.chats),
      })
      if (prefs.blocked === true) {
        toast.success("Chat blocked")
        router.push(ensureLocalizedPathname("/apps/chat", locale))
      } else if (prefs.blocked === false) {
        toast.success("Chat unblocked")
      } else if (prefs.muted === true) {
        toast.success("Notifications muted for this chat")
      } else if (prefs.muted === false) {
        toast.success("Notifications on for this chat")
      }
      return true
    },
    [locale, router]
  )

  const handleSelectChat = useCallback((chat: ChatType) => {
    dispatch({ type: "selectChat", chat })
  }, [])

  const createThreadWithOptions = useCallback(
    async (opts: {
      name: string
      memberUserIds: string[]
      ecoItemId: string | null
    }): Promise<boolean> => {
      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: opts.name.trim() || "New chat",
          memberUserIds: opts.memberUserIds,
          ecoItemId: opts.ecoItemId,
        }),
      })
      if (!res.ok) {
        let msg = "Could not create chat"
        try {
          const err = (await res.json()) as { error?: string }
          if (err?.error) msg = err.error
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return false
      }
      const data = (await res.json()) as {
        chats?: unknown
        createdThreadId?: string
      }
      const chats = reviveChatsFromJson(data.chats)
      dispatch({ type: "hydrateChats", chats })
      toast.success("Chat created")
      const id =
        typeof data.createdThreadId === "string" && data.createdThreadId.trim()
          ? data.createdThreadId.trim()
          : chats[0]?.id
      if (id) {
        router.push(ensureLocalizedPathname(`/apps/chat/${id}`, locale))
      }
      return true
    },
    [locale, router]
  )

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        chatState,
        isChatSidebarOpen,
        setIsChatSidebarOpen,
        handleSelectChat,
        handleAddTextMessage,
        handleAddImagesMessage,
        handleAddFilesMessage,
        handleMarkThreadRead,
        refreshChats,
        createThreadWithOptions,
        replyingTo,
        setReplyingTo,
        handleEditMessage,
        handleDeleteMessage,
        handleForwardMessage,
        copyMessageToClipboard,
        updateThreadPreferences,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
