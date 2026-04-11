import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const createSchema = z.object({
  name: z.string().min(1),
  progress: z.number().min(0).max(100),
  startDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: z.enum(["On Track", "At Risk", "On Hold"]),
})

export async function GET() {
  const rows = await db.crmProject.findMany({ orderBy: { dueDate: "asc" } })
  return NextResponse.json(
    rows.map((p) => ({
      ...p,
      startDate: p.startDate.toISOString(),
      dueDate: p.dueDate.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  )
}

export async function POST(req: Request) {
  const json = await req.json()
  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const v = parsed.data
  const row = await db.crmProject.create({
    data: {
      name: v.name,
      progress: v.progress,
      startDate: new Date(v.startDate),
      dueDate: new Date(v.dueDate),
      status: v.status,
    },
  })
  return NextResponse.json({
    ...row,
    startDate: row.startDate.toISOString(),
    dueDate: row.dueDate.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  })
}
