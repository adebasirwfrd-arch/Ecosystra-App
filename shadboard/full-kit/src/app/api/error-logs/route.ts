import { NextResponse } from "next/server"

import { writeErrorLog } from "@/lib/error-logger"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      source?: "client" | "server" | "boundary"
      message?: string
      stack?: string
      url?: string
      userAgent?: string
      extra?: Record<string, unknown>
    }

    if (!body?.message) {
      return NextResponse.json(
        { message: "Missing error message." },
        { status: 400 }
      )
    }

    await writeErrorLog({
      source: body.source || "client",
      message: body.message,
      stack: body.stack,
      url: body.url,
      userAgent: body.userAgent,
      extra: body.extra,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to store error log.",
      },
      { status: 500 }
    )
  }
}
