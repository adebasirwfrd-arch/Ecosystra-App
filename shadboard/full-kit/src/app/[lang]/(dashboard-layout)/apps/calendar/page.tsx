import type { Metadata } from "next"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type { CategoryType, EventType } from "./types"

import { Card } from "@/components/ui/card"
import { CalendarContent } from "./_components/calendar-content"
import { CalendarHeader } from "./_components/calendar-header"
import { CalendarWrapper } from "./_components/calendar-wrapper"

export const metadata: Metadata = {
  title: "Calendar",
}

export default async function CalendarPage() {
  const b = await getShadboardPageContent("calendar")

  return (
    <CalendarWrapper
      events={b.eventsData as EventType[]}
      categories={b.categoriesData as CategoryType[]}
    >
      <Card>
        <CalendarHeader />
        <CalendarContent />
      </Card>
    </CalendarWrapper>
  )
}
