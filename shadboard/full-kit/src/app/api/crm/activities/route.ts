import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const createSchema = z.object({
  type: z.string().min(1),
  iconName: z.string().min(1),
  fill: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.string().optional().nullable(),
  occurredAt: z.string().datetime(),
  assignedMembers: z.array(
    z.object({
      name: z.string(),
      avatar: z.string(),
      href: z.string(),
    })
  ),
})

export async function GET() {
  const rows = await db.crmActivity.findMany({
    orderBy: { occurredAt: "desc" },
    take: 100,
  })
  return NextResponse.json(
    rows.map((a) => ({
      ...a,
      occurredAt: a.occurredAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
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
  const row = await db.crmActivity.create({
    data: {
      type: v.type,
      iconName: v.iconName,
      fill: v.fill,
      title: v.title,
      description: v.description,
      status: v.status ?? null,
      occurredAt: new Date(v.occurredAt),
      assignedMembers: v.assignedMembers,
    },
  })
  return NextResponse.json({
    ...row,
    occurredAt: row.occurredAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  })
}
