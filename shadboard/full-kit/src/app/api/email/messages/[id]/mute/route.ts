import { jsonError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { jsonFromEmailMutationError } from "@/lib/email/email-mutation-http"
import { mutateToggleMuteEmail } from "@/lib/email/email-mutations"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const sessionEmail = gate.session.user?.email
  if (!sessionEmail) {
    return jsonError("Session has no email", 401)
  }

  const { id } = await ctx.params
  const ecoUserId = await upsertEcoUserIdFromEmail(sessionEmail)
  try {
    const out = await mutateToggleMuteEmail(ecoUserId, id)
    return jsonOk(out)
  } catch (e) {
    return jsonFromEmailMutationError(e)
  }
}
