import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"
import { jsonError } from "@/lib/api/http"

import type { Session } from "next-auth"
import type { NextResponse } from "next/server"

/** Route Handlers: require NextAuth session (modal.md §2.4 — verify user server-side). */
export async function requireApiSession(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { session: null, error: jsonError("Unauthorized", 401) }
  }
  return { session, error: null }
}

/**
 * Same as `requireApiSession` but requires `session.user.email` (EcoUser upsert / chat).
 */
export async function requireSessionWithEmail(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const gate = await requireApiSession()
  if (gate.error) return gate
  const email = gate.session.user?.email?.trim()
  if (!email) {
    return { session: null, error: jsonError("Session has no email", 401) }
  }
  return { session: gate.session, error: null }
}
