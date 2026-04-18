import { jsonError } from "@/lib/api/http"

import type { NextResponse } from "next/server"

export function jsonFromEmailMutationError(e: unknown): NextResponse {
  const msg = e instanceof Error ? e.message : "Server error"
  if (msg === "NOT_FOUND") return jsonError("Not found", 404)
  if (msg === "FORBIDDEN") return jsonError("Forbidden", 403)
  if (msg === "RECIPIENT_NOT_FOUND") {
    return jsonError("Recipient not found", 400)
  }
  if (msg === "INVALID_LABEL") return jsonError("Invalid label", 400)
  if (msg === "UNAUTHORIZED") return jsonError("Unauthorized", 401)
  if (
    msg === "INVALID_ATTACHMENTS" ||
    msg === "ATTACHMENT_TOO_LARGE" ||
    msg === "ATTACHMENTS_TOO_LARGE"
  ) {
    return jsonError(msg, 400)
  }
  return jsonError(msg, 500)
}
