import { jsonError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { jsonFromEmailMutationError } from "@/lib/email/email-mutation-http"
import { mutateDeleteEmail } from "@/lib/email/email-mutations"
import { getEmailByIdForEcoUser } from "@/lib/email/email-inbox-queries"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const email = gate.session.user?.email
  if (!email) {
    return jsonError("Session has no email", 401)
  }

  const { id } = await ctx.params
  const ecoUserId = await upsertEcoUserIdFromEmail(email)
  const row = await getEmailByIdForEcoUser(ecoUserId, id)
  if (!row) {
    return jsonError("Not found", 404)
  }
  return jsonOk(row)
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const email = gate.session.user?.email
  if (!email) {
    return jsonError("Session has no email", 401)
  }

  const { id } = await ctx.params
  const ecoUserId = await upsertEcoUserIdFromEmail(email)
  try {
    await mutateDeleteEmail(ecoUserId, id)
    return jsonOk({ ok: true })
  } catch (e) {
    return jsonFromEmailMutationError(e)
  }
}
