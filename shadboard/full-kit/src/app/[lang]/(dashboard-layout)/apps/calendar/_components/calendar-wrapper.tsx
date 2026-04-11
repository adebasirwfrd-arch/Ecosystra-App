import type { ReactNode } from "react"
import type { CategoryType, EventType } from "../types"

import { CalendarProvider } from "../_contexts/calendar-context"
import { EventSidebar } from "./event-sidebar"

export function CalendarWrapper({
  events,
  categories,
  children,
}: {
  events: EventType[]
  categories?: CategoryType[]
  children: ReactNode
}) {
  return (
    <CalendarProvider events={events} categories={categories}>
      <div className="container p-4">
        {children}
        <EventSidebar />
      </div>
    </CalendarProvider>
  )
}
