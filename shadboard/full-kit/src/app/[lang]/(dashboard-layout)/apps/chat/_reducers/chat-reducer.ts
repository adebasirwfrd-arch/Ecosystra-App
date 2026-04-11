"use client"

import type { ChatActionType, ChatStateType } from "../types"

export const ChatReducer = (
  state: ChatStateType,
  action: ChatActionType
): ChatStateType => {
  switch (action.type) {
    case "hydrateChats": {
      const next = action.chats
      const selectedId = state.selectedChat?.id
      const selectedChat = selectedId
        ? next.find((c) => c.id === selectedId) ?? null
        : state.selectedChat ?? null
      return { chats: next, selectedChat }
    }

    case "selectChat": {
      return { ...state, selectedChat: action.chat }
    }

    default:
      return state
  }
}
