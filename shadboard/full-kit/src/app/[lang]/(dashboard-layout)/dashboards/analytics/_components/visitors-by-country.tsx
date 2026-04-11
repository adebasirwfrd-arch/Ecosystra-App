import type { VisitorsByCountryDataType } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { VisitorsByCountryList } from "./visitors-by-country-list"

export function VisitorsByCountry({
  data,
}: {
  data: VisitorsByCountryDataType
}) {
  const visitorsByCountryData = data
  return (
    <DashboardCard title="Visitors by Country">
      <VisitorsByCountryList data={visitorsByCountryData} />
    </DashboardCard>
  )
}
