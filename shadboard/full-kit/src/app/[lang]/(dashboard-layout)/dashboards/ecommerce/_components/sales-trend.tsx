import type { SalesTrendType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesTrendChart } from "./sales-trend-chart"
import { SalesTrendSummary } from "./sales-trend-summary"

export function SalesTrend({ data }: { data: SalesTrendType }) {
  const salesTrendData = data
  return (
    <DashboardCard
      title="Sales Trend"
      period={salesTrendData.period}
      action={<DashboardCardActionsDropdown />}
      size="lg"
    >
      <SalesTrendSummary data={salesTrendData.summary} />
      <SalesTrendChart data={salesTrendData.salesTrends} />
    </DashboardCard>
  )
}
