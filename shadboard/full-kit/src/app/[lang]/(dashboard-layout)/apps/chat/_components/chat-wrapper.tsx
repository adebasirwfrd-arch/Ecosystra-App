import type { ReactNode } from "react"
import type { ChatType, UserType } from "../types"

import { ChatProvider } from "../_contexts/chat-context"
import { WebRtcCallProvider } from "../_contexts/webrtc-call-context"
import { ChatCallOverlay } from "./chat-call-overlay"
import { ChatSidebar } from "./chat-sidebar"
import { ChatUrlSync } from "./chat-url-sync"

export function ChatWrapper({
  chatsData,
  currentUser,
  children,
}: {
  chatsData: ChatType[]
  currentUser: UserType
  children: ReactNode
}) {
  return (
    <ChatProvider chatsData={chatsData} currentUser={currentUser}>
      <WebRtcCallProvider>
        <ChatUrlSync />
        <div className="container relative w-full flex gap-x-4 p-4">
          <ChatSidebar />
          {children}
        </div>
        <ChatCallOverlay />
      </WebRtcCallProvider>
    </ChatProvider>
  )
}
