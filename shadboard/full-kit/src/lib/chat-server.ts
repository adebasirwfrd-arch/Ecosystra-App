import type { Session } from "next-auth"

import { Prisma } from "@/generated/prisma"

import type { FileType } from "@/types"
import type { ChatType, LastMessageType, MessageType, UserType } from "@/app/[lang]/(dashboard-layout)/apps/chat/types"

import { db, withPrismaRetry } from "@/lib/prisma"

/** Shown when `EcoChat*` tables were never applied (`prisma db push` / migrate). */
export const CHAT_DB_SETUP_MESSAGE =
  "Chat tables are missing. From the full-kit directory run: npx prisma db push"

/** Prisma `P2021` = table does not exist (schema not applied to this database). */
export function isChatSchemaMissingError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return true
  }
  const msg = error instanceof Error ? error.message : String(error)
  return (
    /does not exist in the current database/i.test(msg) &&
    /Chat(Thread|Member|Message)/i.test(msg)
  )
}

const MESSAGE_PAGE = 80

function splitAttachments(raw: unknown): {
  images?: FileType[]
  files?: FileType[]
} {
  const arr = Array.isArray(raw) ? raw : []
  const images: FileType[] = []
  const files: FileType[] = []
  for (const item of arr) {
    if (!item || typeof item !== "object") continue
    const a = item as FileType
    if (String(a.type ?? "").startsWith("image/")) images.push(a)
    else files.push(a)
  }
  return {
    images: images.length ? images : undefined,
    files: files.length ? files : undefined,
  }
}

function mapEcoUserToChatUser(u: {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  status: string | null
}): UserType {
  return {
    id: u.id,
    name: u.name?.trim() || u.email.split("@")[0] || "User",
    avatar: u.avatarUrl ?? undefined,
    status: u.status || "Active",
  }
}

function mapMessageRow(m: {
  id: string
  senderId: string
  text: string
  attachments: unknown
  createdAt: Date
  editedAt?: Date | null
  replyToMessageId?: string | null
  forwardedFromMessageId?: string | null
}): MessageType {
  const { images, files } = splitAttachments(m.attachments)
  const base: MessageType = {
    id: m.id,
    senderId: m.senderId,
    status: "DELIVERED",
    createdAt: m.createdAt,
  }
  if (m.text.trim()) base.text = m.text
  if (images?.length) base.images = images
  if (files?.length) base.files = files
  if (m.editedAt) base.editedAt = m.editedAt
  if (m.replyToMessageId) base.replyToMessageId = m.replyToMessageId
  if (m.forwardedFromMessageId)
    base.forwardedFromMessageId = m.forwardedFromMessageId
  return base
}

function lastMessageFromThread(
  messages: {
    text: string
    attachments: unknown
    createdAt: Date
    deletedAt?: Date | null
  }[],
  threadCreatedAt: Date
): LastMessageType {
  const visible = messages.filter((m) => !m.deletedAt)
  if (!visible.length) {
    return { content: "No messages yet", createdAt: threadCreatedAt }
  }
  const latest = visible[0]
  const { images, files } = splitAttachments(latest.attachments)
  let content = latest.text.trim()
  if (!content) {
    if (images?.length) content = images.length > 1 ? "Images" : "Image"
    else if (files?.length) content = files.length > 1 ? "Files" : "File"
    else content = "Message"
  }
  return { content, createdAt: latest.createdAt }
}

/** Upsert EcoUser from NextAuth session (same as GraphQL `getViewer`). */
export async function ensureEcoUserFromSession(session: Session) {
  const email = session.user?.email?.trim()
  if (!email) return null
  return withPrismaRetry(() =>
    db.ecoUser.upsert({
      where: { email },
      create: {
        email,
        name: session.user?.name ?? email.split("@")[0],
        avatarUrl: session.user?.avatar ?? null,
        status: session.user?.status ?? "Active",
      },
      update: {},
    })
  )
}

export async function loadChatsForEcoUserId(ecoUserId: string): Promise<ChatType[]> {
  try {
    const threads = await withPrismaRetry(() =>
      db.ecoChatThread.findMany({
        where: {
          members: {
            some: { userId: ecoUserId, blocked: false },
          },
        },
        orderBy: { updatedAt: "desc" },
        include: {
          ecoItem: {
            select: {
              id: true,
              name: true,
              board: { select: { name: true } },
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  avatarUrl: true,
                  status: true,
                },
              },
            },
          },
          messages: {
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: MESSAGE_PAGE,
          },
        },
      })
    )

    return threads.map((t) => {
      const viewerMember = t.members.find((m) => m.userId === ecoUserId)
      const lastRead = viewerMember?.lastReadAt?.getTime() ?? 0

      const unreadCount = t.messages.filter(
        (msg) =>
          msg.senderId !== ecoUserId && msg.createdAt.getTime() > lastRead
      ).length

      const users: UserType[] = t.members.map((m) => mapEcoUserToChatUser(m.user))

      const messages: MessageType[] = t.messages.map((msg) =>
        mapMessageRow({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.text,
          attachments: msg.attachments,
          createdAt: msg.createdAt,
          editedAt: msg.editedAt,
          replyToMessageId: msg.replyToMessageId,
          forwardedFromMessageId: msg.forwardedFromMessageId,
        })
      )

      const lastMessage = lastMessageFromThread(t.messages, t.createdAt)

      return {
        id: t.id,
        name: t.name,
        avatar: t.avatarUrl ?? undefined,
        status: undefined,
        lastMessage,
        messages,
        users,
        typingUsers: [],
        unreadCount: unreadCount > 0 ? unreadCount : undefined,
        muted: viewerMember?.muted ?? false,
        linkedTask: t.ecoItem
          ? {
              id: t.ecoItem.id,
              name: t.ecoItem.name,
              boardName: t.ecoItem.board?.name,
            }
          : undefined,
      }
    })
  } catch (e) {
    if (isChatSchemaMissingError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[chat] ${CHAT_DB_SETUP_MESSAGE}`)
      }
      return []
    }
    throw e
  }
}

export function ecoUserToChatUserType(u: {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  status: string | null
}): UserType {
  return mapEcoUserToChatUser(u)
}
