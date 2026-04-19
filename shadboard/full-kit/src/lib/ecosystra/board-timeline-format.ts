import { format, isValid, differenceInDays } from "date-fns"

import type { DateRange } from "react-day-picker"

/** Persisted task timeline label, e.g. `Apr 12 - 18` or `Apr 12 - 19, 2026`. */
export function formatTimelineRange(range: DateRange | undefined): string {
  if (!range?.from) return "—"

  const curYear = new Date().getFullYear()

  if (!range.to) {
    const showYear = range.from.getFullYear() !== curYear
    return format(range.from, showYear ? "MMM d, yyyy" : "MMM d")
  }

  const { from, to } = range
  const showYear =
    from.getFullYear() !== curYear || to.getFullYear() !== curYear

  if (from.getFullYear() === to.getFullYear()) {
    if (from.getMonth() === to.getMonth()) {
      const suffix = showYear ? `, ${from.getFullYear()}` : ""
      return `${format(from, "MMM d")} - ${format(to, "d")}${suffix}`
    }
    const suffix = showYear ? `, ${from.getFullYear()}` : ""
    return `${format(from, "MMM d")} - ${format(to, "MMM d")}${suffix}`
  }
  return `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`
}

export function parseTimelineRange(s: string): DateRange | undefined {
  if (!s || s === "—" || s === "") return undefined

  const normalized = s.replace(/–/g, "-")
  const parts = normalized.split("-").map((p) => p.trim())

  if (parts.length === 1) {
    const d = new Date(parts[0])
    return isValid(d) ? { from: d, to: undefined } : undefined
  }

  let fromPart = parts[0]
  let toPart = parts[1]

  const yearMatch = s.match(/, (\d{4})/)
  const targetYear = yearMatch
    ? parseInt(yearMatch[1], 10)
    : new Date().getFullYear()

  const monthMatch = fromPart.match(/^[A-Za-z]{3}/)
  const monthStr = monthMatch ? monthMatch[0] : ""

  if (/^\d+/.test(toPart) && !/[A-Za-z]/.test(toPart)) {
    toPart = `${monthStr} ${toPart}`
  }

  const fromDate = new Date(fromPart)
  if (
    isValid(fromDate) &&
    fromDate.getFullYear() === 2001 &&
    !fromPart.includes("2001")
  ) {
    fromDate.setFullYear(targetYear)
  }

  const toDate = new Date(toPart)
  if (
    isValid(toDate) &&
    toDate.getFullYear() === 2001 &&
    !toPart.includes("2001")
  ) {
    toDate.setFullYear(targetYear)
  }

  if (!isValid(fromDate)) return undefined
  return { from: fromDate, to: isValid(toDate) ? toDate : undefined }
}

export function getTimelineDuration(range: DateRange | undefined): string {
  if (!range?.from || !range.to) return ""
  const days = differenceInDays(range.to, range.from) + 1
  return `${days}d`
}
