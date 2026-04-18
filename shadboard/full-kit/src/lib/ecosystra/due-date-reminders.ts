import { format, isValid, parse } from "date-fns"
import { Prisma } from "@/generated/prisma"
import { db as prisma } from "@/lib/prisma"
import { buildEcosystraBoardAbsoluteUrl } from "./app-url"
import { sendDueDateReminderEmail } from "./brevo-email"

export type DueReminderWindow = "7d" | "3d" | "1d"

/** Calendar math for reminders (due dates are plain dates, interpreted in WIB). */
const JAKARTA_TZ = "Asia/Jakarta"

function todayIsoInJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function parseIsoParts(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!m) return null
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) }
}

/** Whole calendar days from `fromIso` to `toIso` (YYYY-MM-DD). */
function calendarDaysBetweenIso(fromIso: string, toIso: string): number {
  const a = parseIsoParts(fromIso)
  const b = parseIsoParts(toIso)
  if (!a || !b) return NaN
  const t0 = Date.UTC(a.y, a.m - 1, a.d)
  const t1 = Date.UTC(b.y, b.m - 1, b.d)
  return Math.round((t1 - t0) / 86400000)
}

function formatDueIsoForEmail(iso: string): string {
  const p = parseIsoParts(iso)
  if (!p) return iso
  const d = new Date(Date.UTC(p.y, p.m - 1, p.d))
  return new Intl.DateTimeFormat("en-US", {
    timeZone: JAKARTA_TZ,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

function readAssigneeUserIdsFromDynamic(
  d: Record<string, unknown> | undefined
): string[] {
  if (!d) return []
  const raw = d.assigneeUserIds
  if (Array.isArray(raw)) {
    return [...new Set(raw.map((x) => String(x)).filter(Boolean))]
  }
  const single = d.assigneeUserId
  if (typeof single === "string" && single.trim()) return [single.trim()]
  return []
}

function inferIsoFromDisplay(dueDate: string): string | null {
  const trimmed = dueDate.trim()
  if (!trimmed || trimmed === "—") return null
  const ty = parseIsoParts(todayIsoInJakarta())?.y ?? new Date().getFullYear()
  const candidates = [ty, ty + 1, ty - 1]
  const refParse = new Date()
  for (const year of candidates) {
    const dt = parse(`${trimmed}, ${year}`, "MMM d, yyyy", refParse)
    if (isValid(dt)) {
      return format(dt, "yyyy-MM-dd")
    }
  }
  return null
}

function resolveDueDateIso(d: Record<string, unknown>): string | null {
  const raw = d.dueDateIso
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
    return raw.trim()
  }
  const disp = d.dueDate
  if (typeof disp === "string") return inferIsoFromDisplay(disp)
  return null
}

function reminderAlreadySent(
  d: Record<string, unknown>,
  window: DueReminderWindow,
  dueIso: string
): boolean {
  const raw = d.dueReminderFired
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false
  const key = `${window}:${dueIso}`
  return Boolean((raw as Record<string, unknown>)[key])
}

function buildReminderPatch(
  prev: Record<string, unknown>,
  window: DueReminderWindow,
  dueIso: string
): Record<string, unknown> {
  const prevFired =
    prev.dueReminderFired &&
    typeof prev.dueReminderFired === "object" &&
    !Array.isArray(prev.dueReminderFired)
      ? { ...(prev.dueReminderFired as Record<string, unknown>) }
      : {}
  prevFired[`${window}:${dueIso}`] = new Date().toISOString()
  return { ...prev, dueReminderFired: prevFired }
}

function isDoneStatus(status: unknown): boolean {
  if (typeof status !== "string") return false
  const s = status.trim().toLowerCase()
  return s === "done" || s === "complete" || s === "completed"
}

function boardTaskDeepLink(taskId: string): string {
  return buildEcosystraBoardAbsoluteUrl({ task: taskId })
}

type ItemRow = {
  id: string
  name: string
  dynamicData: unknown
  createdByUserId: string | null
  boardName: string | null
  groupName: string | null
}

/**
 * Scans top-level tasks with due dates and sends Brevo reminders at 7 / 3 / 1 **calendar** days before due
 * (**Asia/Jakarta, GMT+7**). Idempotent per (task, window, dueIso) via `dynamicData.dueReminderFired`.
 */
export async function processDueDateReminders(): Promise<{
  scanned: number
  sent: number
  skipped: number
}> {
  const todayJakarta = todayIsoInJakarta()
  const rows = await prisma.$queryRaw<ItemRow[]>(Prisma.sql`
    SELECT
      i.id,
      i.name,
      i."dynamicData" AS "dynamicData",
      i."createdByUserId" AS "createdByUserId",
      b.name AS "boardName",
      g.name AS "groupName"
    FROM public."Item" i
    LEFT JOIN public."Board" b ON b.id = i."boardId"
    LEFT JOIN public."Group" g ON g.id = i."groupId"
    WHERE i."parentItemId" IS NULL
      AND (
        (i."dynamicData"->>'dueDateIso') IS NOT NULL
        AND (i."dynamicData"->>'dueDateIso') <> ''
        OR (i."dynamicData"->>'dueDate') IS NOT NULL
        AND (i."dynamicData"->>'dueDate') <> ''
        AND (i."dynamicData"->>'dueDate') <> '—'
      )
  `)

  let sent = 0
  let skipped = 0

  for (const row of rows) {
    const d = (row.dynamicData as Record<string, unknown>) || {}
    if (isDoneStatus(d.taskStatus)) {
      skipped++
      continue
    }

    const dueIso = resolveDueDateIso(d)
    if (!dueIso) {
      skipped++
      continue
    }

    const diff = calendarDaysBetweenIso(todayJakarta, dueIso)
    if (diff < 0 || Number.isNaN(diff)) {
      skipped++
      continue
    }
    const window: DueReminderWindow | null =
      diff === 7 ? "7d" : diff === 3 ? "3d" : diff === 1 ? "1d" : null
    if (!window) {
      skipped++
      continue
    }

    if (reminderAlreadySent(d, window, dueIso)) {
      skipped++
      continue
    }

    const ownerId =
      (typeof d.ownerUserId === "string" && d.ownerUserId.trim()
        ? d.ownerUserId.trim()
        : null) || row.createdByUserId
    const assigneeIds = readAssigneeUserIdsFromDynamic(d)
    const userIds = [...new Set([...(ownerId ? [ownerId] : []), ...assigneeIds])]
    if (userIds.length === 0) {
      skipped++
      continue
    }

    const users = await prisma.ecoUser.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, name: true },
    })
    const byId = new Map(users.map((u) => [u.id, u]))
    const recipients: { email: string; name: string | null }[] = []
    const seen = new Set<string>()
    for (const uid of userIds) {
      const u = byId.get(uid)
      const email = u?.email?.trim()
      if (!email || seen.has(email.toLowerCase())) continue
      seen.add(email.toLowerCase())
      recipients.push({ email, name: u?.name ?? null })
    }
    if (recipients.length === 0) {
      skipped++
      continue
    }

    const dueDisplay =
      (typeof d.dueDate === "string" && d.dueDate.trim()) ||
      formatDueIsoForEmail(dueIso)
    const deepLink = boardTaskDeepLink(row.id)
    const windowLabel =
      window === "7d" ? "7 days" : window === "3d" ? "3 days" : "1 day"

    let anyOk = false
    for (const r of recipients) {
      const ok = await sendDueDateReminderEmail({
        toEmail: r.email,
        toName: r.name,
        taskName: row.name,
        boardName: row.boardName || "Board",
        groupName: row.groupName,
        dueDateDisplay: dueDisplay,
        dueDateIso: dueIso,
        windowKey: window,
        windowLabel,
        deepLink,
        taskStatus: typeof d.taskStatus === "string" ? d.taskStatus : null,
        priority: typeof d.priority === "string" ? d.priority : null,
      })
      if (ok) anyOk = true
    }

    if (anyOk) {
      const nextDynamic = buildReminderPatch(d, window, dueIso)
      await prisma.ecoItem.update({
        where: { id: row.id },
        data: { dynamicData: nextDynamic as object },
      })
      sent++
    } else {
      skipped++
    }
  }

  return { scanned: rows.length, sent, skipped }
}
