import type { CalendarApi } from "@fullcalendar/core/index.js"
import type { z } from "zod"
import type { createEventSidebarSchema } from "./_schemas/event-sidebar-schema"

export interface CalendarContextType {
  allCategories: CategoryType[]
  /** When false, hide “add event” and dummy sidebar create flows (Ecosystra board-driven calendar). */
  allowAddEvent: boolean
  calendarState: CalendarStateType
  calendarApi: CalendarApi | null
  setCalendarApi: (val: CalendarApi) => void
  eventSidebarIsOpen: boolean
  setEventSidebarIsOpen: (val: boolean) => void
  handleAddEvent: (event: EventWithoutIdType) => void
  handleUpdateEvent: (event: EventType) => void
  handleDeleteEvent: (eventId: EventType["id"]) => void
  handleSelectEvent: (event?: EventType) => void
  handleSelectCategory: (category: CategoryType) => void
  handleSelectAllCategories: (isSelectAllCategories: boolean) => void
  refetchBoardEvents?: () => void
}

export type CategoryType =
  | "Business"
  | "Personal"
  | "Family"
  | "Holiday"
  | "Health"
  | "Miscellaneous"

/** Ecosystra board task ↔ calendar event (due / timeline). */
export type EcosystraCalendarMeta = {
  source: "ecosystra"
  itemId: string
  /** Root task name (without calendar suffix). */
  taskName: string
  groupId: string
  boardId: string
  groupName: string
  eventKind: "due" | "timeline"
  dynamicDataSnapshot: Record<string, unknown>
  viewerWorkspaceRole: string
  isSubitem: boolean
}

export type EventType = {
  id: string
  url?: string
  title: string
  allDay: boolean
  end: Date
  start: Date
  extendedProps: {
    category: CategoryType
    description?: string
    ecosystra?: EcosystraCalendarMeta
  }
}

export type EventWithoutIdType = Omit<EventType, "id">

export type CalendarStateType = {
  initalEvents: EventType[]
  events: EventType[]
  selectedEvent?: EventType
  selectedCategories: CategoryType[]
}

export type CalendarActionType = {
  type:
    | "addEvent"
    | "updateEvent"
    | "deleteEvent"
    | "selectEvent"
    | "selectCategory"
    | "selectAllCategories"
    | "replaceEvents"
  event?: EventType
  events?: EventType[]
  category?: CategoryType
  eventId?: string
  isSelectAllCategories?: boolean
}

export type EventSidebarFormType = z.infer<
  ReturnType<typeof createEventSidebarSchema>
>
