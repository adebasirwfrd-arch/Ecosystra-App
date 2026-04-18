import type { Prisma } from "@/generated/prisma"
import { formatEmailRow, type EcoEmailRow } from "@/lib/email/email-inbox-queries"
import { getPublicSiteOrigin } from "@/lib/ecosystra/app-url"
import { db as prisma } from "@/lib/prisma"

const MAX_ATTACHMENT_BYTES = 500 * 1024
const MAX_ATTACHMENTS_TOTAL_BYTES = 2 * 1024 * 1024

function appBaseUrl(): string {
  return getPublicSiteOrigin()
}

function parseAddressList(s: string | null | undefined): string[] {
  if (!s?.trim()) return []
  const parts = s
    .split(/[,;]+/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set(parts)]
}

function normalizeAttachmentsInput(raw: unknown): Prisma.InputJsonValue {
  if (raw == null) return []
  if (!Array.isArray(raw)) throw new Error("INVALID_ATTACHMENTS")
  let total = 0
  const out: Array<{
    fileName: string
    mimeType: string
    contentBase64: string
  }> = []
  for (const item of raw) {
    if (typeof item !== "object" || item === null)
      throw new Error("INVALID_ATTACHMENTS")
    const o = item as Record<string, unknown>
    const fileName = String(o.fileName ?? "file").slice(0, 240)
    const mimeType = String(o.mimeType ?? "application/octet-stream").slice(
      0,
      120
    )
    const contentBase64 = String(o.contentBase64 ?? "")
    let size: number
    try {
      size = Buffer.from(contentBase64, "base64").length
    } catch {
      throw new Error("INVALID_ATTACHMENTS")
    }
    if (size > MAX_ATTACHMENT_BYTES) throw new Error("ATTACHMENT_TOO_LARGE")
    total += size
    if (total > MAX_ATTACHMENTS_TOTAL_BYTES)
      throw new Error("ATTACHMENTS_TOO_LARGE")
    out.push({ fileName, mimeType, contentBase64 })
  }
  return out as unknown as Prisma.InputJsonValue
}

function normalizeIncomingEmailLabel(
  label: string | null | undefined
): string | null {
  if (label == null || typeof label !== "string") return null
  const t = label.trim().toLowerCase()
  if (!t) return null
  if (t === "personal" || t === "important" || t === "work") return t
  return null
}

async function ensureEcoRecipientByEmail(to: string) {
  const raw = to.trim()
  if (!raw) return null
  const existing = await prisma.ecoUser.findFirst({
    where: { email: { equals: raw, mode: "insensitive" } },
  })
  if (existing) return existing
  const authUser = await prisma.user.findFirst({
    where: { email: { equals: raw, mode: "insensitive" } },
  })
  if (!authUser?.email) return null
  return prisma.ecoUser.create({
    data: {
      email: authUser.email,
      name: authUser.name || authUser.email.split("@")[0],
      avatarUrl: authUser.avatar || authUser.image,
    },
  })
}

export async function mutateSendEmail(input: {
  viewerEcoUserId: string
  to: string
  subject: string
  content: string
  label?: string | null
  cc?: string | null
  bcc?: string | null
  attachments?: unknown | null
}) {
  const recipient = await ensureEcoRecipientByEmail(input.to)
  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND")

  const attachmentsJson = normalizeAttachmentsInput(input.attachments)
  const toNorm = input.to.trim().toLowerCase()
  const ccList = parseAddressList(input.cc ?? undefined).filter(
    (e) => e !== toNorm
  )
  const bccSet = new Set(parseAddressList(input.bcc ?? undefined))
  for (const c of ccList) bccSet.delete(c)
  const bccList = [...bccSet]
  const ccDisplay = input.cc?.trim() ? input.cc.trim() : null
  const bccDisplay = input.bcc?.trim() ? input.bcc.trim() : null

  const basePayload = {
    subject: input.subject,
    content: input.content,
    label: normalizeIncomingEmailLabel(input.label ?? undefined),
    cc: ccDisplay,
    bcc: bccDisplay,
    attachments: attachmentsJson,
  }

  const sentRow = await prisma.ecoEmail.create({
    data: {
      ...basePayload,
      senderId: input.viewerEcoUserId,
      recipientId: recipient.id,
      isSent: true,
    },
    include: { sender: true },
  })

  await prisma.ecoEmail.create({
    data: {
      ...basePayload,
      senderId: input.viewerEcoUserId,
      recipientId: recipient.id,
      isSent: false,
    },
  })

  const extraEmails = [...new Set([...ccList, ...bccList])]
  for (const addr of extraEmails) {
    const u = await ensureEcoRecipientByEmail(addr)
    if (!u || u.id === recipient.id) continue
    await prisma.ecoEmail.create({
      data: {
        ...basePayload,
        senderId: input.viewerEcoUserId,
        recipientId: u.id,
        isSent: false,
      },
    })
  }

  try {
    const { sendTaskNotificationEmail } = await import(
      "@/lib/ecosystra/brevo-email"
    )
    await sendTaskNotificationEmail({
      taskId: sentRow.id,
      assigneeEmail: input.to,
      assigneeName: recipient.name,
      changes: {},
      deepLink: `${appBaseUrl()}/apps/email/inbox`,
      summary: input.subject,
    })
  } catch (e) {
    console.warn("[sendEmail] brevo send failed", e)
  }

  return formatEmailRow(sentRow as unknown as EcoEmailRow)
}

async function assertEmailAccess(viewerEcoUserId: string, id: string) {
  const row = await prisma.ecoEmail.findFirst({
    where: {
      id,
      OR: [{ recipientId: viewerEcoUserId }, { senderId: viewerEcoUserId }],
    },
  })
  if (!row) throw new Error("NOT_FOUND")
  return row
}

export async function mutateToggleStarEmail(
  viewerEcoUserId: string,
  id: string
) {
  const row = await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { starred: !row.starred, isStarred: !row.starred },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateMarkEmailRead(
  viewerEcoUserId: string,
  id: string
) {
  await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { read: true },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateMarkEmailUnread(
  viewerEcoUserId: string,
  id: string
) {
  await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { read: false },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateArchiveEmail(
  viewerEcoUserId: string,
  id: string
) {
  await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { isDeleted: true, isSpam: false },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateMarkEmailSpam(
  viewerEcoUserId: string,
  id: string
) {
  await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { isSpam: true, isDeleted: false },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateDeleteEmail(viewerEcoUserId: string, id: string) {
  const row = await prisma.ecoEmail.findFirst({
    where: {
      id,
      OR: [{ recipientId: viewerEcoUserId }, { senderId: viewerEcoUserId }],
    },
  })
  if (!row) {
    const stillThere = await prisma.ecoEmail.findUnique({ where: { id } })
    if (!stillThere) return true
    throw new Error("FORBIDDEN")
  }
  if (row.isDeleted) {
    await prisma.ecoEmail.delete({ where: { id } })
  } else {
    await prisma.ecoEmail.update({ where: { id }, data: { isDeleted: true } })
  }
  return true
}

export async function mutateSetEmailLabel(
  viewerEcoUserId: string,
  id: string,
  label: string
) {
  await assertEmailAccess(viewerEcoUserId, id)
  const t = label.trim().toLowerCase()
  let next: string | null
  if (!t) next = null
  else if (t === "personal" || t === "important" || t === "work") next = t
  else throw new Error("INVALID_LABEL")
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { label: next },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}

export async function mutateToggleMuteEmail(
  viewerEcoUserId: string,
  id: string
) {
  const row = await assertEmailAccess(viewerEcoUserId, id)
  const updated = await prisma.ecoEmail.update({
    where: { id },
    data: { muted: !row.muted },
    include: { sender: true },
  })
  return formatEmailRow(updated as unknown as EcoEmailRow)
}
