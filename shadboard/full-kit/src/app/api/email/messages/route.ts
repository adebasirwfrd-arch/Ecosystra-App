import { z } from "zod"

import { jsonError, jsonFromZodError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { listEmailsForEcoUser } from "@/lib/email/email-inbox-queries"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

const querySchema = z.object({
  filter: z.string().min(1).default("inbox"),
})

/** REST read path for inbox (modal.md §2.4) — prefer over GraphQL when `NEXT_PUBLIC_EMAIL_API=rest`. */
export async function GET(req: Request) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const email = gate.session.user?.email
  if (!email) {
    return jsonError("Session has no email", 401)
  }

  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    filter: url.searchParams.get("filter") ?? "inbox",
  })
  if (!parsed.success) return jsonFromZodError(parsed.error)

  const ecoUserId = await upsertEcoUserIdFromEmail(email)
  const rows = await listEmailsForEcoUser(ecoUserId, parsed.data.filter)
  return jsonOk(rows)
}
