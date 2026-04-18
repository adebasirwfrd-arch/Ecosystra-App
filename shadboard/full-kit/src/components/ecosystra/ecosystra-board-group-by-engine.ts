/**
 * Board “group by” row segmentation — bucket keys, order modes, and segment lists
 * for the main group table (Monday-style sections).
 */

import {
  readFacetScalar,
  readOwnerUserId,
  resolveColumnKind,
  type BoardFacetLabels,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import {
  readAssigneeUserIdsFromDynamic,
  type DuePriorityLabel,
  type GqlBoardGroup,
  type GqlBoardItem,
  type HidableBoardColumnId,
  type TableCustomColumnDef,
} from "./hooks/use-ecosystra-board-apollo"

export type BoardGroupByOrder =
  | "labels_asc"
  | "labels_desc"
  | "az"
  | "za"
  | "system_asc"
  | "system_desc"
  | "chronological_asc"
  | "chronological_desc"
  | "numeric_asc"
  | "numeric_desc"

export const BOARD_GROUP_BY_ORDER_VALUES = [
  "labels_asc",
  "labels_desc",
  "az",
  "za",
  "system_asc",
  "system_desc",
  "chronological_asc",
  "chronological_desc",
  "numeric_asc",
  "numeric_desc",
] as const satisfies readonly BoardGroupByOrder[]

export function isBoardGroupByOrder(s: string): s is BoardGroupByOrder {
  return (BOARD_GROUP_BY_ORDER_VALUES as readonly string[]).includes(s)
}

export type BoardGroupBySuite = {
  columnId: string
  order: BoardGroupByOrder
  showEmpty: boolean
}

export type BoardGroupRowSeg =
  | { type: "header"; key: string; label: string }
  | { type: "row"; key: string; item: GqlBoardItem }

export function groupColumnMetaStub(
  columnId: string,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): BoardFilterColumnMeta {
  const kind = resolveColumnKind(columnId, tableCustomColumns)
  let valueKind: BoardFilterColumnMeta["valueKind"] = "text"
  if (columnId === "task") valueKind = "taskName"
  else if (kind === "group") valueKind = "group"
  else if (kind === "assignee" || kind === "owner") valueKind = "users"
  else if (kind === "rating" || kind === "budget") valueKind = "number"
  return { id: columnId, kind, title: columnId, valueKind }
}

type WorkspaceUser = { id: string; name: string | null; email: string }

function userLabel(
  id: string,
  users: WorkspaceUser[],
  emptyLabel: string
): string {
  if (!id.trim()) return emptyLabel
  const u = users.find((x) => x.id === id)
  return (u?.name || u?.email || id).trim()
}

function itemPriorityRank(d: Record<string, unknown>): number {
  const raw = String(d.priority ?? "").trim()
  if (/high/i.test(raw)) return 3
  if (/medium/i.test(raw)) return 2
  if (/low/i.test(raw)) return 1
  const n = Number(d.priorityRank ?? d.priority_rank ?? NaN)
  if (n === 3) return 3
  if (n === 2) return 2
  if (n === 1) return 1
  return 0
}

function resolvePriorityBucketLabel(
  d: Record<string, unknown>,
  priorityLabels: DuePriorityLabel[]
): string {
  const raw = String(d.priority ?? "").trim()
  const hit = priorityLabels.find((l) => l.label === raw || l.id === raw)
  if (hit) return hit.label
  const r = itemPriorityRank(d)
  if (r === 3)
    return priorityLabels.find((l) => /high/i.test(l.label))?.label ?? "High"
  if (r === 2)
    return (
      priorityLabels.find((l) => /medium/i.test(l.label))?.label ?? "Medium"
    )
  if (r === 1)
    return priorityLabels.find((l) => /low/i.test(l.label))?.label ?? "Low"
  return raw || "—"
}

export function columnGroupFamily(
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): "labels" | "date" | "numeric" | "users" | "text" {
  const kind: HidableBoardColumnId | "task" | "group" = col.id.startsWith(
    "c_"
  )
    ? (tableCustomColumns[col.id]?.kind ?? col.kind)
    : col.kind
  if (
    kind === "status" ||
    kind === "priority" ||
    kind === "notesCategory" ||
    kind === "duePriority"
  )
    return "labels"
  if (
    kind === "dueDate" ||
    kind === "date" ||
    kind === "timeline" ||
    kind === "lastUpdated"
  )
    return "date"
  if (kind === "budget" || kind === "rating" || kind === "files")
    return "numeric"
  if (kind === "owner" || kind === "assignee") return "users"
  if (col.valueKind === "number") return "numeric"
  return "text"
}

function labelListForColumn(
  col: BoardFilterColumnMeta,
  labels: BoardFacetLabels,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): string[] {
  const fam = columnGroupFamily(col, tableCustomColumns)
  if (fam !== "labels") return []
  const kind = col.id.startsWith("c_")
    ? (tableCustomColumns[col.id]?.kind ?? col.kind)
    : col.kind
  if (kind === "status")
    return labels.statusLabels.map((l) => l.label).filter(Boolean)
  if (kind === "priority")
    return labels.priorityLabels.map((l) => l.label).filter(Boolean)
  if (kind === "notesCategory")
    return labels.notesCategoryLabels.map((l) => l.label).filter(Boolean)
  if (kind === "duePriority")
    return labels.duePriorityLabels.map((l) => l.label).filter(Boolean)
  return []
}

function bucketKeyAndDisplay(
  item: GqlBoardItem,
  group: GqlBoardGroup,
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: BoardFacetLabels,
  workspaceUsers: WorkspaceUser[],
  unassignedLabel: string
): { key: string; display: string } {
  const d = item.dynamicData || {}
  const kind = col.id.startsWith("c_")
    ? (tableCustomColumns[col.id]?.kind ?? col.kind)
    : col.kind

  if (kind === "owner") {
    const oid = readOwnerUserId(d)
    const display = userLabel(oid, workspaceUsers, unassignedLabel)
    return { key: oid || "__unassigned__", display }
  }

  if (kind === "assignee") {
    const aids = readAssigneeUserIdsFromDynamic(d)
    if (aids.length === 0)
      return { key: "__unassigned__", display: unassignedLabel }
    const sorted = [...aids].sort()
    const display = sorted
      .map((id) => userLabel(id, workspaceUsers, id))
      .join(", ")
    return { key: sorted.join(","), display }
  }

  if (kind === "priority") {
    const display = resolvePriorityBucketLabel(d, labels.priorityLabels)
    return { key: display, display }
  }

  const scalar = readFacetScalar(
    item,
    group,
    col,
    tableCustomColumns,
    labels
  ).trim()
  const display = scalar || "—"
  return { key: display, display }
}

function parseIsoFromItem(
  item: GqlBoardItem,
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): number {
  const kind = col.id.startsWith("c_")
    ? (tableCustomColumns[col.id]?.kind ?? col.kind)
    : col.kind
  const d = item.dynamicData || {}
  if (kind === "lastUpdated") {
    return Date.parse(item.updatedAt) || 0
  }
  if (kind === "dueDate" || kind === "date") {
    const iso = String(d.dueDateIso ?? d.dateIso ?? "").trim()
    const t = Date.parse(iso)
    if (Number.isFinite(t)) return t
  }
  if (kind === "timeline") {
    const iso = String(d.timelineIso ?? "").trim()
    const t = Date.parse(iso)
    if (Number.isFinite(t)) return t
  }
  return NaN
}

export function defaultGroupByOrderForColumn(
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): BoardGroupByOrder {
  const fam = columnGroupFamily(col, tableCustomColumns)
  if (fam === "labels") return "labels_asc"
  if (fam === "date") return "system_asc"
  if (fam === "numeric") return "numeric_asc"
  return "az"
}

function allowedGroupByOrders(
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): BoardGroupByOrder[] {
  const fam = columnGroupFamily(col, tableCustomColumns)
  if (fam === "labels")
    return ["labels_asc", "labels_desc", "az", "za"]
  if (fam === "date")
    return [
      "system_asc",
      "system_desc",
      "chronological_asc",
      "chronological_desc",
    ]
  if (fam === "numeric") return ["numeric_asc", "numeric_desc"]
  return ["az", "za"]
}

function dictLabelForGroupByOrder(
  order: BoardGroupByOrder,
  dict: Record<string, string>
): string {
  const keyMap: Record<BoardGroupByOrder, string> = {
    labels_asc: "groupByOrderLabelsAsc",
    labels_desc: "groupByOrderLabelsDesc",
    az: "groupByOrderAz",
    za: "groupByOrderZa",
    system_asc: "groupByOrderSystemAsc",
    system_desc: "groupByOrderSystemDesc",
    chronological_asc: "groupByOrderChronologicalAsc",
    chronological_desc: "groupByOrderChronologicalDesc",
    numeric_asc: "groupByOrderNumericAsc",
    numeric_desc: "groupByOrderNumericDesc",
  }
  return dict[keyMap[order]] ?? order
}

export function coerceGroupByOrder(
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  orderRaw: string
): BoardGroupByOrder {
  const allowed = new Set(allowedGroupByOrders(col, tableCustomColumns))
  const o = isBoardGroupByOrder(orderRaw) ? orderRaw : null
  if (o && allowed.has(o)) return o
  return defaultGroupByOrderForColumn(col, tableCustomColumns)
}

export function parseTableGroupBySuite(
  meta: Record<string, unknown> | null | undefined,
  tableCustomColumns: Record<string, TableCustomColumnDef>
): BoardGroupBySuite | null {
  const m = meta ?? {}
  const raw = m.tableGroupBySuite
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>
    const columnId = typeof o.columnId === "string" ? o.columnId.trim() : ""
    if (!columnId) return null
    const col = groupColumnMetaStub(columnId, tableCustomColumns)
    const order = coerceGroupByOrder(
      col,
      tableCustomColumns,
      typeof o.order === "string" ? o.order : ""
    )
    return {
      columnId,
      order,
      showEmpty: o.showEmpty === true,
    }
  }
  if (m.tableGroupBy === "priority") {
    const col = groupColumnMetaStub("priority", tableCustomColumns)
    return {
      columnId: "priority",
      order: defaultGroupByOrderForColumn(col, tableCustomColumns),
      showEmpty: false,
    }
  }
  return null
}

export function groupByOrderOptionsForColumn(
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  dict: Record<string, string>
): { value: BoardGroupByOrder; label: string }[] {
  return allowedGroupByOrders(col, tableCustomColumns).map((value) => ({
    value,
    label: dictLabelForGroupByOrder(value, dict),
  }))
}

function orderedBucketKeys(
  bucketMap: Map<string, { display: string; items: GqlBoardItem[] }>,
  col: BoardFilterColumnMeta,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  order: BoardGroupByOrder,
  labels: BoardFacetLabels,
  itemsInOriginalOrder: GqlBoardItem[],
  group: GqlBoardGroup,
  workspaceUsers: WorkspaceUser[],
  unassignedLabel: string
): string[] {
  const keys = [...bucketMap.keys()]
  const fam = columnGroupFamily(col, tableCustomColumns)
  const labelOrder = labelListForColumn(col, labels, tableCustomColumns)

  if (fam === "labels" && labelOrder.length > 0) {
    if (order === "labels_desc") return [...labelOrder].reverse()
    if (order === "labels_asc") return [...labelOrder]
    if (order === "az")
      return [...keys].sort((a, b) =>
        (bucketMap.get(a)?.display ?? a).localeCompare(
          bucketMap.get(b)?.display ?? b,
          undefined,
          { sensitivity: "base", numeric: true }
        )
      )
    if (order === "za")
      return [...keys].sort((a, b) =>
        (bucketMap.get(b)?.display ?? b).localeCompare(
          bucketMap.get(a)?.display ?? a,
          undefined,
          { sensitivity: "base", numeric: true }
        )
      )
    return [...labelOrder].filter((k) => keys.includes(k)).concat(
      keys.filter((k) => !labelOrder.includes(k)).sort()
    )
  }

  if (fam === "date") {
    const firstSeen = new Map<string, number>()
    for (let i = 0; i < itemsInOriginalOrder.length; i++) {
      const { key } = bucketKeyAndDisplay(
        itemsInOriginalOrder[i]!,
        group,
        col,
        tableCustomColumns,
        labels,
        workspaceUsers,
        unassignedLabel
      )
      if (!firstSeen.has(key)) firstSeen.set(key, i)
    }
    const minIso = (k: string) => {
      const arr = bucketMap.get(k)?.items ?? []
      let m = Infinity
      for (const it of arr) {
        const t = parseIsoFromItem(it, col, tableCustomColumns)
        if (Number.isFinite(t)) m = Math.min(m, t)
      }
      return m
    }
    if (order === "system_asc")
      return [...keys].sort(
        (a, b) => (firstSeen.get(a) ?? 0) - (firstSeen.get(b) ?? 0)
      )
    if (order === "system_desc")
      return [...keys].sort(
        (a, b) => (firstSeen.get(b) ?? 0) - (firstSeen.get(a) ?? 0)
      )
    if (order === "chronological_asc")
      return [...keys].sort((a, b) => minIso(a) - minIso(b))
    if (order === "chronological_desc")
      return [...keys].sort((a, b) => minIso(b) - minIso(a))
    return [...keys].sort((a, b) => minIso(a) - minIso(b))
  }

  if (fam === "numeric") {
    const num = (k: string) => {
      const t = (bucketMap.get(k)?.display ?? "").replace(/,/g, ".")
      const n = Number(t)
      return Number.isFinite(n) ? n : 0
    }
    if (order === "numeric_desc")
      return [...keys].sort((a, b) => num(b) - num(a))
    return [...keys].sort((a, b) => num(a) - num(b))
  }

  if (order === "za")
    return [...keys].sort((a, b) =>
      (bucketMap.get(b)?.display ?? b).localeCompare(
        bucketMap.get(a)?.display ?? a,
        undefined,
        { sensitivity: "base", numeric: true }
      )
    )
  return [...keys].sort((a, b) =>
    (bucketMap.get(a)?.display ?? a).localeCompare(
      bucketMap.get(b)?.display ?? b,
      undefined,
      { sensitivity: "base", numeric: true }
    )
  )
}

export function buildBoardGroupRowSegments(
  items: GqlBoardItem[],
  group: GqlBoardGroup,
  suite: BoardGroupBySuite | null,
  column: BoardFilterColumnMeta | null,
  tableCustomColumns: Record<string, TableCustomColumnDef>,
  labels: BoardFacetLabels,
  workspaceUsers: WorkspaceUser[],
  unassignedLabel: string
): BoardGroupRowSeg[] {
  if (!suite?.columnId || !column || column.id !== suite.columnId) {
    return items.map((item) => ({ type: "row", key: item.id, item }))
  }

  const col = column
  const bucketMap = new Map<
    string,
    { display: string; items: GqlBoardItem[] }
  >()

  for (const item of items) {
    const { key, display } = bucketKeyAndDisplay(
      item,
      group,
      col,
      tableCustomColumns,
      labels,
      workspaceUsers,
      unassignedLabel
    )
    const cur = bucketMap.get(key)
    if (cur) cur.items.push(item)
    else bucketMap.set(key, { display, items: [item] })
  }

  const fam = columnGroupFamily(col, tableCustomColumns)
  if (suite.showEmpty && fam === "labels") {
    const labelOrder = labelListForColumn(col, labels, tableCustomColumns)
    for (const lab of labelOrder) {
      if (!bucketMap.has(lab)) bucketMap.set(lab, { display: lab, items: [] })
    }
  }

  const orderedKeys = orderedBucketKeys(
    bucketMap,
    col,
    tableCustomColumns,
    suite.order,
    labels,
    items,
    group,
    workspaceUsers,
    unassignedLabel
  )

  const out: BoardGroupRowSeg[] = []
  for (const key of orderedKeys) {
    const b = bucketMap.get(key)
    if (!b) continue
    if (!suite.showEmpty && b.items.length === 0) continue
    out.push({
      type: "header",
      key: `hdr-${key}-${group.id}`,
      label: b.display,
    })
    for (const item of b.items) {
      out.push({ type: "row", key: item.id, item })
    }
  }
  return out
}
