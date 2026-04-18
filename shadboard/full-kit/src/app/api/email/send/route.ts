import { z } from "zod"

import { jsonError, jsonFromZodError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { jsonFromEmailMutationError } from "@/lib/email/email-mutation-http"
import { mutateSendEmail } from "@/lib/email/email-mutations"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  to: z.string().min(1),
  subject: z.string().min(1),
  content: z.string(),
  label: z.string().optional().nullable(),
  cc: z.string().optional().nullable(),
  bcc: z.string().optional().nullable(),
  attachments: z.unknown().optional().nullable(),
})

export async function POST(req: Request) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const email = gate.session.user?.email
  if (!email) {
    return jsonError("Session has no email", 401)
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return jsonError("Invalid JSON body", 400)
  }
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return jsonFromZodError(parsed.error)

  const ecoUserId = await upsertEcoUserIdFromEmail(email)
  try {
    const out = await mutateSendEmail({
      viewerEcoUserId: ecoUserId,
      ...parsed.data,
    })
    return jsonOk(out, 201)
  } catch (e) {
    return jsonFromEmailMutationError(e)
  }
}
