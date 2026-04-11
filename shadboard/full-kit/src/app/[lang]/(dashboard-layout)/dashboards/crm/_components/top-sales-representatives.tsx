import type { SalesRepresentativeType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TopSalesRepresentativesList } from "./top-sales-representatives-list"

export function TopSalesRepresentatives({
  data,
}: {
  data: SalesRepresentativeType
}) {
  const salesRepresentativeData = data
  return (
    <DashboardCard
      title="Top Sales Representatives"
      period={salesRepresentativeData.period}
      action={<DashboardCardActionsDropdown />}
    >
      <TopSalesRepresentativesList
        data={salesRepresentativeData.representatives}
      />
    </DashboardCard>
  )
}
