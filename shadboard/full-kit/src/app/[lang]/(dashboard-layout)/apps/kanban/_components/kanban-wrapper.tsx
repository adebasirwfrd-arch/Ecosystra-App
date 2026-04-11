import type { ReactNode } from "react"
import type { ColumnType, LabelType, UserType } from "../types"

import { KanbanProvider } from "../_contexts/kanban-context"
import { KanbanSidebar } from "./kanban-sidebar"

export function KanbanWrapper({
  kanbanData,
  teamMembersData,
  labelsData,
  children,
}: {
  kanbanData: ColumnType[]
  teamMembersData?: UserType[]
  labelsData?: LabelType[]
  children: ReactNode
}) {
  return (
    <KanbanProvider
      kanbanData={kanbanData}
      teamMembersData={teamMembersData}
      labelsData={labelsData}
    >
      <div className="flex">
        <KanbanSidebar />
        {children}
      </div>
    </KanbanProvider>
  )
}
