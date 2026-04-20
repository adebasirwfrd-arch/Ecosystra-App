import { z } from "zod"

import { jsonError, jsonFromZodError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { sendVideoMeetingInviteEmail } from "@/lib/ecosystra/brevo-email"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  roomId: z.string().min(1).max(200),
  taskTitle: z.string().min(1).max(500),
  groupName: z.string().max(300).optional().nullable(),
  recipientEmails: z
    .array(z.string().email())
    .min(1)
    .max(40),
  joinUrl: z.string().min(8).max(2000),
})

export async function POST(req: Request) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return jsonError("Invalid JSON body", 400)
  }
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return jsonFromZodError(parsed.error)

  const inviterName =
    gate.session.user?.name?.trim() ||
    gate.session.user?.email?.trim() ||
    "A teammate"

  const seen = new Set<string>()
  const emails = parsed.data.recipientEmails
    .map((e) => e.trim().toLowerCase())
    .filter((e) => {
      if (seen.has(e)) return false
      seen.add(e)
      return true
    })

  const selfEmail = gate.session.user?.email?.trim().toLowerCase()
  const filtered = selfEmail
    ? emails.filter((e) => e !== selfEmail)
    : emails

  if (filtered.length === 0) {
    return jsonError("No recipients after deduplication", 400)
  }

  let sent = 0
  const failures: string[] = []
  for (const toEmail of filtered) {
    const r = await sendVideoMeetingInviteEmail({
      toEmail,
      toName: null,
      taskTitle: parsed.data.taskTitle,
      groupName: parsed.data.groupName,
      roomId: parsed.data.roomId,
      joinUrl: parsed.data.joinUrl,
      inviterName,
    })
    if (r.ok) sent++
    else failures.push(toEmail)
  }

  return jsonOk({
    sent,
    failed: failures.length,
    failedEmails: failures,
  })
}
