import type { TopProductType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { TopProductsList } from "./top-products-list"

export function TopProducts({ data }: { data: TopProductType }) {
  const topProductsData = data
  return (
    <DashboardCard
      title="Top Products"
      period={topProductsData.period}
      action={<DashboardCardActionsDropdown />}
      size="lg"
    >
      <TopProductsList data={topProductsData.products} />
    </DashboardCard>
  )
}
