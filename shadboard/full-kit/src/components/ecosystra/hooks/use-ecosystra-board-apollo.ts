"use client"

import { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { toast } from "sonner"

import type { DictionaryType } from "@/lib/get-dictionary"

import {
  CREATE_GROUP,
  CREATE_ITEM,
  DELETE_GROUP,
  DELETE_ITEM,
  GET_OR_CREATE_BOARD,
  SEARCH_WORKSPACE,
  ACCEPT_TASK_ASSIGNEE_INVITE,
  SET_TASK_ASSIGNEE,
  SET_TASK_ASSIGNEES,
  SET_TASK_OWNER,
  UPDATE_BOARD,
  UPDATE_BOARD_METADATA,
  UPDATE_GROUP,
  UPDATE_ITEM,
  UPDATE_ITEM_DYNAMIC_DATA,
  WORKSPACE_USERS,
} from "@/lib/ecosystra/board-gql"

import { useOptionalEcosystraDictionary } from "../ecosystra-dictionary-context"

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

export type GqlBoardItem = {
  id: string
  name: string
  groupId?: string | null
  parentItemId?: string | null
  createdByUserId?: string | null
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
  "lastUpdated",
  "files",
  "owner",
  "assignee",
  "timeline",
  "priority",
  "budget",
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

export function reorderArray<T>(list: T[], fromIndex: number, toIndex: number): T[] {
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

/** Insert `owner` before `assignee` for boards saved before Owner column existed. */
function ensureOwnerColumnInOrder(order: string[]): string[] {
  if (order.includes("owner")) return order
  const ai = order.indexOf("assignee")
  if (ai >= 0) return [...order.slice(0, ai), "owner", ...order.slice(ai)]
  return order
}

export function parseBoardTableUiMetadata(
  meta: Record<string, unknown> | null | undefined
): {
  hiddenColumnIds: HidableBoardColumnId[]
  groupBy: BoardTableGroupBy
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
} {
  const rawHidden = meta?.hiddenTableColumnIds
  const hidden = Array.isArray(rawHidden)
    ? rawHidden.filter((id): id is HidableBoardColumnId =>
        HIDABLE_COLUMN_IDS.includes(id as HidableBoardColumnId)
      )
    : []
  const gb = meta?.tableGroupBy
  const groupBy: BoardTableGroupBy = gb === "priority" ? "priority" : "none"
  const rawW = meta?.tableColumnWidthsPx
  const columnWidthsPx: Record<string, number> = {}
  if (rawW && typeof rawW === "object" && rawW !== null && !Array.isArray(rawW)) {
    for (const [k, v] of Object.entries(rawW)) {
      if (typeof v === "number" && Number.isFinite(v) && v > 0) {
        columnWidthsPx[k] = v
      }
    }
  }
  const rawCc = meta?.tableCustomColumns
  const tableCustomColumns: Record<string, TableCustomColumnDef> = {}
  if (rawCc && typeof rawCc === "object" && rawCc !== null && !Array.isArray(rawCc)) {
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

  const rawOrder = meta?.tableColumnOrder
  const rawOrderArr = Array.isArray(rawOrder)
    ? rawOrder.filter((x): x is string => typeof x === "string")
    : undefined
  const tableColumnOrder = ensureOwnerColumnInOrder(
    mergeBoardColumnOrder(
      rawOrderArr,
      BOARD_TABLE_COLUMN_IDS,
      customColumnIds
    )
  )

  const groupItemOrders: Record<string, string[]> = {}
  const rawGio = meta?.groupItemOrders
  if (rawGio && typeof rawGio === "object" && rawGio !== null && !Array.isArray(rawGio)) {
    for (const [k, v] of Object.entries(rawGio)) {
      if (Array.isArray(v)) {
        groupItemOrders[k] = v.filter((x): x is string => typeof x === "string")
      }
    }
  }

  const tableColumnTitles: Record<string, string> = {}
  const rawTitles = meta?.tableColumnTitles
  if (rawTitles && typeof rawTitles === "object" && rawTitles !== null && !Array.isArray(rawTitles)) {
    for (const [k, v] of Object.entries(rawTitles)) {
      if (typeof k === "string" && typeof v === "string" && v.trim()) {
        tableColumnTitles[k] = v.trim()
      }
    }
  }

  return {
    hiddenColumnIds: hidden,
    groupBy,
    columnWidthsPx,
    tableColumnOrder,
    tableCustomColumns,
    groupItemOrders,
    tableColumnTitles,
  }
}

export type BoardViewTab = "table" | "kanban"

export function defaultTaskDynamicData(): Record<string, unknown> {
  const d = new Date()
  const m = d.toLocaleString("en-US", { month: "short" })
  const day = d.getDate()
  return {
    taskStatus: "Working on it",
    dueDate: `${m} ${day}`,
    lastUpdatedLabel: "1 week ago",
    lastUpdatedBy: "User",
    filesCount: 0,
    timeline: `${m} ${day} - ${day + 1}`,
    priority: "Medium",
    budget: 0,
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

  const { data, loading, error, refetch } = useQuery<{
    getOrCreateBoard: GqlBoard
  }>(GET_OR_CREATE_BOARD, { fetchPolicy: "cache-and-network" })

  const board = data?.getOrCreateBoard

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

  const groups = useMemo(() => board?.groups ?? [], [board?.groups])

  const tableUi = useMemo(
    () => parseBoardTableUiMetadata(board?.metadata ?? undefined),
    [board?.metadata]
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
              subStatus2: "—",
              subNotesText: "",
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

  const patchBoardTableUi = useCallback(
    async (partial: {
      hiddenTableColumnIds?: HidableBoardColumnId[]
      tableGroupBy?: BoardTableGroupBy
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
    }) => {
      if (!board?.id) return
      try {
        await updateBoardMetadata({
          variables: {
            id: board.id,
            metadata: partial,
          },
        })
      } catch (e) {
        toast.error(gqlErrorMessage(e))
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
    addGroup,
    patchGroup,
    removeGroup,
    tableUi,
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
