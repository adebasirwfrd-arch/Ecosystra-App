import type { ChurnRateType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { ChurnRateChart } from "./churn-rate-chart"
import { ChurnRateSummary } from "./churn-rate-summary"

export function ChurnRate({ data }: { data: ChurnRateType }) {
  const churnRateData = data
  return (
    <DashboardCard
      title="Churn Rate"
      period={churnRateData.period}
      action={<DashboardCardActionsDropdown />}
      size="sm"
    >
      <ChurnRateSummary data={churnRateData.summary} />
      <ChurnRateChart data={churnRateData.months} />
    </DashboardCard>
  )
}
