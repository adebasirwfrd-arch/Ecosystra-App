import { NextResponse } from "next/server"
import { z } from "zod"

import { jsonError, jsonFromZodError, jsonOk } from "@/lib/api/http"
import { requireApiSession } from "@/lib/api/route-session"
import { zegoTokenServerLog } from "@/lib/ecosystra/zego-meeting-log"
import { normalizeZegoServerSecret } from "@/lib/zego/zego-secret"
import { generateToken04 } from "@/lib/zego/zegoServerAssistant"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  roomID: z.string().min(1).max(128),
})

function sanitizeZegoUserId(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9_-]/g, "_")
  return s.length > 0 ? s.slice(0, 64) : "user"
}

export async function POST(req: Request) {
  const reqId = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const t0 = Date.now()

  zegoTokenServerLog({
    phase: "request_received",
    reqId,
  })

  const gate = await requireApiSession()
  if (gate.error) {
    zegoTokenServerLog({
      phase: "auth_failed",
      reqId,
      durationMs: Date.now() - t0,
    })
    return gate.error
  }

  const sessionUserId = String(gate.session.user?.id ?? "")
  zegoTokenServerLog({
    phase: "auth_ok",
    reqId,
    sessionUserIdLen: sessionUserId.length,
    sessionUserIdPrefix: sessionUserId.slice(0, 8),
  })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    zegoTokenServerLog({
      phase: "error_invalid_json",
      reqId,
      durationMs: Date.now() - t0,
    })
    return jsonError("Invalid JSON body", 400)
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    zegoTokenServerLog({
      phase: "error_validation",
      reqId,
      durationMs: Date.now() - t0,
    })
    return jsonFromZodError(parsed.error)
  }

  const appIdRaw =
    process.env.ZEGO_APP_ID ?? process.env.NEXT_PUBLIC_ZEGO_APP_ID
  const secretRaw = process.env.ZEGO_SERVER_SECRET
  if (!appIdRaw || !secretRaw) {
    zegoTokenServerLog({
      phase: "error_env_missing",
      reqId,
      hasAppId: Boolean(appIdRaw),
      hasSecret: Boolean(secretRaw),
      durationMs: Date.now() - t0,
    })
    return jsonError("Zego is not configured on the server", 503)
  }

  const appID = Number(appIdRaw)
  if (!Number.isFinite(appID) || appID <= 0) {
    zegoTokenServerLog({
      phase: "error_app_id_invalid",
      reqId,
      durationMs: Date.now() - t0,
    })
    return jsonError("Invalid ZEGO_APP_ID", 503)
  }

  let secret: string
  try {
    secret = normalizeZegoServerSecret(secretRaw)
  } catch (e) {
    zegoTokenServerLog({
      phase: "error_secret_normalize",
      reqId,
      message: e instanceof Error ? e.message : String(e),
      durationMs: Date.now() - t0,
    })
    return jsonError(
      e instanceof Error ? e.message : "Invalid server secret",
      503
    )
  }

  const userID = sanitizeZegoUserId(String(gate.session.user?.id ?? "user"))

  const { roomID } = parsed.data
  zegoTokenServerLog({
    phase: "inputs_ready",
    reqId,
    appID,
    roomIDLen: roomID.length,
    zegoUserIDLen: userID.length,
    payloadPrivilege: "login+publish",
  })

  const payload = JSON.stringify({
    room_id: roomID,
    privilege: {
      1: 1,
      2: 1,
    },
    stream_id_list: null,
  })

  try {
    const token = generateToken04(appID, userID, secret, 3600, payload)
    zegoTokenServerLog({
      phase: "token_ok",
      reqId,
      appID,
      tokenLen: token.length,
      tokenPrefix: token.slice(0, 6),
      durationMs: Date.now() - t0,
    })
    return jsonOk({ token, appID })
  } catch (e: unknown) {
    if (e instanceof Error) {
      zegoTokenServerLog({
        phase: "error_generate_token_exception",
        reqId,
        message: e.message,
        name: e.name,
        durationMs: Date.now() - t0,
      })
      return NextResponse.json(
        { error: e.message || "Token generation failed" },
        { status: 500 }
      )
    }
    const msg =
      e &&
      typeof e === "object" &&
      "errorMessage" in e &&
      typeof (e as { errorMessage: unknown }).errorMessage === "string"
        ? (e as { errorMessage: string }).errorMessage
        : "Token generation failed"
    zegoTokenServerLog({
      phase: "error_generate_token_object",
      reqId,
      message: msg,
      durationMs: Date.now() - t0,
    })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
