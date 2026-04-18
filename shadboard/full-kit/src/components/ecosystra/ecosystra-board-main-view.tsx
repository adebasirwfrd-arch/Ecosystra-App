"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLazyQuery, useQuery } from "@apollo/client"
import { toast } from "sonner"
import {
  ArrowUpDown,
  ChevronDown,
  EyeOff,
  Filter,
  LayoutGrid,
  ListChecks,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  User,
} from "lucide-react"

import boardSurface from "./ecosystra-board-surface.module.css"

import type { HidableBoardColumnId } from "./hooks/use-ecosystra-board-apollo"

import { SEARCH_WORKSPACE, WORKSPACE_USERS } from "@/lib/ecosystra/board-gql"
import { cn } from "@/lib/utils"

import {
  HIDABLE_COLUMN_IDS,
  newCustomTableColumnId,
  orderWithColumnBeforeAdd,
  reorderArray,
  sortItemsByOrder,
  readAssigneeUserIdsFromDynamic,
  useEcosystraBoardApollo,
} from "./hooks/use-ecosystra-board-apollo"
import {
  AccordionContent,
  EcosystraAccordion,
  EcosystraAccordionItem,
} from "./ecosystra-accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EcosystraAttentionBox } from "./ecosystra-attention-box"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { EcosystraBoardGroupAccordionTrigger } from "./ecosystra-board-group-accordion-trigger"
import {
  EcosystraBoardGroupColorButton,
  EcosystraBoardGroupEditableName,
} from "./ecosystra-board-group-header"
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

export function EcosystraBoardMainView() {
  const dictionary = useEcosystraDictionary()
  const bt = dictionary.ecosystraApp.boardTable
  const t = bt as unknown as Record<string, string>

  const {
    board,
    loading,
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
    addGroup,
    removeGroup,
    tableUi,
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
  const [unassignedOnly, setUnassignedOnly] = useState(false)
  const [compactToolbar, setCompactToolbar] = useState(false)
  const [notesFilter, setNotesFilter] = useState("")
  const [attentionDismissed, setAttentionDismissed] = useState(false)
  const [sheetActivityOpen, setSheetActivityOpen] = useState(false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")
  const [rowDensity, setRowDensity] = useState([1])
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

  const [sortMode, setSortMode] = useState<"none" | "nameAsc" | "nameDesc">(
    "none"
  )

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

  const sortedGroups = useMemo(() => {
    const qNotes = notesFilter.trim().toLowerCase()
    const base = filteredGroups.map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (unassignedOnly) {
          const d = it.dynamicData || {}
          const a =
            String(d.assignee ?? "").trim() ||
            String(d.assigneeEmail ?? "").trim()
          if (a) return false
        }
        if (qNotes) {
          const d = it.dynamicData || {}
          const cat = String(d.notesCategory ?? "").toLowerCase()
          if (!cat.includes(qNotes)) return false
        }
        return true
      }),
    }))
    const ordered = base.map((g) => ({
      ...g,
      items: sortItemsByOrder(g.items, tableUi.groupItemOrders[g.id]),
    }))
    if (sortMode === "none") return ordered
    return ordered.map((g) => ({
      ...g,
      items: [...g.items].sort((a, b) => {
        const cmp = a.name.localeCompare(b.name)
        return sortMode === "nameAsc" ? cmp : -cmp
      }),
    }))
  }, [
    filteredGroups,
    sortMode,
    unassignedOnly,
    notesFilter,
    tableUi.groupItemOrders,
  ])

  const columnDragGroupId = useMemo(() => {
    const withItems = sortedGroups.find((g) => g.items.length > 0)
    return withItems?.id ?? sortedGroups[0]?.id
  }, [sortedGroups])

  const handleBoardDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result
      if (!destination) return
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return

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
        const next = reorderArray(full, fromFull, toFull)
        void patchBoardTableUi({ tableColumnOrder: next })
        return
      }
    },
    [
      patchBoardTableUi,
      tableUi.hiddenColumnIds,
      tableUi.tableColumnOrder,
    ]
  )

  const onRowOrderCommit = useCallback(
    (groupId: string, orderedItemIds: string[]) => {
      void patchBoardTableUi({
        groupItemOrders: {
          ...tableUi.groupItemOrders,
          [groupId]: orderedItemIds,
        },
      })
    },
    [patchBoardTableUi, tableUi.groupItemOrders]
  )

  const taskCount = useMemo(
    () => sortedGroups.reduce((n, g) => n + g.items.length, 0),
    [sortedGroups]
  )

  const allRowsEmpty = taskCount === 0 && filteredGroups.length > 0

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
        lastUpdated: bt.hideColLastUpdated,
        files: bt.hideColFiles,
        owner: bt.hideColOwner,
        assignee: bt.hideColAssignee,
        timeline: bt.hideColTimeline,
        priority: bt.hideColPriority,
        budget: bt.hideColBudget,
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

  /** Append a new column instance (unique id) to the left of the + control. */
  const addCustomBoardColumn = useCallback(
    (kind: HidableBoardColumnId) => {
      const id = newCustomTableColumnId()
      const nextCc = { ...tableUi.tableCustomColumns, [id]: { kind } }
      const nextOrder = orderWithColumnBeforeAdd(tableUi.tableColumnOrder, id)
      void patchBoardTableUi({
        tableCustomColumns: nextCc,
        tableColumnOrder: nextOrder,
      })
    },
    [
      patchBoardTableUi,
      tableUi.tableCustomColumns,
      tableUi.tableColumnOrder,
    ]
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

  const [personQuery, setPersonQuery] = useState("")
  useEffect(() => {
    if (!boardAnnouncement.trim()) return
    const timer = window.setTimeout(() => setBoardAnnouncement(""), 4000)
    return () => window.clearTimeout(timer)
  }, [boardAnnouncement])

  const { data: peopleData } = useQuery(WORKSPACE_USERS, {
    variables: {
      workspaceId: board?.workspaceId ?? "",
      query: personQuery || ".",
      take: 8,
    },
    skip: !board?.workspaceId,
    fetchPolicy: "cache-and-network",
  })

  const pageLang = localeSeg === "ar" ? "ar" : "en"

  return (
    <section
      lang={pageLang}
      className={cn(
        boardSurface.boardRoot,
        "flex min-h-0 flex-1 flex-col gap-[var(--vibe-space-12)] overflow-auto p-[var(--vibe-space-16)] md:gap-[var(--vibe-space-16)] md:px-[var(--vibe-space-24)] md:pb-[var(--vibe-space-24)] md:pt-[var(--vibe-space-12)]"
      )}
      data-ecosystra-embedded="true"
      data-ecosystra-board="true"
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {boardAnnouncement}
      </div>
      {loading && !board ? (
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
          <header className="flex flex-col gap-[var(--vibe-space-12)]">
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
            <div className="flex flex-wrap items-center justify-between gap-[var(--vibe-space-8)]">
              <h1 className="m-0 max-w-md min-w-0 flex-1 text-2xl font-semibold tracking-tight">
                <label htmlFor="eco-board-title-input" className="sr-only">
                  {bt.boardTitle}
                </label>
                <Input
                  id="eco-board-title-input"
                  className="border-transparent px-0 text-2xl font-semibold tracking-tight shadow-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={titleDraft}
                  data-eco-editable-heading
                  aria-label={bt.boardTitle}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => {
                    if (titleDraft.trim() && titleDraft !== board.name) {
                      void renameBoard(titleDraft.trim())
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
                    <DropdownMenuItem onSelect={() => setMediaDialogOpen(true)}>
                      {bt.menuMediaModal}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-[var(--vibe-space-8)]">
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
                      className={cn(boardSurface.boardToolbarBadge, "tabular-nums")}
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
                      className={cn(boardSurface.boardToolbarBadge, "tabular-nums")}
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
              <Separator className="bg-[color:var(--eco-board-row-divider)]" />
              <div className="flex flex-wrap items-center gap-3">
                <Toggle
                  pressed={compactToolbar}
                  onPressedChange={setCompactToolbar}
                  variant="outline"
                  size="sm"
                  aria-label={bt.compactToolbar}
                >
                  {bt.compactToolbar}
                </Toggle>
                <div className="flex min-w-[140px] max-w-[200px] flex-1 flex-col gap-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    {bt.toolbarDensityLabel}
                  </Label>
                  <Slider
                    value={rowDensity}
                    onValueChange={setRowDensity}
                    min={1}
                    max={3}
                    step={1}
                    aria-label={bt.toolbarDensityLabel}
                  />
                </div>
              </div>
              <div
                role="toolbar"
                aria-label={bt.searchLabel}
                className={cn(
                  "flex flex-wrap items-center gap-[var(--vibe-space-8)] pb-[var(--vibe-space-12)]",
                  boardSurface.boardToolbarActions,
                  compactToolbar && "gap-2 pb-2"
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
                  className="relative min-w-[200px] max-w-sm flex-1"
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
                  <PopoverContent className="w-80" align="start">
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
                      className="gap-1"
                    >
                      <User className="size-4" aria-hidden />
                      {bt.person}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <div className="border-b border-border/60 p-3 text-xs text-muted-foreground">
                      {bt.personToolbarHint}
                    </div>
                    {personTargetItemId ? (
                      <div className="border-b border-border/60 px-3 py-2 text-xs font-medium text-foreground">
                        {bt.personTaskLabel}{" "}
                        {(() => {
                          const hit = kanbanFlatItems.find(
                            (i) => i.id === personTargetItemId
                          )
                          return hit?.name ?? personTargetItemId
                        })()}
                      </div>
                    ) : null}
                    <Command shouldFilter={false} className="max-h-72">
                      <CommandInput
                        placeholder={bt.personFilterPlaceholder}
                        value={personQuery}
                        onValueChange={setPersonQuery}
                        aria-label={bt.personWorkspaceUsers}
                      />
                      <CommandList>
                        <CommandEmpty>{bt.personNoResults}</CommandEmpty>
                        <CommandGroup heading={bt.personWorkspaceUsers}>
                          {(peopleData?.workspaceUsers ?? []).map(
                            (u: {
                              id: string
                              name: string | null
                              email: string
                            }) => (
                              <CommandItem
                                key={u.id}
                                value={u.id}
                                className="flex flex-col gap-2 py-2"
                                onSelect={() => {
                                  if (!personTargetItemId) return
                                  addPersonAsAssignee(personTargetItemId, u.id)
                                }}
                              >
                                <span className="truncate font-medium">
                                  {u.name || u.email}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    disabled={!personTargetItemId}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (!personTargetItemId) return
                                      addPersonAsAssignee(
                                        personTargetItemId,
                                        u.id
                                      )
                                    }}
                                  >
                                    {bt.personAssignToolbar}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    disabled={!personTargetItemId}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (!personTargetItemId) return
                                      void setTaskOwner(
                                        personTargetItemId,
                                        u.id
                                      )
                                    }}
                                  >
                                    {bt.personOwnerToolbar}
                                  </Button>
                                </div>
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Filter className="size-4" aria-hidden />
                      {bt.filter}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-72 border-2 border-border/80 p-[var(--vibe-space-12)] shadow-md"
                    align="start"
                  >
                    <p className="mb-1 text-sm font-medium text-foreground">
                      {bt.filterPopoverTitle}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {bt.filterClientHint}
                    </p>
                    <Separator className="mb-3" />
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Label htmlFor="eco-unassigned" className="text-sm">
                        {bt.filterUnassignedOnly}
                      </Label>
                      <Switch
                        id="eco-unassigned"
                        checked={unassignedOnly}
                        onCheckedChange={setUnassignedOnly}
                      />
                    </div>
                    <Label className="text-xs text-muted-foreground">
                      {bt.colNotesCategory}
                    </Label>
                    <Textarea
                      className="mt-1 min-h-[72px] text-sm"
                      value={notesFilter}
                      onChange={(e) => setNotesFilter(e.target.value)}
                      placeholder={bt.searchThisBoard}
                      aria-label={bt.colNotesCategory}
                    />
                    <Separator className="my-3" />
                    <div
                      role="search"
                      aria-label={bt.searchThisBoard}
                      className="relative"
                    >
                      <Search
                        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        className="ps-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={bt.searchThisBoard}
                        aria-label={bt.searchThisBoard}
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
                      className="gap-1"
                    >
                      <ArrowUpDown className="size-4" aria-hidden />
                      {bt.sort}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="start">
                    <RadioGroup
                      value={sortMode}
                      onValueChange={(v) =>
                        setSortMode(v as "none" | "nameAsc" | "nameDesc")
                      }
                      aria-label={bt.sortRadioLabel}
                      className="gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="none" id="eco-sort-none" />
                        <Label htmlFor="eco-sort-none" className="font-normal">
                          {bt.sortNone}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nameAsc" id="eco-sort-asc" />
                        <Label htmlFor="eco-sort-asc" className="font-normal">
                          {bt.sortNameAsc}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nameDesc" id="eco-sort-desc" />
                        <Label htmlFor="eco-sort-desc" className="font-normal">
                          {bt.sortNameDesc}
                        </Label>
                      </div>
                    </RadioGroup>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <EyeOff className="size-4" aria-hidden />
                      {bt.hide}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 text-sm" align="start">
                    <p className="mb-3 text-xs text-muted-foreground">
                      {bt.hideColumnsHelp}
                    </p>
                    <ul className="space-y-2">
                      {HIDABLE_COLUMN_IDS.map((id) => (
                        <li key={id} className="flex items-center gap-2">
                          <Checkbox
                            id={`eco-hide-${id}`}
                            checked={!tableUi.hiddenColumnIds.includes(id)}
                            onCheckedChange={() => toggleHiddenColumn(id)}
                            aria-label={hideColumnLabel(id)}
                          />
                          <Label
                            htmlFor={`eco-hide-${id}`}
                            className="cursor-pointer font-normal leading-none"
                          >
                            {hideColumnLabel(id)}
                          </Label>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <LayoutGrid className="size-4" aria-hidden />
                      {bt.groupBy}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3 text-sm" align="start">
                    <RadioGroup
                      value={tableUi.groupBy}
                      onValueChange={(v) =>
                        void patchBoardTableUi({
                          tableGroupBy: v as "none" | "priority",
                        })
                      }
                      aria-label={bt.groupByRadioLabel}
                      className="gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="none" id="eco-gb-none" />
                        <Label htmlFor="eco-gb-none" className="font-normal">
                          {bt.groupByNone}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="priority" id="eco-gb-priority" />
                        <Label
                          htmlFor="eco-gb-priority"
                          className="font-normal"
                        >
                          {bt.groupByPriorityOption}
                        </Label>
                      </div>
                    </RadioGroup>
                  </PopoverContent>
                </Popover>
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
                    setNotesFilter("")
                    setUnassignedOnly(false)
                  }}
                />
              ) : null}
              {!allRowsEmpty ? (
                <DragDropContext onDragEnd={handleBoardDragEnd}>
                  <EcosystraAccordion
                    id="eco-board-groups-accordion"
                    type="multiple"
                    aria-label={bt.boardGroupsAccordion}
                    className="flex min-h-0 flex-1 flex-col gap-[var(--vibe-space-16)]"
                    value={openAccordionGroupIds}
                    onValueChange={(vals) =>
                      setGroupsOpenFromAccordion(vals, accordionKnownGroupIds)
                    }
                  >
                    {sortedGroups.map((group) => (
                    <EcosystraAccordionItem
                      key={group.id}
                      value={group.id}
                      id={`eco-board-group-${group.id}`}
                      className="rounded-xl border !border-b-0 border-[color:var(--eco-board-outer-border)] bg-[color:var(--eco-board-card-bg)] shadow-none data-[state=open]:shadow-[0_1px_0_rgba(0,0,0,0.06)]"
                    >
                      <div
                        className="flex items-stretch border-s-4"
                        style={{
                          borderColor: group.color
                            ? group.color
                            : "var(--eco-group-todo)",
                        }}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2 py-[var(--vibe-space-8)] ps-[var(--vibe-space-12)] pe-2">
                          <EcosystraBoardGroupColorButton
                            color={group.color}
                            ariaLabel={bt.groupColorPickerAria}
                            onPick={(hex) =>
                              void patchGroup(group.id, undefined, hex)
                            }
                          />
                          <EcosystraBoardGroupEditableName
                            name={group.name}
                            groupColor={group.color}
                            onCommit={(next) =>
                              void patchGroup(group.id, next, undefined)
                            }
                          />
                        </div>
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
                      <AccordionContent className="px-[var(--vibe-space-12)] pb-[var(--vibe-space-12)] pt-0">
                        <EcosystraBoardGroupTable
                          groupId={group.id}
                          groupName={group.name}
                          workspaceId={board.workspaceId}
                          items={group.items}
                          rowDensityScale={rowDensity[0]}
                          t={t}
                          expandedSubitemRowId={expandedSubitemRowId}
                          setExpandedSubitemRowId={setExpandedSubitemRowId}
                          hiddenColumnIds={tableUi.hiddenColumnIds}
                          groupByPriority={tableUi.groupBy === "priority"}
                          onPersonToolbarTarget={(id) =>
                            setPersonTargetItemId(id)
                          }
                          onAddTask={(gid) => void addTask(gid, "New task")}
                          onAddSubitem={(parentId) =>
                            void addSubitem(parentId, "New subitem")
                          }
                          onPatchItem={(id, patch) =>
                            void patchItemField(id, patch)
                          }
                          onRenameItem={(id, name) => void renameItem(id, name)}
                          onSetTaskAssignees={(id, userIds, inviteEmails) =>
                            void setTaskAssignees(id, userIds, inviteEmails)
                          }
                          onDeleteItem={(id) =>
                            setDeleteTarget({ kind: "item", id })
                          }
                          columnWidthsPx={tableUi.columnWidthsPx}
                          onColumnWidthCommit={onColumnWidthCommit}
                          tableColumnOrder={tableUi.tableColumnOrder}
                          tableCustomColumns={tableUi.tableCustomColumns}
                          enableColumnDrag={group.id === columnDragGroupId}
                          onRowOrderCommit={onRowOrderCommit}
                          onAddBoardColumn={addCustomBoardColumn}
                          onRowSelectionChange={
                            groupSelectionHandlers[group.id]
                          }
                          selectionClearVersion={selectionClearVersion}
                          tableColumnTitles={tableUi.tableColumnTitles}
                          onColumnTitleCommit={commitColumnTitle}
                        />
                      </AccordionContent>
                    </EcosystraAccordionItem>
                  ))}
                  </EcosystraAccordion>
                </DragDropContext>
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
              className="max-w-md"
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

          <Sheet open={sheetActivityOpen} onOpenChange={setSheetActivityOpen}>
            <SheetContent
              className="flex w-full flex-col sm:max-w-md"
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
              className="flex w-full flex-col gap-4 sm:max-w-md"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                window.requestAnimationFrame(() => {
                  document
                    .getElementById("eco-sheet-selection-title")
                    ?.focus()
                })
              }}
            >
              <SheetHeader>
                <SheetTitle id="eco-sheet-selection-title" tabIndex={-1}>
                  {bt.selectionSheetTitle}
                </SheetTitle>
                <SheetDescription>{bt.selectionSheetDescription}</SheetDescription>
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
                          <li
                            key={task.id}
                            className="text-muted-foreground"
                          >
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
              className="max-w-lg"
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
                  document.getElementById("eco-delete-dialog-title")?.focus()
                })
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle id="eco-delete-dialog-title" tabIndex={-1}>
                  {deleteTarget?.kind === "group"
                    ? bt.deleteDialogTitleGroup
                    : bt.deleteDialogTitleTask}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteTarget?.kind === "group"
                    ? bt.deleteDialogDescGroup
                    : bt.deleteDialogDescTask}
                </AlertDialogDescription>
              </AlertDialogHeader>
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
