"use client"

import {
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"

import type { CalendarApi } from "@fullcalendar/core/index.js"
import type { ReactNode } from "react"
import type {
  CalendarContextType,
  CategoryType,
  EventType,
  EventWithoutIdType,
} from "../types"

import { CATEGORIES } from "../constants"
import { CalendarReducer } from "../_reducers/calendar-reducer"

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
)

export function CalendarProvider({
  events,
  categories = CATEGORIES,
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
  const catList = categories.length ? categories : CATEGORIES

  const [calendarState, dispatch] = useReducer(CalendarReducer, {
    initalEvents: events,
    events,
    selectedCategories: [...catList],
  })

  const [calendarApi, setCalendarApi] = useState<null | CalendarApi>(null)
  const [eventSidebarIsOpen, setEventSidebarIsOpen] = useState(false)

  const eventsSyncKey = useRef<string>("")
  useEffect(() => {
    const key = events.map((e) => e.id).join("|")
    if (key === eventsSyncKey.current) return
    eventsSyncKey.current = key
    dispatch({ type: "replaceEvents", events })
  }, [events])

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
        allCategories: catList,
        allowAddEvent,
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
        refetchBoardEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}
