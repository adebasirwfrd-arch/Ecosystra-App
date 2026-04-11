import type { ReactNode } from "react"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type { ChatType } from "./types"

import { ChatWrapper } from "./_components/chat-wrapper"

export default async function ChatLayout({
  children,
}: {
  children: ReactNode
}) {
  const b = await getShadboardPageContent("chat")

  return (
    <ChatWrapper chatsData={b.chatsData as ChatType[]}>{children}</ChatWrapper>
  )
}
