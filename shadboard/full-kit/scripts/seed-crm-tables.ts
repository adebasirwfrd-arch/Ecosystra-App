/**
 * Hydrates CRM tables from `scripts/seed/page-content.json` → `modules.crm`
 * so `/dashboards/crm` and `/apps/sales-management` share one source of truth.
 *
 * Safe: skips if `crm_deal` already has rows (use `pnpm db:seed-crm -- --force` to wipe CRM tables first).
 *
 * Run: pnpm db:seed-crm
 */
import { readFileSync } from "fs"
import { join } from "path"

import { config } from "dotenv"
import { endOfMonth, startOfMonth } from "date-fns"
import { Prisma, PrismaClient } from "@prisma/client"

import { CRM_LEAD_SOURCES } from "../src/lib/crm/crm-constants"

config({ path: ".env.local" })

const prisma = new PrismaClient()

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function monthIndex(label: string): number {
  const i = MONTH_NAMES.indexOf(label as (typeof MONTH_NAMES)[number])
  return i >= 0 ? i : 0
}

function randomBetween(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function randomTsInMonth(year: number, month0: number): Date {
  const start = startOfMonth(new Date(year, month0, 1))
  const end = endOfMonth(start)
  const t =
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  return new Date(t)
}

type CrmJson = Record<string, unknown>

async function main() {
  const force = process.argv.includes("--force")

  const raw = readFileSync(
    join(process.cwd(), "scripts/seed/page-content.json"),
    "utf8"
  )
  const { modules } = JSON.parse(raw) as { modules: { crm: CrmJson } }
  const crm = modules.crm

  const existing = await prisma.crmDeal.count()
  if (existing > 0 && !force) {
    console.log(
      "[seed-crm] crm_deal already has rows; skip (use --force to replace)."
    )
    return
  }

  if (force) {
    await prisma.$transaction([
      prisma.crmActivity.deleteMany(),
      prisma.crmFeedback.deleteMany(),
      prisma.crmProject.deleteMany(),
      prisma.crmSalesRep.deleteMany(),
      prisma.crmDeal.deleteMany(),
    ])
    console.log("[seed-crm] wiped CRM tables (--force)")
  }

  const salesTrendData = crm.salesTrendData as {
    monthly: Array<{
      month: string
      lead: number
      proposal: number
      negotiation: number
      closed: number
    }>
  }
  const salesByCountryData = crm.salesByCountryData as {
    countries: Array<{
      countryName: string
      countryCode: string
      sales: number
    }>
  }
  const salesRepresentativeData = crm.salesRepresentativeData as {
    representatives: Array<{
      name: string
      email: string
      avatar: string
      sales: number
    }>
  }
  const activityTimelineData = crm.activityTimelineData as {
    activities: Array<Record<string, unknown>>
  }
  const customerSatisfactionData = crm.customerSatisfactionData as {
    feedbacks: Array<Record<string, unknown>>
  }
  const activeProjectsData = crm.activeProjectsData as Array<{
    name: string
    progress: number
    startDate: string
    dueDate: string
    status: string
  }>

  await prisma.crmSalesRep.createMany({
    data: salesRepresentativeData.representatives.map((r) => ({
      name: r.name,
      email: r.email,
      avatar: r.avatar,
    })),
    skipDuplicates: true,
  })
  console.log("[seed-crm] crm_sales_rep")

  await prisma.crmFeedback.createMany({
    data: customerSatisfactionData.feedbacks.map((f) => ({
      name: String(f.name),
      email: String(f.email),
      avatar: String(f.avatar),
      rating: new Prisma.Decimal(String(f.rating)),
      feedbackMessage: String(f.feedbackMessage),
      createdAt: new Date(String(f.createdAt)),
    })),
  })
  console.log("[seed-crm] crm_feedback")

  await prisma.crmProject.createMany({
    data: activeProjectsData.map((p) => ({
      name: p.name,
      progress: p.progress,
      startDate: new Date(p.startDate),
      dueDate: new Date(p.dueDate),
      status: p.status,
    })),
  })
  console.log("[seed-crm] crm_project")

  await prisma.crmActivity.createMany({
    data: activityTimelineData.activities.map((a) => ({
      type: String(a.type),
      iconName: String(a.iconName),
      fill: String(a.fill),
      title: String(a.title),
      description: String(a.description),
      status: a.status != null ? String(a.status) : null,
      occurredAt: new Date(String(a.date)),
      assignedMembers: a.assignedMembers as Prisma.InputJsonValue,
    })),
  })
  console.log("[seed-crm] crm_activity")

  const year = 2025
  const countries = salesByCountryData.countries
  const reps = salesRepresentativeData.representatives
  const dealsToCreate: Prisma.CrmDealCreateManyInput[] = []

  let dealSeq = 0
  const pushDeals = (
    count: number,
    stage: string,
    monthLabel: string,
    amountRange: [number, number]
  ) => {
    const m = monthIndex(monthLabel)
    for (let i = 0; i < count; i++) {
      const rep = reps[dealSeq % reps.length]
      const geo = countries[dealSeq % countries.length]
      const src = CRM_LEAD_SOURCES[dealSeq % CRM_LEAD_SOURCES.length]
      const createdAt = randomTsInMonth(year, m)
      const isClosed = stage === "CLOSED_WON"
      const isLost = stage === "CLOSED_LOST"
      const amount = randomBetween(amountRange[0], amountRange[1])
      dealSeq += 1
      dealsToCreate.push({
        title: `${monthLabel.slice(0, 3)} ${stage} #${dealSeq}`,
        companyName: `${geo.countryName.split(" ")[0]} Corp ${dealSeq}`,
        amount,
        currency: "USD",
        stage,
        leadSource: src,
        countryCode: geo.countryCode,
        countryName: geo.countryName,
        ownerName: rep.name,
        ownerEmail: rep.email,
        ownerAvatar: rep.avatar,
        probability:
          stage === "NEGOTIATION"
            ? randomBetween(40, 85)
            : stage === "PROPOSAL"
              ? randomBetween(15, 45)
              : null,
        expectedClose:
          !isClosed && !isLost
            ? endOfMonth(randomTsInMonth(year, Math.min(11, m + 2)))
            : null,
        notes: null,
        closedAt:
          isClosed || isLost
            ? randomTsInMonth(year, m)
            : null,
        createdAt,
      })
    }
  }

  const scale = (n: number) => Math.max(1, Math.round(n / 32))

  for (const row of salesTrendData.monthly) {
    const label = row.month
    pushDeals(scale(row.lead), "LEAD", label, [800, 9000])
    pushDeals(scale(row.proposal), "PROPOSAL", label, [2000, 22000])
    pushDeals(scale(row.negotiation), "NEGOTIATION", label, [5000, 45000])
    pushDeals(scale(row.closed), "CLOSED_WON", label, [8000, 95000])
  }

  for (let i = 0; i < 24; i++) {
    const label = MONTH_NAMES[i % 12]
    pushDeals(1, "CLOSED_LOST", label, [1000, 8000])
  }

  const batchSize = 200
  for (let i = 0; i < dealsToCreate.length; i += batchSize) {
    const chunk = dealsToCreate.slice(i, i + batchSize)
    await prisma.crmDeal.createMany({ data: chunk })
  }
  console.log("[seed-crm] crm_deal ×", dealsToCreate.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
