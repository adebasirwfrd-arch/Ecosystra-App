import { z } from "zod"

import { jsonError, jsonFromZodError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { jsonFromEmailMutationError } from "@/lib/email/email-mutation-http"
import { mutateSetEmailLabel } from "@/lib/email/email-mutations"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  label: z.string(),
})

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const sessionEmail = gate.session.user?.email
  if (!sessionEmail) {
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

  const { id } = await ctx.params
  const ecoUserId = await upsertEcoUserIdFromEmail(sessionEmail)
  try {
    const out = await mutateSetEmailLabel(ecoUserId, id, parsed.data.label)
    return jsonOk(out)
  } catch (e) {
    return jsonFromEmailMutationError(e)
  }
}
