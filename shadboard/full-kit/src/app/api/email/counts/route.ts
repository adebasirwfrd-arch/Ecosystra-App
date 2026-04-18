import { jsonError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { getEmailCountsForEcoUser } from "@/lib/email/email-inbox-queries"
import { upsertEcoUserIdFromEmail } from "@/lib/email/resolve-eco-user"

export const dynamic = "force-dynamic"

export async function GET() {
  const gate = await requireApiSession()
  if (gate.error) return gate.error

  const email = gate.session.user?.email
  if (!email) {
    return jsonError("Session has no email", 401)
  }

  const ecoUserId = await upsertEcoUserIdFromEmail(email)
  const counts = await getEmailCountsForEcoUser(ecoUserId)
  return jsonOk(counts)
}
