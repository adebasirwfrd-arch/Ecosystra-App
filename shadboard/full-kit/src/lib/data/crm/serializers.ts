/** JSON-safe CRM row shapes for `/api/crm/*` (modal.md §2.4). */

export function serializeCrmDeal(d: {
  id: string
  title: string
  companyName: string
  amount: { toString(): string }
  currency: string
  stage: string
  leadSource: string
  countryCode: string
  countryName: string
  ownerName: string
  ownerEmail: string
  ownerAvatar: string | null
  probability: number | null
  expectedClose: Date | null
  notes: string | null
  closedAt: Date | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...d,
    amount: d.amount.toString(),
    expectedClose: d.expectedClose?.toISOString() ?? null,
    closedAt: d.closedAt?.toISOString() ?? null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }
}

export function serializeCrmProject(p: {
  id: string
  name: string
  progress: number
  startDate: Date
  dueDate: Date
  status: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...p,
    startDate: p.startDate.toISOString(),
    dueDate: p.dueDate.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

export function serializeCrmActivity(a: {
  id: string
  type: string
  iconName: string
  fill: string
  title: string
  description: string
  status: string | null
  occurredAt: Date
  assignedMembers: unknown
  createdAt: Date
}) {
  return {
    ...a,
    occurredAt: a.occurredAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
  }
}

export function serializeCrmRep(r: {
  id: string
  name: string
  email: string
  avatar: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }
}

export function serializeCrmFeedback(f: {
  id: string
  name: string
  email: string
  avatar: string
  rating: { toString(): string }
  feedbackMessage: string
  createdAt: Date
}) {
  return {
    ...f,
    rating: f.rating.toString(),
    createdAt: f.createdAt.toISOString(),
  }
}
