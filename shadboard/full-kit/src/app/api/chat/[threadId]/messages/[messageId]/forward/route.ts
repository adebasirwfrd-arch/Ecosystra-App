import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
  loadChatsForEcoUserId,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

type Body = {
  targetThreadId?: string
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ threadId: string; messageId: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { threadId: sourceThreadId, messageId } = await ctx.params
  if (!sourceThreadId || !messageId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const targetThreadId =
    typeof body.targetThreadId === "string" ? body.targetThreadId.trim() : ""
  if (!targetThreadId) {
    return NextResponse.json({ error: "Missing targetThreadId" }, { status: 400 })
  }
  if (targetThreadId === sourceThreadId) {
    return NextResponse.json(
      { error: "Choose a different chat to forward to" },
      { status: 400 }
    )
  }

  try {
    const [sourceMember, targetMember] = await withPrismaRetry(() =>
      Promise.all([
        db.ecoChatMember.findUnique({
          where: {
            threadId_userId: { threadId: sourceThreadId, userId: eco.id },
          },
        }),
        db.ecoChatMember.findUnique({
          where: {
            threadId_userId: { threadId: targetThreadId, userId: eco.id },
          },
        }),
      ])
    )

    if (!sourceMember || !targetMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const source = await withPrismaRetry(() =>
      db.ecoChatMessage.findFirst({
        where: {
          id: messageId,
          threadId: sourceThreadId,
          deletedAt: null,
        },
      })
    )
    if (!source) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    await withPrismaRetry(() =>
      db.ecoChatMessage.create({
        data: {
          threadId: targetThreadId,
          senderId: eco.id,
          text: source.text,
          attachments: source.attachments ?? [],
          forwardedFromMessageId: source.id,
        },
      })
    )

    await withPrismaRetry(() =>
      db.ecoChatThread.update({
        where: { id: targetThreadId },
        data: { updatedAt: new Date() },
      })
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/messages/forward]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
