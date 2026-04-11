import type { Metadata } from "next"
import Link from "next/link"

import { getCrmPagePayload } from "@/lib/crm/build-crm-dashboard-payload"

import { Button } from "@/components/ui/button"

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
} from "./types"

import { ActiveProjects } from "./_components/active-projects"
import { ActivityTimeline } from "./_components/activity-timeline"
import { CustomerSatisfaction } from "./_components/customer-satisfaction"
import { LeadSources } from "./_components/lead-sources"
import { Overview } from "./_components/overview"
import { RevenueTrend } from "./_components/revenue-trend"
import { SalesByCountry } from "./_components/sales-by-country"
import { SalesTrend } from "./_components/sales-trend"
import { TopSalesRepresentatives } from "./_components/top-sales-representatives"

export const metadata: Metadata = {
  title: "CRM",
}

export default async function CRMPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const b = await getCrmPagePayload()

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <div className="col-span-full flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Data from Supabase when deals exist; otherwise seeded JSON. Manage
          records in Sales Management.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${lang}/apps/sales-management`}>
            Open Sales Management
          </Link>
        </Button>
      </div>
      <Overview data={b.overview as OverviewType} />
      <div className="col-span-full grid gap-4 md:grid-cols-4">
        <SalesTrend data={b.salesTrendData as SalesTrendType} />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <RevenueTrend data={b.revenueTrendData as RevenueTrendType} />
          <LeadSources data={b.leadSourcesData as LeadSourceType} />
        </div>
      </div>
      <ActiveProjects data={b.activeProjectsData as ActiveProjectType[]} />
      <ActivityTimeline data={b.activityTimelineData as ActivityTimelineType} />
      <SalesByCountry data={b.salesByCountryData as SalesByCountryType} />
      <TopSalesRepresentatives
        data={b.salesRepresentativeData as SalesRepresentativeType}
      />
      <CustomerSatisfaction
        data={b.customerSatisfactionData as CustomerSatisfactionType}
      />
    </section>
  )
}
