import type { ReactNode } from "react"
import type { CategoryType, EventType } from "../types"

import { CATEGORIES } from "../constants"
import { CalendarProvider } from "../_contexts/calendar-context"
import { EventSidebar } from "./event-sidebar"

export function CalendarWrapper({
  events,
  categories,
  allowAddEvent = true,
  refetchBoardEvents,
  children,
}: {
  events: EventType[]
  categories?: CategoryType[]
  allowAddEvent?: boolean
  refetchBoardEvents?: () => void
  children: ReactNode
}) {
  return (
    <CalendarProvider
      events={events}
      categories={categories ?? CATEGORIES}
      allowAddEvent={allowAddEvent}
      refetchBoardEvents={refetchBoardEvents}
    >
      <div className="container p-4">
        {children}
        <EventSidebar />
      </div>
    </CalendarProvider>
  )
}
