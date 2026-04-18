import type { Prisma } from "@/generated/prisma"
import { db as prisma, withPrismaRetry } from "@/lib/prisma"

export type EcoEmailRow = {
  id: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  read: boolean
  starred: boolean
  label: string | null
  isDraft: boolean
  isSent: boolean
  isStarred: boolean
  isSpam: boolean
  isDeleted: boolean
  muted: boolean
  cc: string | null
  bcc: string | null
  attachments: unknown
  createdAt: Date
  sender: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
    status: string | null
  }
}

function formatAttachmentsForGql(raw: unknown): unknown[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw
  return []
}

export function formatEmailRow(row: EcoEmailRow) {
  return {
    id: row.id,
    sender: {
      id: row.sender.id,
      name: row.sender.name || row.sender.email.split("@")[0],
      email: row.sender.email,
      avatar: row.sender.avatarUrl || null,
      status: row.sender.status || "Active",
    },
    recipientId: row.recipientId,
    subject: row.subject,
    content: row.content,
    read: row.read,
    starred: row.starred,
    label: row.label?.trim() ? row.label.trim().toLowerCase() : null,
    isDraft: row.isDraft,
    isSent: row.isSent,
    isStarred: row.isStarred,
    isSpam: row.isSpam,
    isDeleted: row.isDeleted,
    muted: row.muted,
    cc: row.cc ?? null,
    bcc: row.bcc ?? null,
    attachments: formatAttachmentsForGql(row.attachments),
    createdAt: row.createdAt.toISOString(),
  }
}

/** Sidebar folders personal / important / work — stored values may be mixed case from older sends. */
function systemLabelEquals(
  tag: "personal" | "important" | "work"
): Prisma.StringNullableFilter {
  return { equals: tag, mode: "insensitive" }
}

export function buildEmailFilter(
  filter: string,
  userId: string
): Prisma.EcoEmailWhereInput {
  switch (filter) {
    case "inbox":
      return {
        recipientId: userId,
        isSent: false,
        isDraft: false,
        isSpam: false,
        isDeleted: false,
        muted: false,
      }
    case "sent":
      return { senderId: userId, isSent: true }
    case "draft":
      return { senderId: userId, isDraft: true }
    case "starred":
      return {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isStarred: true,
      }
    case "spam":
      return { recipientId: userId, isSpam: true }
    case "trash":
      return {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isDeleted: true,
      }
    case "personal":
      return {
        label: systemLabelEquals("personal"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      }
    case "important":
      return {
        label: systemLabelEquals("important"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      }
    case "work":
      return {
        label: systemLabelEquals("work"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      }
    default:
      return { recipientId: userId, isSpam: false, isDeleted: false, muted: false }
  }
}

export async function aggregateEmailCountsForUser(userId: string) {
  const [
    inbox,
    sent,
    draft,
    starred,
    spam,
    trash,
    personal,
    important,
    work,
  ] = await Promise.all([
    prisma.ecoEmail.count({
      where: {
        recipientId: userId,
        isSent: false,
        isDraft: false,
        isSpam: false,
        isDeleted: false,
        muted: false,
        read: false,
      },
    }),
    prisma.ecoEmail.count({
      where: { senderId: userId, isSent: true },
    }),
    prisma.ecoEmail.count({
      where: { senderId: userId, isDraft: true },
    }),
    prisma.ecoEmail.count({
      where: {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isStarred: true,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        recipientId: userId,
        isSpam: true,
        isDeleted: false,
        read: false,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isDeleted: true,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("personal"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("important"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("work"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
  ])
  return {
    inbox,
    sent,
    draft,
    starred,
    spam,
    trash,
    personal,
    important,
    work,
  }
}

export async function listEmailsForEcoUser(userId: string, filter: string) {
  const rows = await withPrismaRetry(() =>
    prisma.ecoEmail.findMany({
      where: buildEmailFilter(filter, userId),
      include: { sender: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  )
  return rows.map((r) => formatEmailRow(r as unknown as EcoEmailRow))
}

export async function getEmailByIdForEcoUser(userId: string, id: string) {
  const row = await withPrismaRetry(() =>
    prisma.ecoEmail.findFirst({
      where: { id, OR: [{ recipientId: userId }, { senderId: userId }] },
      include: { sender: true },
    })
  )
  return row ? formatEmailRow(row as unknown as EcoEmailRow) : null
}

export async function getEmailCountsForEcoUser(userId: string) {
  return withPrismaRetry(() => aggregateEmailCountsForUser(userId))
}
