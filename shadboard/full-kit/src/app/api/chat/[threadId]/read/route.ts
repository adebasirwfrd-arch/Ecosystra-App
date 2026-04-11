import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
  loadChatsForEcoUserId,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ threadId: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { threadId } = await ctx.params
  if (!threadId) {
    return NextResponse.json({ error: "Missing thread" }, { status: 400 })
  }

  try {
    const member = await withPrismaRetry(() =>
      db.ecoChatMember.findUnique({
        where: {
          threadId_userId: { threadId, userId: eco.id },
        },
      })
    )

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await withPrismaRetry(() =>
      db.ecoChatMember.update({
        where: { id: member.id },
        data: { lastReadAt: new Date() },
      })
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    throw e
  }
}
