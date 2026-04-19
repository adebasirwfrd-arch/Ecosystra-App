/**
 * Board filter value extraction + matching. Column icons use lucide + Monday-style
 * color chips (aligned with `ecosystra-board-add-column-popover`). For SVG assets
 * from the Vibe / Monday icon set, see MCP server `user-vibe` tool `list-vibe-icons`.
 */
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  ChevronDown,
  CircleDot,
  Clock,
  FileText,
  GanttChart,
  Hash,
  Layers,
  ListTodo,
  Star,
  Type,
  UserCircle,
  Users,
} from "lucide-react"

import { filesCountFromDynamic } from "@/lib/ecosystra/board-drive-attachment"

import { ecoCcFieldKey } from "./ecosystra-board-cc-field-key"
import type {
  DuePriorityLabel,
  GqlBoardGroup,
  GqlBoardItem,
  HidableBoardColumnId,
  TableCustomColumnDef,
} from "./hooks/use-ecosystra-board-apollo"
import { readAssigneeUserIdsFromDynamic } from "./hooks/use-ecosystra-board-apollo"

export const GROUP_FACET_COLUMN_ID = "__eco_group"
export const BOARD_UNASSIGNED_PERSON_ID = "__eco_board_unassigned"

export type BoardFilterColumnMeta = {
  id: string
  kind: HidableBoardColumnId | "task" | "group"
  title: string
  valueKind: "text" | "number" | "users" | "taskName" | "group"
}

export type AdvancedFilterRuleNode = {
  type: "rule"
  id: string
  columnId: string
  condition: string
  value: string
}

export type AdvancedFilterGroupNode = {
  type: "group"
  id: string
  combinator: "AND" | "OR"
  children: AdvancedFilterNode[]
}

export type AdvancedFilterNode = AdvancedFilterRuleNode | AdvancedFilterGroupNode

export function newAdvancedNodeId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return `${prefix}_${crypto.randomUUID().slice(0, 10)}`
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

export function safeParseAdvancedRoot(raw: unknown): AdvancedFilterNode | null {
  if (raw == null) return null
  if (typeof raw !== "object" || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  if (o.type === "rule" && typeof o.columnId === "string") {
    return {
      type: "rule",
      id: typeof o.id === "string" ? o.id : newAdvancedNodeId("rule"),
      columnId: o.columnId,
      condition: typeof o.condition === "string" ? o.condition : "is",
      value: typeof o.value === "string" ? o.value : "",
    }
  }
  if (
    o.type === "group" &&
    (o.combinator === "AND" || o.combinator === "OR") &&
    Array.isArray(o.children)
  ) {
    const children = (o.children as unknown[])
      .map(safeParseAdvancedRoot)
      .filter((x): x is AdvancedFilterNode => x !== null)
    return {
      type: "group",
      id: typeof o.id === "string" ? o.id : newAdvancedNodeId("grp"),
      combinator: o.combinator,
      children,
    }
  }
  return null
}

export function advancedTreeIsActive(root: AdvancedFilterNode | null): boolean {
  if (!root) return false
  if (root.type === "rule") return true
  return root.children.length > 0
}

/** Flat list (legacy) → single AND group. */
export function rulesFlatToGroup(
  rules: Array<{
    id: string
    columnId: string
    condition: string
    value: string
  }>
): AdvancedFilterGroupNode {
  return {
    type: "group",
    id: newAdvancedNodeId("grp"),
    combinator: "AND",
    children: rules.map((r) => ({
      type: "rule" as const,
      id: r.id,
      columnId: r.columnId,
      condition: r.condition,
      value: r.value,
    })),
  }
}

export function columnKindIcon(
  kind: BoardFilterColumnMeta["kind"]
): { Icon: LucideIcon; iconClass: string } {
  const m: Record<string, { Icon: LucideIcon; iconClass: string }> = {
    group: { Icon: Layers, iconClass: "bg-amber-400" },
    task: { Icon: Type, iconClass: "bg-violet-500" },
    status: { Icon: CircleDot, iconClass: "bg-emerald-500" },
    notes: { Icon: Type, iconClass: "bg-amber-400" },
    owner: { Icon: UserCircle, iconClass: "bg-indigo-500" },
    assignee: { Icon: Users, iconClass: "bg-sky-400" },
    notesCategory: { Icon: ChevronDown, iconClass: "bg-emerald-600" },
    dueDate: { Icon: Calendar, iconClass: "bg-violet-500" },
    date: { Icon: CalendarDays, iconClass: "bg-sky-600" },
    budget: { Icon: Hash, iconClass: "bg-amber-500" },
    rating: { Icon: Star, iconClass: "bg-amber-300" },
    files: { Icon: FileText, iconClass: "bg-red-500" },
    timeline: { Icon: GanttChart, iconClass: "bg-violet-600" },
    priority: { Icon: Layers, iconClass: "bg-amber-600" },
    duePriority: { Icon: AlertTriangle, iconClass: "bg-orange-500" },
    lastUpdated: { Icon: Clock, iconClass: "bg-slate-500" },
  }
  return (
    m[kind] ?? { Icon: ListTodo, iconClass: "bg-slate-500" }
  )
}

function resolveLabelPick(raw: unknown, labels: DuePriorityLabel[]): string {
  const s = String(raw ?? "").trim()
  if (!s) return ""
  const hit = labels.find((l) => l.label === s || l.id === s)
  return hit?.label ?? s
}

function budgetNumber(d: Record<string, unknown>): number {
  const b = d.budget
  if (typeof b === "number" && Number.isFinite(b)) return b
  if (typeof b === "string" && b.trim()) {
    const n = Number(b.replace(/[^\d.-]/g, ""))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function filesCountFrom(d: Record<string, unknown>): number {
  return filesCountFromDynamic(d)
}

function priorityDisplay(
  d: Record<string, unknown>,
  priorityLabels: DuePriorityLabel[]
): string {
  const raw = String(d.priority ?? "").trim()
  if (raw) {
    const hit = priorityLabels.find((l) => l.label === raw || l.id === raw)
    if (hit) return hit.label
  }
  const n = Number(d.priorityRank ?? d.priority_rank ?? NaN)
  if (n === 1) return priorityLabels.find((l) => l.label === "Low")?.label ?? "Low"
  if (n === 2)
    return priorityLabels.find((l) => l.label === "Medium")?.label ?? "Medium"
  if (n === 3)
    return priorityLabels.find((l) => l.label === "High")?.label ?? "High"
  return raw || ""
}

export function resolveColumnKind(
  columnId: string,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): HidableBoardColumnId | "task" | "group" {
  if (columnId === GROUP_FACET_COLUMN_ID) return "group"
  if (columnId === "task") return "task"
  const custom = tableCustomColumns[columnId]
  if (custom) return custom.kind
  return columnId as HidableBoardColumnId
}

const KIND_TITLE_KEY: Partial<
  Record<HidableBoardColumnId | "task" | "group", string>
> = {
  group: "colGroupFilter",
  task: "colTask",
  status: "colStatus",
  dueDate: "colDueDate",
  date: "colDate",
  lastUpdated: "colLastUpdated",
  files: "colFiles",
  timeline: "colTimeline",
  priority: "colPriority",
  budget: "colBudget",
  duePriority: "colDueDatePriority",
  owner: "colOwner",
  assignee: "colAssignee",
  rating: "colRating",
  notes: "colNotes",
  notesCategory: "colNotesCategory",
}

export function buildBoardFilterColumns(params: {
  tableColumnOrder: string[]
  hiddenColumnIds: readonly string[]
  tableCustomColumns: Record<string, TableCustomColumnDef>
  tableColumnTitles: Record<string, string>
  dict: Record<string, string>
}): BoardFilterColumnMeta[] {
  const hidden = new Set(params.hiddenColumnIds)
  const out: BoardFilterColumnMeta[] = [
    {
      id: GROUP_FACET_COLUMN_ID,
      kind: "group",
      title: params.dict.colGroupFilter ?? "Group",
      valueKind: "group",
    },
  ]
  for (const id of params.tableColumnOrder) {
    if (id === "select" || id === "add") continue
    if (hidden.has(id)) continue
    const kind = resolveColumnKind(id, params.tableCustomColumns)
    const titleKey = KIND_TITLE_KEY[kind]
    const fallback =
      (titleKey && params.dict[titleKey]) || String(kind).replace(/([A-Z])/g, " $1")
    const title = params.tableColumnTitles[id]?.trim() || fallback
    let valueKind: BoardFilterColumnMeta["valueKind"] = "text"
    if (id === "task") valueKind = "taskName"
    else if (kind === "group") valueKind = "group"
    else if (kind === "assignee" || kind === "owner") valueKind = "users"
    else if (kind === "rating" || kind === "budget") valueKind = "number"
    else valueKind = "text"
    out.push({ id, kind, title, valueKind })
  }
  return out
}

export function readFacetScalar(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): string {
  const d = item.dynamicData || {}
  if (col.id === GROUP_FACET_COLUMN_ID) return group.id
  if (col.kind === "task" || col.id === "task") return item.name.trim() || "—"
  if (col.id.startsWith("c_")) {
    const fk = ecoCcFieldKey(col.id)
    const kind = tableCustomColumns[col.id]?.kind
    if (kind === "rating" || kind === "budget") {
      if (kind === "budget")
        return String(budgetNumber({ budget: d[fk] } as Record<string, unknown>))
      return String(d[fk] ?? "").trim() || "0"
    }
    return String(d[fk] ?? "").trim()
  }
  switch (col.kind) {
    case "status":
      return resolveLabelPick(d.taskStatus, labels.statusLabels)
    case "notesCategory":
      return resolveLabelPick(d.notesCategory, labels.notesCategoryLabels)
    case "priority":
      return priorityDisplay(d, labels.priorityLabels)
    case "duePriority":
      return resolveLabelPick(d.dueDatePriority, labels.duePriorityLabels)
    case "dueDate":
      return String(d.dueDate ?? "").trim()
    case "notes":
      return String(d.notesText ?? "").trim()
    case "timeline":
      return String(d.timeline ?? "").trim()
    case "budget":
      return String(budgetNumber(d))
    case "rating":
      return String(d.rating ?? "").trim() || "0"
    case "files":
      return String(filesCountFrom(d))
    case "lastUpdated":
      return String(d.lastUpdatedLabel ?? "").trim() || item.updatedAt
    default:
      return ""
  }
}

/** Shared label maps for `readFacetScalar` / board sort. */
export type BoardFacetLabels = {
  statusLabels: DuePriorityLabel[]
  priorityLabels: DuePriorityLabel[]
  notesCategoryLabels: DuePriorityLabel[]
  duePriorityLabels: DuePriorityLabel[]
}

function sortParseNumber(s: string): number | null {
  const n = Number(String(s).replace(/,/g, "."))
  return Number.isFinite(n) ? n : null
}

/**
 * Compare two rows for one sort column (ascending: negative if a sorts before b).
 * Uses the same column metadata as filters — fully dynamic per board table.
 */
export function compareForBoardSort(
  a: { item: GqlBoardItem; group: GqlBoardGroup },
  b: { item: GqlBoardItem; group: GqlBoardGroup },
  columnId: string,
  columns: BoardFilterColumnMeta[],
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: BoardFacetLabels,
  resolveUserLabel?: (userId: string) => string
): number {
  const col = columns.find((c) => c.id === columnId)
  if (!col) return 0

  if (col.id === GROUP_FACET_COLUMN_ID) {
    const na = (a.group.name || "").trim() || a.group.id
    const nb = (b.group.name || "").trim() || b.group.id
    return na.localeCompare(nb, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (col.kind === "owner") {
    const oa = readOwnerUserId(a.item.dynamicData || {})
    const ob = readOwnerUserId(b.item.dynamicData || {})
    const sa = ((resolveUserLabel?.(oa) ?? oa) || "—").toLowerCase()
    const sb = ((resolveUserLabel?.(ob) ?? ob) || "—").toLowerCase()
    return sa.localeCompare(sb, undefined, { sensitivity: "base" })
  }

  if (col.kind === "assignee") {
    const aa = readAssigneeUserIdsFromDynamic(a.item.dynamicData || {})
    const ab = readAssigneeUserIdsFromDynamic(b.item.dynamicData || {})
    const sa = (
      aa.length === 0
        ? "—"
        : aa.map((id) => resolveUserLabel?.(id) ?? id).join(", ")
    ).toLowerCase()
    const sb = (
      ab.length === 0
        ? "—"
        : ab.map((id) => resolveUserLabel?.(id) ?? id).join(", ")
    ).toLowerCase()
    return sa.localeCompare(sb, undefined, { sensitivity: "base" })
  }

  if (col.kind === "lastUpdated") {
    const ta = Date.parse(a.item.updatedAt) || 0
    const tb = Date.parse(b.item.updatedAt) || 0
    if (ta !== tb) return ta < tb ? -1 : 1
    return 0
  }

  if (col.kind === "dueDate" || col.kind === "date") {
    const da = a.item.dynamicData || {}
    const db = b.item.dynamicData || {}
    const isoA = String(da.dueDateIso ?? da.dateIso ?? "").trim()
    const isoB = String(db.dueDateIso ?? db.dateIso ?? "").trim()
    if (isoA && isoB) {
      const pa = Date.parse(isoA)
      const pb = Date.parse(isoB)
      if (Number.isFinite(pa) && Number.isFinite(pb) && pa !== pb) {
        return pa < pb ? -1 : 1
      }
    }
    const sa = readFacetScalar(
      a.item,
      a.group,
      col,
      tableCustomColumns,
      labels
    )
    const sb = readFacetScalar(
      b.item,
      b.group,
      col,
      tableCustomColumns,
      labels
    )
    return sa.localeCompare(sb, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (
    col.valueKind === "number" ||
    col.kind === "files" ||
    col.kind === "budget" ||
    col.kind === "rating"
  ) {
    const sa = readFacetScalar(
      a.item,
      a.group,
      col,
      tableCustomColumns,
      labels
    )
    const sb = readFacetScalar(
      b.item,
      b.group,
      col,
      tableCustomColumns,
      labels
    )
    const na = sortParseNumber(sa) ?? 0
    const nb = sortParseNumber(sb) ?? 0
    if (na !== nb) return na < nb ? -1 : 1
    return 0
  }

  const sa = readFacetScalar(
    a.item,
    a.group,
    col,
    tableCustomColumns,
    labels
  )
  const sb = readFacetScalar(
    b.item,
    b.group,
    col,
    tableCustomColumns,
    labels
  )
  return sa.localeCompare(sb, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

export function readOwnerUserId(d: Record<string, unknown>): string {
  return String(d.ownerUserId ?? "").trim()
}

export function itemPersonMatch(
  item: GqlBoardItem,
  selectedUserIds: string[],
  includeUnassigned: boolean
): boolean {
  if (selectedUserIds.length === 0 && !includeUnassigned) return true
  const d = item.dynamicData || {}
  const ownerId = readOwnerUserId(d)
  const assigneeIds = readAssigneeUserIdsFromDynamic(d)
  const isUnassigned = !ownerId && assigneeIds.length === 0
  const matchUser = selectedUserIds.some(
    (id) => id && (ownerId === id || assigneeIds.includes(id))
  )
  const matchUn = includeUnassigned && isUnassigned
  return matchUser || matchUn
}

export function collectBoardPersonIds(items: GqlBoardItem[]): {
  userIds: string[]
  hasUnassigned: boolean
} {
  const ids = new Set<string>()
  let hasUnassigned = false
  for (const it of items) {
    const d = it.dynamicData || {}
    const oid = readOwnerUserId(d)
    const aids = readAssigneeUserIdsFromDynamic(d)
    if (oid) ids.add(oid)
    for (const a of aids) ids.add(a)
    if (!oid && aids.length === 0) hasUnassigned = true
  }
  return { userIds: [...ids], hasUnassigned }
}

export type FacetOption = {
  key: string
  label: string
  count: number
  color?: string | null
}

export function buildFacetsForColumn(
  col: BoardFilterColumnMeta,
  groups: GqlBoardGroup[],
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  },
  maxOptions = 24
): FacetOption[] {
  const counts = new Map<string, { label: string; count: number; color?: string | null }>()
  const bump = (key: string, label: string, color?: string | null) => {
    const cur = counts.get(key)
    if (cur) cur.count += 1
    else counts.set(key, { label, count: 1, color })
  }

  for (const g of groups) {
    for (const it of g.items) {
      if (col.valueKind === "users" && col.kind === "assignee") {
        const d = it.dynamicData || {}
        const aids = readAssigneeUserIdsFromDynamic(d)
        if (aids.length === 0) bump(BOARD_UNASSIGNED_PERSON_ID, "—", null)
        else for (const id of aids) bump(id, id, null)
        continue
      }
      if (col.valueKind === "users" && col.kind === "owner") {
        const d = it.dynamicData || {}
        const oid = readOwnerUserId(d)
        if (!oid) bump(BOARD_UNASSIGNED_PERSON_ID, "—", null)
        else bump(oid, oid, null)
        continue
      }
      const raw = readFacetScalar(it, g, col, tableCustomColumns, labels)
      const key = raw || "—"
      let color: string | null | undefined
      if (col.kind === "status") {
        color =
          labels.statusLabels.find((l) => l.label === key || l.id === key)?.color ??
          null
      } else if (col.kind === "priority") {
        color =
          labels.priorityLabels.find((l) => l.label === key || l.id === key)?.color ??
          null
      } else if (col.kind === "notesCategory") {
        color =
          labels.notesCategoryLabels.find((l) => l.label === key || l.id === key)
            ?.color ?? null
      } else if (col.kind === "duePriority") {
        color =
          labels.duePriorityLabels.find((l) => l.label === key || l.id === key)
            ?.color ?? null
      }
      if (col.id === GROUP_FACET_COLUMN_ID) bump(g.id, g.name.trim() || g.id, g.color)
      else bump(key, key, color ?? null)
    }
  }

  const list: FacetOption[] = [...counts.entries()]
    .map(([key, v]) => ({
      key,
      label: v.label,
      count: v.count,
      color: v.color,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  return list.slice(0, maxOptions)
}

function itemMatchesQuickColumn(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  col: BoardFilterColumnMeta,
  selected: string[],
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): boolean {
  if (selected.length === 0) return true
  if (col.valueKind === "users" && col.kind === "assignee") {
    const aids = readAssigneeUserIdsFromDynamic(item.dynamicData || {})
    const wantUn = selected.includes(BOARD_UNASSIGNED_PERSON_ID)
    const userPicks = selected.filter((x) => x !== BOARD_UNASSIGNED_PERSON_ID)
    const matchUn = wantUn && aids.length === 0
    const matchUser =
      userPicks.length > 0 && userPicks.some((id) => aids.includes(id))
    if (wantUn && userPicks.length === 0) return matchUn
    if (!wantUn && userPicks.length > 0) return matchUser
    return matchUn || matchUser
  }
  if (col.valueKind === "users" && col.kind === "owner") {
    const oid = readOwnerUserId(item.dynamicData || {})
    const wantUn = selected.includes(BOARD_UNASSIGNED_PERSON_ID)
    const userPicks = selected.filter((x) => x !== BOARD_UNASSIGNED_PERSON_ID)
    const matchUn = wantUn && !oid
    const matchUser = userPicks.length > 0 && userPicks.includes(oid)
    if (wantUn && userPicks.length === 0) return matchUn
    if (!wantUn && userPicks.length > 0) return matchUser
    return matchUn || matchUser
  }
  const scalar = readFacetScalar(item, group, col, tableCustomColumns, labels)
  return selected.includes(scalar) || (selected.includes("—") && !scalar)
}

export function itemMatchesQuickSelections(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  selections: Record<string, string[]>,
  columns: BoardFilterColumnMeta[],
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): boolean {
  const colById = new Map(columns.map((c) => [c.id, c]))
  for (const [colId, sel] of Object.entries(selections)) {
    if (!sel?.length) continue
    const col = colById.get(colId)
    if (!col) continue
    if (!itemMatchesQuickColumn(item, group, col, sel, tableCustomColumns, labels))
      return false
  }
  return true
}

function parseNum(s: string): number | null {
  const n = Number(String(s).replace(/,/g, "."))
  return Number.isFinite(n) ? n : null
}

function itemMatchesOneAdvancedRule(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  rule: AdvancedFilterRuleNode,
  colById: Map<string, BoardFilterColumnMeta>,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): boolean {
  const col = colById.get(rule.columnId)
  if (!col) return true
  const d = item.dynamicData || {}
  const cond = rule.condition
  const val = rule.value.trim()
  if (!val && cond !== "is_empty" && cond !== "is_not_empty") return true
  if (col.valueKind === "users") {
    const oid = readOwnerUserId(d)
    const aids = readAssigneeUserIdsFromDynamic(d)
    const empty = !oid && aids.length === 0
    if (cond === "is_empty") return empty
    if (cond === "is_not_empty") return !empty
    if (col.kind === "owner") {
      if (cond === "is") {
        if (val === BOARD_UNASSIGNED_PERSON_ID) return !oid
        return oid === val
      }
      if (cond === "is_not") {
        if (val === BOARD_UNASSIGNED_PERSON_ID) return !!oid
        return oid !== val
      }
      return true
    }
    if (col.kind === "assignee") {
      if (cond === "is") {
        if (val === BOARD_UNASSIGNED_PERSON_ID) return aids.length === 0
        return aids.includes(val)
      }
      if (cond === "is_not") {
        if (val === BOARD_UNASSIGNED_PERSON_ID) return aids.length > 0
        return !aids.includes(val)
      }
      return true
    }
  }
  const scalar = readFacetScalar(item, group, col, tableCustomColumns, labels)
  const nScalar = parseNum(scalar)
  const nVal = parseNum(val)
  if (col.valueKind === "number") {
    if (cond === "is_empty") return scalar === "" || scalar === "0"
    if (cond === "is_not_empty") return scalar !== "" && scalar !== "0"
    if (cond === "is")
      return nScalar !== null && nVal !== null && nScalar === nVal
    if (cond === "gt")
      return nScalar !== null && nVal !== null && nScalar > nVal
    if (cond === "lt")
      return nScalar !== null && nVal !== null && nScalar < nVal
    return true
  }
  if (cond === "is_empty") return !scalar.trim()
  if (cond === "is_not_empty") return !!scalar.trim()
  const sl = scalar.toLowerCase()
  const vl = val.toLowerCase()
  if (cond === "is") return scalar === val
  if (cond === "is_not") return scalar !== val
  if (cond === "contains") return sl.includes(vl)
  if (cond === "not_contains") return !sl.includes(vl)
  return true
}

function evalAdvancedNode(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  node: AdvancedFilterNode,
  colById: Map<string, BoardFilterColumnMeta>,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): boolean {
  if (node.type === "rule") {
    return itemMatchesOneAdvancedRule(
      item,
      group,
      node,
      colById,
      tableCustomColumns,
      labels
    )
  }
  const parts = node.children.map((c) =>
    evalAdvancedNode(item, group, c, colById, tableCustomColumns, labels)
  )
  if (parts.length === 0) return true
  return node.combinator === "AND" ? parts.every(Boolean) : parts.some(Boolean)
}

export function itemMatchesAdvancedRoot(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  root: AdvancedFilterNode | null,
  columns: BoardFilterColumnMeta[],
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: {
    statusLabels: DuePriorityLabel[]
    priorityLabels: DuePriorityLabel[]
    notesCategoryLabels: DuePriorityLabel[]
    duePriorityLabels: DuePriorityLabel[]
  }
): boolean {
  if (!root) return true
  const colById = new Map(columns.map((c) => [c.id, c]))
  return evalAdvancedNode(
    item,
    group,
    root,
    colById,
    tableCustomColumns,
    labels
  )
}

export function conditionsForValueKind(
  vk: BoardFilterColumnMeta["valueKind"]
): { value: string; label: string }[] {
  if (vk === "number") {
    return [
      { value: "is", label: "is" },
      { value: "gt", label: ">" },
      { value: "lt", label: "<" },
      { value: "is_empty", label: "is empty" },
      { value: "is_not_empty", label: "is not empty" },
    ]
  }
  if (vk === "users") {
    return [
      { value: "is", label: "is" },
      { value: "is_not", label: "is not" },
      { value: "is_empty", label: "is empty" },
      { value: "is_not_empty", label: "is not empty" },
    ]
  }
  return [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
  ]
}
