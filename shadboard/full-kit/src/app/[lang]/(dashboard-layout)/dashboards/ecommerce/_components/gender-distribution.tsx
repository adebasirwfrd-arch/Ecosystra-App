import type { GenderDistributionType } from "../../analytics/types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { GenderDistributionChart } from "./gender-distribution-chart"

export function GenderDistribution({
  data,
}: {
  data: GenderDistributionType[]
}) {
  const genderDistributionData = data
  return (
    <DashboardCard title="Gender Distribution" contentClassName="p-0" size="xs">
      <GenderDistributionChart data={genderDistributionData} />
    </DashboardCard>
  )
}
