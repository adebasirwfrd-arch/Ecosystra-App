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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Analytics",
}

export default async function AnalyticsPage() {
  let b: Record<string, unknown>
  try {
    b = await getShadboardPageContent("analytics")
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return (
      <section className="container p-4">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Analytics tidak bisa dimuat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Koneksi ke database gagal (contoh: Supabase tidak terjangkau dari jaringan ini).</p>
            <p className="font-mono text-xs break-words text-destructive">{msg}</p>
            <ul className="list-disc ps-4 space-y-1">
              <li>Pastikan project Supabase aktif (tidak paused).</li>
              <li>Coba lain: hotspot / jaringan lain, atau matikan VPN.</li>
              <li>
                Di <code className="text-foreground">.env.local</code>: jika direct gagal, set{" "}
                <code className="text-foreground">PRISMA_USE_POOLER=true</code>; jika pooler gagal,
                coba hapus itu dan perbaiki <code className="text-foreground">DIRECT_URL</code>.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    )
  }

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
