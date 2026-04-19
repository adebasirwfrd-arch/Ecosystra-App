"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLazyQuery, useQuery } from "@apollo/client"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { toast } from "sonner"
import {
  ArrowUpDown,
  ChevronDown,
  EyeOff,
  Filter,
  GripVertical,
  LayoutGrid,
  ListChecks,
  Loader2,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  User,
} from "lucide-react"

import boardSurface from "./ecosystra-board-surface.module.css"

import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import type { DropResult } from "@hello-pangea/dnd"
import type {
  BoardGroupBySuite,
  BoardTableSortRule,
  GqlBoardItem,
  HidableBoardColumnId,
} from "./hooks/use-ecosystra-board-apollo"

import { SEARCH_WORKSPACE, WORKSPACE_USERS } from "@/lib/ecosystra/board-gql"
import { cn } from "@/lib/utils"

import {
  HIDABLE_COLUMN_IDS,
  ensureAddColumnLastInOrder,
  newCustomTableColumnId,
  normalizePinnedColumnIds,
  orderWithColumnBeforeAdd,
  readAssigneeUserIdsFromDynamic,
  reorderArray,
  sortItemsByOrder,
  useEcosystraBoardApollo,
} from "./hooks/use-ecosystra-board-apollo"
import {
  BoardAdvancedFiltersDialog,
  BoardPersonFilterPopover,
  BoardQuickFiltersPanel,
} from "./ecosystra-board-filter-toolbar"
import {
  GROUP_FACET_COLUMN_ID,
  advancedTreeIsActive,
  buildBoardFilterColumns,
  compareForBoardSort,
  itemMatchesAdvancedRoot,
  itemMatchesQuickSelections,
  itemPersonMatch,
  safeParseAdvancedRoot,
  type AdvancedFilterNode,
  type BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import {
  coerceGroupByOrder,
  groupColumnMetaStub,
} from "./ecosystra-board-group-by-engine"
import { EcosystraBoardGroupBySuiteContent } from "./ecosystra-board-group-by-suite"
import {
  EcosystraBoardPinColumnsContent,
  type BoardPinColumnRow,
} from "./ecosystra-board-pin-columns-content"
import { EcosystraBoardHideSuiteContent } from "./ecosystra-board-hide-suite"
import { EcosystraBoardSortSuiteContent } from "./ecosystra-board-sort-suite"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MediaGrid } from "@/components/ui/media-grid"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AccordionContent,
  EcosystraAccordion,
  EcosystraAccordionItem,
} from "./ecosystra-accordion"
import { EcosystraAttentionBox } from "./ecosystra-attention-box"
import { EcosystraBoardGroupAccordionTrigger } from "./ecosystra-board-group-accordion-trigger"
import {
  EcosystraBoardGroupColorButton,
  EcosystraBoardGroupEditableName,
} from "./ecosystra-board-group-header"
import { ecoCcFieldKey } from "./ecosystra-board-cc-field-key"
import { EcosystraBoardGroupTable } from "./ecosystra-board-group-table"
import { EcosystraBoardKanbanView } from "./ecosystra-board-kanban-view"
import { useEcosystraDictionary } from "./ecosystra-dictionary-context"
import {
  EcosystraGrandbookDialogBody,
  EcosystraGrandbookEmptyState,
  EcosystraGrandbookIcon,
  EcosystraGrandbookLegacyList,
  EcosystraGrandbookMultiStepIndicator,
  EcosystraGrandbookSteps,
  EcosystraGrandbookTipseen,
  EcosystraGrandbookVirtualizedListWindow,
} from "./ecosystra-grandbook"
import { localeSegmentFromPathname } from "./ecosystra-path-utils"

/** `dynamicData` keys for core columns on sub-items (differs from top-level tasks, e.g. `taskStatus` vs `status`). */
function subitemCoreColumnSourceKey(columnId: string): string {
  const m: Record<string, string> = {
    status: "status",
    dueDate: "subDueDate",
    lastUpdated: "lastUpdatedLabel",
    timeline: "timeline",
    priority: "priority",
    budget: "budget",
    rating: "rating",
    duePriority: "dueDatePriority",
    notes: "notesText",
    notesCategory: "notesCategory",
    files: "filesCount",
    owner: "owner",
    assignee: "assigneeUserIds",
  }
  return m[columnId] || columnId
}

function findRowDragContainer(
  id: string,
  draft: Record<string, string[]>
): string | undefined {
  if (id.startsWith("board-row-drop-")) {
    return id.slice("board-row-drop-".length)
  }
  for (const [gid, ids] of Object.entries(draft)) {
    if (ids.includes(id)) return gid
  }
  return undefined
}

function buildRowOrderDraft(
  groups: Array<{ id: string; items: GqlBoardItem[] }>,
  groupItemOrders: Record<string, string[]>
): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const g of groups) {
    out[g.id] = sortItemsByOrder(g.items, groupItemOrders[g.id]).map(
      (i) => i.id
    )
  }
  return out
}

export function EcosystraBoardMainView() {
  const dictionary = useEcosystraDictionary()
  const bt = dictionary.ecosystraApp.boardTable
  const t = bt as unknown as Record<string, string>

  const {
    board,
    boardInitialLoading,
    error,
    refetch,
    viewTab,
    setViewTab,
    openByGroupId,
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
    removeGroup,
    tableUi,
    subitemTableUi,
    addSubitemBoardColumn,
    patchSubitemBoardTableUi,
    patchBoardTableUi,
    patchGroup,
    setTaskOwner,
    setTaskAssignees,
    acceptTaskAssigneeInvite,
  } = useEcosystraBoardApollo()

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [personTargetItemId, setPersonTargetItemId] = useState<string | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<
    { kind: "group"; id: string } | { kind: "item"; id: string } | null
  >(null)

  const [titleDraft, setTitleDraft] = useState("")
  useEffect(() => {
    if (board?.name) setTitleDraft(board.name)
  }, [board?.name])

  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupStep, setNewGroupStep] = useState(0)
  const [newGroupColor, setNewGroupColor] = useState("#579BFC")
  const [newGroupNotes, setNewGroupNotes] = useState("")
  const [apiSearchDetailsOpen, setApiSearchDetailsOpen] = useState(false)
  const [apiMigrationOpen, setApiMigrationOpen] = useState(false)
  const [personFilterUserIds, setPersonFilterUserIds] = useState<string[]>([])
  const [personIncludeUnassigned, setPersonIncludeUnassigned] =
    useState(false)
  const [boardFilterQuick, setBoardFilterQuick] = useState<
    Record<string, string[]>
  >({})
  const [advancedFilterRoot, setAdvancedFilterRoot] =
    useState<AdvancedFilterNode | null>(null)
  const [saveFilterViewOpen, setSaveFilterViewOpen] = useState(false)
  const [pinColumnsDialogOpen, setPinColumnsDialogOpen] = useState(false)
  const [saveViewNameDraft, setSaveViewNameDraft] = useState("")
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false)
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false)
  const [personQuery, setPersonQuery] = useState("")
  const [attentionDismissed, setAttentionDismissed] = useState(false)
  const [sheetActivityOpen, setSheetActivityOpen] = useState(false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")
  const [kanbanCardScale, setKanbanCardScale] = useState([100])
  const [boardAnnouncement, setBoardAnnouncement] = useState("")
  const [newGroupNameError, setNewGroupNameError] = useState(false)
  /** Mirrors each table’s local checkbox selection by group id (for side panel / bulk actions). */
  const [boardSelectionByGroup, setBoardSelectionByGroup] = useState<
    Record<string, string[]>
  >({})
  const [selectionSheetOpen, setSelectionSheetOpen] = useState(false)
  const [selectionClearVersion, setSelectionClearVersion] = useState(0)

  const localeSeg = localeSegmentFromPathname(pathname)

  const [sortRules, setSortRules] = useState<BoardTableSortRule[]>([])

  useEffect(() => {
    setSortRules(tableUi.sortRules)
  }, [board?.id, tableUi.sortRules])

  const { data: peopleData } = useQuery(WORKSPACE_USERS, {
    variables: {
      workspaceId: board?.workspaceId ?? "",
      query: personQuery || ".",
      take: 8,
    },
    skip: !board?.workspaceId,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  })

  const { data: boardRosterUsers } = useQuery(WORKSPACE_USERS, {
    variables: {
      workspaceId: board?.workspaceId ?? "",
      query: ".",
      take: 80,
    },
    skip: !board?.workspaceId,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  })

  const mergedWorkspaceUsers = useMemo(() => {
    const m = new Map<
      string,
      { id: string; name: string | null; email: string }
    >()
    for (const u of boardRosterUsers?.workspaceUsers ?? []) m.set(u.id, u)
    for (const u of peopleData?.workspaceUsers ?? []) m.set(u.id, u)
    return [...m.values()]
  }, [boardRosterUsers?.workspaceUsers, peopleData?.workspaceUsers])

  const onColumnWidthCommit = useCallback(
    (columnId: string, widthPx: number) => {
      void patchBoardTableUi({
        tableColumnWidthsPx: {
          ...tableUi.columnWidthsPx,
          [columnId]: widthPx,
        },
      })
    },
    [patchBoardTableUi, tableUi.columnWidthsPx]
  )

  const onSubitemColumnWidthCommit = useCallback(
    (columnId: string, widthPx: number) => {
      void patchSubitemBoardTableUi({
        tableColumnWidthsPx: {
          ...subitemTableUi.columnWidthsPx,
          [columnId]: widthPx,
        },
      })
    },
    [patchSubitemBoardTableUi, subitemTableUi.columnWidthsPx]
  )

  const filterLabels = useMemo(
    () => ({
      statusLabels: tableUi.statusLabels,
      priorityLabels: tableUi.priorityLabels,
      notesCategoryLabels: tableUi.notesCategoryLabels,
      duePriorityLabels: tableUi.duePriorityLabels,
    }),
    [
      tableUi.duePriorityLabels,
      tableUi.notesCategoryLabels,
      tableUi.priorityLabels,
      tableUi.statusLabels,
    ]
  )

  const filterableColumns = useMemo(
    () =>
      buildBoardFilterColumns({
        tableColumnOrder: tableUi.tableColumnOrder,
        hiddenColumnIds: tableUi.hiddenColumnIds,
        tableCustomColumns: tableUi.tableCustomColumns,
        tableColumnTitles: tableUi.tableColumnTitles,
        dict: t,
      }),
    [
      t,
      tableUi.hiddenColumnIds,
      tableUi.tableColumnOrder,
      tableUi.tableCustomColumns,
      tableUi.tableColumnTitles,
    ]
  )

  const groupByToolbarColumns = useMemo(
    () => filterableColumns.filter((c) => c.id !== GROUP_FACET_COLUMN_ID),
    [filterableColumns]
  )

  const groupByColumnMeta = useMemo(() => {
    const id = tableUi.groupBySuite?.columnId
    if (!id) return null
    return groupByToolbarColumns.find((c) => c.id === id) ?? null
  }, [groupByToolbarColumns, tableUi.groupBySuite?.columnId])

  const commitGroupBySuite = useCallback(
    (next: BoardGroupBySuite | null) => {
      void patchBoardTableUi({
        tableGroupBySuite: next,
        tableGroupBy: "none",
      })
    },
    [patchBoardTableUi]
  )

  const activeGroupByRuleCount = tableUi.groupBySuite ? 1 : 0

  const pinColumnsExtraCount =
    tableUi.tablePinnedColumnIds.length + subitemTableUi.pinnedColumnIds.length

  const itemPinRows = useMemo((): BoardPinColumnRow[] => {
    const hidden = new Set(tableUi.hiddenColumnIds)
    const cols = buildBoardFilterColumns({
      tableColumnOrder: tableUi.tableColumnOrder,
      hiddenColumnIds: [],
      tableCustomColumns: tableUi.tableCustomColumns,
      tableColumnTitles: tableUi.tableColumnTitles,
      dict: t,
    })
    const metaById = new Map(
      cols
        .filter((c) => c.id !== GROUP_FACET_COLUMN_ID)
        .map((c) => [c.id, c] as const)
    )
    const rows: BoardPinColumnRow[] = []
    for (const id of tableUi.tableColumnOrder) {
      if (id === "add") continue
      if (id === "select") {
        rows.push({
          id: "select",
          title: bt.colSelect,
          kind: "task",
          locked: true,
        })
        continue
      }
      if (hidden.has(id as HidableBoardColumnId)) continue
      const m = metaById.get(id)
      if (!m) continue
      rows.push({
        id,
        title: m.title,
        kind: m.kind,
        locked: id === "task",
      })
    }
    return rows
  }, [
    bt.colSelect,
    t,
    tableUi.hiddenColumnIds,
    tableUi.tableColumnOrder,
    tableUi.tableCustomColumns,
    tableUi.tableColumnTitles,
  ])

  const subitemPinRows = useMemo((): BoardPinColumnRow[] => {
    const hidden = new Set(subitemTableUi.hiddenColumnIds)
    const cols = buildBoardFilterColumns({
      tableColumnOrder: subitemTableUi.tableColumnOrder,
      hiddenColumnIds: [],
      tableCustomColumns: subitemTableUi.tableCustomColumns,
      tableColumnTitles: subitemTableUi.tableColumnTitles,
      dict: t,
    })
    const metaById = new Map(
      cols
        .filter((c) => c.id !== GROUP_FACET_COLUMN_ID)
        .map((c) => [c.id, c] as const)
    )
    const rows: BoardPinColumnRow[] = []
    for (const id of subitemTableUi.tableColumnOrder) {
      if (id === "add") continue
      if (id === "select") {
        rows.push({
          id: "select",
          title: bt.colSelect,
          kind: "task",
          locked: true,
        })
        continue
      }
      if (hidden.has(id as HidableBoardColumnId)) continue
      const m = metaById.get(id)
      if (!m) continue
      rows.push({
        id,
        title: m.title,
        kind: m.kind,
        locked: id === "task",
      })
    }
    return rows
  }, [
    bt.colSelect,
    t,
    subitemTableUi.hiddenColumnIds,
    subitemTableUi.tableColumnOrder,
    subitemTableUi.tableCustomColumns,
    subitemTableUi.tableColumnTitles,
  ])

  const toggleTablePinnedColumn = useCallback(
    (columnId: string, checked: boolean) => {
      if (columnId === "select" || columnId === "task") return
      const cur = new Set(tableUi.tablePinnedColumnIds)
      if (checked) cur.add(columnId)
      else cur.delete(columnId)
      void patchBoardTableUi({
        tablePinnedColumnIds: normalizePinnedColumnIds(
          [...cur],
          tableUi.tableColumnOrder
        ),
      })
    },
    [patchBoardTableUi, tableUi.tableColumnOrder, tableUi.tablePinnedColumnIds]
  )

  const toggleSubitemPinnedColumn = useCallback(
    (columnId: string, checked: boolean) => {
      if (columnId === "select" || columnId === "task") return
      const cur = new Set(subitemTableUi.pinnedColumnIds)
      if (checked) cur.add(columnId)
      else cur.delete(columnId)
      void patchSubitemBoardTableUi({
        pinnedColumnIds: normalizePinnedColumnIds(
          [...cur],
          subitemTableUi.tableColumnOrder
        ),
      })
    },
    [
      patchSubitemBoardTableUi,
      subitemTableUi.pinnedColumnIds,
      subitemTableUi.tableColumnOrder,
    ]
  )

  const openSaveFilterViewDialog = useCallback(() => {
    setSaveViewNameDraft("")
    setSaveFilterViewOpen(true)
  }, [])

  const confirmSaveFilterView = useCallback(async () => {
    const name = saveViewNameDraft.trim()
    if (!name) {
      toast.error(bt.saveViewNameRequired)
      return
    }
    const payload = JSON.stringify({
      personUserIds: personFilterUserIds,
      personIncludeUnassigned,
      quick: boardFilterQuick,
      advancedRoot: advancedFilterRoot,
      sortRules,
      groupBySuite: tableUi.groupBySuite,
      tablePinnedColumnIds: tableUi.tablePinnedColumnIds,
      subitemPinnedColumnIds: subitemTableUi.pinnedColumnIds,
    })
    const ok = await patchBoardTableUi({
      savedFilterViews: [
        ...tableUi.savedFilterViews,
        {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
          payload,
        },
      ],
    })
    if (ok) {
      setSaveFilterViewOpen(false)
      toast.success(bt.saveViewSaved)
    }
  }, [
    saveViewNameDraft,
    personFilterUserIds,
    personIncludeUnassigned,
    boardFilterQuick,
    advancedFilterRoot,
    sortRules,
    patchBoardTableUi,
    tableUi.groupBySuite,
    tableUi.tablePinnedColumnIds,
    subitemTableUi.pinnedColumnIds,
    tableUi.savedFilterViews,
    bt.saveViewNameRequired,
    bt.saveViewSaved,
  ])

  const applySavedFilterView = useCallback(
    (id: string) => {
      const v = tableUi.savedFilterViews.find((x) => x.id === id)
      if (!v) return
      try {
        const p = JSON.parse(v.payload) as {
          personUserIds?: unknown
          personIncludeUnassigned?: unknown
          quick?: unknown
          advancedRoot?: unknown
          sortRules?: unknown
          groupBySuite?: unknown
          tablePinnedColumnIds?: unknown
          subitemPinnedColumnIds?: unknown
        }
        setPersonFilterUserIds(
          Array.isArray(p.personUserIds)
            ? (p.personUserIds as string[])
            : []
        )
        setPersonIncludeUnassigned(!!p.personIncludeUnassigned)
        if (
          p.quick &&
          typeof p.quick === "object" &&
          !Array.isArray(p.quick)
        ) {
          setBoardFilterQuick(p.quick as Record<string, string[]>)
        } else {
          setBoardFilterQuick({})
        }
        const ar =
          p.advancedRoot != null
            ? safeParseAdvancedRoot(p.advancedRoot)
            : null
        setAdvancedFilterRoot(ar)
        if (Array.isArray(p.sortRules)) {
          const nextSort: BoardTableSortRule[] = []
          for (const x of p.sortRules) {
            if (!x || typeof x !== "object" || Array.isArray(x)) continue
            const o = x as Record<string, unknown>
            const id = typeof o.id === "string" ? o.id.trim() : ""
            if (!id) continue
            const direction: "asc" | "desc" =
              o.direction === "desc" ? "desc" : "asc"
            let columnId: string | null = null
            if (typeof o.columnId === "string" && o.columnId.trim()) {
              columnId = o.columnId.trim()
            } else if (o.columnId === null) columnId = null
            nextSort.push({ id, columnId, direction })
          }
          setSortRules(nextSort)
          void patchBoardTableUi({ tableSortRules: nextSort })
        }
        const rawGb = p.groupBySuite
        if (
          rawGb &&
          typeof rawGb === "object" &&
          !Array.isArray(rawGb)
        ) {
          const o = rawGb as Record<string, unknown>
          const columnId =
            typeof o.columnId === "string" ? o.columnId.trim() : ""
          if (columnId) {
            const col = groupColumnMetaStub(
              columnId,
              tableUi.tableCustomColumns
            )
            const order = coerceGroupByOrder(
              col,
              tableUi.tableCustomColumns,
              typeof o.order === "string" ? o.order : ""
            )
            void patchBoardTableUi({
              tableGroupBySuite: {
                columnId,
                order,
                showEmpty: o.showEmpty === true,
              },
              tableGroupBy: "none",
            })
          }
        } else if (p.groupBySuite === null) {
          void patchBoardTableUi({
            tableGroupBySuite: null,
            tableGroupBy: "none",
          })
        }
        if (Array.isArray(p.tablePinnedColumnIds)) {
          void patchBoardTableUi({
            tablePinnedColumnIds: normalizePinnedColumnIds(
              p.tablePinnedColumnIds,
              tableUi.tableColumnOrder
            ),
          })
        }
        if (Array.isArray(p.subitemPinnedColumnIds)) {
          void patchSubitemBoardTableUi({
            pinnedColumnIds: normalizePinnedColumnIds(
              p.subitemPinnedColumnIds,
              subitemTableUi.tableColumnOrder
            ),
          })
        }
        setFilterPopoverOpen(false)
        setAdvancedFilterOpen(false)
      } catch {
        toast.error(bt.saveViewApplyError)
      }
    },
    [
      tableUi.savedFilterViews,
      tableUi.tableColumnOrder,
      tableUi.tableCustomColumns,
      subitemTableUi.tableColumnOrder,
      bt.saveViewApplyError,
      patchBoardTableUi,
      patchSubitemBoardTableUi,
    ]
  )

  const renameSavedFilterView = useCallback(
    async (id: string, name: string) => {
      const n = name.trim()
      if (!n) {
        toast.error(bt.saveViewNameRequired)
        return
      }
      const next = tableUi.savedFilterViews.map((v) =>
        v.id === id ? { ...v, name: n } : v
      )
      const ok = await patchBoardTableUi({ savedFilterViews: next })
      if (ok) toast.success(bt.savedViewRenamed)
    },
    [
      patchBoardTableUi,
      tableUi.savedFilterViews,
      bt.saveViewNameRequired,
      bt.savedViewRenamed,
    ]
  )

  const deleteSavedFilterView = useCallback(
    async (id: string) => {
      const next = tableUi.savedFilterViews.filter((v) => v.id !== id)
      const ok = await patchBoardTableUi({ savedFilterViews: next })
      if (ok) toast.success(bt.savedViewDeleted)
    },
    [patchBoardTableUi, tableUi.savedFilterViews, bt.savedViewDeleted]
  )

  const onFilterAiApply = useCallback(
    async (prompt: string) => {
      const columns = filterableColumns.map((c) => ({
        id: c.id,
        title: c.title,
        valueKind: c.valueKind,
        kind: String(c.kind),
      }))
      try {
        const res = await fetch("/api/ecosystra/board-filter-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, columns }),
        })
        const data = (await res.json()) as {
          root?: unknown
          error?: string
          warning?: string
        }
        if (!res.ok) {
          toast.error(data.error ?? bt.filterAiFailed)
          return
        }
        if (data.warning) toast.warning(data.warning)
        const parsed =
          data.root != null ? safeParseAdvancedRoot(data.root) : null
        if (!parsed) {
          toast.error(bt.filterAiInvalid)
          return
        }
        setAdvancedFilterRoot(parsed)
        toast.success(bt.filterAiApplied)
      } catch {
        toast.error(bt.filterAiFailed)
      }
    },
    [filterableColumns, bt.filterAiFailed, bt.filterAiInvalid, bt.filterAiApplied]
  )

  const commitSortRules = useCallback(
    (next: BoardTableSortRule[]) => {
      const ids = new Set(filterableColumns.map((c) => c.id))
      const cleaned = next.map((r) => ({
        ...r,
        columnId: r.columnId && ids.has(r.columnId) ? r.columnId : null,
      }))
      setSortRules(cleaned)
      void patchBoardTableUi({ tableSortRules: cleaned })
    },
    [patchBoardTableUi, filterableColumns]
  )

  const sortColumnIdSet = useMemo(
    () => new Set(filterableColumns.map((c) => c.id)),
    [filterableColumns]
  )

  const activeSortRules = useMemo(
    () =>
      sortRules.filter(
        (r) => r.columnId && sortColumnIdSet.has(r.columnId)
      ),
    [sortRules, sortColumnIdSet]
  )

  const activeSortRuleCount = activeSortRules.length

  const resolveUserSortLabel = useCallback(
    (userId: string) => {
      const u = mergedWorkspaceUsers.find((x) => x.id === userId)
      return (u?.name || u?.email || userId).trim()
    },
    [mergedWorkspaceUsers]
  )

  const sortedGroups = useMemo(() => {
    const base = filteredGroups.map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (
          !itemPersonMatch(
            it,
            personFilterUserIds,
            personIncludeUnassigned
          )
        )
          return false
        if (
          !itemMatchesQuickSelections(
            it,
            g,
            boardFilterQuick,
            filterableColumns,
            tableUi.tableCustomColumns,
            filterLabels
          )
        )
          return false
        if (
          advancedTreeIsActive(advancedFilterRoot) &&
          !itemMatchesAdvancedRoot(
            it,
            g,
            advancedFilterRoot,
            filterableColumns,
            tableUi.tableCustomColumns,
            filterLabels
          )
        )
          return false
        return true
      }),
    }))
    const ordered = base.map((g) => ({
      ...g,
      items: sortItemsByOrder(g.items, tableUi.groupItemOrders[g.id]),
    }))
    if (activeSortRules.length === 0) return ordered
    return ordered.map((g) => ({
      ...g,
      items: [...g.items].sort((a, b) => {
        const bundleA = { item: a, group: g }
        const bundleB = { item: b, group: g }
        for (const rule of activeSortRules) {
          if (!rule.columnId) continue
          const cmp = compareForBoardSort(
            bundleA,
            bundleB,
            rule.columnId,
            filterableColumns,
            tableUi.tableCustomColumns,
            filterLabels,
            resolveUserSortLabel
          )
          if (cmp !== 0) return rule.direction === "desc" ? -cmp : cmp
        }
        return 0
      }),
    }))
  }, [
    filteredGroups,
    activeSortRules,
    resolveUserSortLabel,
    personFilterUserIds,
    personIncludeUnassigned,
    boardFilterQuick,
    advancedFilterRoot,
    filterableColumns,
    filterLabels,
    tableUi.groupItemOrders,
    tableUi.tableCustomColumns,
  ])

  const [rowDnDraft, setRowDnDraft] = useState<Record<string, string[]> | null>(
    null
  )
  const rowDnInitialRef = useRef<Record<string, string[]> | null>(null)
  const rowDnDraftRef = useRef<Record<string, string[]> | null>(null)

  const topLevelItemById = useMemo(() => {
    const m = new Map<string, GqlBoardItem>()
    for (const g of sortedGroups) {
      for (const it of g.items) {
        m.set(it.id, it)
      }
    }
    return m
  }, [sortedGroups])

  const tableItemsForGroup = useCallback(
    (groupId: string, baseItems: GqlBoardItem[]) => {
      if (!rowDnDraft) {
        return sortItemsByOrder(baseItems, tableUi.groupItemOrders[groupId])
      }
      const ids = rowDnDraft[groupId]
      if (!ids) {
        return sortItemsByOrder(baseItems, tableUi.groupItemOrders[groupId])
      }
      return ids
        .map((id) => topLevelItemById.get(id))
        .filter((x): x is GqlBoardItem => Boolean(x))
    },
    [rowDnDraft, tableUi.groupItemOrders, topLevelItemById]
  )

  const boardRowSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleBoardRowDragStart = useCallback(
    (_e: DragStartEvent) => {
      const draft = buildRowOrderDraft(sortedGroups, tableUi.groupItemOrders)
      rowDnInitialRef.current = draft
      rowDnDraftRef.current = draft
      setRowDnDraft(draft)
    },
    [sortedGroups, tableUi.groupItemOrders]
  )

  const handleBoardRowDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      const overId = over?.id
      if (overId == null) return
      const overIdS = String(overId)
      const activeIdS = String(active.id)
      if (activeIdS === overIdS) return

      setRowDnDraft((draft) => {
        if (!draft) return draft
        const activeContainer = findRowDragContainer(activeIdS, draft)
        const overContainer = findRowDragContainer(overIdS, draft)
        if (!activeContainer || !overContainer) return draft
        if (activeContainer === overContainer) return draft

        const activeItems = [...draft[activeContainer]]
        const overItems = [...draft[overContainer]]
        if (!activeItems.includes(activeIdS)) return draft

        const overIndexRaw = overIdS.startsWith("board-row-drop-")
          ? overItems.length
          : overItems.indexOf(overIdS)

        let newIndex: number
        if (overIdS.startsWith("board-row-drop-")) {
          newIndex = overItems.length
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height
          const modifier = isBelowOverItem ? 1 : 0
          newIndex =
            overIndexRaw >= 0 ? overIndexRaw + modifier : overItems.length
        }

        const next: Record<string, string[]> = {
          ...draft,
          [activeContainer]: activeItems.filter((id) => id !== activeIdS),
          [overContainer]: [
            ...overItems.slice(0, newIndex),
            activeIdS,
            ...overItems.slice(newIndex),
          ],
        }
        rowDnDraftRef.current = next
        return next
      })
    },
    []
  )

  const handleBoardRowDragCancel = useCallback(() => {
    rowDnInitialRef.current = null
    rowDnDraftRef.current = null
    setRowDnDraft(null)
  }, [])

  const handleBoardRowDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const initial = rowDnInitialRef.current
      const cleanup = () => {
        rowDnInitialRef.current = null
        rowDnDraftRef.current = null
        setRowDnDraft(null)
      }

      if (!initial) {
        cleanup()
        return
      }

      const { active, over } = event
      if (!over) {
        cleanup()
        return
      }

      const activeId = String(active.id)
      const overId = String(over.id)
      if (activeId === overId) {
        cleanup()
        return
      }

      const finalDraft = rowDnDraftRef.current ?? initial

      const ac = findRowDragContainer(activeId, initial)
      const oc = findRowDragContainer(overId, finalDraft)
      if (!ac || !oc) {
        cleanup()
        return
      }

      if (ac === oc) {
        const list = [...initial[ac]]
        const oldI = list.indexOf(activeId)
        let newI: number
        if (overId.startsWith("board-row-drop-")) {
          newI = Math.max(0, list.length - 1)
        } else {
          newI = list.indexOf(overId)
        }
        if (oldI < 0 || newI < 0) {
          cleanup()
          return
        }
        if (oldI !== newI) {
          const next = arrayMove(list, oldI, newI)
          void patchBoardTableUi({
            groupItemOrders: {
              ...tableUi.groupItemOrders,
              [ac]: next,
            },
          })
        }
        cleanup()
        return
      }

      if (JSON.stringify(initial) === JSON.stringify(finalDraft)) {
        cleanup()
        return
      }

      const fromG = findRowDragContainer(activeId, initial)
      const toG = findRowDragContainer(activeId, finalDraft)
      if (fromG && toG && fromG !== toG) {
        try {
          await moveItemToGroup(activeId, toG)
        } catch {
          cleanup()
          return
        }
      }

      const nextOrders: Record<string, string[]> = {
        ...tableUi.groupItemOrders,
      }
      for (const gid of Object.keys(finalDraft)) {
        nextOrders[gid] = finalDraft[gid]
      }
      void patchBoardTableUi({ groupItemOrders: nextOrders })
      cleanup()
    },
    [moveItemToGroup, patchBoardTableUi, tableUi.groupItemOrders]
  )

  const addCustomBoardColumn = useCallback(
    (kind: HidableBoardColumnId) => {
      const newId = newCustomTableColumnId()
      const nextOrder = orderWithColumnBeforeAdd(
        tableUi.tableColumnOrder,
        newId
      )
      void patchBoardTableUi({
        tableColumnOrder: nextOrder,
        tableCustomColumns: {
          ...tableUi.tableCustomColumns,
          [newId]: { kind },
        },
      })
    },
    [patchBoardTableUi, tableUi.tableColumnOrder, tableUi.tableCustomColumns]
  )

  const duplicateSubitemBoardColumn = useCallback(
    async (columnId: string) => {
      const { tableColumnOrder, tableCustomColumns, tableColumnTitles } =
        subitemTableUi
      const colIdx = tableColumnOrder.indexOf(columnId)
      if (colIdx < 0) return

      const newId = newCustomTableColumnId()
      const isCustom = columnId.startsWith("c_")
      const kind = isCustom
        ? tableCustomColumns[columnId]?.kind
        : (columnId as HidableBoardColumnId)

      if (!kind) return

      const nextOrder = [...tableColumnOrder]
      nextOrder.splice(colIdx + 1, 0, newId)

      const nextCustom = {
        ...tableCustomColumns,
        [newId]: { kind },
      }

      const nextTitles = { ...tableColumnTitles }
      if (tableColumnTitles[columnId]) {
        nextTitles[newId] = `${tableColumnTitles[columnId]} (Copy)`
      }

      await patchSubitemBoardTableUi({
        tableColumnOrder: nextOrder,
        tableCustomColumns: nextCustom,
        tableColumnTitles: nextTitles,
      })

      const sourceKey = isCustom
        ? ecoCcFieldKey(columnId)
        : subitemCoreColumnSourceKey(columnId)

      const targetKey = ecoCcFieldKey(newId)
      const allSubitems =
        board?.groups.flatMap((g) =>
          g.items.flatMap((it) => it.subitems ?? [])
        ) ?? []
      const itemsWithData = allSubitems.filter(
        (it) => it.dynamicData?.[sourceKey] !== undefined
      )

      if (itemsWithData.length > 0) {
        toast.info(`Duplicating data for ${itemsWithData.length} subitems...`, {
          id: "duplicate-subitem-data-progress",
        })
        for (const it of itemsWithData) {
          void patchItemField(it.id, { [targetKey]: it.dynamicData[sourceKey] })
        }
        toast.success("Data duplicated", {
          id: "duplicate-subitem-data-progress",
        })
      }
    },
    [patchSubitemBoardTableUi, subitemTableUi, board?.groups, patchItemField]
  )

  const deleteSubitemBoardColumn = useCallback(
    (columnId: string) => {
      const { tableColumnOrder, tableCustomColumns, hiddenColumnIds } =
        subitemTableUi

      if (columnId === "task" || columnId === "select" || columnId === "add") {
        return
      }

      const isCustom = columnId.startsWith("c_")
      if (isCustom) {
        const nextOrder = tableColumnOrder.filter((id) => id !== columnId)
        const nextCustom = { ...tableCustomColumns }
        delete nextCustom[columnId]
        void patchSubitemBoardTableUi({
          tableColumnOrder: nextOrder,
          tableCustomColumns: nextCustom,
          pinnedColumnIds: normalizePinnedColumnIds(
            subitemTableUi.pinnedColumnIds.filter((id) => id !== columnId),
            nextOrder
          ),
        })
      } else {
        const nextHidden = [
          ...new Set([...hiddenColumnIds, columnId as HidableBoardColumnId]),
        ]
        void patchSubitemBoardTableUi({
          hiddenTableColumnIds: nextHidden,
          pinnedColumnIds: normalizePinnedColumnIds(
            subitemTableUi.pinnedColumnIds.filter((id) => id !== columnId),
            tableColumnOrder
          ),
        })
      }
    },
    [patchSubitemBoardTableUi, subitemTableUi]
  )

  const duplicateBoardColumn = useCallback(
    async (columnId: string) => {
      const { tableColumnOrder, tableCustomColumns, tableColumnTitles } =
        tableUi
      const colIdx = tableColumnOrder.indexOf(columnId)
      if (colIdx < 0) return

      const newId = newCustomTableColumnId()
      const isCustom = columnId.startsWith("c_")
      const kind = isCustom
        ? tableCustomColumns[columnId]?.kind
        : (columnId as HidableBoardColumnId)

      if (!kind) return

      const nextOrder = [...tableColumnOrder]
      nextOrder.splice(colIdx + 1, 0, newId)

      const nextCustom = {
        ...tableCustomColumns,
        [newId]: { kind },
      }

      const nextTitles = { ...tableColumnTitles }
      if (tableColumnTitles[columnId]) {
        nextTitles[newId] = `${tableColumnTitles[columnId]} (Copy)`
      }

      await patchBoardTableUi({
        tableColumnOrder: nextOrder,
        tableCustomColumns: nextCustom,
        tableColumnTitles: nextTitles,
      })

      // Duplicate cell data
      const sourceKey = isCustom
        ? ecoCcFieldKey(columnId)
        : ((): string => {
            const m: Record<string, string> = {
              status: "taskStatus",
              dueDate: "dueDate",
              lastUpdated: "lastUpdatedLabel",
              timeline: "timeline",
              priority: "priority",
              budget: "budget",
              rating: "rating",
              duePriority: "dueDatePriority",
              notes: "notesText",
              notesCategory: "notesCategory",
            }
            return m[columnId] || columnId
          })()

      const targetKey = ecoCcFieldKey(newId)
      const allItems = board?.groups.flatMap((g) => g.items) || []
      const itemsWithData = allItems.filter(
        (it) => it.dynamicData?.[sourceKey] !== undefined
      )

      if (itemsWithData.length > 0) {
        toast.info(`Duplicating data for ${itemsWithData.length} items...`, {
          id: "duplicate-data-progress",
        })
        for (const it of itemsWithData) {
          void patchItemField(it.id, { [targetKey]: it.dynamicData[sourceKey] })
        }
        toast.success("Data duplicated", { id: "duplicate-data-progress" })
      }
    },
    [patchBoardTableUi, tableUi, board?.groups, patchItemField]
  )

  const deleteBoardColumn = useCallback(
    (columnId: string) => {
      const { tableColumnOrder, tableCustomColumns, hiddenColumnIds } = tableUi

      if (columnId === "task" || columnId === "select" || columnId === "add") {
        return
      }

      const isCustom = columnId.startsWith("c_")
      if (isCustom) {
        const nextOrder = tableColumnOrder.filter((id) => id !== columnId)
        const nextCustom = { ...tableCustomColumns }
        delete nextCustom[columnId]
        void patchBoardTableUi({
          tableColumnOrder: nextOrder,
          tableCustomColumns: nextCustom,
          tablePinnedColumnIds: normalizePinnedColumnIds(
            tableUi.tablePinnedColumnIds.filter((id) => id !== columnId),
            nextOrder
          ),
        })
      } else {
        const nextHidden = [
          ...new Set([...hiddenColumnIds, columnId as HidableBoardColumnId]),
        ]
        void patchBoardTableUi({
          hiddenTableColumnIds: nextHidden,
          tablePinnedColumnIds: normalizePinnedColumnIds(
            tableUi.tablePinnedColumnIds.filter((id) => id !== columnId),
            tableColumnOrder
          ),
        })
      }
    },
    [patchBoardTableUi, tableUi]
  )

  const handleBoardDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result
      if (!destination) return
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return

      if (type === "BOARD_GROUP") {
        const ids = sortedGroups.map((g) => g.id)
        const next = reorderArray(ids, source.index, destination.index)
        void patchBoardTableUi({ groupOrder: next })
        return
      }

      if (type === "COLUMN") {
        const full = tableUi.tableColumnOrder
        const hidden = new Set<string>(tableUi.hiddenColumnIds)
        const visibleIds = full.filter((id) => !hidden.has(id))
        const fromId = visibleIds[source.index]
        const toId = visibleIds[destination.index]
        if (!fromId || !toId) return
        const fromFull = full.indexOf(fromId)
        const toFull = full.indexOf(toId)
        if (fromFull < 0 || toFull < 0) return
        const next = ensureAddColumnLastInOrder(
          reorderArray(full, fromFull, toFull)
        )
        void patchBoardTableUi({ tableColumnOrder: next })
        return
      }

      if (type === "SUBITEM_COLUMN") {
        const full = subitemTableUi.tableColumnOrder
        const hidden = new Set<string>(subitemTableUi.hiddenColumnIds)
        const visibleIds = full.filter((id) => !hidden.has(id))
        const fromId = visibleIds[source.index]
        const toId = visibleIds[destination.index]
        if (!fromId || !toId) return
        const fromFull = full.indexOf(fromId)
        const toFull = full.indexOf(toId)
        if (fromFull < 0 || toFull < 0) return
        const next = ensureAddColumnLastInOrder(
          reorderArray(full, fromFull, toFull)
        )
        void patchSubitemBoardTableUi({ tableColumnOrder: next })
        return
      }
    },
    [
      patchBoardTableUi,
      patchSubitemBoardTableUi,
      sortedGroups,
      subitemTableUi.hiddenColumnIds,
      subitemTableUi.tableColumnOrder,
      tableUi.hiddenColumnIds,
      tableUi.tableColumnOrder,
    ]
  )

  const taskCount = useMemo(
    () => sortedGroups.reduce((n, g) => n + g.items.length, 0),
    [sortedGroups]
  )

  const baseTaskCount = useMemo(
    () => filteredGroups.reduce((n, g) => n + g.items.length, 0),
    [filteredGroups]
  )

  const boardItemsForLookup = useMemo(
    () => filteredGroups.flatMap((g) => g.items),
    [filteredGroups]
  )

  const personTaskNameForToolbar = useMemo(() => {
    if (!personTargetItemId) return ""
    return (
      boardItemsForLookup.find((i) => i.id === personTargetItemId)?.name ??
      personTargetItemId
    )
  }, [boardItemsForLookup, personTargetItemId])

  /** True only when filters/search hide every row — still show groups when the board is simply empty. */
  const hasActiveRowFilters =
    searchQuery.trim().length > 0 ||
    personFilterUserIds.length > 0 ||
    personIncludeUnassigned ||
    Object.values(boardFilterQuick).some((a) => a && a.length > 0) ||
    advancedTreeIsActive(advancedFilterRoot)

  const allRowsEmpty =
    taskCount === 0 && filteredGroups.length > 0 && hasActiveRowFilters

  const openAccordionGroupIds = useMemo(
    () => sortedGroups.filter((g) => openByGroupId[g.id]).map((g) => g.id),
    [sortedGroups, openByGroupId]
  )

  const accordionKnownGroupIds = useMemo(
    () => sortedGroups.map((g) => g.id),
    [sortedGroups]
  )

  const kanbanFlatItems = useMemo(
    () => sortedGroups.flatMap((g) => g.items),
    [sortedGroups]
  )

  const addPersonAsAssignee = useCallback(
    (itemId: string, userId: string) => {
      const hit = kanbanFlatItems.find((i) => i.id === itemId)
      const ids = readAssigneeUserIdsFromDynamic(hit?.dynamicData)
      if (ids.includes(userId)) return
      void setTaskAssignees(itemId, [...ids, userId], [])
    },
    [kanbanFlatItems, setTaskAssignees]
  )

  const acceptAssigneeToken = searchParams.get("acceptAssignee")

  useEffect(() => {
    const token = acceptAssigneeToken?.trim()
    if (!token) return

    const storageKey = `ecosystra-accept-assignee:${token}`
    if (
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(storageKey)
    ) {
      const next = new URLSearchParams(searchParams.toString())
      next.delete("acceptAssignee")
      const q = next.toString()
      router.replace(q ? `${pathname}?${q}` : pathname)
      return
    }

    let cancelled = false
    void (async () => {
      try {
        await acceptTaskAssigneeInvite(token)
        if (!cancelled) {
          try {
            window.sessionStorage.setItem(storageKey, "1")
          } catch {
            /* private mode / quota */
          }
          toast.success(bt.toastInviteAccepted)
          const next = new URLSearchParams(searchParams.toString())
          next.delete("acceptAssignee")
          const q = next.toString()
          router.replace(q ? `${pathname}?${q}` : pathname)
        }
      } catch {
        /* toast in hook */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [
    acceptAssigneeToken,
    searchParams,
    pathname,
    router,
    acceptTaskAssigneeInvite,
    bt.toastInviteAccepted,
  ])

  useEffect(() => {
    const valid = new Set(sortedGroups.map((g) => g.id))
    setBoardSelectionByGroup((prev) => {
      let changed = false
      const next: Record<string, string[]> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (!valid.has(k)) {
          changed = true
          continue
        }
        next[k] = v
      }
      return changed ? next : prev
    })
  }, [sortedGroups])

  const groupSelectionHandlers = useMemo(() => {
    const handlers: Record<string, (ids: string[]) => void> = {}
    for (const g of sortedGroups) {
      handlers[g.id] = (selectedIds: string[]) => {
        setBoardSelectionByGroup((prev) => ({ ...prev, [g.id]: selectedIds }))
      }
    }
    return handlers
  }, [sortedGroups])

  const selectionTotalCount = useMemo(
    () =>
      Object.values(boardSelectionByGroup).reduce(
        (sum, ids) => sum + ids.length,
        0
      ),
    [boardSelectionByGroup]
  )

  const selectionSheetSections = useMemo(() => {
    const sections: {
      groupId: string
      groupName: string
      tasks: { id: string; name: string }[]
    }[] = []
    for (const g of sortedGroups) {
      const ids = boardSelectionByGroup[g.id]
      if (!ids?.length) continue
      const nameById = new Map(g.items.map((it) => [it.id, it.name ?? ""]))
      const tasks = ids.map((id) => ({
        id,
        name: (nameById.get(id) ?? "").trim() || id,
      }))
      sections.push({ groupId: g.id, groupName: g.name, tasks })
    }
    return sections
  }, [sortedGroups, boardSelectionByGroup])

  useEffect(() => {
    if (selectionTotalCount === 0) setSelectionSheetOpen(false)
  }, [selectionTotalCount])

  const hideColumnLabel = useCallback(
    (id: HidableBoardColumnId) => {
      const m: Record<HidableBoardColumnId, string> = {
        status: bt.hideColStatus,
        dueDate: bt.hideColDueDate,
        date: bt.hideColDate,
        lastUpdated: bt.hideColLastUpdated,
        files: bt.hideColFiles,
        owner: bt.hideColOwner,
        assignee: bt.hideColAssignee,
        timeline: bt.hideColTimeline,
        priority: bt.hideColPriority,
        budget: bt.hideColBudget,
        rating: bt.hideColRating,
        duePriority: bt.hideColDue,
        notes: bt.hideColNotes,
        notesCategory: bt.hideColNotesCategory,
      }
      return m[id]
    },
    [bt]
  )

  const toggleHiddenColumn = useCallback(
    (id: HidableBoardColumnId) => {
      const cur = tableUi.hiddenColumnIds
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      void patchBoardTableUi({ hiddenTableColumnIds: next })
    },
    [patchBoardTableUi, tableUi.hiddenColumnIds]
  )

  const setAllHidableColumnsVisible = useCallback(
    (visible: boolean) => {
      if (visible) {
        void patchBoardTableUi({ hiddenTableColumnIds: [] })
      } else {
        void patchBoardTableUi({
          hiddenTableColumnIds: [...HIDABLE_COLUMN_IDS],
        })
      }
    },
    [patchBoardTableUi]
  )

  const hideSuiteColumns = useMemo((): BoardFilterColumnMeta[] => {
    const all = buildBoardFilterColumns({
      tableColumnOrder: tableUi.tableColumnOrder,
      hiddenColumnIds: [],
      tableCustomColumns: tableUi.tableCustomColumns,
      tableColumnTitles: tableUi.tableColumnTitles,
      dict: t,
    })
    const order = new Map(
      tableUi.tableColumnOrder.map((id, i) => [id, i] as const)
    )
    const rows = HIDABLE_COLUMN_IDS.map((id) => {
      const hit = all.find((c) => c.id === id)
      if (hit) return hit
      return {
        id,
        kind: id,
        title: hideColumnLabel(id),
        valueKind: "text" as const,
      }
    })
    rows.sort(
      (a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999)
    )
    return rows
  }, [
    hideColumnLabel,
    tableUi.tableColumnOrder,
    tableUi.tableCustomColumns,
    tableUi.tableColumnTitles,
    t,
  ])

  const hasHiddenHidableColumn = useMemo(
    () =>
      HIDABLE_COLUMN_IDS.some((id) => tableUi.hiddenColumnIds.includes(id)),
    [tableUi.hiddenColumnIds]
  )

  const commitColumnTitle = useCallback(
    (columnId: string, nextTitle: string, fallbackTitle: string) => {
      const titles = { ...tableUi.tableColumnTitles }
      if (nextTitle === fallbackTitle) delete titles[columnId]
      else titles[columnId] = nextTitle
      void patchBoardTableUi({ tableColumnTitles: titles })
    },
    [patchBoardTableUi, tableUi.tableColumnTitles]
  )

  const commitSubitemColumnTitle = useCallback(
    (columnId: string, nextTitle: string, fallbackTitle: string) => {
      const titles = { ...subitemTableUi.tableColumnTitles }
      if (nextTitle === fallbackTitle) delete titles[columnId]
      else titles[columnId] = nextTitle
      void patchSubitemBoardTableUi({ tableColumnTitles: titles })
    },
    [patchSubitemBoardTableUi, subitemTableUi.tableColumnTitles]
  )

  const commitSubitemRowOrder = useCallback(
    (parentItemId: string, orderedIds: string[]) => {
      void patchSubitemBoardTableUi({
        itemOrdersByParent: {
          ...subitemTableUi.itemOrdersByParent,
          [parentItemId]: orderedIds,
        },
      })
    },
    [patchSubitemBoardTableUi, subitemTableUi.itemOrdersByParent]
  )

  const [runSearch, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SEARCH_WORKSPACE)

  const onRunSearch = useCallback(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      toast.message(bt.searchMinCharsToast)
      return
    }
    void runSearch({ variables: { query: q } })
  }, [runSearch, searchQuery, bt.searchMinCharsToast])

  useEffect(() => {
    if (!boardAnnouncement.trim()) return
    const timer = window.setTimeout(() => setBoardAnnouncement(""), 4000)
    return () => window.clearTimeout(timer)
  }, [boardAnnouncement])

  const pageLang = localeSeg === "ar" ? "ar" : "en"

  return (
    <section
      lang={pageLang}
      className={cn(
        boardSurface.boardRoot,
        "flex min-h-0 flex-1 flex-col gap-[var(--vibe-space-8)] overflow-auto p-[var(--vibe-space-8)] sm:gap-[var(--vibe-space-12)] sm:p-[var(--vibe-space-12)] md:gap-[var(--vibe-space-16)] md:px-[var(--vibe-space-24)] md:pb-[var(--vibe-space-24)] md:pt-[var(--vibe-space-12)]"
      )}
      data-ecosystra-embedded="true"
      data-ecosystra-board="true"
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {boardAnnouncement}
      </div>
      {boardInitialLoading ? (
        <div
          className="flex flex-col gap-3 p-2"
          role="status"
          aria-live="polite"
          aria-label={bt.loadingBoard}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span>{bt.loadingBoard}</span>
          </div>
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : null}

      {error ? (
        <Alert variant="destructive" role="alert">
          <AlertTitle>{bt.retryBoard}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{String(error.message)}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-destructive/60"
              onClick={() => void refetch()}
            >
              {bt.retryBoard}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {board ? (
        <>
          <header className="flex flex-col gap-[var(--vibe-space-8)] sm:gap-[var(--vibe-space-12)]">
            <EcosystraGrandbookTipseen
              title={bt.toolbarTipseenTitle}
              body={bt.toolbarTipseenBody}
              dismissLabel={bt.toolbarTipseenDismiss}
            />
            {searchQuery.trim() && !attentionDismissed ? (
              <EcosystraAttentionBox
                type="warning"
                title={bt.attentionFilterTitle}
                text={bt.attentionFilterText}
                onClose={() => setAttentionDismissed(true)}
                closeButtonAriaLabel={bt.attentionFilterDismissAria}
              />
            ) : null}
            <div className="flex flex-col gap-[var(--vibe-space-8)]">
              <div className="flex flex-wrap items-center justify-between gap-[var(--vibe-space-4)] sm:gap-[var(--vibe-space-8)]">
                <h1 className="m-0 min-w-0 flex-1 basis-full text-xl font-semibold tracking-tight sm:basis-auto sm:max-w-md sm:text-2xl">
                  <label htmlFor="eco-board-title-input" className="sr-only">
                    {bt.boardTitle}
                  </label>
                  <Input
                    id="eco-board-title-input"
                    className="border-transparent px-0 text-xl font-semibold tracking-tight shadow-none sm:text-2xl hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={titleDraft}
                    data-eco-editable-heading
                    aria-label={bt.boardTitle}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={() => {
                      if (titleDraft.trim() && titleDraft !== board.name) {
                        void renameBoard(titleDraft.trim())
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        e.currentTarget.blur()
                      }
                    }}
                  />
                </h1>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewGroupOpen(true)}
                  >
                    <Plus className="me-1 size-4" aria-hidden />
                    Group
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={bt.boardOptions}
                      >
                        <MoreHorizontal className="size-5" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        {bt.toolbarBoardMenuTitle}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => void refetch()}>
                        {bt.menuRefreshBoard}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          void navigator.clipboard.writeText(board.id)
                          toast.success(bt.boardIdCopied)
                        }}
                      >
                        {bt.menuCopyBoardId}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSheetActivityOpen(true)}
                      >
                        {bt.menuBoardActivity}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setMediaDialogOpen(true)}
                      >
                        {bt.menuMediaModal}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex w-full min-w-0 flex-wrap items-center gap-[var(--vibe-space-4)] sm:gap-[var(--vibe-space-8)]">
                <Tabs
                  id="ecosystra-board-views"
                  value={viewTab}
                  onValueChange={(v) => setViewTab(v as "table" | "kanban")}
                  className="min-w-0 flex-1"
                >
                  <TabsList
                    id="ecosystra-board-view-tablist"
                    aria-label={bt.viewTabsLabel}
                    className={cn(
                      boardSurface.boardToolbarTablist,
                      "overflow-x-auto"
                    )}
                  >
                    <TabsTrigger
                      value="kanban"
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      <span>{bt.tabKanban}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          boardSurface.boardToolbarBadge,
                          "tabular-nums"
                        )}
                      >
                        {taskCount}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="table"
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      <span>{bt.tabMainTable}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          boardSurface.boardToolbarBadge,
                          "tabular-nums"
                        )}
                      >
                        {taskCount}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="calendar"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabCalendar}
                    </TabsTrigger>
                    <TabsTrigger
                      value="gantt"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabGantt}
                    </TabsTrigger>
                    <TabsTrigger
                      value="table2"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabTable}
                    </TabsTrigger>
                    <TabsTrigger
                      value="chart"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabChart}
                    </TabsTrigger>
                    <TabsTrigger
                      value="doc"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabDoc}
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabFileGallery}
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      disabled
                      className={cn(boardSurface.boardToolbarTab, "shrink-0")}
                    >
                      {bt.tabCustomView}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0 px-2 text-muted-foreground"
                  disabled
                  aria-hidden
                  tabIndex={-1}
                >
                  +
                </Button>
              </div>
            </div>
          </header>

          {viewTab === "kanban" ? (
            <Card className="border-[color:var(--eco-board-outer-border)] bg-[color:var(--eco-board-card-bg)] shadow-none">
              <CardHeader>
                <CardTitle asChild>
                  <p className="text-lg font-semibold leading-none tracking-tight">
                    {bt.tabKanban}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{bt.counterTasks}</span>
                    <span className="tabular-nums font-medium text-foreground">
                      {taskCount}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      taskCount === 0 ? 0 : 35 + taskCount * 3
                    )}
                    aria-label={bt.counterTasks}
                  />
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      {bt.kanbanDensityLabel}
                    </Label>
                    <Slider
                      value={kanbanCardScale}
                      onValueChange={setKanbanCardScale}
                      min={90}
                      max={115}
                      step={1}
                      aria-label={bt.kanbanDensityLabel}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {bt.kanbanPlaceholder}
                </p>
                <EcosystraBoardKanbanView
                  flatItems={kanbanFlatItems}
                  onChangePriority={(id, p) => {
                    void patchItemField(id, { priority: p })
                    const hit = kanbanFlatItems.find((i) => i.id === id)
                    const name = hit?.name?.trim() || id
                    setBoardAnnouncement(
                      bt.announceTaskPriority
                        .replace("{name}", name)
                        .replace("{priority}", p)
                    )
                  }}
                  t={t}
                  cardScalePercent={kanbanCardScale[0] ?? 100}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div
                role="toolbar"
                aria-label={bt.searchLabel}
                className={cn(
                  "flex flex-wrap items-center gap-[var(--vibe-space-4)] pb-[var(--vibe-space-8)] sm:gap-[var(--vibe-space-8)] sm:pb-[var(--vibe-space-12)]",
                  boardSurface.boardToolbarActions
                )}
              >
                <div className="flex items-center rounded-md shadow-sm">
                  <Button
                    type="button"
                    className={cn(
                      boardSurface.boardNewTaskPrimary,
                      "h-9 rounded-e-none px-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    onClick={() => {
                      const g = sortedGroups[0]
                      if (g) void addTask(g.id, "New task")
                    }}
                  >
                    <Plus className="me-2 size-4" aria-hidden />
                    {bt.newTask}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        className={cn(
                          boardSurface.boardNewTaskSplit,
                          "h-9 rounded-s-none"
                        )}
                        aria-label={bt.newTaskMenu}
                      >
                        <ChevronDown className="size-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>{bt.newTask}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => {
                          const g = sortedGroups[0]
                          if (g) void addTask(g.id, "New task")
                        }}
                      >
                        {bt.newTaskMenuPrimary}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setNewGroupOpen(true)}>
                        {bt.newTaskMenuGroup}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div
                  role="search"
                  aria-label={bt.searchThisBoard}
                  className="relative min-w-0 w-full max-w-sm flex-1 sm:min-w-[200px]"
                >
                  <EcosystraGrandbookIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="size-4" />
                  </EcosystraGrandbookIcon>
                  <Input
                    className="border-[color:var(--eco-board-outer-border)] bg-[color:var(--eco-board-card-bg)] ps-9 shadow-none"
                    placeholder={bt.searchThisBoard}
                    aria-label={bt.searchThisBoard}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onRunSearch()
                    }}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Search className="me-1 size-4" aria-hidden />
                      API
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[calc(100dvw-32px)] sm:w-80"
                    align="start"
                  >
                    <p className="mb-2 text-xs text-muted-foreground">
                      {bt.apiSearchIntro}
                    </p>
                    <Collapsible
                      open={apiSearchDetailsOpen}
                      onOpenChange={setApiSearchDetailsOpen}
                      className="mb-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex w-full items-center justify-between gap-2 font-normal"
                          aria-expanded={apiSearchDetailsOpen}
                          aria-controls="eco-api-search-details"
                        >
                          <span className="text-start text-xs">
                            {bt.apiSearchDetailsToggle}
                          </span>
                          <ChevronDown
                            className={cn(
                              "size-4 shrink-0 transition-transform",
                              apiSearchDetailsOpen && "rotate-180"
                            )}
                            aria-hidden
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent
                        id="eco-api-search-details"
                        className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
                      >
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {bt.apiSearchDetailsBody}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible
                      open={apiMigrationOpen}
                      onOpenChange={setApiMigrationOpen}
                      className="mb-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-full justify-between px-0 text-xs text-muted-foreground"
                          aria-expanded={apiMigrationOpen}
                        >
                          {bt.dropdownMigrationTitle}
                          <ChevronDown
                            className={cn(
                              "size-3 transition-transform",
                              apiMigrationOpen && "rotate-180"
                            )}
                            aria-hidden
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="text-xs text-muted-foreground">
                        {bt.dropdownMigrationBody}
                      </CollapsibleContent>
                    </Collapsible>
                    <p className="mb-1 text-xs font-medium text-foreground">
                      {bt.comboboxDeprecatedHeading}
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {bt.comboboxDeprecatedBody}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      disabled={searchLoading}
                      onClick={() => onRunSearch()}
                    >
                      {searchLoading ? bt.apiSearching : bt.apiRunSearch}
                    </Button>
                    <p className="mt-2 text-xs font-medium text-foreground">
                      {bt.apiResultsHeading}
                    </p>
                    <EcosystraGrandbookVirtualizedListWindow className="mt-1">
                      <EcosystraGrandbookLegacyList className="text-sm">
                        {(searchData?.search ?? []).map(
                          (r: { id: string; name: string; type: string }) => (
                            <li
                              key={`${r.type}-${r.id}`}
                              className="truncate py-0.5 [content-visibility:auto]"
                            >
                              <span className="text-muted-foreground">
                                {r.type}:
                              </span>{" "}
                              {r.name}
                            </li>
                          )
                        )}
                      </EcosystraGrandbookLegacyList>
                    </EcosystraGrandbookVirtualizedListWindow>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1",
                        (personFilterUserIds.length > 0 ||
                          personIncludeUnassigned) &&
                          "border-primary/50 bg-primary/5"
                      )}
                    >
                      <User className="size-4" aria-hidden />
                      {bt.person}
                    </Button>
                  </PopoverTrigger>
                  <BoardPersonFilterPopover
                    dict={t}
                    groups={filteredGroups}
                    workspaceUsers={mergedWorkspaceUsers}
                    selectedUserIds={personFilterUserIds}
                    includeUnassigned={personIncludeUnassigned}
                    onChange={(ids, inc) => {
                      setPersonFilterUserIds(ids)
                      setPersonIncludeUnassigned(inc)
                    }}
                    personTargetItemId={personTargetItemId}
                    personTaskName={personTaskNameForToolbar}
                    personQuery={personQuery}
                    onPersonQueryChange={setPersonQuery}
                    workspaceUsersForAssign={peopleData?.workspaceUsers ?? []}
                    onPickAssignee={(userId) => {
                      if (!personTargetItemId) return
                      addPersonAsAssignee(personTargetItemId, userId)
                    }}
                    onPickOwner={(userId) => {
                      if (!personTargetItemId) return
                      void setTaskOwner(personTargetItemId, userId)
                    }}
                    onSaveView={openSaveFilterViewDialog}
                  />
                </Popover>
                <Popover
                  open={filterPopoverOpen}
                  onOpenChange={setFilterPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1",
                        (Object.values(boardFilterQuick).some(
                          (s) => s && s.length > 0
                        ) ||
                          advancedTreeIsActive(advancedFilterRoot)) &&
                          "border-primary/50 bg-primary/5"
                      )}
                    >
                      <Filter className="size-4" aria-hidden />
                      {bt.filter}
                    </Button>
                  </PopoverTrigger>
                  <BoardQuickFiltersPanel
                    dict={t}
                    groups={filteredGroups}
                    tableUi={{
                      tableColumnOrder: tableUi.tableColumnOrder,
                      hiddenColumnIds: tableUi.hiddenColumnIds,
                      tableCustomColumns: tableUi.tableCustomColumns,
                      tableColumnTitles: tableUi.tableColumnTitles,
                      statusLabels: tableUi.statusLabels,
                      priorityLabels: tableUi.priorityLabels,
                      notesCategoryLabels: tableUi.notesCategoryLabels,
                      duePriorityLabels: tableUi.duePriorityLabels,
                    }}
                    workspaceUsers={mergedWorkspaceUsers}
                    selections={boardFilterQuick}
                    onSelectionsChange={setBoardFilterQuick}
                    onOpenAdvanced={() => {
                      setFilterPopoverOpen(false)
                      setAdvancedFilterOpen(true)
                    }}
                    filteredTaskCount={taskCount}
                    totalTaskCount={baseTaskCount}
                    onSaveView={openSaveFilterViewDialog}
                    savedFilterViews={tableUi.savedFilterViews}
                    onApplySavedView={applySavedFilterView}
                    onRenameSavedView={renameSavedFilterView}
                    onDeleteSavedView={deleteSavedFilterView}
                  />
                </Popover>
                <BoardAdvancedFiltersDialog
                  open={advancedFilterOpen}
                  onOpenChange={setAdvancedFilterOpen}
                  dict={t}
                  groups={filteredGroups}
                  tableUi={{
                    tableColumnOrder: tableUi.tableColumnOrder,
                    hiddenColumnIds: tableUi.hiddenColumnIds,
                    tableCustomColumns: tableUi.tableCustomColumns,
                    tableColumnTitles: tableUi.tableColumnTitles,
                    statusLabels: tableUi.statusLabels,
                    priorityLabels: tableUi.priorityLabels,
                    notesCategoryLabels: tableUi.notesCategoryLabels,
                    duePriorityLabels: tableUi.duePriorityLabels,
                  }}
                  workspaceUsers={mergedWorkspaceUsers}
                  filterRoot={advancedFilterRoot}
                  onFilterRootChange={setAdvancedFilterRoot}
                  onSaveView={openSaveFilterViewDialog}
                  savedFilterViews={tableUi.savedFilterViews}
                  onApplySavedView={applySavedFilterView}
                  onRenameSavedView={renameSavedFilterView}
                  onDeleteSavedView={deleteSavedFilterView}
                  onFilterAiApply={onFilterAiApply}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1",
                        activeSortRuleCount > 0 &&
                          "border-primary/50 bg-primary/5"
                      )}
                    >
                      <ArrowUpDown className="size-4" aria-hidden />
                      {activeSortRuleCount > 0
                        ? (bt.sortWithCount?.replace(
                            "{n}",
                            String(activeSortRuleCount)
                          ) ?? `Sort / ${activeSortRuleCount}`)
                        : bt.sort}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <EcosystraBoardSortSuiteContent
                        dict={t}
                        columns={filterableColumns}
                        sortRules={sortRules}
                        onSortRulesChange={commitSortRules}
                        onSaveView={openSaveFilterViewDialog}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "gap-1",
                        hasHiddenHidableColumn &&
                          "border-primary/50 bg-primary/5"
                      )}
                    >
                      <EyeOff className="size-4" aria-hidden />
                      {bt.hide}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <EcosystraBoardHideSuiteContent
                        dict={t}
                        columns={hideSuiteColumns}
                        hiddenColumnIds={tableUi.hiddenColumnIds}
                        onToggleColumn={toggleHiddenColumn}
                        onSetAllHidableVisible={setAllHidableColumnsVisible}
                        onSaveView={openSaveFilterViewDialog}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-0.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-1",
                          activeGroupByRuleCount > 0 &&
                            "border-primary/50 bg-primary/5"
                        )}
                        aria-label={bt.groupByRadioLabel}
                      >
                        <LayoutGrid className="size-4" aria-hidden />
                        {activeGroupByRuleCount > 0
                          ? bt.groupByWithCount.replace(
                              "{n}",
                              String(activeGroupByRuleCount)
                            )
                          : bt.groupBy}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <EcosystraBoardGroupBySuiteContent
                          dict={t}
                          columns={groupByToolbarColumns}
                          suite={tableUi.groupBySuite}
                          tableCustomColumns={tableUi.tableCustomColumns}
                          onSuiteChange={commitGroupBySuite}
                          onSaveView={openSaveFilterViewDialog}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={cn(
                          "size-8 shrink-0",
                          pinColumnsExtraCount > 0 &&
                            "border-primary/50 bg-primary/5"
                        )}
                        aria-label={bt.boardTableMoreOptionsAria}
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        onSelect={() => {
                          setPinColumnsDialogOpen(true)
                        }}
                      >
                        <Pin className="me-2 size-4" aria-hidden />
                        {bt.pinColumnsMenu.replace(
                          "{n}",
                          String(pinColumnsExtraCount)
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {selectionTotalCount > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setSelectionSheetOpen(true)}
                    aria-label={bt.selectionToolbarAria}
                  >
                    <ListChecks className="size-4" aria-hidden />
                    {bt.selectionToolbarLabel.replace(
                      "{n}",
                      String(selectionTotalCount)
                    )}
                  </Button>
                ) : null}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ms-auto"
                      aria-label={bt.toolbarMore}
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{bt.toolbarMore}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => void refetch()}>
                      {bt.menuRefreshBoard}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSheetActivityOpen(true)}
                    >
                      {bt.menuBoardActivity}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {allRowsEmpty ? (
                <EcosystraGrandbookEmptyState
                  title={bt.emptyFilteredTitle}
                  description={bt.emptyFilteredBody}
                  actionLabel={bt.emptyFilteredClear}
                  onAction={() => {
                    setSearchQuery("")
                    setPersonFilterUserIds([])
                    setPersonIncludeUnassigned(false)
                    setBoardFilterQuick({})
                    setAdvancedFilterRoot(null)
                    commitSortRules([])
                  }}
                />
              ) : null}
              {!allRowsEmpty ? (
                <DndContext
                  sensors={boardRowSensors}
                  onDragStart={handleBoardRowDragStart}
                  onDragOver={handleBoardRowDragOver}
                  onDragEnd={handleBoardRowDragEnd}
                  onDragCancel={handleBoardRowDragCancel}
                >
                  <DragDropContext onDragEnd={handleBoardDragEnd}>
                    <EcosystraAccordion
                      id="eco-board-groups-accordion"
                      type="multiple"
                      aria-label={bt.boardGroupsAccordion}
                      className="flex min-h-0 flex-1 flex-col"
                      value={openAccordionGroupIds}
                      onValueChange={(vals) =>
                        setGroupsOpenFromAccordion(vals, accordionKnownGroupIds)
                      }
                    >
                      <Droppable droppableId="board-groups" type="BOARD_GROUP">
                        {(dropProvided) => (
                          <div
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                            className="flex min-h-0 flex-1 flex-col gap-[var(--vibe-space-8)] sm:gap-[var(--vibe-space-12)] md:gap-[var(--vibe-space-16)]"
                          >
                            {sortedGroups.map((group, groupIndex) => (
                              <Draggable
                                key={group.id}
                                draggableId={`board-group-${group.id}`}
                                index={groupIndex}
                              >
                                {(dragProvided, snapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    style={dragProvided.draggableProps.style}
                                    className={cn(
                                      snapshot.isDragging &&
                                        "rounded-xl shadow-lg ring-2 ring-primary/25"
                                    )}
                                  >
                                    <EcosystraAccordionItem
                                      value={group.id}
                                      id={`eco-board-group-${group.id}`}
                                      className="rounded-lg border !border-b-0 border-[color:var(--eco-board-outer-border)] bg-[color:var(--eco-board-card-bg)] shadow-none sm:rounded-xl data-[state=open]:shadow-[0_1px_0_rgba(0,0,0,0.06)]"
                                    >
                                      <div
                                        className="group/group-row flex items-stretch border-s-4"
                                        style={{
                                          borderColor: group.color
                                            ? group.color
                                            : "var(--eco-group-todo)",
                                        }}
                                      >
                                        <div className="flex min-w-0 flex-1 items-center gap-1.5 py-[var(--vibe-space-4)] ps-[var(--vibe-space-8)] pe-1 sm:gap-2 sm:py-[var(--vibe-space-8)] sm:ps-[var(--vibe-space-12)] sm:pe-2">
                                          <EcosystraBoardGroupColorButton
                                            color={group.color}
                                            ariaLabel={bt.groupColorPickerAria}
                                            onPick={(hex) =>
                                              void patchGroup(
                                                group.id,
                                                undefined,
                                                hex
                                              )
                                            }
                                          />
                                          <EcosystraBoardGroupEditableName
                                            name={group.name}
                                            groupColor={group.color}
                                            onCommit={(next) =>
                                              void patchGroup(
                                                group.id,
                                                next,
                                                undefined
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="flex shrink-0 items-stretch">
                                          <button
                                            type="button"
                                            className="inline-flex size-8 shrink-0 items-center justify-center self-stretch rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted/80 hover:text-foreground group-hover/group-row:opacity-100 focus-visible:opacity-100"
                                            aria-label={bt.groupDragReorderAria}
                                            {...dragProvided.dragHandleProps}
                                          >
                                            <GripVertical
                                              className="size-4"
                                              aria-hidden
                                            />
                                          </button>
                                          <EcosystraBoardGroupAccordionTrigger
                                            className="hover:no-underline inline-flex shrink-0 items-center justify-center self-stretch px-2 py-[var(--vibe-space-8)]"
                                            aria-label={
                                              openByGroupId[group.id]
                                                ? `${bt.collapseGroup}: ${group.name}`
                                                : `${bt.expandGroup}: ${group.name}`
                                            }
                                          >
                                            <span className="sr-only">
                                              {openByGroupId[group.id]
                                                ? `${bt.collapseGroup}: ${group.name}`
                                                : `${bt.expandGroup}: ${group.name}`}
                                            </span>
                                          </EcosystraBoardGroupAccordionTrigger>
                                        </div>
                                        <div className="flex shrink-0 items-center pe-2">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 shrink-0"
                                                aria-label={bt.groupRowMenu}
                                              >
                                                <MoreHorizontal
                                                  className="size-4"
                                                  aria-hidden
                                                />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onSelect={() =>
                                                  setDeleteTarget({
                                                    kind: "group",
                                                    id: group.id,
                                                  })
                                                }
                                              >
                                                {bt.deleteGroupMenu}
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                      <AccordionContent className="px-[var(--vibe-space-4)] pb-[var(--vibe-space-8)] pt-0 sm:px-[var(--vibe-space-8)] md:px-[var(--vibe-space-12)] md:pb-[var(--vibe-space-12)]">
                                        <EcosystraBoardGroupTable
                                          groupId={group.id}
                                          groupName={group.name}
                                          groupColor={group.color}
                                          workspaceId={board.workspaceId}
                                          items={tableItemsForGroup(
                                            group.id,
                                            group.items
                                          )}
                                          rowDensityScale={1}
                                          t={t}
                                          expandedSubitemRowId={
                                            expandedSubitemRowId
                                          }
                                          setExpandedSubitemRowId={
                                            setExpandedSubitemRowId
                                          }
                                          hiddenColumnIds={
                                            tableUi.hiddenColumnIds
                                          }
                                          groupBySuite={tableUi.groupBySuite}
                                          groupByColumn={groupByColumnMeta}
                                          groupByLabels={filterLabels}
                                          workspaceUsersForGroupBy={
                                            mergedWorkspaceUsers
                                          }
                                          groupByUnassignedLabel={
                                            bt.assigneeUnassigned
                                          }
                                          onPersonToolbarTarget={(id) =>
                                            setPersonTargetItemId(id)
                                          }
                                          onAddTask={(gid) =>
                                            void addTask(gid, "New task")
                                          }
                                          onAddSubitem={(parentId) =>
                                            void addSubitem(
                                              parentId,
                                              "New subitem"
                                            )
                                          }
                                          onPatchItem={(id, patch) =>
                                            void patchItemField(id, patch)
                                          }
                                          onRenameItem={(id, name) =>
                                            void renameItem(id, name)
                                          }
                                          onSetTaskAssignees={(
                                            id,
                                            userIds,
                                            inviteEmails
                                          ) =>
                                            void setTaskAssignees(
                                              id,
                                              userIds,
                                              inviteEmails
                                            )
                                          }
                                          onDeleteItem={(id) =>
                                            setDeleteTarget({
                                              kind: "item",
                                              id,
                                            })
                                          }
                                          columnWidthsPx={
                                            tableUi.columnWidthsPx
                                          }
                                          onColumnWidthCommit={
                                            onColumnWidthCommit
                                          }
                                          tableColumnOrder={
                                            tableUi.tableColumnOrder
                                          }
                                          tablePinnedColumnIds={
                                            tableUi.tablePinnedColumnIds
                                          }
                                          tableCustomColumns={
                                            tableUi.tableCustomColumns
                                          }
                                          enableColumnDrag
                                          onAddBoardColumn={
                                            addCustomBoardColumn
                                          }
                                          subitemTableUi={subitemTableUi}
                                          onAddSubitemBoardColumn={
                                            addSubitemBoardColumn
                                          }
                                          onSubitemColumnWidthCommit={
                                            onSubitemColumnWidthCommit
                                          }
                                          enableSubitemColumnDrag
                                          onDuplicateSubitemBoardColumn={
                                            duplicateSubitemBoardColumn
                                          }
                                          onDeleteSubitemBoardColumn={
                                            deleteSubitemBoardColumn
                                          }
                                          onSubitemColumnTitleCommit={
                                            commitSubitemColumnTitle
                                          }
                                          onSubitemRowOrderCommit={
                                            commitSubitemRowOrder
                                          }
                                          onDuplicateBoardColumn={
                                            duplicateBoardColumn
                                          }
                                          onDeleteBoardColumn={
                                            deleteBoardColumn
                                          }
                                          onRowSelectionChange={
                                            groupSelectionHandlers[group.id]
                                          }
                                          selectionClearVersion={
                                            selectionClearVersion
                                          }
                                          tableColumnTitles={
                                            tableUi.tableColumnTitles
                                          }
                                          onColumnTitleCommit={
                                            commitColumnTitle
                                          }
                                          duePriorityLabels={
                                            tableUi.duePriorityLabels
                                          }
                                          statusLabels={tableUi.statusLabels}
                                          priorityLabels={
                                            tableUi.priorityLabels
                                          }
                                          notesCategoryLabels={
                                            tableUi.notesCategoryLabels
                                          }
                                          patchBoardTableUi={patchBoardTableUi}
                                        />
                                      </AccordionContent>
                                    </EcosystraAccordionItem>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </EcosystraAccordion>
                  </DragDropContext>
                </DndContext>
              ) : null}
            </>
          )}

          <Dialog
            open={newGroupOpen}
            onOpenChange={(o) => {
              setNewGroupOpen(o)
              setNewGroupNameError(false)
              if (!o) {
                setNewGroupStep(0)
                setNewGroupNotes("")
                setNewGroupColor("#579BFC")
              }
            }}
          >
            <DialogContent
              className="w-[calc(100dvw-16px)] sm:max-w-md"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  document.getElementById("eco-dialog-new-group-title")?.focus()
                })
              }}
            >
              <DialogHeader>
                <DialogTitle id="eco-dialog-new-group-title" tabIndex={-1}>
                  {bt.dialogNewGroupTitle}
                </DialogTitle>
              </DialogHeader>
              <EcosystraGrandbookSteps
                labels={[
                  bt.dialogNewGroupStep1,
                  bt.dialogNewGroupStep2,
                  bt.dialogNewGroupStep3,
                ]}
                current={newGroupStep}
                ariaLabel={bt.dialogStepsAria}
              />
              <EcosystraGrandbookMultiStepIndicator
                current={newGroupStep + 1}
                total={3}
                ariaLabel={bt.dialogMultiStepAria}
              />
              <EcosystraGrandbookDialogBody className="mt-3 space-y-3">
                {newGroupStep === 0 ? (
                  <div className="space-y-1">
                    <Input
                      id="eco-new-group-name"
                      value={newGroupName}
                      onChange={(e) => {
                        setNewGroupName(e.target.value)
                        if (newGroupNameError) setNewGroupNameError(false)
                      }}
                      placeholder={bt.dialogNewGroupNamePh}
                      aria-label={bt.dialogNewGroupNamePh}
                      required
                      aria-required
                      aria-invalid={newGroupNameError}
                      aria-describedby={
                        newGroupNameError ? "eco-new-group-name-err" : undefined
                      }
                    />
                    {newGroupNameError ? (
                      <p
                        id="eco-new-group-name-err"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {bt.groupNameRequiredError}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {newGroupStep === 1 ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="eco-ng-color">
                        {bt.dialogNewGroupColor}
                      </Label>
                      <input
                        id="eco-ng-color"
                        type="color"
                        className="h-10 w-full cursor-pointer rounded-md border border-border"
                        value={newGroupColor}
                        onChange={(e) => setNewGroupColor(e.target.value)}
                        aria-label={bt.dialogNewGroupColor}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="eco-ng-notes">
                        {bt.dialogNewGroupNotesPh}
                      </Label>
                      <Textarea
                        id="eco-ng-notes"
                        value={newGroupNotes}
                        onChange={(e) => setNewGroupNotes(e.target.value)}
                        placeholder={bt.dialogNewGroupNotesPh}
                      />
                    </div>
                  </div>
                ) : null}
                {newGroupStep === 2 ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">
                        {bt.dialogNewGroupStep1}:
                      </span>{" "}
                      <span className="font-medium">
                        {newGroupName.trim() || "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {bt.dialogNewGroupColor}:
                      </span>{" "}
                      <span
                        className="inline-block size-4 rounded border align-middle"
                        style={{ backgroundColor: newGroupColor }}
                        aria-hidden
                      />
                      <span className="ms-2 font-mono text-xs">
                        {newGroupColor}
                      </span>
                    </p>
                  </div>
                ) : null}
              </EcosystraGrandbookDialogBody>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newGroupStep === 0) setNewGroupOpen(false)
                    else setNewGroupStep((s) => Math.max(0, s - 1))
                  }}
                >
                  {newGroupStep === 0 ? bt.dialogCancel : bt.dialogBack}
                </Button>
                {newGroupStep < 2 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (newGroupStep === 0 && !newGroupName.trim()) {
                        setNewGroupNameError(true)
                        return
                      }
                      setNewGroupNameError(false)
                      setNewGroupStep((s) => s + 1)
                    }}
                  >
                    {bt.dialogNext}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      const n = newGroupName.trim()
                      if (!n) return
                      void addGroup(n, newGroupColor)
                      setNewGroupName("")
                      setNewGroupNotes("")
                      setNewGroupColor("#579BFC")
                      setNewGroupStep(0)
                      setNewGroupOpen(false)
                    }}
                  >
                    {bt.dialogCreate}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={saveFilterViewOpen}
            onOpenChange={setSaveFilterViewOpen}
          >
            <DialogContent className="w-[calc(100dvw-16px)] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{bt.saveViewDialogTitle}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="eco-save-view-name">
                  {bt.saveViewNameLabel}
                </Label>
                <Input
                  id="eco-save-view-name"
                  value={saveViewNameDraft}
                  onChange={(e) => setSaveViewNameDraft(e.target.value)}
                  placeholder={bt.saveViewNamePlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void confirmSaveFilterView()
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSaveFilterViewOpen(false)}
                >
                  {bt.dialogCancel}
                </Button>
                <Button
                  type="button"
                  onClick={() => void confirmSaveFilterView()}
                >
                  {bt.saveViewSave}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={pinColumnsDialogOpen}
            onOpenChange={setPinColumnsDialogOpen}
          >
            <DialogContent className="w-[calc(100dvw-16px)] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{bt.pinColumnsDialogTitle}</DialogTitle>
              </DialogHeader>
              <EcosystraBoardPinColumnsContent
                dict={t}
                itemRows={itemPinRows}
                subitemRows={subitemPinRows}
                pinnedItemIds={tableUi.tablePinnedColumnIds}
                pinnedSubitemIds={subitemTableUi.pinnedColumnIds}
                onToggleItemPin={toggleTablePinnedColumn}
                onToggleSubitemPin={toggleSubitemPinnedColumn}
                onSaveView={() => {
                  setPinColumnsDialogOpen(false)
                  openSaveFilterViewDialog()
                }}
              />
            </DialogContent>
          </Dialog>

          <Sheet open={sheetActivityOpen} onOpenChange={setSheetActivityOpen}>
            <SheetContent
              className="flex w-full max-w-[100dvw] flex-col sm:max-w-md"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  document.getElementById("eco-sheet-activity-title")?.focus()
                })
              }}
            >
              <SheetHeader>
                <SheetTitle id="eco-sheet-activity-title" tabIndex={-1}>
                  {bt.sheetActivityTitle}
                </SheetTitle>
                <SheetDescription>{bt.sheetActivityBody}</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Sheet open={selectionSheetOpen} onOpenChange={setSelectionSheetOpen}>
            <SheetContent
              className="flex w-full max-w-[100dvw] flex-col gap-4 sm:max-w-md"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  document.getElementById("eco-sheet-selection-title")?.focus()
                })
              }}
            >
              <SheetHeader>
                <SheetTitle id="eco-sheet-selection-title" tabIndex={-1}>
                  {bt.selectionSheetTitle}
                </SheetTitle>
                <SheetDescription>
                  {bt.selectionSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ul className="space-y-4 text-sm">
                  {selectionSheetSections.map((section) => (
                    <li key={section.groupId}>
                      <p className="mb-2 font-medium text-foreground">
                        {section.groupName}
                      </p>
                      <ul className="space-y-1 rounded-md border border-border bg-muted/30 px-3 py-2">
                        {section.tasks.map((task) => (
                          <li key={task.id} className="text-muted-foreground">
                            <span className="text-foreground">{task.name}</span>
                            <span className="ms-2 font-mono text-xs opacity-70">
                              {task.id}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full shrink-0"
                onClick={() => {
                  setBoardSelectionByGroup({})
                  setSelectionClearVersion((v) => v + 1)
                  setSelectionSheetOpen(false)
                }}
              >
                {bt.selectionSheetClear}
              </Button>
            </SheetContent>
          </Sheet>

          <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
            <DialogContent
              className="w-[calc(100dvw-16px)] sm:max-w-lg"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  document.getElementById("eco-dialog-media-title")?.focus()
                })
              }}
            >
              <DialogHeader>
                <DialogTitle id="eco-dialog-media-title" tabIndex={-1}>
                  {bt.mediaModalTitle}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                {bt.mediaModalDesc}
              </p>
              <MediaGrid
                className="mt-2"
                data={[
                  { src: "", alt: bt.mediaAltSample, type: "IMAGE" },
                  { src: "", alt: bt.mediaAltSample, type: "IMAGE" },
                  { src: "", alt: bt.mediaAltSample, type: "IMAGE" },
                  { src: "", alt: bt.mediaAltSample, type: "IMAGE" },
                ]}
                limit={4}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={deleteTarget !== null}
            onOpenChange={(open) => {
              if (!open) {
                setDeleteTarget(null)
                setDeleteReason("")
              }
            }}
          >
            <AlertDialogContent
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  const el = document.querySelector(
                    '[data-slot="alert-dialog-content"] [data-slot="alert-dialog-title"]'
                  )
                  if (el instanceof HTMLElement) el.focus()
                })
              }}
            >
              <AlertDialogTitle tabIndex={-1}>
                {deleteTarget?.kind === "group"
                  ? bt.deleteDialogTitleGroup
                  : bt.deleteDialogTitleTask}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget?.kind === "group"
                  ? bt.deleteDialogDescGroup
                  : bt.deleteDialogDescTask}
              </AlertDialogDescription>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder={bt.deleteReasonPh}
                aria-label={bt.deleteReasonPh}
                className="min-h-[72px]"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>{bt.dialogCancel}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    if (!deleteTarget) return
                    if (deleteTarget.kind === "group") {
                      void removeGroup(deleteTarget.id)
                    } else {
                      void removeItem(deleteTarget.id)
                    }
                    setDeleteTarget(null)
                    setDeleteReason("")
                  }}
                >
                  {bt.deleteConfirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : null}
    </section>
  )
}
