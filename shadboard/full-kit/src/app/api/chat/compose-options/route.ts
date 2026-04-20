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

  const workspaceRows = await withPrismaRetry(() =>
    db.ecoMember.findMany({
      where: { userId: eco.id },
      select: { workspaceId: true },
    })
  )
  const workspaceIds = [...new Set(workspaceRows.map((r) => r.workspaceId))]

  let users: {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
  }[] = []
  let tasks: {
    id: string
    name: string
    board: { name: string } | null
  }[] = []

  if (workspaceIds.length > 0) {
    ;[users, tasks] = await Promise.all([
      withPrismaRetry(() =>
        db.ecoUser.findMany({
          where: {
            id: { not: eco.id },
            memberships: {
              some: { workspaceId: { in: workspaceIds } },
            },
          },
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
          where: {
            board: { workspaceId: { in: workspaceIds } },
          },
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
  } else {
    /** No EcoMember row yet — still allow picking people/tasks so chat compose works. */
    ;[users, tasks] = await Promise.all([
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
  }

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
