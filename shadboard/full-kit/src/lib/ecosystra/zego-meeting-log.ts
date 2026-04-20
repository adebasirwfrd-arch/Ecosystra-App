/**
 * Structured logs for ZEGO meeting flows. Grep: `[ecosystra:zego-meeting]`
 * Never log tokens, kit tokens, or server secrets.
 */

export const ZEGO_MEETING_LOG_PREFIX = "[ecosystra:zego-meeting]"

export type ZegoMeetingLogLevel = "debug" | "info" | "warn" | "error"

export type ZegoMeetingClientPayload = {
  runId: string
  phase: string
  level?: ZegoMeetingLogLevel
  /** Extra safe fields only (no secrets). */
  details?: Record<string, unknown>
  durationMs?: number
  errorName?: string
  errorMessage?: string
}

export function createZegoMeetingRunId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

function safeJson(payload: ZegoMeetingClientPayload): string {
  try {
    return JSON.stringify({
      t: new Date().toISOString(),
      ...payload,
    })
  } catch {
    return JSON.stringify({
      t: new Date().toISOString(),
      runId: payload.runId,
      phase: payload.phase,
      level: "error",
      details: { stringifyFailed: true },
    })
  }
}

/** Browser / client: one JSON line per event for easy copy from DevTools. */
export function zegoMeetingClientLog(payload: ZegoMeetingClientPayload): void {
  const level = payload.level ?? "info"
  const line = `${ZEGO_MEETING_LOG_PREFIX} ${safeJson(payload)}`
  switch (level) {
    case "debug":
      console.debug(line)
      break
    case "warn":
      console.warn(line)
      break
    case "error":
      console.error(line)
      break
    default:
      console.info(line)
  }
}

/** Optional: send errors to server log file via existing endpoint (no PII beyond message). */
export async function zegoMeetingReportClientError(payload: {
  runId: string
  phase: string
  message: string
  stack?: string
  extra?: Record<string, unknown>
}): Promise<void> {
  try {
    await fetch("/api/error-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "client",
        message: `${ZEGO_MEETING_LOG_PREFIX} ${payload.phase}: ${payload.message}`,
        stack: payload.stack,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        extra: {
          runId: payload.runId,
          ...payload.extra,
        },
      }),
    })
  } catch {
    /* non-fatal */
  }
}

/** Server (token route). Grep: `[ecosystra:zego-token]` — never pass secrets or full token. */
const ZEGO_TOKEN_LOG_PREFIX = "[ecosystra:zego-token]"

export function zegoTokenServerLog(
  payload: Record<string, unknown> & { phase: string }
): void {
  console.info(
    `${ZEGO_TOKEN_LOG_PREFIX} ${JSON.stringify({
      t: new Date().toISOString(),
      ...payload,
    })}`
  )
}
