import type { ConversionFunnelType } from "../types"

import {
  DashboardCard,
  DashboardCardActionsDropdown,
} from "@/components/dashboards/dashboard-card"
import { ConversionFunnelChart } from "./conversion-funnel-chart"
import { ConversionFunnelList } from "./conversion-funnel-list"

export function ConversionFunnel({ data }: { data: ConversionFunnelType }) {
  const conversionFunnelData = data
  return (
    <DashboardCard
      title="Conversion Funnel"
      period={conversionFunnelData.period}
      action={<DashboardCardActionsDropdown />}
      className="overflow-hidden"
      contentClassName="p-0"
      size="sm"
    >
      <ConversionFunnelList data={conversionFunnelData.funnelSteps} />
      <ConversionFunnelChart data={conversionFunnelData.funnelSteps} />
    </DashboardCard>
  )
}
