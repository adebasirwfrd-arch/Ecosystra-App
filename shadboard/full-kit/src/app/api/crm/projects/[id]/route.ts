import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const patchSchema = z
  .object({
    name: z.string().min(1).optional(),
    progress: z.number().min(0).max(100).optional(),
    startDate: z.string().datetime().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["On Track", "At Risk", "On Hold"]).optional(),
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
  const row = await db.crmProject.update({
    where: { id },
    data: {
      ...v,
      startDate: v.startDate ? new Date(v.startDate) : undefined,
      dueDate: v.dueDate ? new Date(v.dueDate) : undefined,
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

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  try {
    await db.crmProject.delete({ where: { id } })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
