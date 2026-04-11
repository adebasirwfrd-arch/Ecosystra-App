import { NextResponse } from "next/server"

import { Prisma } from "@/generated/prisma"

import type { FileType } from "@/types"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
  loadChatsForEcoUserId,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

/** Persist only JSON-safe metadata; blob: URLs are not valid after reload anyway. */
function attachmentsToPrismaJson(files: FileType[]): Prisma.InputJsonValue {
  const rows = files.map((f) => ({
    id: String(f.id),
    name: String(f.name),
    size: Number(f.size) || 0,
    type: String(f.type ?? "application/octet-stream"),
    url: typeof f.url === "string" && !f.url.startsWith("blob:") ? f.url : "",
  }))
  return JSON.parse(JSON.stringify(rows)) as Prisma.InputJsonValue
}

type Body = {
  text?: string
  attachments?: FileType[]
  replyToMessageId?: string
  forwardedFromMessageId?: string
}

export async function POST(
  req: Request,
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

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const text = typeof body.text === "string" ? body.text : ""
  const attachments = Array.isArray(body.attachments) ? body.attachments : []
  const replyToMessageId =
    typeof body.replyToMessageId === "string" && body.replyToMessageId.trim()
      ? body.replyToMessageId.trim()
      : undefined
  const forwardedFromMessageId =
    typeof body.forwardedFromMessageId === "string" &&
    body.forwardedFromMessageId.trim()
      ? body.forwardedFromMessageId.trim()
      : undefined

  if (!text.trim() && !attachments.length) {
    return NextResponse.json(
      { error: "Message must include text or attachments" },
      { status: 400 }
    )
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

    if (replyToMessageId) {
      const parent = await withPrismaRetry(() =>
        db.ecoChatMessage.findFirst({
          where: {
            id: replyToMessageId,
            threadId,
            deletedAt: null,
          },
        })
      )
      if (!parent) {
        return NextResponse.json(
          { error: "Reply target message not found" },
          { status: 400 }
        )
      }
    }

    if (forwardedFromMessageId) {
      const origin = await withPrismaRetry(() =>
        db.ecoChatMessage.findFirst({
          where: { id: forwardedFromMessageId, deletedAt: null },
        })
      )
      if (!origin) {
        return NextResponse.json(
          { error: "Forwarded message not found" },
          { status: 400 }
        )
      }
    }

    await withPrismaRetry(() =>
      db.$transaction([
        db.ecoChatMessage.create({
          data: {
            threadId,
            senderId: eco.id,
            text: text.trim(),
            attachments: attachments.length
              ? attachmentsToPrismaJson(attachments)
              : [],
            replyToMessageId: replyToMessageId ?? null,
            forwardedFromMessageId: forwardedFromMessageId ?? null,
          },
        }),
        db.ecoChatThread.update({
          where: { id: threadId },
          data: { updatedAt: new Date() },
        }),
      ])
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/messages]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
