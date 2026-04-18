import { NextResponse } from "next/server"

import { processDueDateReminders } from "@/lib/ecosystra/due-date-reminders"

function authorizeCron(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return process.env.NODE_ENV === "development"
  }
  return req.headers.get("authorization") === `Bearer ${secret}`
}

/**
 * Daily (or on-demand) job: sends Brevo email reminders at 7, 3, and 1 calendar days before task due dates.
 * Secure with `Authorization: Bearer $CRON_SECRET` or Vercel Cron (`x-vercel-cron: 1`).
 */
export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const result = await processDueDateReminders()
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error("[cron/due-date-reminders]", e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "failed" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  return GET(req)
}
