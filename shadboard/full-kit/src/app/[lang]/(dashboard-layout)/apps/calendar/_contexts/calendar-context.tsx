"use client"

import { createContext, useReducer, useState } from "react"

import type { CalendarApi } from "@fullcalendar/core/index.js"
import type { ReactNode } from "react"
import type {
  CalendarContextType,
  CategoryType,
  EventType,
  EventWithoutIdType,
} from "../types"

import { CalendarReducer } from "../_reducers/calendar-reducer"

// Create Kanban context
export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export function CalendarProvider({
  events,
  categories,
  children,
}: {
  events: EventType[]
  categories: CategoryType[]
  children: ReactNode
}) {
  const [calendarState, dispatch] = useReducer(CalendarReducer, {
    initalEvents: events,
    events,
    selectedCategories: [...categories],
  })

  // State management
  const [calendarApi, setCalendarApi] = useState<null | CalendarApi>(null)
  const [eventSidebarIsOpen, setEventSidebarIsOpen] = useState(false)

  // Handlers for event actions
  const handleAddEvent = (event: EventWithoutIdType) => {
    dispatch({
      type: "addEvent",
      event: { ...event, id: calendarState.events.length.toString() },
    })
  }

  const handleUpdateEvent = (event: EventType) => {
    dispatch({ type: "updateEvent", event })
  }

  const handleDeleteEvent = (eventId: EventType["id"]) => {
    dispatch({ type: "deleteEvent", eventId })
  }

  // Selection handlers
  const handleSelectEvent = (event?: EventType) => {
    dispatch({ type: "selectEvent", event: event })
  }

  const handleSelectCategory = (category: CategoryType) => {
    dispatch({ type: "selectCategory", category })
  }

  const handleSelectAllCategories = (isSelectAllCategories: boolean) => {
    dispatch({ type: "selectAllCategories", isSelectAllCategories })
  }

  return (
    <CalendarContext.Provider
      value={{
        allCategories: categories,
        calendarState,
        calendarApi,
        setCalendarApi,
        eventSidebarIsOpen,
        setEventSidebarIsOpen,
        handleUpdateEvent,
        handleAddEvent,
        handleDeleteEvent,
        handleSelectEvent,
        handleSelectCategory,
        handleSelectAllCategories,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}
