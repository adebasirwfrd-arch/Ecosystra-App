import type { ChatType } from "@/app/[lang]/(dashboard-layout)/apps/chat/types"

/** Restore `Date` fields after `fetch` + `JSON.parse` (API responses). */
export function reviveChatsFromJson(raw: unknown): ChatType[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c) => {
    const chat = c as Record<string, unknown>
    const lastMessage = chat.lastMessage as Record<string, unknown> | undefined
    const messages = Array.isArray(chat.messages) ? chat.messages : []
    return {
      ...chat,
      lastMessage: lastMessage
        ? {
            ...lastMessage,
            createdAt: new Date(lastMessage.createdAt as string),
          }
        : { content: "", createdAt: new Date() },
      messages: messages.map((m) => {
        const msg = m as Record<string, unknown>
        const edited = msg.editedAt
        return {
          ...msg,
          createdAt: new Date(msg.createdAt as string),
          editedAt:
            typeof edited === "string" ? new Date(edited) : undefined,
        }
      }),
    } as ChatType
  })
}
