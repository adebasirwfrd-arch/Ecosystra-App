import type { Metadata } from "next"

import { CalendarEcosystraConnected } from "./_components/calendar-ecosystra-connected"

export const metadata: Metadata = {
  title: "Calendar",
}

export default function CalendarPage() {
  return <CalendarEcosystraConnected />
}
