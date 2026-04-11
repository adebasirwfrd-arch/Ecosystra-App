import type { ActiveProjectType } from "../types"

import { DashboardCard } from "@/components/dashboards/dashboard-card"
import { ActiveProjectsList } from "./active-projects-list"

export function ActiveProjects({
  data,
}: {
  data: ActiveProjectType[]
}) {
  const activeProjectsData = data
  return (
    <DashboardCard title="Active Projects" size="lg">
      <ActiveProjectsList data={activeProjectsData} />
    </DashboardCard>
  )
}
