import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().min(1),
})

export async function GET() {
  const rows = await db.crmSalesRep.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
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
  const row = await db.crmSalesRep.create({ data: v })
  return NextResponse.json({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  })
}
