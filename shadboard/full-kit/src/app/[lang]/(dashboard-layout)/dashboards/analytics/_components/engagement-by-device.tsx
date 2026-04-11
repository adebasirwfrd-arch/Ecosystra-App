import type { EngagementByDeviceType } from "../types"

import { EngagementByDeviceTable } from "./engagement-by-device-table"

export function EngagementByDevice({
  data,
}: {
  data: EngagementByDeviceType[]
}) {
  const engagementByDeviceData = data
  return (
    <article className="col-span-full">
      <EngagementByDeviceTable data={engagementByDeviceData} />
    </article>
  )
}
