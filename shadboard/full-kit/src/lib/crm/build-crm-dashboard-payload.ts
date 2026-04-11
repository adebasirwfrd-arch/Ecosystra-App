import {
  endOfMonth,
  format,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns"

import { db } from "@/lib/prisma"

import { getShadboardPageContent } from "../get-shadboard-page-content"

import type {
  ActiveProjectType,
  ActivityTimelineType,
  CustomerSatisfactionType,
  LeadSourceType,
  OverviewType,
  RevenueTrendType,
  SalesByCountryType,
  SalesRepresentativeType,
  SalesTrendType,
} from "@/app/[lang]/(dashboard-layout)/dashboards/crm/types"

function num(d: { toString(): string } | null | undefined): number {
  if (d == null) return 0
  return Number(d.toString())
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Builds the same JSON shape as `page-content.json` → `modules.crm`, either from
 * Supabase CRM tables (when at least one deal exists) or from seeded page content.
 */
export async function getCrmPagePayload(): Promise<Record<string, unknown>> {
  let dealCount = 0
  try {
    dealCount = await db.crmDeal.count()
  } catch {
    return getShadboardPageContent("crm")
  }

  if (dealCount === 0) {
    return getShadboardPageContent("crm")
  }

  const [deals, projects, activities, feedbacks, reps, jsonFallback] =
    await Promise.all([
      db.crmDeal.findMany(),
      db.crmProject.findMany({ orderBy: { dueDate: "asc" } }),
      db.crmActivity.findMany({ orderBy: { occurredAt: "desc" }, take: 40 }),
      db.crmFeedback.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      db.crmSalesRep.findMany(),
      getShadboardPageContent("crm"),
    ])

  const now = new Date()
  const d30 = subDays(now, 30)
  const d60 = subDays(now, 60)

  const closedWon = deals.filter((x) => x.stage === "CLOSED_WON")
  const sumClosedInRange = (from: Date, to: Date) =>
    closedWon
      .filter((x) => {
        const t = x.closedAt ?? x.updatedAt
        return t >= from && t <= to
      })
      .reduce((s, x) => s + num(x.amount), 0)

  const salesLast30 = sumClosedInRange(d30, now)
  const salesPrev30 = sumClosedInRange(d60, d30)

  const profitLast30 = salesLast30 * 0.28
  const profitPrev30 = salesPrev30 * 0.28

  const negLast30 = deals
    .filter((x) => x.stage === "NEGOTIATION" && x.createdAt >= d30)
    .reduce((s, x) => s + num(x.amount) * ((x.probability ?? 50) / 100), 0)
  const negPrev30 = deals
    .filter(
      (x) =>
        x.stage === "NEGOTIATION" &&
        x.createdAt >= d60 &&
        x.createdAt < d30
    )
    .reduce((s, x) => s + num(x.amount) * ((x.probability ?? 50) / 100), 0)

  const newLeadsLast30 = deals.filter(
    (x) => x.stage === "LEAD" && x.createdAt >= d30
  ).length
  const newLeadsPrev30 = deals.filter(
    (x) =>
      x.stage === "LEAD" && x.createdAt >= d60 && x.createdAt < d30
  ).length

  const overview: OverviewType = {
    totalSales: {
      period: "Last 30 days",
      value: Math.round(salesLast30),
      percentageChange: pctChange(salesLast30, salesPrev30),
    },
    totalProfit: {
      period: "Last 30 days",
      value: Math.round(profitLast30),
      percentageChange: pctChange(profitLast30, profitPrev30),
    },
    revenueGrowth: {
      period: "Last 30 days",
      value: Math.round(negLast30),
      percentageChange: pctChange(negLast30, negPrev30),
    },
    newCustomers: {
      period: "Last 30 days",
      value: newLeadsLast30,
      percentageChange: pctChange(newLeadsLast30, newLeadsPrev30),
    },
  }

  const months: { label: string; start: Date; end: Date }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i)
    months.push({
      label: format(d, "MMMM"),
      start: startOfMonth(d),
      end: endOfMonth(d),
    })
  }

  const monthlyTrend: SalesTrendType["monthly"] = months.map(
    ({ label, start, end }) => {
      const inMonth = deals.filter(
        (x) => x.createdAt >= start && x.createdAt <= end
      )
      return {
        month: label,
        lead: inMonth.filter((x) => x.stage === "LEAD").length,
        proposal: inMonth.filter((x) => x.stage === "PROPOSAL").length,
        negotiation: inMonth.filter((x) => x.stage === "NEGOTIATION").length,
        closed: inMonth.filter((x) => x.stage === "CLOSED_WON").length,
      }
    }
  )

  const summary = monthlyTrend.reduce(
    (acc, m) => ({
      totalLead: acc.totalLead + m.lead,
      totalProposal: acc.totalProposal + m.proposal,
      totalNegotiation: acc.totalNegotiation + m.negotiation,
      totalClosed: acc.totalClosed + m.closed,
    }),
    { totalLead: 0, totalProposal: 0, totalNegotiation: 0, totalClosed: 0 }
  )

  const salesTrendData: SalesTrendType = {
    period: "Last 12 months",
    summary,
    monthly: monthlyTrend,
  }

  const revenueTrends = months.map(({ label, start, end }) => {
    const rev = closedWon
      .filter((x) => {
        const t = x.closedAt ?? x.updatedAt
        return t >= start && t <= end
      })
      .reduce((s, x) => s + num(x.amount), 0)
    return { month: label, revenue: Math.round(rev) }
  })

  const totalRevenue = revenueTrends.reduce((s, x) => s + x.revenue, 0)
  const half = Math.floor(revenueTrends.length / 2)
  const firstHalf = revenueTrends.slice(0, half).reduce((s, x) => s + x.revenue, 0)
  const secondHalf = revenueTrends.slice(half).reduce((s, x) => s + x.revenue, 0)
  const totalPercentageChange = pctChange(secondHalf, firstHalf || 1) / 100

  const revenueTrendData: RevenueTrendType = {
    period: format(now, "yyyy"),
    summary: {
      totalRevenue,
      totalPercentageChange,
    },
    revenueTrends,
  }

  const leadBuckets: LeadSourceType["leads"] = {
    socialMedia: 0,
    emailCampaigns: 0,
    referrals: 0,
    website: 0,
    other: 0,
  }
  for (const d of deals) {
    const k = d.leadSource as keyof typeof leadBuckets
    if (k in leadBuckets) leadBuckets[k] += 1
    else leadBuckets.other += 1
  }

  const leadSourcesData: LeadSourceType = {
    period: "All deals",
    summary: { totalLeads: deals.length },
    leads: leadBuckets,
  }

  const countryMap = new Map<
    string,
    { countryName: string; countryCode: string; sales: number }
  >()
  for (const d of closedWon) {
    const code = d.countryCode
    const prev = countryMap.get(code) ?? {
      countryName: d.countryName,
      countryCode: code,
      sales: 0,
    }
    prev.sales += num(d.amount)
    countryMap.set(code, prev)
  }
  const countries = [...countryMap.values()].sort((a, b) => b.sales - a.sales)

  const salesByCountryData: SalesByCountryType = {
    period: "Closed-won total",
    countries,
  }

  const repTotals = new Map<
    string,
    { name: string; email: string; avatar: string; sales: number }
  >()
  for (const d of closedWon) {
    const k = d.ownerEmail
    const cur = repTotals.get(k) ?? {
      name: d.ownerName,
      email: d.ownerEmail,
      avatar: d.ownerAvatar ?? "/images/avatars/male-01.svg",
      sales: 0,
    }
    cur.sales += num(d.amount)
    if (d.ownerAvatar) cur.avatar = d.ownerAvatar
    repTotals.set(k, cur)
  }
  const fromReps = [...repTotals.values()].sort((a, b) => b.sales - a.sales)

  const repByEmail = new Map(reps.map((r) => [r.email, r]))
  const representatives = fromReps.slice(0, 8).map((r) => {
    const row = repByEmail.get(r.email)
    return {
      name: r.name,
      email: r.email,
      avatar: row?.avatar ?? r.avatar,
      sales: Math.round(r.sales),
    }
  })

  const salesRepresentativeData: SalesRepresentativeType =
    representatives.length > 0
      ? {
          period: "Closed-won revenue by owner",
          representatives,
        }
      : (jsonFallback.salesRepresentativeData as SalesRepresentativeType)

  const customerSatisfactionData: CustomerSatisfactionType =
    feedbacks.length > 0
      ? (() => {
          const avgRating =
            feedbacks.reduce((s, f) => s + num(f.rating), 0) /
            feedbacks.length
          return {
            period: "Feedback entries",
            summary: {
              name: "Average rating",
              value: Math.round(avgRating * 10) / 10,
            },
            feedbacks: feedbacks.map((f) => ({
              name: f.name,
              email: f.email,
              avatar: f.avatar,
              rating: num(f.rating),
              feedbackMessage: f.feedbackMessage,
              createdAt: f.createdAt,
            })),
          }
        })()
      : (jsonFallback.customerSatisfactionData as CustomerSatisfactionType)

  const activeProjectsData: ActiveProjectType[] =
    projects.length > 0
      ? projects.map((p) => ({
          name: p.name,
          progress: p.progress,
          startDate: p.startDate,
          dueDate: p.dueDate,
          status: p.status as ActiveProjectType["status"],
        }))
      : (jsonFallback.activeProjectsData as ActiveProjectType[]).map((p) => ({
          ...p,
          startDate:
            p.startDate instanceof Date
              ? p.startDate
              : new Date(String(p.startDate)),
          dueDate:
            p.dueDate instanceof Date ? p.dueDate : new Date(String(p.dueDate)),
        }))

  const activityTimelineData: ActivityTimelineType =
    activities.length > 0
      ? {
          period: "Recent",
          activities: activities.map((a) => ({
            type: a.type as ActivityTimelineType["activities"][0]["type"],
            iconName: a.iconName as ActivityTimelineType["activities"][0]["iconName"],
            fill: a.fill,
            title: a.title,
            description: a.description,
            status: a.status ?? undefined,
            date: a.occurredAt.toISOString(),
            assignedMembers: a.assignedMembers as ActivityTimelineType["activities"][0]["assignedMembers"],
          })),
        }
      : (jsonFallback.activityTimelineData as ActivityTimelineType)

  return {
    overview,
    salesTrendData,
    revenueTrendData,
    leadSourcesData,
    salesByCountryData,
    salesRepresentativeData,
    customerSatisfactionData,
    activeProjectsData,
    activityTimelineData,
  }
}
