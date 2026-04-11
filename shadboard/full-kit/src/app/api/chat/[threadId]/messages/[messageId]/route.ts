import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
  loadChatsForEcoUserId,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

const MAX_TEXT = 280

function hasContent(text: string, attachments: unknown): boolean {
  const t = text.trim()
  if (t.length > 0) return true
  const arr = Array.isArray(attachments) ? attachments : []
  return arr.length > 0
}

export async function PATCH(
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

  const { threadId, messageId } = await ctx.params
  if (!threadId || !messageId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  let body: { text?: string }
  try {
    body = (await req.json()) as { text?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const text = typeof body.text === "string" ? body.text : ""
  if (text.length > MAX_TEXT) {
    return NextResponse.json(
      { error: `Text must be at most ${MAX_TEXT} characters` },
      { status: 400 }
    )
  }

  try {
    const member = await withPrismaRetry(() =>
      db.ecoChatMember.findUnique({
        where: { threadId_userId: { threadId, userId: eco.id } },
      })
    )
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const existing = await withPrismaRetry(() =>
      db.ecoChatMessage.findFirst({
        where: { id: messageId, threadId, deletedAt: null },
      })
    )
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (existing.senderId !== eco.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const nextText = text.trim()
    if (!hasContent(nextText, existing.attachments)) {
      return NextResponse.json(
        { error: "Message must have text or attachments" },
        { status: 400 }
      )
    }

    await withPrismaRetry(() =>
      db.ecoChatMessage.update({
        where: { id: messageId },
        data: {
          text: nextText,
          editedAt: new Date(),
        },
      })
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/messages PATCH]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
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

  const { threadId, messageId } = await ctx.params
  if (!threadId || !messageId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  try {
    const member = await withPrismaRetry(() =>
      db.ecoChatMember.findUnique({
        where: { threadId_userId: { threadId, userId: eco.id } },
      })
    )
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const existing = await withPrismaRetry(() =>
      db.ecoChatMessage.findFirst({
        where: { id: messageId, threadId, deletedAt: null },
      })
    )
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (existing.senderId !== eco.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await withPrismaRetry(() =>
      db.ecoChatMessage.update({
        where: { id: messageId },
        data: { deletedAt: new Date() },
      })
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/messages DELETE]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
