import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"

import { CRM_DEAL_STAGES, CRM_LEAD_SOURCES } from "@/lib/crm/crm-constants"

export const dynamic = "force-dynamic"

const createSchema = z.object({
  title: z.string().min(1),
  companyName: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().optional(),
  stage: z.enum(CRM_DEAL_STAGES as unknown as [string, ...string[]]),
  leadSource: z.enum(CRM_LEAD_SOURCES as unknown as [string, ...string[]]),
  countryCode: z.string().min(2).max(8),
  countryName: z.string().min(1),
  ownerName: z.string().min(1),
  ownerEmail: z.string().email(),
  ownerAvatar: z.string().optional().nullable(),
  probability: z.number().min(0).max(100).optional().nullable(),
  expectedClose: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
})

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

export async function GET() {
  const rows = await db.crmDeal.findMany({ orderBy: { updatedAt: "desc" } })
  return NextResponse.json(rows.map(serialize))
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
  const closedAt =
    v.stage === "CLOSED_WON" || v.stage === "CLOSED_LOST" ? new Date() : null
  const row = await db.crmDeal.create({
    data: {
      title: v.title,
      companyName: v.companyName,
      amount: v.amount,
      currency: v.currency ?? "USD",
      stage: v.stage,
      leadSource: v.leadSource,
      countryCode: v.countryCode,
      countryName: v.countryName,
      ownerName: v.ownerName,
      ownerEmail: v.ownerEmail,
      ownerAvatar: v.ownerAvatar ?? null,
      probability: v.probability ?? null,
      expectedClose: v.expectedClose ? new Date(v.expectedClose) : null,
      notes: v.notes ?? null,
      closedAt,
    },
  })
  return NextResponse.json(serialize(row))
}
