import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth"
import { ensureEcoUserFromSession } from "@/lib/chat-server"
import { db, withPrismaRetry } from "@/lib/prisma"

/** Users (except viewer) + board items for "Create chat" dialog. */
export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eco = await ensureEcoUserFromSession(session)
  if (!eco) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [users, tasks] = await Promise.all([
    withPrismaRetry(() =>
      db.ecoUser.findMany({
        where: { id: { not: eco.id } },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
        orderBy: [{ name: "asc" }, { email: "asc" }],
        take: 400,
      })
    ),
    withPrismaRetry(() =>
      db.ecoItem.findMany({
        select: {
          id: true,
          name: true,
          board: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 400,
      })
    ),
  ])

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name?.trim() || u.email.split("@")[0] || "User",
      avatarUrl: u.avatarUrl,
    })),
    tasks: tasks.map((t) => ({
      id: t.id,
      name: t.name,
      boardName: t.board?.name ?? "",
    })),
  })
}
