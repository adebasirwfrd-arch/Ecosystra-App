"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { HelpCircle, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { AdvancedFilterTreeEditor } from "./ecosystra-board-advanced-filter-editor"
import { EcosystraBoardAvatar } from "./ecosystra-board-avatars"
import {
  BOARD_UNASSIGNED_PERSON_ID,
  advancedTreeIsActive,
  buildBoardFilterColumns,
  buildFacetsForColumn,
  collectBoardPersonIds,
  columnKindIcon,
  itemMatchesAdvancedRoot,
  type AdvancedFilterNode,
} from "./ecosystra-board-filter-engine"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { BoardSavedFilterViewRow } from "./hooks/use-ecosystra-board-apollo"
import type { DuePriorityLabel } from "./hooks/use-ecosystra-board-apollo"
import type { GqlBoardGroup, TableCustomColumnDef } from "./hooks/use-ecosystra-board-apollo"

type WorkspaceUser = { id: string; name: string | null; email: string }

type TableUiSlice = {
  tableColumnOrder: string[]
  hiddenColumnIds: readonly string[]
  tableCustomColumns: Record<string, TableCustomColumnDef>
  tableColumnTitles: Record<string, string>
  statusLabels: DuePriorityLabel[]
  priorityLabels: DuePriorityLabel[]
  notesCategoryLabels: DuePriorityLabel[]
  duePriorityLabels: DuePriorityLabel[]
}

function toggleInList(list: string[], key: string): string[] {
  const set = new Set(list)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  return [...set]
}

function userLabel(
  id: string,
  users: WorkspaceUser[],
  dict: Record<string, string>
): string {
  if (id === BOARD_UNASSIGNED_PERSON_ID)
    return dict.filterUnassignedFacet ?? "Unassigned"
  const u = users.find((x) => x.id === id)
  return (u?.name || u?.email || id).trim()
}

export function BoardPersonFilterPopover({
  dict,
  groups,
  workspaceUsers,
  selectedUserIds,
  includeUnassigned,
  onChange,
  personTargetItemId,
  personTaskName,
  personQuery,
  onPersonQueryChange,
  workspaceUsersForAssign,
  onPickAssignee,
  onPickOwner,
  onSaveView,
}: {
  dict: Record<string, string>
  groups: GqlBoardGroup[]
  workspaceUsers: WorkspaceUser[]
  selectedUserIds: string[]
  includeUnassigned: boolean
  onChange: (userIds: string[], includeUnassigned: boolean) => void
  personTargetItemId: string | null
  personTaskName: string
  personQuery: string
  onPersonQueryChange: (q: string) => void
  workspaceUsersForAssign: WorkspaceUser[]
  onPickAssignee: (userId: string) => void
  onPickOwner: (userId: string) => void
  onSaveView: () => void
}) {
  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  )
  const roster = useMemo(() => collectBoardPersonIds(flatItems), [flatItems])

  const toggleUser = useCallback(
    (id: string) => {
      onChange(toggleInList(selectedUserIds, id), includeUnassigned)
    },
    [selectedUserIds, includeUnassigned, onChange]
  )

  const toggleUnassigned = useCallback(() => {
    onChange(selectedUserIds, !includeUnassigned)
  }, [selectedUserIds, includeUnassigned, onChange])

  return (
    <PopoverContent
      className="w-[calc(100dvw-32px)] p-0 sm:w-[min(100dvw-32px,22rem)]"
      align="start"
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/60 px-3 py-2">
        <div className="min-w-0 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {dict.personFilterBoardTitle}
          </span>{" "}
          {dict.personFilterBoardHint}
          <button
            type="button"
            className="ms-1 inline-flex align-middle text-muted-foreground hover:text-foreground"
            aria-label={dict.personFilterBoardInfoAria}
          >
            <HelpCircle className="size-3.5" aria-hidden />
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 text-xs"
          onClick={onSaveView}
        >
          {dict.saveAsNewView}
        </Button>
      </div>
      <div className="px-3 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {dict.personFilterAssigneeOrOwner}
        </p>
        <div className="flex flex-wrap gap-2">
          {roster.hasUnassigned ? (
            <button
              type="button"
              onClick={toggleUnassigned}
              className={cn(
                "rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow",
                includeUnassigned ? "ring-primary" : "ring-transparent"
              )}
              aria-pressed={includeUnassigned}
              aria-label={dict.filterUnassignedFacet}
            >
              <EcosystraBoardAvatar
                name=""
                avatarUrl={null}
                aria-label={dict.filterUnassignedFacet}
              />
            </button>
          ) : null}
          {roster.userIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleUser(id)}
              className={cn(
                "rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow",
                selectedUserIds.includes(id) ? "ring-primary" : "ring-transparent"
              )}
              aria-pressed={selectedUserIds.includes(id)}
              aria-label={userLabel(id, workspaceUsers, dict)}
            >
              <EcosystraBoardAvatar
                name={userLabel(id, workspaceUsers, dict)}
                avatarUrl={null}
              />
            </button>
          ))}
        </div>
      </div>
      {personTargetItemId ? (
        <>
          <div className="border-t border-border/60 px-3 py-2 text-xs font-medium text-foreground">
            {dict.personTaskLabel} {personTaskName}
          </div>
          <Command shouldFilter={false} className="max-h-64 border-t border-border/60">
            <CommandInput
              placeholder={dict.personFilterPlaceholder}
              value={personQuery}
              onValueChange={onPersonQueryChange}
              aria-label={dict.personWorkspaceUsers}
            />
            <CommandList>
              <CommandEmpty>{dict.personNoResults}</CommandEmpty>
              <CommandGroup heading={dict.personWorkspaceUsers}>
                {workspaceUsersForAssign.map((u) => (
                  <CommandItem
                    key={u.id}
                    value={u.id}
                    className="flex flex-col gap-2 py-2"
                    onSelect={() => onPickAssignee(u.id)}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          onPickAssignee(u.id)
                        }}
                      >
                        {dict.personAssignToolbar}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPickOwner(u.id)
                        }}
                      >
                        {dict.personOwnerToolbar}
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </>
      ) : null}
    </PopoverContent>
  )
}

function FacetPill({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  color?: string | null
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex max-w-[140px] items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border/80 bg-muted/40 text-muted-foreground hover:bg-muted/70"
      )}
    >
      {color ? (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0 truncate">{label}</span>
      <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground">
        {count}
      </span>
    </button>
  )
}

function SavedViewsPickerBlock({
  dict,
  savedFilterViews,
  onApplySavedView,
  onRenameSavedView,
  onDeleteSavedView,
  selectTriggerClassName,
}: {
  dict: Record<string, string>
  savedFilterViews: BoardSavedFilterViewRow[]
  onApplySavedView: (id: string) => void
  onRenameSavedView: (id: string, name: string) => void | Promise<void>
  onDeleteSavedView: (id: string) => void | Promise<void>
  selectTriggerClassName: string
}) {
  const [selectNonce, setSelectNonce] = useState(0)
  const [manageOpen, setManageOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    if (editingId && !savedFilterViews.some((v) => v.id === editingId)) {
      setEditingId(null)
    }
  }, [savedFilterViews, editingId])

  if (savedFilterViews.length === 0) return null

  return (
    <>
      <div className="flex max-w-full items-center gap-1">
        <Select
          key={selectNonce}
          onValueChange={(id) => {
            onApplySavedView(id)
            setSelectNonce((n) => n + 1)
          }}
        >
          <SelectTrigger
            className={cn("h-8 shrink-0 text-xs", selectTriggerClassName)}
          >
            <SelectValue placeholder={dict.savedViewsPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {savedFilterViews.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover open={manageOpen} onOpenChange={setManageOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label={dict.savedViewsManageAria}
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="end">
            <p className="mb-2 text-xs font-semibold text-foreground">
              {dict.savedViewsManageTitle}
            </p>
            <div className="max-h-48 space-y-2 overflow-y-auto pe-0.5">
              {savedFilterViews.map((v) => (
                <div
                  key={v.id}
                  className="rounded-md border border-border/60 bg-muted/20 p-2"
                >
                  {editingId === v.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        className="h-8 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingId(null)
                          if (e.key === "Enter") {
                            e.preventDefault()
                            void (async () => {
                              const n = editDraft.trim()
                              if (!n) return
                              await onRenameSavedView(v.id, n)
                              setEditingId(null)
                            })()
                          }
                        }}
                      />
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setEditingId(null)}
                        >
                          {dict.dialogCancel}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            void (async () => {
                              const n = editDraft.trim()
                              if (!n) return
                              await onRenameSavedView(v.id, n)
                              setEditingId(null)
                            })()
                          }}
                        >
                          {dict.savedViewsRenameSave}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                        {v.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                        aria-label={dict.savedViewsRenameAria}
                        onClick={() => {
                          setEditingId(v.id)
                          setEditDraft(v.name)
                        }}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-destructive hover:text-destructive"
                        aria-label={dict.savedViewsDeleteAria}
                        onClick={() => {
                          setManageOpen(false)
                          setDeleteTarget({ id: v.id, name: v.name })
                        }}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.savedViewsDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? dict.savedViewsDeleteBody.replace(
                    "{name}",
                    deleteTarget.name
                  )
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.dialogCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget)
                  void onDeleteSavedView(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              {dict.savedViewsDeleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function BoardQuickFiltersPanel({
  dict,
  groups,
  tableUi,
  workspaceUsers,
  selections,
  onSelectionsChange,
  onOpenAdvanced,
  onSaveView,
  savedFilterViews,
  onApplySavedView,
  onRenameSavedView,
  onDeleteSavedView,
  filteredTaskCount,
  totalTaskCount,
}: {
  dict: Record<string, string>
  groups: GqlBoardGroup[]
  tableUi: TableUiSlice
  workspaceUsers: WorkspaceUser[]
  selections: Record<string, string[]>
  onSelectionsChange: (next: Record<string, string[]>) => void
  onOpenAdvanced: () => void
  onSaveView: () => void
  savedFilterViews: BoardSavedFilterViewRow[]
  onApplySavedView: (id: string) => void
  onRenameSavedView: (id: string, name: string) => void | Promise<void>
  onDeleteSavedView: (id: string) => void | Promise<void>
  filteredTaskCount: number
  totalTaskCount: number
}) {
  const columns = useMemo(
    () =>
      buildBoardFilterColumns({
        tableColumnOrder: tableUi.tableColumnOrder,
        hiddenColumnIds: tableUi.hiddenColumnIds,
        tableCustomColumns: tableUi.tableCustomColumns,
        tableColumnTitles: tableUi.tableColumnTitles,
        dict,
      }),
    [
      dict,
      tableUi.hiddenColumnIds,
      tableUi.tableColumnOrder,
      tableUi.tableCustomColumns,
      tableUi.tableColumnTitles,
    ]
  )

  const labels = useMemo(
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

  const facetMap = useMemo(() => {
    const m = new Map<string, ReturnType<typeof buildFacetsForColumn>>()
    for (const col of columns) {
      const raw = buildFacetsForColumn(
        col,
        groups,
        tableUi.tableCustomColumns,
        labels
      )
      const resolved = raw.map((f) => {
        if (col.kind === "assignee" || col.kind === "owner") {
          return {
            ...f,
            label:
              f.key === BOARD_UNASSIGNED_PERSON_ID
                ? dict.filterUnassignedFacet ?? "Unassigned"
                : userLabel(f.key, workspaceUsers, dict),
          }
        }
        return f
      })
      m.set(col.id, resolved)
    }
    return m
  }, [columns, dict, groups, labels, tableUi.tableCustomColumns, workspaceUsers])

  const toggleFacet = (colId: string, key: string) => {
    const cur = selections[colId] ?? []
    const nextSel = { ...selections, [colId]: toggleInList(cur, key) }
    if (nextSel[colId]?.length === 0) delete nextSel[colId]
    onSelectionsChange(nextSel)
  }

  const clearQuick = () => onSelectionsChange({})

  return (
    <PopoverContent
      className="w-[calc(100dvw-24px)] max-w-[min(100dvw-24px,56rem)] border-2 border-border/80 p-0 shadow-md"
      align="start"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-3 py-2 sm:px-4">
        <div className="min-w-0 text-sm">
          <span className="font-semibold text-foreground">
            {dict.quickFiltersTitle}
          </span>{" "}
          <span className="text-muted-foreground">
            {dict
              .quickFiltersShowing
              ?.replace("{visible}", String(filteredTaskCount))
              .replace("{total}", String(totalTaskCount)) ??
              `Showing ${filteredTaskCount} of ${totalTaskCount} tasks`}
          </span>
          <button
            type="button"
            className="ms-1 inline-flex align-middle text-muted-foreground hover:text-foreground"
            aria-label={dict.quickFiltersHelpAria}
          >
            <HelpCircle className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <SavedViewsPickerBlock
            dict={dict}
            savedFilterViews={savedFilterViews}
            onApplySavedView={onApplySavedView}
            onRenameSavedView={onRenameSavedView}
            onDeleteSavedView={onDeleteSavedView}
            selectTriggerClassName="w-[min(140px,calc(100dvw-120px))]"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={clearQuick}
          >
            {dict.quickFiltersClearAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={onSaveView}
          >
            {dict.saveAsNewView}
          </Button>
        </div>
      </div>
      <div className="px-2 py-2 sm:px-3">
        <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {dict.quickFiltersAllColumns}
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-min gap-3 px-1 py-1">
            {columns.map((col) => {
              const { Icon, iconClass } = columnKindIcon(col.kind)
              const facets = facetMap.get(col.id) ?? []
              const sel = selections[col.id] ?? []
              return (
                <div
                  key={col.id}
                  className="w-[148px] shrink-0 rounded-lg border border-border/60 bg-muted/20 p-2"
                >
                  <div className="mb-2 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex size-6 shrink-0 items-center justify-center rounded text-white",
                        iconClass
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground">
                      {col.title}
                    </span>
                  </div>
                  <div className="flex max-h-40 flex-col gap-1 overflow-y-auto pe-0.5">
                    {facets.map((f) => (
                      <FacetPill
                        key={f.key}
                        active={sel.includes(f.key)}
                        color={f.color}
                        label={f.label}
                        count={f.count}
                        onClick={() => toggleFacet(col.id, f.key)}
                      />
                    ))}
                    {facets.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground">
                        {dict.quickFiltersNoValues}
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-border/60 px-3 py-2">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto py-1 text-xs"
          onClick={onOpenAdvanced}
        >
          {dict.quickFiltersAdvancedLink}
        </Button>
      </div>
    </PopoverContent>
  )
}

export function BoardAdvancedFiltersDialog({
  open,
  onOpenChange,
  dict,
  groups,
  tableUi,
  workspaceUsers,
  filterRoot,
  onFilterRootChange,
  onSaveView,
  savedFilterViews,
  onApplySavedView,
  onRenameSavedView,
  onDeleteSavedView,
  onFilterAiApply,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  dict: Record<string, string>
  groups: GqlBoardGroup[]
  tableUi: TableUiSlice
  workspaceUsers: WorkspaceUser[]
  filterRoot: AdvancedFilterNode | null
  onFilterRootChange: (r: AdvancedFilterNode | null) => void
  onSaveView: () => void
  savedFilterViews: BoardSavedFilterViewRow[]
  onApplySavedView: (id: string) => void
  onRenameSavedView: (id: string, name: string) => void | Promise<void>
  onDeleteSavedView: (id: string) => void | Promise<void>
  onFilterAiApply: (prompt: string) => Promise<void>
}) {
  const [aiOn, setAiOn] = useState(false)
  const [aiDraft, setAiDraft] = useState("")
  const [aiBusy, setAiBusy] = useState(false)

  const columns = useMemo(
    () =>
      buildBoardFilterColumns({
        tableColumnOrder: tableUi.tableColumnOrder,
        hiddenColumnIds: tableUi.hiddenColumnIds,
        tableCustomColumns: tableUi.tableCustomColumns,
        tableColumnTitles: tableUi.tableColumnTitles,
        dict,
      }),
    [
      dict,
      tableUi.hiddenColumnIds,
      tableUi.tableColumnOrder,
      tableUi.tableCustomColumns,
      tableUi.tableColumnTitles,
    ]
  )

  const labels = useMemo(
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

  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items.map((it) => ({ item: it, group: g }))),
    [groups]
  )

  const matchedCount = useMemo(() => {
    if (!advancedTreeIsActive(filterRoot)) return flatItems.length
    return flatItems.filter(({ item, group }) =>
      itemMatchesAdvancedRoot(
        item,
        group,
        filterRoot,
        columns,
        tableUi.tableCustomColumns,
        labels
      )
    ).length
  }, [
    columns,
    filterRoot,
    flatItems,
    labels,
    tableUi.tableCustomColumns,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90dvh,720px)] w-[calc(100dvw-24px)] max-w-3xl overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-baseline gap-2 text-base">
            {dict.advancedFiltersTitle}
            <span className="text-sm font-normal text-muted-foreground">
              {dict.advancedFiltersMatched
                ?.replace("{n}", String(matchedCount))
                .replace("{total}", String(flatItems.length)) ??
                `${matchedCount} / ${flatItems.length}`}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-center justify-end gap-2 border-b border-border/60 pb-3">
          <SavedViewsPickerBlock
            dict={dict}
            savedFilterViews={savedFilterViews}
            onApplySavedView={onApplySavedView}
            onRenameSavedView={onRenameSavedView}
            onDeleteSavedView={onDeleteSavedView}
            selectTriggerClassName="w-[min(160px,calc(100dvw-120px))]"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFilterRootChange(null)}
          >
            {dict.quickFiltersClearAll}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onSaveView}>
            {dict.saveAsNewView}
          </Button>
        </div>
        <div className="space-y-2 border-b border-border/60 py-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="eco-filter-ai" className="text-sm">
              {dict.filterWithAi}
            </Label>
            <Switch
              id="eco-filter-ai"
              checked={aiOn}
              onCheckedChange={setAiOn}
            />
          </div>
          {aiOn ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{dict.filterAiHint}</p>
              <Textarea
                id="eco-filter-ai-text"
                className="min-h-[72px] text-sm"
                placeholder={dict.filterAiPlaceholder}
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                disabled={aiBusy || !aiDraft.trim()}
                onClick={async () => {
                  setAiBusy(true)
                  try {
                    await onFilterAiApply(aiDraft.trim())
                  } finally {
                    setAiBusy(false)
                  }
                }}
              >
                {aiBusy ? dict.filterAiApplying : dict.filterAiApply}
              </Button>
            </div>
          ) : null}
        </div>
        <div className="py-3">
          <AdvancedFilterTreeEditor
            root={filterRoot}
            onChange={onFilterRootChange}
            columns={columns}
            dict={dict}
            groups={groups}
            tableCustomColumns={tableUi.tableCustomColumns}
            labels={labels}
            workspaceUsers={workspaceUsers}
          />
        </div>
        <DialogFooter className="flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="text-xs"
            onClick={() => onOpenChange(false)}
          >
            {dict.advancedSwitchQuick}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
