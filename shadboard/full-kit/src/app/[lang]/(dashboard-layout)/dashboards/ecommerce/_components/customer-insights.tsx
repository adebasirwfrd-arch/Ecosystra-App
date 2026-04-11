import type { CustomerInsightsType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { CustomerInsightList } from "./customer-insight-list"

export function CustomerInsights({
  data,
}: {
  data: CustomerInsightsType
}) {
  const customerInsightsData = data
  return (
    <DashboardCard
      title="Customer Insights"
      period={customerInsightsData.period}
      action={<DashboardCardActionsDropdown />}
      size="xs"
      className="md:col-span-3"
      contentClassName="justify-center"
    >
      <CustomerInsightList data={customerInsightsData} />
    </DashboardCard>
  )
}
