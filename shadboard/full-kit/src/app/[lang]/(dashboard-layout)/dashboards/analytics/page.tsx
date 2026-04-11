import type { Metadata } from "next"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type {
  ConversionFunnelType,
  EngagementByDeviceType,
  NewVsReturningVisitorsType,
  OverviewType,
  PerformanceOverTimeType,
  TrafficSourcesType,
  VisitorsByCountryDataType,
} from "./types"

import { ConversionFunnel } from "./_components/conversion-funnel"
import { EngagementByDevice } from "./_components/engagement-by-device"
import { NewVsReturningVisitors } from "./_components/new-vs-returning-visitors"
import { Overview } from "./_components/overview"
import { PerformanceOverTime } from "./_components/performance-over-time"
import { TrafficSources } from "./_components/traffic-sources"
import { VisitorsByCountry } from "./_components/visitors-by-country"

export const metadata: Metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage() {
  const b = await getShadboardPageContent("analytics")

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <Overview data={b.overview as OverviewType} />
      <TrafficSources data={b.trafficSourcesData as TrafficSourcesType} />
      <div className="space-y-4">
        <ConversionFunnel data={b.conversionFunnelData as ConversionFunnelType} />
        <NewVsReturningVisitors
          data={b.newVsReturningVisitors as NewVsReturningVisitorsType}
        />
      </div>
      <PerformanceOverTime
        data={b.performanceOverTimeData as PerformanceOverTimeType}
      />
      <VisitorsByCountry
        data={b.visitorsByCountryData as VisitorsByCountryDataType}
      />
      <EngagementByDevice
        data={b.engagementByDeviceData as EngagementByDeviceType[]}
      />
    </section>
  )
}
