import type { EmailType } from "../types"

import { PAGE_SIZE } from "../constants"

export function filterEmailsBySearchTerm(emails: EmailType[], term: string): EmailType[] {
  const t = term.trim().toLowerCase()
  if (!t) return emails
  return emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(t) ||
      e.sender.name.toLowerCase().includes(t) ||
      e.sender.email.toLowerCase().includes(t)
  )
}

export function slicePage<T>(items: T[], page: number): T[] {
  const p = Math.max(1, page)
  const start = (p - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

export function totalPagesFor(count: number): number {
  return Math.max(1, Math.ceil(Math.max(0, count) / PAGE_SIZE))
}
