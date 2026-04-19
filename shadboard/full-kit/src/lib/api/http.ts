import { NextResponse } from "next/server"
import { ZodError } from "zod"

/** Standard JSON error body for Route Handlers. */
export function jsonError(
  message: string,
  status = 400,
  extras?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extras }, { status })
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonFromZodError(e: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      issues: e.flatten(),
    },
    { status: 422 }
  )
}

export function jsonFromUnknown(e: unknown, fallback = "Unexpected error") {
  if (e instanceof ZodError) return jsonFromZodError(e)
  const message =
    e instanceof Error ? e.message : typeof e === "string" ? e : fallback
  return jsonError(message, 500)
}
