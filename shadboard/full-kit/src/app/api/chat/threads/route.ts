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
  name?: string
  memberUserIds?: unknown
  ecoItemId?: unknown
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  const out: string[] = []
  for (const x of v) {
    if (typeof x === "string" && x.trim()) out.push(x.trim())
  }
  return [...new Set(out)]
}

/** Create a thread with the current user + optional members + optional linked task (EcoItem). */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : "New chat"

  const memberUserIds = asStringArray(body.memberUserIds).filter(
    (id) => id !== eco.id
  )

  let ecoItemId: string | null = null
  if (body.ecoItemId === null || body.ecoItemId === "") {
    ecoItemId = null
  } else if (typeof body.ecoItemId === "string" && body.ecoItemId.trim()) {
    ecoItemId = body.ecoItemId.trim()
  }

  try {
    if (ecoItemId) {
      const item = await withPrismaRetry(() =>
        db.ecoItem.findUnique({
          where: { id: ecoItemId! },
          select: { id: true },
        })
      )
      if (!item) {
        return NextResponse.json({ error: "Task not found" }, { status: 400 })
      }
    }

    if (memberUserIds.length) {
      const n = await withPrismaRetry(() =>
        db.ecoUser.count({ where: { id: { in: memberUserIds } } })
      )
      if (n !== memberUserIds.length) {
        return NextResponse.json(
          { error: "One or more people could not be found" },
          { status: 400 }
        )
      }
    }

    const memberCreates = [
      { userId: eco.id },
      ...memberUserIds.map((userId) => ({ userId })),
    ]

    const created = await withPrismaRetry(() =>
      db.ecoChatThread.create({
        data: {
          name,
          ecoItemId: ecoItemId ?? undefined,
          members: {
            create: memberCreates,
          },
        },
        select: { id: true },
      })
    )

    const chats = await loadChatsForEcoUserId(eco.id)
    return NextResponse.json({ chats, createdThreadId: created.id })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    throw e
  }
}
