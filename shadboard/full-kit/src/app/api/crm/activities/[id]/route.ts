import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

const patchSchema = z
  .object({
    type: z.string().min(1).optional(),
    iconName: z.string().min(1).optional(),
    fill: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: z.string().optional().nullable(),
    occurredAt: z.string().datetime().optional(),
    assignedMembers: z
      .array(
        z.object({
          name: z.string(),
          avatar: z.string(),
          href: z.string(),
        })
      )
      .optional(),
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
  const row = await db.crmActivity.update({
    where: { id },
    data: {
      ...v,
      occurredAt: v.occurredAt ? new Date(v.occurredAt) : undefined,
    },
  })
  return NextResponse.json({
    ...row,
    occurredAt: row.occurredAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  })
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  try {
    await db.crmActivity.delete({ where: { id } })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
