import type { RevenueTrendType } from "../types"

import { Card } from "@/components/ui/card"
import { RevenueTrendChart } from "./revenue-trend-chart"
import { RevenueTrendSummary } from "./revenue-trend-summary"

export function RevenueTrend({ data }: { data: RevenueTrendType }) {
  const revenueTrendData = data
  return (
    <Card className="h-56 flex flex-col justify-between gap-y-6 p-6">
      <RevenueTrendSummary data={revenueTrendData.summary} />
      <RevenueTrendChart data={revenueTrendData.revenueTrends} />
    </Card>
  )
}
