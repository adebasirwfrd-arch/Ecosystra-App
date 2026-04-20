import { addDays, parseISO, startOfDay } from "date-fns"

import type {
  CategoryType,
  EcosystraCalendarMeta,
  EventType,
} from "../types"

import type { GqlBoard, GqlBoardItem } from "@/components/ecosystra/hooks/use-ecosystra-board-apollo"

import { CATEGORIES } from "../constants"
import {
  formatTimelineRange,
  parseTimelineRange,
} from "@/lib/ecosystra/board-timeline-format"

function categoryFromSeed(seed: string): CategoryType {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return CATEGORIES[h % CATEGORIES.length]
}

function readDueIso(item: GqlBoardItem, isSubitem: boolean): string | null {
  const d = (item.dynamicData ?? {}) as Record<string, unknown>
  if (isSubitem) {
    const iso =
      typeof d.subDueDateIso === "string" ? d.subDueDateIso.trim() : ""
    return iso.length >= 10 ? iso.slice(0, 10) : null
  }
  const iso = typeof d.dueDateIso === "string" ? d.dueDateIso.trim() : ""
  return iso.length >= 10 ? iso.slice(0, 10) : null
}

function readTimelineLabel(item: GqlBoardItem): string {
  const d = (item.dynamicData ?? {}) as Record<string, unknown>
  const tl = typeof d.timeline === "string" ? d.timeline.trim() : ""
  return tl && tl !== "—" ? tl : ""
}

function collectRootItems(
  board: GqlBoard
): { item: GqlBoardItem; group: { id: string; name: string } }[] {
  const out: { item: GqlBoardItem; group: { id: string; name: string } }[] =
    []
  for (const g of board.groups ?? []) {
    for (const it of g.items) {
      if (it.parentItemId) continue
      out.push({ item: it, group: { id: g.id, name: g.name } })
    }
  }
  return out
}

/** Maps Ecosystra board root tasks to FullCalendar events (due + timeline). */
export function boardToCalendarEvents(board: GqlBoard | undefined): EventType[] {
  if (!board?.groups?.length) return []

  const role = (board.viewerWorkspaceRole ?? "MEMBER").toUpperCase()
  const rows = collectRootItems(board)
  const events: EventType[] = []

  for (const { item, group } of rows) {
    const d = (item.dynamicData ?? {}) as Record<string, unknown>
    const snapshot = { ...d }
    const baseMeta: Omit<EcosystraCalendarMeta, "eventKind"> = {
      source: "ecosystra",
      itemId: item.id,
      taskName: item.name,
      groupId: group.id,
      boardId: board.id,
      groupName: group.name,
      dynamicDataSnapshot: snapshot,
      viewerWorkspaceRole: role,
      isSubitem: false,
    }

    const dueIso = readDueIso(item, false)
    if (dueIso) {
      const start = startOfDay(parseISO(`${dueIso}T12:00:00`))
      const end = addDays(start, 1)
      events.push({
        id: `${item.id}:due`,
        title: `${item.name} · Due`,
        allDay: true,
        start,
        end,
        extendedProps: {
          category: categoryFromSeed(`${item.id}-due`),
          description:
            typeof d.notesText === "string" ? d.notesText : undefined,
          ecosystra: {
            ...baseMeta,
            eventKind: "due",
          },
        },
      })
    }

    const tl = readTimelineLabel(item)
    if (tl) {
      const range = parseTimelineRange(tl)
      if (range?.from) {
        const from = startOfDay(range.from)
        const toDay = range.to ? startOfDay(range.to) : from
        const endExclusive = addDays(toDay, 1)
        events.push({
          id: `${item.id}:timeline`,
          title: `${item.name} · Timeline`,
          allDay: true,
          start: from,
          end: endExclusive,
          extendedProps: {
            category: categoryFromSeed(`${item.id}-tl`),
            description:
              typeof d.notesText === "string" ? d.notesText : undefined,
            ecosystra: {
              ...baseMeta,
              eventKind: "timeline",
            },
          },
        })
      }
    }
  }

  return events
}

export function mergeTaskDynamicFromCalendarForm(input: {
  snapshot: Record<string, unknown>
  notesText: string
  taskStatus: string
  dueDateStart: Date
  timelineStart: Date
  timelineEnd: Date
}): Record<string, unknown> {
  const dueIso = `${input.dueDateStart.getFullYear()}-${String(input.dueDateStart.getMonth() + 1).padStart(2, "0")}-${String(input.dueDateStart.getDate()).padStart(2, "0")}`
  const m = input.dueDateStart.toLocaleString("en-US", { month: "short" })
  const day = input.dueDateStart.getDate()
  const dueDisplay = `${m} ${day}`

  const range = {
    from: input.timelineStart,
    to: input.timelineEnd,
  }
  const timelineLabel = formatTimelineRange(range)

  return {
    ...input.snapshot,
    taskStatus: input.taskStatus,
    notesText: input.notesText,
    dueDateIso: dueIso,
    dueDate: dueDisplay,
    timeline: timelineLabel,
  }
}
