import type { LeadSourceType } from "../types"

import { Card } from "@/components/ui/card"
import { LeadSourcesChart } from "./lead-sources-chart"

export function LeadSources({ data }: { data: LeadSourceType }) {
  const leadSourcesData = data
  return (
    <Card className="h-56 p-6">
      <LeadSourcesChart
        data={{
          leads: leadSourcesData.leads,
          summary: leadSourcesData.summary,
        }}
      />
    </Card>
  )
}
