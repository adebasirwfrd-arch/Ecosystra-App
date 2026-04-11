import type { SalesByCountryType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { SalesByCountryChart } from "./sales-by-country-chart"

export function SalesByCountry({ data }: { data: SalesByCountryType }) {
  const salesByCountryData = data
  return (
    <DashboardCard
      title="Sales by Country"
      period={salesByCountryData.period}
      action={<DashboardCardActionsDropdown />}
    >
      <SalesByCountryChart data={salesByCountryData.countries} />
    </DashboardCard>
  )
}
