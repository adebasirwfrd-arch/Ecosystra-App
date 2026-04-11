import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

import { CRM_DEAL_STAGES, CRM_LEAD_SOURCES } from "@/lib/crm/crm-constants"

const patchSchema = z
  .object({
    title: z.string().min(1).optional(),
    companyName: z.string().min(1).optional(),
    amount: z.number().nonnegative().optional(),
    currency: z.string().optional(),
    stage: z
      .enum(CRM_DEAL_STAGES as unknown as [string, ...string[]])
      .optional(),
    leadSource: z
      .enum(CRM_LEAD_SOURCES as unknown as [string, ...string[]])
      .optional(),
    countryCode: z.string().min(2).max(8).optional(),
    countryName: z.string().min(1).optional(),
    ownerName: z.string().min(1).optional(),
    ownerEmail: z.string().email().optional(),
    ownerAvatar: z.string().optional().nullable(),
    probability: z.number().min(0).max(100).optional().nullable(),
    expectedClose: z.string().datetime().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .strict()

function serialize(d: {
  id: string
  title: string
  companyName: string
  amount: { toString(): string }
  currency: string
  stage: string
  leadSource: string
  countryCode: string
  countryName: string
  ownerName: string
  ownerEmail: string
  ownerAvatar: string | null
  probability: number | null
  expectedClose: Date | null
  notes: string | null
  closedAt: Date | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...d,
    amount: d.amount.toString(),
    expectedClose: d.expectedClose?.toISOString() ?? null,
    closedAt: d.closedAt?.toISOString() ?? null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }
}

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
  const existing = await db.crmDeal.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const nextStage = v.stage ?? existing.stage
  let closedAt = existing.closedAt
  if (nextStage === "CLOSED_WON" || nextStage === "CLOSED_LOST") {
    closedAt = closedAt ?? new Date()
  } else {
    closedAt = null
  }

  const row = await db.crmDeal.update({
    where: { id },
    data: {
      ...v,
      expectedClose: v.expectedClose
        ? new Date(v.expectedClose)
        : v.expectedClose === null
          ? null
          : undefined,
      closedAt,
    },
  })
  return NextResponse.json(serialize(row))
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  try {
    await db.crmDeal.delete({ where: { id } })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
