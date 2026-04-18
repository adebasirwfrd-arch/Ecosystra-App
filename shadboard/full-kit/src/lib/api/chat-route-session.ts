import "server-only"

import { ensureEcoUserFromSession } from "@/lib/chat-server"

import { jsonError } from "@/lib/api/http"
import { requireSessionWithEmail } from "@/lib/api/route-session"

import type { NextResponse } from "next/server"

type EcoUserRow = NonNullable<
  Awaited<ReturnType<typeof ensureEcoUserFromSession>>
>

/** Chat Route Handlers: verified session + Eco user row. */
export async function requireChatEcoUser(): Promise<
  { eco: EcoUserRow; error: null } | { eco: null; error: NextResponse }
> {
  const gate = await requireSessionWithEmail()
  if (gate.error) return { eco: null, error: gate.error }
  const eco = await ensureEcoUserFromSession(gate.session)
  if (!eco) return { eco: null, error: jsonError("Unauthorized", 401) }
  return { eco, error: null }
}
