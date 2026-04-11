import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const patchSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    avatar: z.string().min(1).optional(),
    rating: z.number().min(0).max(5).optional(),
    feedbackMessage: z.string().min(1).optional(),
    createdAt: z.string().datetime().optional(),
  })
  .strict()

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const json = await req.json()
  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const v = parsed.data
  const row = await db.crmFeedback.update({
    where: { id },
    data: {
      ...v,
      createdAt: v.createdAt ? new Date(v.createdAt) : undefined,
    },
  })
  return NextResponse.json({
    ...row,
    rating: row.rating.toString(),
    createdAt: row.createdAt.toISOString(),
  })
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  try {
    await db.crmFeedback.delete({ where: { id } })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
