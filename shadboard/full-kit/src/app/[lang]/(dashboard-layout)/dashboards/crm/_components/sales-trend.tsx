import type { SalesTrendType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesTrendChart } from "./sales-trend-chart"

export function SalesTrend({ data }: { data: SalesTrendType }) {
  const salesTrendData = data
  return (
    <DashboardCard
      title="Sales Trend"
      period={salesTrendData.period}
      action={<DashboardCardActionsDropdown />}
      className="col-span-full md:col-span-3"
    >
      <SalesTrendChart data={salesTrendData} />
    </DashboardCard>
  )
}
