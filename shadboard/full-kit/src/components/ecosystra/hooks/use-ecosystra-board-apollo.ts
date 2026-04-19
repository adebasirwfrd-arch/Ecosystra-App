"use client"

import { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { toast } from "sonner"

import type { DictionaryType } from "@/lib/get-dictionary"

import {
  ACCEPT_TASK_ASSIGNEE_INVITE,
  CREATE_GROUP,
  CREATE_ITEM,
  DELETE_GROUP,
  DELETE_ITEM,
  GET_OR_CREATE_BOARD,
  MOVE_ITEM_TO_GROUP,
  SEARCH_WORKSPACE,
  SET_TASK_ASSIGNEE,
  SET_TASK_ASSIGNEES,
  SET_TASK_OWNER,
  UPDATE_BOARD,
  UPDATE_BOARD_METADATA,
  UPDATE_BOARD_SUBITEM_COLUMNS,
  UPDATE_GROUP,
  UPDATE_ITEM,
  UPDATE_ITEM_DYNAMIC_DATA,
  WORKSPACE_USERS,
} from "@/lib/ecosystra/board-gql"

import {
  parseTableGroupBySuite,
  type BoardGroupBySuite,
} from "../ecosystra-board-group-by-engine"
import { useOptionalEcosystraDictionary } from "../ecosystra-dictionary-context"

export type { BoardGroupBySuite }

function boardToastMessages(dict: DictionaryType | null) {
  const m = dict?.ecosystraApp?.boardTable as Record<string, string> | undefined
  return {
    boardUpdated: m?.toastBoardUpdated ?? "Board updated",
    taskCreated: m?.toastTaskCreated ?? "Task created",
    subitemCreated: m?.toastSubitemCreated ?? "Subitem created",
    taskDeleted: m?.toastTaskDeleted ?? "Task deleted",
    groupCreated: m?.toastGroupCreated ?? "Group created",
    groupDeleted: m?.toastGroupDeleted ?? "Group deleted",
  }
}

export type GqlBoardUser = {
  id: string
  name?: string | null
  avatarUrl?: string | null
}

export type GqlBoardItem = {
  id: string
  name: string
  groupId?: string | null
  parentItemId?: string | null
  createdByUserId?: string | null
  updatedAt: string
  lastUpdatedBy?: GqlBoardUser | null
  dynamicData: Record<string, unknown>
  subitems?: GqlBoardItem[]
}

/** Reads `assigneeUserIds` / legacy `assigneeUserId` from task `dynamicData`. */
export function readAssigneeUserIdsFromDynamic(
  d: Record<string, unknown> | undefined
): string[] {
  if (!d) return []
  const raw = d.assigneeUserIds
  if (Array.isArray(raw)) {
    return [...new Set(raw.map((x) => String(x)).filter(Boolean))]
  }
  const single = d.assigneeUserId
  if (typeof single === "string" && single.trim()) return [single.trim()]
  return []
}

export type GqlBoardGroup = {
  id: string
  name: string
  color: string | null
  items: GqlBoardItem[]
}

export type GqlBoard = {
  id: string
  name: string
  workspaceId: string
  metadata?: Record<string, unknown> | null
  columns: unknown
  subitemColumns: unknown
  groups: GqlBoardGroup[]
}

export type BoardTableGroupBy = "none" | "priority"

/** Columns the board can hide via `updateBoardMetadata` (server-persisted). */
export const HIDABLE_COLUMN_IDS = [
  "status",
  "dueDate",
  "date",
  "lastUpdated",
  "files",
  "owner",
  "assignee",
  "timeline",
  "priority",
  "budget",
  "rating",
  "duePriority",
  "notes",
  "notesCategory",
] as const

export type HidableBoardColumnId = (typeof HIDABLE_COLUMN_IDS)[number]

/** Default main-table column ids — must match `EcosystraBoardGroupTable` `allColumns` order. */
export const BOARD_TABLE_COLUMN_IDS: readonly string[] = [
  "select",
  "task",
  "status",
  "dueDate",
  "lastUpdated",
  "notes",
  "notesCategory",
  "files",
  "timeline",
  "priority",
  "budget",
  "duePriority",
  "owner",
  "assignee",
  "rating",
  "add",
] as const

/** User-added columns (metadata `tableCustomColumns`) — ids are `c_…`, values are `{ kind }`. */
export type TableCustomColumnDef = {
  kind: HidableBoardColumnId
}

export function newCustomTableColumnId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `c_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`
  }
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function mergeBoardColumnOrder(
  saved: string[] | undefined,
  defaults: readonly string[],
  customColumnIds: readonly string[] = []
): string[] {
  const customSet = new Set(customColumnIds)
  const defaultSet = new Set(defaults)
  const fromSaved = (saved ?? []).filter(
    (id) => defaultSet.has(id) || customSet.has(id)
  )
  const seen = new Set(fromSaved)
  const out = [...fromSaved]
  for (const id of defaults) {
    if (!seen.has(id)) {
      out.push(id)
      seen.add(id)
    }
  }
  for (const id of customColumnIds) {
    if (!seen.has(id)) {
      const addI = out.indexOf("add")
      if (addI >= 0) out.splice(addI, 0, id)
      else out.push(id)
      seen.add(id)
    }
  }
  return out
}

/** Place `columnId` immediately before the sticky `add` column (rightmost data column). */
export function orderWithColumnBeforeAdd(
  currentOrder: string[],
  columnId: string,
  defaults: readonly string[] = BOARD_TABLE_COLUMN_IDS
): string[] {
  const customIdsInOrder = currentOrder.filter((id) => id.startsWith("c_"))
  const withoutId = currentOrder.filter((c) => c !== columnId)
  const addIdx = withoutId.indexOf("add")
  if (addIdx >= 0) {
    return [...withoutId.slice(0, addIdx), columnId, ...withoutId.slice(addIdx)]
  }
  const merged = mergeBoardColumnOrder(withoutId, defaults, customIdsInOrder)
  const stripped = merged.filter((c) => c !== columnId)
  const beforeAdd = stripped.indexOf("add")
  return beforeAdd >= 0
    ? [...stripped.slice(0, beforeAdd), columnId, ...stripped.slice(beforeAdd)]
    : [...stripped, columnId, "add"]
}

export function reorderArray<T>(
  list: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return [...list]
  }
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export function sortItemsByOrder<T extends { id: string }>(
  items: T[],
  order: string[] | undefined
): T[] {
  if (!order?.length) return items
  const map = new Map(items.map((i) => [i.id, i]))
  const out: T[] = []
  const seen = new Set<string>()
  for (const id of order) {
    const it = map.get(id)
    if (it) {
      out.push(it)
      seen.add(id)
    }
  }
  for (const it of items) {
    if (!seen.has(it.id)) out.push(it)
  }
  return out
}

/** Apply persisted `groupOrder` (board metadata) to API group list. */
function mergeGroupOrder<T extends { id: string }>(
  groups: T[],
  order: string[] | undefined
): T[] {
  if (!order?.length) return groups
  const map = new Map(groups.map((g) => [g.id, g]))
  const out: T[] = []
  const seen = new Set<string>()
  for (const id of order) {
    const g = map.get(id)
    if (g) {
      out.push(g)
      seen.add(id)
    }
  }
  for (const g of groups) {
    if (!seen.has(g.id)) out.push(g)
  }
  return out
}

/** Insert `owner` before `assignee` for boards saved before Owner column existed. */
function ensureOwnerColumnInOrder(order: string[]): string[] {
  if (order.includes("owner")) return order
  const ai = order.indexOf("assignee")
  if (ai >= 0) return [...order.slice(0, ai), "owner", ...order.slice(ai)]
  return order
}

/** Keep the sticky "+ add column" id last (main and sub-item tables). */
export function ensureAddColumnLastInOrder(order: string[]): string[] {
  if (!order.length) return ["add"]
  if (!order.includes("add")) return [...order, "add"]
  return [...order.filter((id) => id !== "add"), "add"]
}

/**
 * Default sub-item nested table column ids — same set and order as the main table
 * so default pixel widths from `allColumns` match the primary board.
 */
export const SUBITEM_DEFAULT_BOARD_COLUMN_IDS: readonly string[] =
  BOARD_TABLE_COLUMN_IDS

/** Main and sub-item tables always pin these on horizontal scroll. */
export const ALWAYS_STICKY_BOARD_COLUMN_IDS = ["select", "task"] as const

/** Extra pinned column ids (not including `select` / `task`), ordered by `columnOrder`. */
export function normalizePinnedColumnIds(
  raw: unknown,
  columnOrder: readonly string[]
): string[] {
  const locked = new Set<string>(ALWAYS_STICKY_BOARD_COLUMN_IDS)
  const rawArr = Array.isArray(raw)
    ? raw.filter((x): x is string => typeof x === "string")
    : []
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of columnOrder) {
    if (id === "add") continue
    if (locked.has(id)) continue
    if (!rawArr.includes(id)) continue
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

export type SubitemBoardTableUi = {
  hiddenColumnIds: HidableBoardColumnId[]
  columnWidthsPx: Record<string, number>
  tableColumnOrder: string[]
  tableCustomColumns: Record<string, TableCustomColumnDef>
  tableColumnTitles: Record<string, string>
  /** Extra sticky column ids for the nested sub-item table (excluding select + task). */
  pinnedColumnIds: string[]
  /** Per parent task id: ordered sub-item ids for drag-reorder within the nested table. */
  itemOrdersByParent: Record<string, string[]>
}

export function parseSubitemBoardTableUi(raw: unknown): SubitemBoardTableUi {
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {}
  const rawHidden = base.hiddenTableColumnIds
  const hidden = Array.isArray(rawHidden)
    ? rawHidden.filter((id): id is HidableBoardColumnId =>
        HIDABLE_COLUMN_IDS.includes(id as HidableBoardColumnId)
      )
    : []
  const rawW = base.tableColumnWidthsPx
  const columnWidthsPx: Record<string, number> = {}
  if (
    rawW &&
    typeof rawW === "object" &&
    rawW !== null &&
    !Array.isArray(rawW)
  ) {
    for (const [k, v] of Object.entries(rawW)) {
      if (typeof v === "number" && Number.isFinite(v) && v > 0) {
        columnWidthsPx[k] = v
      }
    }
  }
  const tableCustomColumns: Record<string, TableCustomColumnDef> = {}
  const rawCc = base.tableCustomColumns
  if (
    rawCc &&
    typeof rawCc === "object" &&
    rawCc !== null &&
    !Array.isArray(rawCc)
  ) {
    for (const [k, v] of Object.entries(rawCc)) {
      if (
        typeof k === "string" &&
        k.startsWith("c_") &&
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        "kind" in v
      ) {
        const kind = (v as { kind?: unknown }).kind
        if (HIDABLE_COLUMN_IDS.includes(kind as HidableBoardColumnId)) {
          tableCustomColumns[k] = { kind: kind as HidableBoardColumnId }
        }
      }
    }
  }
  const customColumnIds = Object.keys(tableCustomColumns)
  const rawOrder = base.tableColumnOrder
  const rawOrderArr = Array.isArray(rawOrder)
    ? rawOrder.filter((x): x is string => typeof x === "string")
    : undefined
  const tableColumnOrder = ensureAddColumnLastInOrder(
    ensureOwnerColumnInOrder(
      mergeBoardColumnOrder(
        rawOrderArr,
        SUBITEM_DEFAULT_BOARD_COLUMN_IDS,
        customColumnIds
      )
    )
  )
  const tableColumnTitles: Record<string, string> = {}
  const rawTitles = base.tableColumnTitles
  if (
    rawTitles &&
    typeof rawTitles === "object" &&
    rawTitles !== null &&
    !Array.isArray(rawTitles)
  ) {
    for (const [k, v] of Object.entries(rawTitles)) {
      if (typeof k === "string" && typeof v === "string") {
        tableColumnTitles[k] = v
      }
    }
  }
  const itemOrdersByParent: Record<string, string[]> = {}
  const rawIobp = base.itemOrdersByParent
  if (rawIobp && typeof rawIobp === "object" && !Array.isArray(rawIobp)) {
    for (const [k, v] of Object.entries(rawIobp)) {
      if (typeof k === "string" && Array.isArray(v)) {
        itemOrdersByParent[k] = v.filter(
          (x): x is string => typeof x === "string"
        )
      }
    }
  }
  const pinnedColumnIds = normalizePinnedColumnIds(
    base.pinnedColumnIds,
    tableColumnOrder
  )
  return {
    hiddenColumnIds: hidden,
    columnWidthsPx,
    tableColumnOrder,
    tableCustomColumns,
    tableColumnTitles,
    pinnedColumnIds,
    itemOrdersByParent,
  }
}

export function serializeSubitemBoardTableUi(
  ui: SubitemBoardTableUi
): Record<string, unknown> {
  return {
    hiddenTableColumnIds: ui.hiddenColumnIds,
    tableColumnWidthsPx: ui.columnWidthsPx,
    tableColumnOrder: ui.tableColumnOrder,
    tableCustomColumns: ui.tableCustomColumns,
    tableColumnTitles: ui.tableColumnTitles,
    pinnedColumnIds: ui.pinnedColumnIds,
    itemOrdersByParent: ui.itemOrdersByParent,
  }
}

export type DuePriorityLabel = {
  id: string
  label: string
  color: string
}

export const DEFAULT_DUE_PRIORITY_LABELS: DuePriorityLabel[] = [
  { id: "high", label: "High Priority", color: "#00C875" },
  { id: "critical", label: "Critical Priority", color: "#FDAB3D" },
  { id: "standard", label: "Standard Priority", color: "#E2445C" },
  { id: "none", label: "", color: "#C4C4C4" },
]

/** Main-table Status column — values persisted as `taskStatus` label text. */
export const DEFAULT_TASK_STATUS_LABELS: DuePriorityLabel[] = [
  { id: "working-on-it", label: "Working on it", color: "#FDAB3D" },
  { id: "done", label: "Done", color: "#00C875" },
  { id: "stuck", label: "Stuck", color: "#E2445C" },
  { id: "not-started", label: "Not started", color: "#C4C4C4" },
]

/** Main-table Priority column — `priority` field stores label text. */
export const DEFAULT_PRIORITY_LABELS: DuePriorityLabel[] = [
  { id: "low", label: "Low", color: "#579BFC" },
  { id: "medium", label: "Medium", color: "#0073EA" },
  { id: "high", label: "High", color: "#E2445C" },
]

/** Main-table Notes category — `notesCategory` stores label text. */
export const DEFAULT_NOTES_CATEGORY_LABELS: DuePriorityLabel[] = [
  { id: "general-note", label: "General Note", color: "#E442BB" },
  { id: "action-item", label: "Action Item", color: "#FF6900" },
  { id: "meeting-summary", label: "Meeting Summary", color: "#7F5347" },
]

function parseLabelArray(
  raw: unknown,
  fallback: DuePriorityLabel[]
): DuePriorityLabel[] {
  if (!Array.isArray(raw)) return [...fallback]
  const out: DuePriorityLabel[] = []
  for (const x of raw) {
    if (
      x &&
      typeof x === "object" &&
      typeof (x as { id?: unknown }).id === "string" &&
      typeof (x as { label?: unknown }).label === "string" &&
      typeof (x as { color?: unknown }).color === "string"
    ) {
      out.push({
        id: (x as { id: string }).id,
        label: (x as { label: string }).label,
        color: (x as { color: string }).color,
      })
    }
  }
  return out.length > 0 ? out : [...fallback]
}

/** Saved filter “views” for the main board toolbar (JSON payload). */
export type BoardSavedFilterViewRow = {
  id: string
  name: string
  createdAt: string
  /** JSON: `{ personUserIds, personIncludeUnassigned, quick, advancedRoot }` */
  payload: string
}

/** Multi-column sort rules persisted as `tableSortRules` in board metadata. */
export type BoardTableSortRule = {
  id: string
  columnId: string | null
  direction: "asc" | "desc"
}

function parseTableSortRules(raw: unknown): BoardTableSortRule[] {
  if (!Array.isArray(raw)) return []
  const out: BoardTableSortRule[] = []
  for (const x of raw) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue
    const o = x as Record<string, unknown>
    const id = typeof o.id === "string" ? o.id.trim() : ""
    if (!id) continue
    const direction: "asc" | "desc" = o.direction === "desc" ? "desc" : "asc"
    let columnId: string | null = null
    if (typeof o.columnId === "string" && o.columnId.trim()) {
      columnId = o.columnId.trim()
    } else if (o.columnId === null) {
      columnId = null
    }
    out.push({ id, columnId, direction })
  }
  return out
}

export function parseBoardTableUiMetadata(
  meta: Record<string, unknown> | null | undefined
): {
  hiddenColumnIds: HidableBoardColumnId[]
  /** @deprecated Use `groupBySuite` — kept for compatibility (`"priority"` means any grouping active). */
  groupBy: BoardTableGroupBy
  groupBySuite: BoardGroupBySuite | null
  /** Persisted column widths (px) from `tableColumnWidthsPx` */
  columnWidthsPx: Record<string, number>
  /** Full column id order (persisted `tableColumnOrder`). */
  tableColumnOrder: string[]
  /** User-added columns (`c_…` ids) and their field kind (persisted `tableCustomColumns`). */
  tableCustomColumns: Record<string, TableCustomColumnDef>
  /** Per-group top-level item id order (persisted `groupItemOrders`). */
  groupItemOrders: Record<string, string[]>
  /** Optional display title overrides per column id (persisted `tableColumnTitles`). */
  tableColumnTitles: Record<string, string>
  /** Custom label text and colors for the 'duePriority' column (persisted `duePriorityLabels`). */
  duePriorityLabels: DuePriorityLabel[]
  /** Status column options (`statusLabels`). */
  statusLabels: DuePriorityLabel[]
  /** Priority column options (`priorityLabels`). */
  priorityLabels: DuePriorityLabel[]
  /** Notes category column options (`notesCategoryLabels`). */
  notesCategoryLabels: DuePriorityLabel[]
  /** Top-level group row order (`groupOrder` in board metadata). */
  groupOrder: string[]
  /** Named toolbar filter presets (`savedFilterViews` in board metadata). */
  savedFilterViews: BoardSavedFilterViewRow[]
  /** Multi-level column sort (`tableSortRules` in board metadata). */
  sortRules: BoardTableSortRule[]
  /** Extra horizontally sticky column ids (always includes select + task). */
  tablePinnedColumnIds: string[]
} {
  const rawHidden = meta?.hiddenTableColumnIds
  const hidden = Array.isArray(rawHidden)
    ? rawHidden.filter((id): id is HidableBoardColumnId =>
        HIDABLE_COLUMN_IDS.includes(id as HidableBoardColumnId)
      )
    : []
  const rawW = meta?.tableColumnWidthsPx
  const columnWidthsPx: Record<string, number> = {}
  if (
    rawW &&
    typeof rawW === "object" &&
    rawW !== null &&
    !Array.isArray(rawW)
  ) {
    for (const [k, v] of Object.entries(rawW)) {
      if (typeof v === "number" && Number.isFinite(v) && v > 0) {
        columnWidthsPx[k] = v
      }
    }
  }
  const rawCc = meta?.tableCustomColumns
  const tableCustomColumns: Record<string, TableCustomColumnDef> = {}
  if (
    rawCc &&
    typeof rawCc === "object" &&
    rawCc !== null &&
    !Array.isArray(rawCc)
  ) {
    for (const [k, v] of Object.entries(rawCc)) {
      if (
        typeof k === "string" &&
        k.startsWith("c_") &&
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        "kind" in v
      ) {
        const kind = (v as { kind?: unknown }).kind
        if (HIDABLE_COLUMN_IDS.includes(kind as HidableBoardColumnId)) {
          tableCustomColumns[k] = { kind: kind as HidableBoardColumnId }
        }
      }
    }
  }
  const customColumnIds = Object.keys(tableCustomColumns)

  const groupBySuite = parseTableGroupBySuite(meta, tableCustomColumns)
  const groupBy: BoardTableGroupBy = groupBySuite ? "priority" : "none"

  const rawOrder = meta?.tableColumnOrder
  const rawOrderArr = Array.isArray(rawOrder)
    ? rawOrder.filter((x): x is string => typeof x === "string")
    : undefined
  const tableColumnOrder = ensureAddColumnLastInOrder(
    ensureOwnerColumnInOrder(
      mergeBoardColumnOrder(
        rawOrderArr,
        BOARD_TABLE_COLUMN_IDS,
        customColumnIds
      )
    )
  )

  const groupItemOrders: Record<string, string[]> = {}
  const rawGio = meta?.groupItemOrders
  if (
    rawGio &&
    typeof rawGio === "object" &&
    rawGio !== null &&
    !Array.isArray(rawGio)
  ) {
    for (const [k, v] of Object.entries(rawGio)) {
      if (Array.isArray(v)) {
        groupItemOrders[k] = v.filter((x): x is string => typeof x === "string")
      }
    }
  }

  const tableColumnTitles: Record<string, string> = {}
  const rawTitles = meta?.tableColumnTitles
  if (
    rawTitles &&
    typeof rawTitles === "object" &&
    rawTitles !== null &&
    !Array.isArray(rawTitles)
  ) {
    for (const [k, v] of Object.entries(rawTitles)) {
      if (typeof k === "string" && typeof v === "string") {
        tableColumnTitles[k] = v
      }
    }
  }

  const duePriorityLabels: DuePriorityLabel[] = []
  const rawDpl = meta?.duePriorityLabels
  if (Array.isArray(rawDpl)) {
    for (const x of rawDpl) {
      if (
        x &&
        typeof x === "object" &&
        typeof x.id === "string" &&
        typeof x.label === "string" &&
        typeof x.color === "string"
      ) {
        duePriorityLabels.push({
          id: x.id,
          label: x.label,
          color: x.color,
        })
      }
    }
  }
  if (duePriorityLabels.length === 0) {
    duePriorityLabels.push(...DEFAULT_DUE_PRIORITY_LABELS)
  }

  const statusLabels = parseLabelArray(
    meta?.statusLabels,
    DEFAULT_TASK_STATUS_LABELS
  )
  const priorityLabels = parseLabelArray(
    meta?.priorityLabels,
    DEFAULT_PRIORITY_LABELS
  )
  const notesCategoryLabels = parseLabelArray(
    meta?.notesCategoryLabels,
    DEFAULT_NOTES_CATEGORY_LABELS
  )

  const rawGroupOrder = meta?.groupOrder
  const groupOrder = Array.isArray(rawGroupOrder)
    ? rawGroupOrder.filter((x): x is string => typeof x === "string")
    : []

  const savedFilterViews: BoardSavedFilterViewRow[] = []
  const rawViews = meta?.savedFilterViews
  if (Array.isArray(rawViews)) {
    for (const x of rawViews) {
      if (!x || typeof x !== "object" || Array.isArray(x)) continue
      const o = x as Record<string, unknown>
      const id = typeof o.id === "string" ? o.id.trim() : ""
      const name = typeof o.name === "string" ? o.name.trim() : ""
      const createdAt =
        typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString()
      const payload = typeof o.payload === "string" ? o.payload : ""
      if (id && name && payload) {
        savedFilterViews.push({ id, name, createdAt, payload })
      }
    }
  }

  const sortRules = parseTableSortRules(meta?.tableSortRules)

  const tablePinnedColumnIds = normalizePinnedColumnIds(
    meta?.tablePinnedColumnIds,
    tableColumnOrder
  )

  return {
    hiddenColumnIds: hidden,
    groupBy,
    groupBySuite,
    columnWidthsPx,
    tableColumnOrder,
    tableCustomColumns,
    groupItemOrders,
    tableColumnTitles,
    duePriorityLabels,
    statusLabels,
    priorityLabels,
    notesCategoryLabels,
    groupOrder,
    savedFilterViews,
    sortRules,
    tablePinnedColumnIds,
  }
}

export type BoardViewTab = "table" | "kanban"

export function defaultTaskDynamicData(): Record<string, unknown> {
  const d = new Date()
  const m = d.toLocaleString("en-US", { month: "short" })
  const day = d.getDate()
  const dueDateIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return {
    taskStatus: "Working on it",
    dueDate: `${m} ${day}`,
    dueDateIso,
    lastUpdatedLabel: "1 week ago",
    lastUpdatedBy: "User",
    filesCount: 0,
    timeline: `${m} ${day} - ${day + 1}`,
    priority: "Medium",
    budget: 0,
    rating: 0,
    dueDatePriority: "Critical Priority",
    notesCategory: "General Note",
    notesText: "",
  }
}

function gqlErrorMessage(err: unknown): string {
  const any = err as {
    graphQLErrors?: readonly { message?: string }[]
    message?: string
  }
  const gqlMsg = any.graphQLErrors?.[0]?.message
  if (gqlMsg) return gqlMsg
  if (err instanceof Error) return err.message
  return any.message || "Request failed"
}

/**
 * Apollo-backed board: `getOrCreateBoard` + task/group mutations (GRANDBOOK
 * Table + operable controls).
 */
export function useEcosystraBoardApollo() {
  const dict = useOptionalEcosystraDictionary()
  const toastMsg = useMemo(() => boardToastMessages(dict), [dict])

  const { data, previousData, loading, error, refetch } = useQuery<{
    getOrCreateBoard: GqlBoard
  }>(GET_OR_CREATE_BOARD, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  })

  const board = data?.getOrCreateBoard ?? previousData?.getOrCreateBoard

  /** Full-page skeleton only on first load — keep showing board during refetch. */
  const boardInitialLoading =
    loading && !data?.getOrCreateBoard && !previousData?.getOrCreateBoard

  const [viewTab, setViewTab] = useState<BoardViewTab>("table")
  const [openByGroupId, setOpenByGroupId] = useState<Record<string, boolean>>(
    {}
  )
  const [expandedSubitemRowId, setExpandedSubitemRowId] = useState<
    string | null
  >(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [updateBoard] = useMutation(UPDATE_BOARD, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [createItem] = useMutation(CREATE_ITEM, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [updateItem] = useMutation(UPDATE_ITEM, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [updateItemDynamicData] = useMutation(UPDATE_ITEM_DYNAMIC_DATA, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [moveItemToGroupMutation] = useMutation(MOVE_ITEM_TO_GROUP, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [createGroup] = useMutation(CREATE_GROUP, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [updateGroup] = useMutation(UPDATE_GROUP, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [deleteGroup] = useMutation(DELETE_GROUP, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [updateBoardMetadata] = useMutation(UPDATE_BOARD_METADATA, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [updateBoardSubitemColumnsMutation] = useMutation(
    UPDATE_BOARD_SUBITEM_COLUMNS,
    {
      refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
    }
  )
  const [setTaskOwnerMutation] = useMutation(SET_TASK_OWNER, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [setTaskAssigneeMutation] = useMutation(SET_TASK_ASSIGNEE, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [setTaskAssigneesMutation] = useMutation(SET_TASK_ASSIGNEES, {
    refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
  })
  const [acceptTaskAssigneeInviteMutation] = useMutation(
    ACCEPT_TASK_ASSIGNEE_INVITE,
    {
      refetchQueries: [{ query: GET_OR_CREATE_BOARD }],
    }
  )

  const tableUi = useMemo(
    () => parseBoardTableUiMetadata(board?.metadata ?? undefined),
    [board?.metadata]
  )

  const groups = useMemo(
    () => mergeGroupOrder(board?.groups ?? [], tableUi.groupOrder),
    [board?.groups, tableUi.groupOrder]
  )

  const mergedOpen = useMemo(() => {
    const out: Record<string, boolean> = { ...openByGroupId }
    for (const g of groups) {
      if (out[g.id] === undefined) out[g.id] = true
    }
    return out
  }, [groups, openByGroupId])

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return groups
    return groups.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.name.toLowerCase().includes(q)),
    }))
  }, [groups, searchQuery])

  const setGroupOpen = useCallback((groupId: string, open: boolean) => {
    setOpenByGroupId((prev) => ({ ...prev, [groupId]: open }))
  }, [])

  /** Radix Accordion `type="multiple"` passes the full open value list; sync all known group ids. */
  const setGroupsOpenFromAccordion = useCallback(
    (openIds: string[], groupIds: string[]) => {
      setOpenByGroupId((prev) => {
        const next = { ...prev }
        for (const gid of groupIds) {
          next[gid] = openIds.includes(gid)
        }
        return next
      })
    },
    []
  )

  const renameBoard = useCallback(
    async (name: string) => {
      if (!board?.id) return
      try {
        await updateBoard({ variables: { id: board.id, name } })
        toast.success(toastMsg.boardUpdated)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, updateBoard, toastMsg.boardUpdated]
  )

  const addTask = useCallback(
    async (groupId: string, name: string) => {
      if (!board?.id) return
      try {
        await createItem({
          variables: {
            name,
            boardId: board.id,
            groupId,
            dynamicData: defaultTaskDynamicData(),
          },
        })
        toast.success(toastMsg.taskCreated)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, createItem, toastMsg.taskCreated]
  )

  const addSubitem = useCallback(
    async (parentItemId: string, name: string) => {
      if (!board?.id) return
      try {
        await createItem({
          variables: {
            name,
            boardId: board.id,
            parentItemId,
            dynamicData: {
              status: "Working on it",
              dropdown: "General",
              subDueDate: "",
              subDueDateIso: "",
              subStatus2: "—",
              subNotesText: "",
              priority: "Medium",
              rating: 0,
              budget: 0,
              filesCount: 0,
              dueDatePriority: "Critical Priority",
              notesCategory: "General Note",
            },
          },
        })
        toast.success(toastMsg.subitemCreated)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, createItem, toastMsg.subitemCreated]
  )

  const patchItemField = useCallback(
    async (itemId: string, patch: Record<string, unknown>) => {
      try {
        await updateItemDynamicData({
          variables: { id: itemId, dynamicData: patch },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [updateItemDynamicData]
  )

  const renameItem = useCallback(
    async (itemId: string, name: string) => {
      try {
        await updateItem({ variables: { id: itemId, name } })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [updateItem]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        await deleteItem({ variables: { id: itemId } })
        toast.success(toastMsg.taskDeleted)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [deleteItem, toastMsg.taskDeleted]
  )

  const moveItemToGroup = useCallback(
    async (itemId: string, targetGroupId: string) => {
      try {
        await moveItemToGroupMutation({
          variables: { id: itemId, groupId: targetGroupId },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
        throw e
      }
    },
    [moveItemToGroupMutation]
  )

  const addGroup = useCallback(
    async (name: string, color?: string) => {
      if (!board?.id) return
      try {
        await createGroup({
          variables: { name, boardId: board.id, color: color ?? "#579BFC" },
        })
        toast.success(toastMsg.groupCreated)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, createGroup, toastMsg.groupCreated]
  )

  const patchGroup = useCallback(
    async (groupId: string, name?: string, color?: string) => {
      try {
        await updateGroup({ variables: { id: groupId, name, color } })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [updateGroup]
  )

  const removeGroup = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup({ variables: { id: groupId } })
        toast.success(toastMsg.groupDeleted)
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [deleteGroup, toastMsg.groupDeleted]
  )

  const subitemTableUi = useMemo(
    () => parseSubitemBoardTableUi(board?.subitemColumns),
    [board?.subitemColumns]
  )

  const patchSubitemBoardTableUi = useCallback(
    async (partial: {
      hiddenTableColumnIds?: HidableBoardColumnId[]
      tableColumnWidthsPx?: Record<string, number>
      tableColumnOrder?: string[]
      tableCustomColumns?: Record<string, TableCustomColumnDef>
      tableColumnTitles?: Record<string, string>
      itemOrdersByParent?: Record<string, string[]>
      pinnedColumnIds?: string[]
    }) => {
      if (!board?.id) return
      const cur = parseSubitemBoardTableUi(board.subitemColumns)
      const nextOrder = ensureAddColumnLastInOrder(
        partial.tableColumnOrder ?? cur.tableColumnOrder
      )
      const next: SubitemBoardTableUi = {
        hiddenColumnIds: partial.hiddenTableColumnIds ?? cur.hiddenColumnIds,
        columnWidthsPx: partial.tableColumnWidthsPx ?? cur.columnWidthsPx,
        tableColumnOrder: nextOrder,
        tableCustomColumns:
          partial.tableCustomColumns ?? cur.tableCustomColumns,
        tableColumnTitles: partial.tableColumnTitles ?? cur.tableColumnTitles,
        pinnedColumnIds:
          partial.pinnedColumnIds != null
            ? normalizePinnedColumnIds(partial.pinnedColumnIds, nextOrder)
            : cur.pinnedColumnIds,
        itemOrdersByParent:
          partial.itemOrdersByParent ?? cur.itemOrdersByParent,
      }
      try {
        await updateBoardSubitemColumnsMutation({
          variables: {
            id: board.id,
            subitemColumns: serializeSubitemBoardTableUi(next),
          },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, board?.subitemColumns, updateBoardSubitemColumnsMutation]
  )

  const addSubitemBoardColumn = useCallback(
    async (kind: HidableBoardColumnId) => {
      if (!board?.id) return
      const cur = parseSubitemBoardTableUi(board.subitemColumns)
      const newId = newCustomTableColumnId()
      const nextOrder = orderWithColumnBeforeAdd(
        cur.tableColumnOrder,
        newId,
        SUBITEM_DEFAULT_BOARD_COLUMN_IDS
      )
      const next: SubitemBoardTableUi = {
        ...cur,
        tableColumnOrder: ensureAddColumnLastInOrder(nextOrder),
        tableCustomColumns: { ...cur.tableCustomColumns, [newId]: { kind } },
      }
      try {
        await updateBoardSubitemColumnsMutation({
          variables: {
            id: board.id,
            subitemColumns: serializeSubitemBoardTableUi(next),
          },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [board?.id, board?.subitemColumns, updateBoardSubitemColumnsMutation]
  )

  const patchBoardTableUi = useCallback(
    async (partial: {
      hiddenTableColumnIds?: HidableBoardColumnId[]
      tableGroupBy?: BoardTableGroupBy
      /** Main-table row grouping (`tableGroupBySuite` in board metadata). */
      tableGroupBySuite?: BoardGroupBySuite | null
      /** Full merged map — shallow-merged server-side into board metadata */
      tableColumnWidthsPx?: Record<string, number>
      /** Full merged column id list */
      tableColumnOrder?: string[]
      /** Full merged per-group item id lists */
      groupItemOrders?: Record<string, string[]>
      /** Full merged map of `c_…` column id → `{ kind }` */
      tableCustomColumns?: Record<string, TableCustomColumnDef>
      /** Full merged map of column id → display title override */
      tableColumnTitles?: Record<string, string>
      /** Full merged list for the main-table Due priority column */
      duePriorityLabels?: DuePriorityLabel[]
      /** Full merged list for the Status column */
      statusLabels?: DuePriorityLabel[]
      /** Full merged list for the Priority column */
      priorityLabels?: DuePriorityLabel[]
      /** Full merged list for the Notes category column */
      notesCategoryLabels?: DuePriorityLabel[]
      /** Full merged top-level group id list (main table accordion order) */
      groupOrder?: string[]
      /** Named filter views for the board toolbar */
      savedFilterViews?: BoardSavedFilterViewRow[]
      /** Multi-column sort rules (`tableSortRules` in board metadata) */
      tableSortRules?: BoardTableSortRule[]
      /** Extra sticky column ids for horizontal scroll (`tablePinnedColumnIds`). */
      tablePinnedColumnIds?: string[]
    }): Promise<boolean> => {
      if (!board?.id) return false
      try {
        await updateBoardMetadata({
          variables: {
            id: board.id,
            metadata: partial,
          },
        })
        return true
      } catch (e) {
        toast.error(gqlErrorMessage(e))
        return false
      }
    },
    [board?.id, updateBoardMetadata]
  )

  const setTaskOwnerFn = useCallback(
    async (itemId: string, ownerUserId: string | null) => {
      try {
        await setTaskOwnerMutation({
          variables: { itemId, ownerUserId },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [setTaskOwnerMutation]
  )

  const setTaskAssigneeFn = useCallback(
    async (itemId: string, assigneeUserId: string | null) => {
      try {
        await setTaskAssigneeMutation({
          variables: { itemId, assigneeUserId },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [setTaskAssigneeMutation]
  )

  const setTaskAssigneesFn = useCallback(
    async (
      itemId: string,
      assigneeUserIds: string[],
      inviteEmails: string[]
    ) => {
      try {
        await setTaskAssigneesMutation({
          variables: { itemId, assigneeUserIds, inviteEmails },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
      }
    },
    [setTaskAssigneesMutation]
  )

  const acceptTaskAssigneeInviteFn = useCallback(
    async (token: string) => {
      try {
        await acceptTaskAssigneeInviteMutation({ variables: { token } })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
        throw e
      }
    },
    [acceptTaskAssigneeInviteMutation]
  )

  return {
    board,
    loading,
    boardInitialLoading,
    error,
    refetch,
    viewTab,
    setViewTab,
    openByGroupId: mergedOpen,
    setGroupOpen,
    setGroupsOpenFromAccordion,
    expandedSubitemRowId,
    setExpandedSubitemRowId,
    searchQuery,
    setSearchQuery,
    filteredGroups,
    renameBoard,
    addTask,
    addSubitem,
    patchItemField,
    renameItem,
    removeItem,
    moveItemToGroup,
    addGroup,
    patchGroup,
    removeGroup,
    tableUi,
    subitemTableUi,
    patchSubitemBoardTableUi,
    addSubitemBoardColumn,
    patchBoardTableUi,
    setTaskOwner: setTaskOwnerFn,
    setTaskAssignee: setTaskAssigneeFn,
    setTaskAssignees: setTaskAssigneesFn,
    acceptTaskAssigneeInvite: acceptTaskAssigneeInviteFn,
    gql: {
      SEARCH_WORKSPACE,
      WORKSPACE_USERS,
    },
  }
}
