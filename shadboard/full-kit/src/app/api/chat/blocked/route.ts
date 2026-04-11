import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import {
  CHAT_DB_SETUP_MESSAGE,
  ensureEcoUserFromSession,
  isChatSchemaMissingError,
} from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

/** List threads the current user has blocked (for unblock UI). */
export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const rows = await withPrismaRetry(() =>
      db.ecoChatMember.findMany({
        where: { userId: eco.id, blocked: true },
        include: {
          thread: { select: { id: true, name: true } },
        },
        orderBy: { joinedAt: "desc" },
      })
    )

    const threads = rows.map((r) => ({
      id: r.thread.id,
      name: r.thread.name,
    }))

    return NextResponse.json({ threads })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      return NextResponse.json({ error: CHAT_DB_SETUP_MESSAGE }, { status: 503 })
    }
    const message = e instanceof Error ? e.message : "Server error"
    console.error("[api/chat/blocked]", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
