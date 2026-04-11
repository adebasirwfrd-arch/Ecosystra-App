import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().min(1),
  rating: z.number().min(0).max(5),
  feedbackMessage: z.string().min(1),
  createdAt: z.string().datetime().optional(),
})

export async function GET() {
  const rows = await db.crmFeedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  return NextResponse.json(
    rows.map((f) => ({
      ...f,
      rating: f.rating.toString(),
      createdAt: f.createdAt.toISOString(),
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
  const row = await db.crmFeedback.create({
    data: {
      name: v.name,
      email: v.email,
      avatar: v.avatar,
      rating: v.rating,
      feedbackMessage: v.feedbackMessage,
      createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
    },
  })
  return NextResponse.json({
    ...row,
    rating: row.rating.toString(),
    createdAt: row.createdAt.toISOString(),
  })
}
