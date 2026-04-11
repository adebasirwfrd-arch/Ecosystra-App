import type { Metadata } from "next"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type { ColumnType, LabelType, UserType } from "./types"

import { Kanban } from "./_components/kanban"
import { KanbanWrapper } from "./_components/kanban-wrapper"

export const metadata: Metadata = {
  title: "Kanban",
}

export default async function KanbanPage() {
  const b = await getShadboardPageContent("kanban")

  return (
    <KanbanWrapper
      kanbanData={b.kanbanData as ColumnType[]}
      labelsData={b.labelsData as LabelType[]}
      teamMembersData={b.teamMembersData as UserType[]}
    >
      <Kanban />
    </KanbanWrapper>
  )
}
