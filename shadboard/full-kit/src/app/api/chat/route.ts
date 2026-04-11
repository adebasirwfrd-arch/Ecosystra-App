import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import { ensureEcoUserFromSession, loadChatsForEcoUserId } from "@/lib/chat-server"

export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const chats = await loadChatsForEcoUserId(eco.id)
  return NextResponse.json({ chats })
}
