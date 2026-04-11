import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"
import { ecoUserToChatUserType, ensureEcoUserFromSession, loadChatsForEcoUserId } from "@/lib/chat-server"

import { ChatWrapper } from "./_components/chat-wrapper"

export default async function ChatLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  if (!session?.user?.email) {
    redirect("/sign-in")
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    redirect("/sign-in")
  }

  const chats = await loadChatsForEcoUserId(eco.id)
  const currentUser = ecoUserToChatUserType(eco)

  return (
    <ChatWrapper chatsData={chats} currentUser={currentUser}>
      {children}
    </ChatWrapper>
  )
}
