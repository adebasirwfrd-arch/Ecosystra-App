import type { NewVsReturningVisitorsType } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { NewVsReturningVisitorsChart } from "./new-vs-returning-visitors-chart"
import { NewVsReturningVisitorsList } from "./new-vs-returning-visitors-list"

export function NewVsReturningVisitors({
  data,
}: {
  data: NewVsReturningVisitorsType
}) {
  const newVsReturningVisitors = data
  return (
    <DashboardCard
      title="New vs. Returning Visitors"
      size="xs"
      contentClassName="gap-y-3"
    >
      <NewVsReturningVisitorsChart data={newVsReturningVisitors.visitors} />
      <NewVsReturningVisitorsList data={newVsReturningVisitors.visitors} />
    </DashboardCard>
  )
}
