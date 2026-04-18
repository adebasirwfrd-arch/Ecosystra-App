"use client"

import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { useMedia } from "react-use"
import { useApolloClient } from "@apollo/client"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { format, isValid } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  Check,
  ChevronDown,
  FileText,
  GripVertical,
  Info,
  Mail,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserPlus,
  X,
} from "lucide-react"
import { toast } from "sonner"

import bookmark from "./ecosystra-board-bookmark.module.css"
import boardSurface from "./ecosystra-board-surface.module.css"

import type { TableColumn } from "@/components/ui/ecosystra-table"
import type {
  DragEndEvent,
  DraggableSyntheticListeners,
  SensorDescriptor,
} from "@dnd-kit/core"
import type {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import type { CSSProperties, ReactNode, Ref } from "react"
import type {
  GqlBoardItem,
  HidableBoardColumnId,
  TableCustomColumnDef,
} from "./hooks/use-ecosystra-board-apollo"

import { WORKSPACE_USERS } from "@/lib/ecosystra/board-gql"
import { cn, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowHeaderCell,
  resolveTableColumnWidthPx,
  stickyLeftPxForColumnIndex,
} from "@/components/ui/ecosystra-table"
import { Input } from "@/components/ui/input"
import { InputSpin } from "@/components/ui/input-spin"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  EcosystraBoardAvatar,
  EcosystraBoardAvatarGroup,
  EcosystraBoardLastUpdatedCell,
} from "./ecosystra-board-avatars"
import { EcosystraBoardAddColumnPopover } from "./ecosystra-board-add-column-popover"
import { EcosystraBoardEditableColumnHeader } from "./ecosystra-board-editable-column-header"
import { formatIdr } from "./ecosystra-board-format-idr"
import { SortableBoardRowTbody } from "./ecosystra-board-sortable-row-tbody"
import { EcosystraGrandbookNewList } from "./ecosystra-grandbook"

const NOTES_CATEGORY_OPTIONS = [
  "General Note",
  "Action Item",
  "Meeting Summary",
] as const

/** Per-cell value for user-added columns (`tableCustomColumns`) — shallow-safe keys in `dynamicData`. */
export function ecoCcFieldKey(columnId: string): string {
  return `ecoCc__${columnId}`
}

function normalizeNotesCategory(v: unknown): string {
  const s = String(v ?? "General Note")
  return (NOTES_CATEGORY_OPTIONS as readonly string[]).includes(s)
    ? s
    : "General Note"
}

function notesCategoryStyle(category: string): {
  backgroundColor: string
  color: string
} {
  const c = normalizeNotesCategory(category)
  if (c.includes("Action")) {
    return {
      backgroundColor: "var(--eco-mono-notes-action-bg)",
      color: "var(--eco-mono-notes-action-fg)",
    }
  }
  if (c.includes("Meeting")) {
    return {
      backgroundColor: "var(--eco-mono-notes-meeting-bg)",
      color: "var(--eco-mono-notes-meeting-fg)",
    }
  }
  return {
    backgroundColor: "var(--eco-mono-notes-general-bg)",
    color: "var(--eco-mono-notes-general-fg)",
  }
}

function formatTimelineRange(range: DateRange | undefined): string {
  if (!range?.from) return ""
  if (!range.to) return format(range.from, "MMM d, yyyy")

  const { from, to } = range
  if (from.getFullYear() === to.getFullYear()) {
    if (from.getMonth() === to.getMonth()) {
      return `${format(from, "MMM d")} - ${format(to, "d, yyyy")}`
    }
    return `${format(from, "MMM d")} - ${format(to, "MMM d, yyyy")}`
  }
  return `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`
}

function parseTimelineRange(s: string): DateRange | undefined {
  if (!s || s === "—") return undefined
  const parts = s.split(" - ")
  if (parts.length === 1) {
    const d = new Date(parts[0])
    return isValid(d) ? { from: d, to: undefined } : undefined
  }
  const from = new Date(parts[0])
  const to = new Date(parts[1])
  if (!isValid(from)) return undefined
  return { from, to: isValid(to) ? to : undefined }
}

function DuePill({
  label,
  duePriorityLabel,
}: {
  label: string
  duePriorityLabel: string
}) {
  const readable = `${duePriorityLabel}: ${label}`
  return (
    <span
      className={cn(
        bookmark.bookmarkSelectTrigger,
        "max-w-[220px] truncate shadow-none"
      )}
      style={{
        backgroundColor: "var(--eco-mono-due-critical-bg)",
        color: "var(--eco-mono-due-critical-fg)",
      }}
      aria-label={readable}
      title={readable}
    >
      <span className="truncate">{label}</span>
      <Sparkles className="size-3 shrink-0 opacity-90" aria-hidden />
    </span>
  )
}

const SUBITEM_STATUS2_OPTIONS = ["—", "At risk", "On track"] as const

function normalizeSubitemStatus2(
  v: unknown
): (typeof SUBITEM_STATUS2_OPTIONS)[number] {
  const s = String(v ?? "—")
  return (SUBITEM_STATUS2_OPTIONS as readonly string[]).includes(s)
    ? (s as (typeof SUBITEM_STATUS2_OPTIONS)[number])
    : "—"
}

function InlineNotesPlain({
  itemId,
  value,
  ariaLabel,
  placeholder,
  onCommit,
}: {
  itemId: string
  value: string
  ariaLabel: string
  placeholder: string
  onCommit: (next: string) => void
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => {
    setDraft(value)
  }, [itemId, value])

  return (
    <Input
      className="h-8 min-w-[100px] max-w-[240px] border-transparent bg-transparent px-1 text-sm shadow-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = draft.trim()
        if (n !== String(value ?? "").trim()) onCommit(n)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur()
        if (e.key === "Escape") {
          setDraft(value)
          e.currentTarget.blur()
        }
      }}
      aria-label={ariaLabel}
      placeholder={placeholder}
    />
  )
}

function budgetNumber(d: Record<string, unknown>): number {
  const b = d.budget
  if (typeof b === "number") return b
  if (typeof b === "string") {
    const n = Number(b.replace(/[^0-9.]/g, ""))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function itemPriority(d: Record<string, unknown>): "Low" | "Medium" | "High" {
  const pr = String(d.priority ?? "Medium")
  return pr === "Low" || pr === "High" || pr === "Medium" ? pr : "Medium"
}

/** Stored in `Item.dynamicData` for subitems; values must match `SelectItem` values. */
const SUBITEM_STATUS_OPTIONS = [
  "Working on it",
  "Done",
  "Stuck",
  "Not started",
] as const

const SUBITEM_DROPDOWN_OPTIONS = [
  "General",
  "Development",
  "Marketing",
] as const

function normalizeSubitemStatus(
  v: unknown
): (typeof SUBITEM_STATUS_OPTIONS)[number] {
  const s = String(v ?? "Working on it")
  return (SUBITEM_STATUS_OPTIONS as readonly string[]).includes(s)
    ? (s as (typeof SUBITEM_STATUS_OPTIONS)[number])
    : "Working on it"
}

function normalizeSubitemDropdown(
  v: unknown
): (typeof SUBITEM_DROPDOWN_OPTIONS)[number] {
  const s = String(v ?? "General")
  return (SUBITEM_DROPDOWN_OPTIONS as readonly string[]).includes(s)
    ? (s as (typeof SUBITEM_DROPDOWN_OPTIONS)[number])
    : "General"
}

function taskStatusPillStyle(status: string): {
  backgroundColor: string
  color: string
} {
  const s = normalizeSubitemStatus(status)
  const map: Record<(typeof SUBITEM_STATUS_OPTIONS)[number], [string, string]> =
    {
      "Working on it": [
        "var(--eco-mono-status-working-bg)",
        "var(--eco-mono-status-working-fg)",
      ],
      Done: [
        "var(--eco-mono-status-done-bg)",
        "var(--eco-mono-status-done-fg)",
      ],
      Stuck: [
        "var(--eco-mono-status-stuck-bg)",
        "var(--eco-mono-status-stuck-fg)",
      ],
      "Not started": [
        "var(--eco-mono-status-notstarted-bg)",
        "var(--eco-mono-status-notstarted-fg)",
      ],
    }
  const pair = map[s]
  return {
    backgroundColor: pair[0],
    color: pair[1],
  }
}

function priorityPillStyle(p: "Low" | "Medium" | "High"): {
  backgroundColor: string
  color: string
} {
  const map = {
    Low: ["var(--eco-mono-priority-low-bg)", "var(--eco-mono-priority-low-fg)"],
    Medium: [
      "var(--eco-mono-priority-med-bg)",
      "var(--eco-mono-priority-med-fg)",
    ],
    High: [
      "var(--eco-mono-priority-high-bg)",
      "var(--eco-mono-priority-high-fg)",
    ],
  } as const
  return { backgroundColor: map[p][0], color: map[p][1] }
}

function ColumnSummaryBar({
  segments,
  "aria-label": ariaLabel,
}: {
  segments: { color: string; flex: number }[]
  "aria-label": string
}) {
  const total = segments.reduce((a, s) => a + s.flex, 0)
  if (total <= 0) {
    return (
      <div
        className="h-2 w-full max-w-[140px] rounded-full bg-muted"
        aria-hidden
      />
    )
  }
  return (
    <div
      className="flex h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-muted/50"
      role="img"
      aria-label={ariaLabel}
    >
      {segments.map((s, i) =>
        s.flex > 0 ? (
          <span
            key={i}
            className="h-full min-w-[2px]"
            style={{
              flexGrow: s.flex,
              flexShrink: 1,
              backgroundColor: s.color,
            }}
          />
        ) : null
      )}
    </div>
  )
}

function boardColumnResizeBounds(columnId: string): {
  min: number
  max: number
} {
  if (columnId === "select") return { min: 40, max: 88 }
  if (columnId === "task") return { min: 160, max: 900 }
  if (columnId.startsWith("c_")) return { min: 64, max: 640 }
  return { min: 64, max: 640 }
}

function groupTimelineFooterLabel(items: GqlBoardItem[]): string {
  const raw = items
    .map((it) => String((it.dynamicData || {}).timeline ?? "").trim())
    .filter(Boolean)
  if (raw.length === 0) return "—"
  return raw[0]
}

function InlineTaskTitle({
  itemId,
  name,
  ariaLabel,
  className,
  emptyErrorLabel,
  onCommit,
}: {
  itemId: string
  name: string
  ariaLabel: string
  className?: string
  emptyErrorLabel: string
  onCommit: (next: string) => void
}) {
  const [draft, setDraft] = useState(name)
  const [showEmptyError, setShowEmptyError] = useState(false)
  const errId = `${itemId}-title-error`

  useEffect(() => {
    setDraft(name)
    setShowEmptyError(false)
  }, [itemId, name])

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <Textarea
        id={`task-title-${itemId}`}
        rows={2}
        className={cn(
          "min-h-[2.25rem] max-h-28 min-w-0 w-full resize-y border-transparent bg-transparent px-1 py-1.5 font-medium shadow-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          className
        )}
        value={draft}
        aria-label={ariaLabel}
        aria-invalid={showEmptyError}
        aria-describedby={showEmptyError ? errId : undefined}
        aria-required
        onChange={(e) => {
          setDraft(e.target.value)
          if (showEmptyError) setShowEmptyError(false)
        }}
        onBlur={() => {
          const n = draft.trim()
          if (!n) {
            setShowEmptyError(true)
            setDraft(name)
            return
          }
          setShowEmptyError(false)
          if (n !== name.trim()) onCommit(n)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setShowEmptyError(false)
            setDraft(name)
            e.currentTarget.blur()
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.blur()
          }
        }}
      />
      {showEmptyError ? (
        <span id={errId} className="text-xs text-destructive" role="alert">
          {emptyErrorLabel}
        </span>
      ) : null}
    </div>
  )
}

type RowSeg =
  | { type: "header"; key: string; label: string }
  | { type: "row"; key: string; item: GqlBoardItem }

function buildRowSegments(
  items: GqlBoardItem[],
  groupByPriority: boolean
): RowSeg[] {
  if (!groupByPriority) {
    return items.map((item) => ({ type: "row", key: item.id, item }))
  }
  const order: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"]
  const sorted = [...items].sort(
    (a, b) =>
      order.indexOf(itemPriority(a.dynamicData || {})) -
      order.indexOf(itemPriority(b.dynamicData || {}))
  )
  const out: RowSeg[] = []
  let last = ""
  for (const item of sorted) {
    const p = itemPriority(item.dynamicData || {})
    if (p !== last) {
      out.push({ type: "header", key: `hdr-${p}-${item.id}`, label: p })
      last = p
    }
    out.push({ type: "row", key: item.id, item })
  }
  return out
}

type AssigneeDisplay = {
  id: string
  name: string
  avatarUrl?: string | null
}

function parseAssigneesFromDynamic(d: Record<string, unknown>): AssigneeDisplay[] {
  const raw = d.assignees
  if (Array.isArray(raw)) {
    const out: AssigneeDisplay[] = []
    for (const x of raw) {
      if (!x || typeof x !== "object") continue
      const o = x as Record<string, unknown>
      const id = String(o.id ?? "").trim()
      if (!id) continue
      out.push({
        id,
        name: String(o.name ?? o.email ?? "").trim() || id.slice(0, 8),
        avatarUrl: (o.avatarUrl as string | null | undefined) ?? null,
      })
    }
    return out
  }
  const uid = String(d.assigneeUserId ?? "").trim()
  if (!uid) return []
  return [
    {
      id: uid,
      name:
        String(d.assignee ?? d.assigneeEmail ?? "").trim() || uid.slice(0, 8),
      avatarUrl: (d.assignee_avatarUrl as string | null | undefined) ?? null,
    },
  ]
}

function parsePendingInvitesFromDynamic(
  d: Record<string, unknown>
): { email: string }[] {
  const raw = d.assigneePendingInvites
  if (!Array.isArray(raw)) return []
  const out: { email: string }[] = []
  for (const x of raw) {
    if (!x || typeof x !== "object") continue
    const email = String((x as { email?: string }).email ?? "")
      .trim()
      .toLowerCase()
    if (email) out.push({ email })
  }
  return out
}

function isValidEmailInput(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

function normalizeEmailAddr(s: string): string {
  return s.trim().toLowerCase()
}

function AssigneePicker({
  workspaceId,
  itemId,
  assignees,
  pendingInvites,
  assigneeButtonLabel,
  onCommit,
  onOpenAssign,
  filterPlaceholder,
  clearLabel,
  inviteFooterLabel,
  inviteHint,
}: {
  workspaceId: string
  itemId: string
  assignees: AssigneeDisplay[]
  pendingInvites: { email: string }[]
  assigneeButtonLabel: string
  onCommit: (assigneeUserIds: string[], inviteEmails: string[]) => void
  onOpenAssign: (itemId: string) => void
  filterPlaceholder: string
  clearLabel: string
  inviteFooterLabel: string
  inviteHint: string
}) {
  const client = useApolloClient()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<
    { id: string; name: string | null; email: string }[]
  >([])

  useEffect(() => {
    if (!open || !workspaceId) return
    let cancelled = false
    void (async () => {
      try {
        const { data } = await client.query({
          query: WORKSPACE_USERS,
          variables: { workspaceId, query: q.trim() || ".", take: 12 },
          fetchPolicy: "network-only",
        })
        if (!cancelled) setRows(data?.workspaceUsers ?? [])
      } catch {
        if (!cancelled) setRows([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, workspaceId, q, client])

  const ids = assignees.map((a) => a.id)
  const hasPeople = assignees.length > 0 || pendingInvites.length > 0

  const addUserId = (userId: string) => {
    if (ids.includes(userId)) return
    onCommit([...ids, userId], [])
  }

  const removeUserId = (userId: string) => {
    onCommit(
      ids.filter((id) => id !== userId),
      []
    )
  }

  const inviteByEmail = () => {
    const email = normalizeEmailAddr(q)
    if (!isValidEmailInput(email)) {
      toast.message(inviteFooterLabel, { description: inviteHint })
      return
    }
    onCommit(ids, [email])
    setQ("")
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) onOpenAssign(itemId)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-9 min-w-9 shrink-0 rounded-full border-border/60 px-0.5",
            open && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          aria-label={assigneeButtonLabel}
        >
          <EcosystraBoardAvatarGroup
            assignees={assignees}
            pendingInvites={pendingInvites}
            max={3}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-32px)] p-3 sm:w-80" align="start">
        {hasPeople ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {assignees.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-950 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100"
                  title={a.name}
                >
                  <Avatar className="size-5 shrink-0">
                    {a.avatarUrl ? (
                      <AvatarImage src={a.avatarUrl} alt="" className="rounded-full" />
                    ) : null}
                    <AvatarFallback className="rounded-full text-[9px]">
                      {getInitials(a.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 max-w-[140px] truncate font-medium">
                    {a.name}
                  </span>
                  <button
                    type="button"
                    className="rounded p-0.5 hover:bg-sky-200/80 dark:hover:bg-sky-800/80"
                    aria-label={clearLabel}
                    onClick={() => removeUserId(a.id)}
                  >
                    <X className="size-3.5 shrink-0 opacity-80" aria-hidden />
                  </button>
                </span>
              ))}
              {pendingInvites.map((p) => (
                <span
                  key={p.email}
                  className="inline-flex items-center gap-1 rounded-md border border-dashed border-muted-foreground/40 bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden />
                  <span className="max-w-[160px] truncate">{p.email}</span>
                  <span className="text-[10px] uppercase">pending</span>
                </span>
              ))}
            </div>
            <Separator className="my-2" />
          </>
        ) : null}
        <div className="relative mb-2">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="h-9 pl-9 pr-16"
            placeholder={filterPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={filterPlaceholder}
          />
          {q.trim() ? (
            <button
              type="button"
              className="absolute right-9 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={clearLabel}
              onClick={() => setQ("")}
            >
              <X className="size-3.5" aria-hidden />
            </button>
          ) : null}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    type="button"
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={inviteHint}
                  >
                    <Info className="size-3.5" aria-hidden />
                  </button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {inviteHint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <EcosystraGrandbookNewList className="max-h-44 overflow-auto text-sm">
          {rows.map((u) => (
            <li key={u.id} className="[content-visibility:auto]">
              <button
                type="button"
                className="w-full truncate px-2 py-1.5 text-start hover:bg-muted"
                onClick={() => {
                  addUserId(u.id)
                  setOpen(false)
                }}
              >
                {u.name?.trim() || u.email}
              </button>
            </li>
          ))}
        </EcosystraGrandbookNewList>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-2 rounded-md bg-muted/80 px-2.5 py-2 text-left text-xs font-medium text-foreground hover:bg-muted"
          onClick={() => inviteByEmail()}
        >
          <UserPlus className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          {inviteFooterLabel}
        </button>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Keeps `@dnd-kit`’s hidden accessibility nodes out of `<table>` (invalid HTML / hydration).
 */
function BoardRowDndContext({
  enabled,
  groupId,
  sensors,
  onDragEnd,
  children,
}: {
  enabled: boolean
  groupId: string
  sensors: SensorDescriptor<any>[]
  onDragEnd: (e: DragEndEvent) => void
  children: ReactNode
}) {
  if (!enabled) return children
  return (
    <DndContext
      id={`board-rows-${groupId}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  )
}

export type BoardGroupTableLabels = Record<string, string>

type Props = {
  groupId: string
  /** Used for the table caption (screen readers). */
  groupName: string
  workspaceId: string
  items: GqlBoardItem[]
  t: BoardGroupTableLabels
  expandedSubitemRowId: string | null
  setExpandedSubitemRowId: (id: string | null) => void
  hiddenColumnIds: readonly HidableBoardColumnId[]
  groupByPriority: boolean
  onPersonToolbarTarget: (itemId: string) => void
  onAddTask: (groupId: string) => void
  onAddSubitem: (parentItemId: string) => void
  onPatchItem: (itemId: string, patch: Record<string, unknown>) => void
  onRenameItem: (itemId: string, name: string) => void
  onSetTaskAssignees: (
    itemId: string,
    assigneeUserIds: string[],
    inviteEmails: string[]
  ) => void
  onDeleteItem: (itemId: string) => void
  /** 36 / density — maps to `Table` row size (1 small, 2 medium, 3 large). */
  rowDensityScale?: number
  /** Persisted column widths (board metadata `tableColumnWidthsPx`). */
  columnWidthsPx?: Record<string, number>
  /** Persist width after resize (merge full map server-side). */
  onColumnWidthCommit?: (columnId: string, widthPx: number) => void
  /** Full merged column order from board metadata (`tableColumnOrder`). */
  tableColumnOrder: string[]
  /** User-added columns (`c_…` ids) from board metadata (`tableCustomColumns`). */
  tableCustomColumns: Record<string, TableCustomColumnDef>
  /** Only one group should expose draggable column headers (see main view). */
  enableColumnDrag?: boolean
  /** Persist row order for this group (`groupItemOrders` metadata). */
  onRowOrderCommit?: (groupId: string, orderedItemIds: string[]) => void
  /** Append a new column instance (`c_…`) before the + column. */
  onAddBoardColumn?: (kind: HidableBoardColumnId) => void
  /** Create a copy of the given column (props + title override). */
  onDuplicateBoardColumn?: (columnId: string) => void
  /** Remove custom column or hide core column. */
  onDeleteBoardColumn?: (columnId: string) => void
  /**
   * Fires whenever row checkbox selection changes (this group only).
   * Parent can open a side panel / modal from the selected task ids.
   */
  onRowSelectionChange?: (selectedIds: string[]) => void
  /**
   * Increment from the parent (e.g. after “Clear selection” in a sheet) to reset
   * this group’s checkbox state while keeping selection local per table instance.
   */
  selectionClearVersion?: number
  /** Board metadata `tableColumnTitles` — display overrides per column id. */
  tableColumnTitles?: Record<string, string>
  /** Persist title override via `patchBoardTableUi({ tableColumnTitles })`. */
  onColumnTitleCommit?: (
    columnId: string,
    nextTitle: string,
    fallbackTitle: string
  ) => void
}

export function EcosystraBoardGroupTable({
  groupId,
  groupName,
  workspaceId,
  items,
  t,
  expandedSubitemRowId,
  setExpandedSubitemRowId,
  hiddenColumnIds,
  groupByPriority,
  onPersonToolbarTarget,
  onAddTask,
  onAddSubitem,
  onPatchItem,
  onRenameItem,
  onSetTaskAssignees,
  onDeleteItem,
  rowDensityScale = 2,
  columnWidthsPx: columnWidthsPxProp,
  onColumnWidthCommit,
  tableColumnOrder,
  tableCustomColumns,
  enableColumnDrag = false,
  onRowOrderCommit,
  onAddBoardColumn,
  onRowSelectionChange,
  selectionClearVersion = 0,
  tableColumnTitles = {},
  onColumnTitleCommit,
  onDuplicateBoardColumn,
  onDeleteBoardColumn,
}: Props) {
  const isDesktop = useMedia("(min-width: 640px)", false)
  const hidden = useMemo(() => new Set(hiddenColumnIds), [hiddenColumnIds])
  /** Row selection for highlight (Vibe: highlighted row + side panel trigger). */
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set<string>())

  useEffect(() => {
    setSelectedRowIds(new Set())
  }, [selectionClearVersion])

  const setRowSelected = useCallback((itemId: string, selected: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev)
      if (selected) next.add(itemId)
      else next.delete(itemId)
      return next
    })
  }, [])

  useEffect(() => {
    const valid = new Set(items.map((it) => it.id))
    setSelectedRowIds((prev) => {
      let changed = false
      const next = new Set<string>()
      for (const id of prev) {
        if (valid.has(id)) next.add(id)
        else changed = true
      }
      return changed ? next : prev
    })
  }, [items])

  useEffect(() => {
    onRowSelectionChange?.(Array.from(selectedRowIds))
  }, [selectedRowIds, onRowSelectionChange])

  const tableSize =
    rowDensityScale <= 1 ? "small" : rowDensityScale >= 3 ? "large" : "medium"

  const allColumns: TableColumn[] = useMemo(
    () => [
      {
        id: "select",
        title: t.colSelect,
        loadingStateType: "circle",
        width: 48,
        sticky: true,
      },
      {
        id: "task",
        title: t.colTask,
        loadingStateType: "long-text",
        width: isDesktop ? 280 : 200,
        sticky: isDesktop,
      },
      {
        id: "status",
        title: t.colStatus,
        loadingStateType: "medium-text",
        infoContent: t.colStatusInfo,
      },
      {
        id: "dueDate",
        title: t.colDueDate,
        loadingStateType: "medium-text",
        infoContent: t.colDueDateInfo,
      },
      {
        id: "lastUpdated",
        title: t.colLastUpdated,
        loadingStateType: "medium-text",
      },
      {
        id: "notes",
        title: t.colNotes,
        loadingStateType: "long-text",
        infoContent: t.colNotesInfo,
      },
      {
        id: "notesCategory",
        title: t.colNotesCategory,
        loadingStateType: "medium-text",
        infoContent: t.colNotesCategoryInfo,
      },
      {
        id: "files",
        title: t.colFiles,
        loadingStateType: "short-text",
      },
      {
        id: "timeline",
        title: t.colTimeline,
        loadingStateType: "medium-text",
        infoContent: t.colTimelineInfo,
      },
      {
        id: "priority",
        title: t.colPriority,
        loadingStateType: "medium-text",
      },
      {
        id: "budget",
        title: t.colBudget,
        loadingStateType: "short-text",
      },
      {
        id: "duePriority",
        title: t.colDueDatePriority,
        loadingStateType: "medium-text",
      },
      {
        id: "owner",
        title: t.colOwner,
        loadingStateType: "medium-text",
        infoContent: t.colOwnerInfo,
        width: 72,
      },
      {
        id: "assignee",
        title: t.colAssignee,
        loadingStateType: "medium-text",
        infoContent: t.colAssigneeInfo,
        width: 72,
      },
      {
        id: "add",
        title: t.colAdd,
        loadingStateType: "short-text",
        width: 52,
        stickyEnd: true,
      },
    ],
    [t]
  )

  const visibleColumns = useMemo(() => {
    const byId = new Map(allColumns.map((c) => [c.id, c]))
    return tableColumnOrder
      .map((id) => {
        const built = byId.get(id)
        if (built) return built
        const def = tableCustomColumns[id]
        if (!def) return undefined
        const tmpl = byId.get(def.kind)
        if (!tmpl) return undefined
        return {
          id,
          title: tmpl.title,
          loadingStateType: tmpl.loadingStateType,
          width: tmpl.width,
          infoContent: tmpl.infoContent,
        } satisfies TableColumn
      })
      .filter(
        (c): c is TableColumn =>
          !!c && !hidden.has(c.id as HidableBoardColumnId)
      )
  }, [allColumns, hidden, tableColumnOrder, tableCustomColumns])

  const columnWidthsPx = columnWidthsPxProp

  const [dragWidthById, setDragWidthById] = useState<
    Partial<Record<string, number>>
  >({})

  const mergedWidths = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of visibleColumns) {
      const d = dragWidthById[c.id]
      if (typeof d === "number" && Number.isFinite(d) && d > 0) {
        m[c.id] = d
      } else {
        m[c.id] = resolveTableColumnWidthPx(c, columnWidthsPx)
      }
    }
    return m
  }, [visibleColumns, columnWidthsPx, dragWidthById])

  useEffect(() => {
    if (!columnWidthsPx) return
    setDragWidthById((prev) => {
      const keys = Object.keys(prev)
      if (keys.length === 0) return prev
      const next = { ...prev }
      let changed = false
      for (const k of keys) {
        const sv = columnWidthsPx[k]
        const pv = next[k]
        if (
          typeof sv === "number" &&
          typeof pv === "number" &&
          Math.abs(sv - pv) < 1
        ) {
          delete next[k]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [columnWidthsPx])

  const getColumnResize = useCallback(
    (col: TableColumn, index: number) => {
      if (!onColumnWidthCommit || index >= visibleColumns.length - 1)
        return undefined
      const w =
        mergedWidths[col.id] ?? resolveTableColumnWidthPx(col, columnWidthsPx)
      const b = boardColumnResizeBounds(col.id)
      return {
        minPx: b.min,
        maxPx: b.max,
        widthPx: w,
        showHandle: true as const,
        ariaLabel: t.resizeColumn,
        onResize: (next: number) =>
          setDragWidthById((prev) => ({ ...prev, [col.id]: next })),
        onResizeCommit: (final: number) => {
          onColumnWidthCommit(col.id, final)
        },
      }
    },
    [
      columnWidthsPx,
      mergedWidths,
      onColumnWidthCommit,
      t.resizeColumn,
      visibleColumns.length,
    ]
  )

  const rowSegments = useMemo(
    () => buildRowSegments(items, groupByPriority),
    [items, groupByPriority]
  )

  const rowIdsForSort = useMemo(
    () =>
      rowSegments
        .filter((s): s is Extract<RowSeg, { type: "row" }> => s.type === "row")
        .map((s) => s.item.id),
    [rowSegments]
  )

  const rowDndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleRowDndEnd = useCallback(
    (event: DragEndEvent) => {
      if (!onRowOrderCommit) return
      const { active, over } = event
      if (!over || active.id === over.id) return
      const ids = rowIdsForSort
      const oldIndex = ids.indexOf(String(active.id))
      const newIndex = ids.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return
      const next = arrayMove(ids, oldIndex, newIndex)
      onRowOrderCommit(groupId, next)
    },
    [groupId, onRowOrderCommit, rowIdsForSort]
  )

  const colSpan = visibleColumns.length

  const emptyState = (
    <div className="p-8 text-center text-sm text-muted-foreground">
      {t.emptyGroup}
    </div>
  )
  const errorState = emptyState

  const budgetSum = items.reduce(
    (acc, it) => acc + budgetNumber(it.dynamicData || {}),
    0
  )

  type HeaderCellDnd = {
    innerRef: Ref<HTMLTableCellElement>
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps?: DraggableProvidedDragHandleProps | null
    snapshot: DraggableStateSnapshot
  }

  const mergeHeaderDnd = (
    dnd: HeaderCellDnd | undefined,
    extraClassName?: string
  ) => {
    if (!dnd) return extraClassName ? { className: extraClassName } : {}
    return {
      ref: dnd.innerRef,
      ...dnd.draggableProps,
      style: dnd.draggableProps.style as CSSProperties,
      columnDragHandleProps: dnd.dragHandleProps ?? undefined,
      columnDragAriaLabel: t.reorderColumn,
      className: cn(
        extraClassName,
        dnd.snapshot.isDragging && "bg-muted/40 opacity-95"
      ),
    }
  }

  /** Task column stays left; all other columns centered; long text wraps. */
  const boardAlign = (columnId: string) => ({
    contentAlign: (columnId === "task" ? "start" : "center") as
      | "start"
      | "center",
    wordWrap: true,
  })

  /** Header labels are always centered (including Task). */
  const boardHeaderAlign = {
    contentAlign: "center" as const,
    wordWrap: true,
  }

  const renderColumnMenu = (col: TableColumn) => {
    if (col.id === "select" || col.id === "add" || col.id === "task") {
      return null
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 rounded-md hover:bg-muted/80 focus-visible:ring-1"
            aria-label={t.columnActions}
          >
            <MoreHorizontal className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            className="gap-2"
            onClick={() => onDuplicateBoardColumn?.(col.id)}
          >
            <Plus className="size-4 opacity-70" />
            {t.duplicateColumn}
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2 text-destructive"
            onClick={() => onDeleteBoardColumn?.(col.id)}
          >
            <Trash2 className="size-4 opacity-70" />
            {t.deleteColumn}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderHeaderCell = (
    col: TableColumn,
    index: number,
    dnd?: HeaderCellDnd
  ) => {
    const sticky = !!col.sticky
    const stickyLeftPx = stickyLeftPxForColumnIndex(
      visibleColumns,
      mergedWidths,
      index
    )
    const columnResize = getColumnResize(col, index)

    const cellCommonProps = {
      sticky,
      stickyLeftPx,
      size: "medium" as const,
    }

    if (col.id === "add") {
      const addTrigger = (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={t.colAdd}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="size-4" aria-hidden />
        </Button>
      )
      return (
        <TableHeaderCell
          key={col.id}
          {...mergeHeaderDnd(dnd)}
          {...boardHeaderAlign}
          title={String(col.title)}
          {...cellCommonProps}
          sticky={false}
          stickyEnd
          stickyLeftPx={undefined}
          columnResize={columnResize}
        >
          {onAddBoardColumn ? (
            <EcosystraBoardAddColumnPopover
              t={t as Record<string, string>}
              onAddColumn={onAddBoardColumn}
            >
              {addTrigger}
            </EcosystraBoardAddColumnPopover>
          ) : (
            addTrigger
          )}
        </TableHeaderCell>
      )
    }
    if (col.id === "select") {
      return (
        <TableHeaderCell
          key={col.id}
          {...mergeHeaderDnd(
            dnd,
            col.id === "select" ? "box-border min-w-0" : undefined
          )}
          {...boardHeaderAlign}
          title={col.title}
          {...cellCommonProps}
          columnResize={columnResize}
          infoContent={col.infoContent}
        />
      )
    }
    const fallbackTitle = String(col.title)
    const displayTitle = tableColumnTitles[col.id] ?? fallbackTitle
    if (onColumnTitleCommit) {
      return (
        <TableHeaderCell
          key={col.id}
          {...mergeHeaderDnd(dnd)}
          {...boardHeaderAlign}
          {...cellCommonProps}
          columnResize={columnResize}
          infoContent={col.infoContent}
          menu={renderColumnMenu(col)}
        >
          <span className="inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 font-medium text-muted-foreground">
            <EcosystraBoardEditableColumnHeader
              label={displayTitle}
              fallbackLabel={fallbackTitle}
              ariaLabel={`${displayTitle}: ${t.editColumnTitle}`}
              onCommit={(next) =>
                onColumnTitleCommit(col.id, next, fallbackTitle)
              }
            />
            {col.infoContent ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                      aria-label="Column information"
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Info className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {col.infoContent}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </span>
        </TableHeaderCell>
      )
    }
    return (
      <TableHeaderCell
        key={col.id}
        {...mergeHeaderDnd(
          dnd,
          col.id === "select" ? "box-border min-w-0" : undefined
        )}
        {...boardHeaderAlign}
        title={tableColumnTitles[col.id] ?? col.title}
        size="medium"
        sticky={sticky}
        stickyLeftPx={stickyLeftPx}
        columnResize={columnResize}
        infoContent={col.infoContent}
        menu={renderColumnMenu(col)}
      />
    )
  }

  const renderBodyCell = (
    col: TableColumn,
    row: GqlBoardItem,
    colIndex: number,
    rowDragListeners?: DraggableSyntheticListeners | null
  ) => {
    const d = row.dynamicData || {}
    const sticky = !!col.sticky
    const stickyLeftPx = stickyLeftPxForColumnIndex(
      visibleColumns,
      mergedWidths,
      colIndex
    )

    const cellCommonProps = {
      sticky,
      stickyLeftPx,
      size: "medium" as const,
    }

    const customDef = tableCustomColumns[col.id]
    if (customDef) {
      const fk = ecoCcFieldKey(col.id)
      switch (customDef.kind) {
        case "status": {
          const status = normalizeSubitemStatus(d[fk])
          const pill = taskStatusPillStyle(status)
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <div className="flex min-w-0 max-w-full items-center gap-1">
                <Select
                  value={status}
                  onValueChange={(v) => onPatchItem(row.id, { [fk]: v })}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-8 min-w-[120px] max-w-[180px] flex-1 rounded-full border-0 font-semibold shadow-none hover:opacity-95"
                    style={pill}
                    aria-label={t.colStatus}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBITEM_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {status === "Done" ? (
                  <Check
                    className="size-4 shrink-0 text-emerald-600"
                    aria-label={t.statusDoneHint}
                  />
                ) : null}
              </div>
            </TableCell>
          )
        }
        case "dueDate": {
          const label = String(d[fk] ?? "—")
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-border/80 px-2 font-normal"
                    aria-label={`${t.colDueDate}: ${label}`}
                  >
                    <Check
                      className="size-3.5 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    <span className="truncate">{label}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => {
                      if (!date) return
                      onPatchItem(row.id, {
                        [fk]: format(date, "MMM d"),
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          )
        }
        case "lastUpdated": {
          const rel = String(d[fk] ?? "—")
          const by = "User"
          const avatarUrl =
            (d.lastUpdated_avatarUrl as string | null | undefined) ?? null
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <EcosystraBoardLastUpdatedCell
                byName={by}
                avatarUrl={avatarUrl}
                relativeLabel={rel}
              />
            </TableCell>
          )
        }
        case "files": {
          const raw = d[fk]
          const n =
            typeof raw === "number" && Number.isFinite(raw)
              ? raw
              : typeof raw === "string"
                ? Number(raw.replace(/[^0-9.]/g, "")) || 0
                : 0
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <div
                className="flex items-center gap-1.5 text-muted-foreground"
                aria-label={
                  n > 0
                    ? t.filesAttachedCount.replace("{n}", String(n))
                    : t.filesNone
                }
              >
                <FileText className="size-4 shrink-0" aria-hidden />
                {n > 0 ? (
                  <span className="text-xs font-medium text-foreground">
                    {n}
                  </span>
                ) : (
                  <span className="text-xs">—</span>
                )}
              </div>
            </TableCell>
          )
        }
        case "owner": {
          const raw = d[fk]
          let ownerName = ""
          let avatarUrl: string | null = null
          if (raw && typeof raw === "object") {
            const o = raw as Record<string, unknown>
            ownerName = String(o.owner ?? "").trim()
            avatarUrl = (o.owner_avatarUrl as string | null | undefined) ?? null
          } else {
            ownerName = String(d.owner ?? "").trim()
            avatarUrl = (d.owner_avatarUrl as string | null | undefined) ?? null
          }
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <EcosystraBoardAvatar name={ownerName} avatarUrl={avatarUrl} />
            </TableCell>
          )
        }
        case "assignee": {
          const assignees = parseAssigneesFromDynamic(d)
          const pendingInvites = parsePendingInvitesFromDynamic(d)
          const assigneeButtonLabel =
            assignees.length > 0 || pendingInvites.length > 0
              ? `${t.colAssignee}: ${assignees.length + pendingInvites.length}`
              : `${t.colAssignee}: ${t.assigneeUnassigned}`
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <AssigneePicker
                workspaceId={workspaceId}
                itemId={row.id}
                assignees={assignees}
                pendingInvites={pendingInvites}
                assigneeButtonLabel={assigneeButtonLabel}
                onCommit={(userIds, inviteEmails) =>
                  onSetTaskAssignees(row.id, userIds, inviteEmails)
                }
                onOpenAssign={() => onPersonToolbarTarget(row.id)}
                filterPlaceholder={t.assigneeSearch}
                clearLabel={t.assigneeClear}
                inviteFooterLabel={t.assigneeInviteFooter}
                inviteHint={t.assigneeInviteHint}
              />
            </TableCell>
          )
        }
        case "timeline": {
          const tl = String(d[fk] ?? "—")
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 max-w-[200px] truncate rounded-full border-0 px-3 text-xs font-semibold shadow-none hover:opacity-95"
                    style={{
                      backgroundColor: "var(--eco-mono-timeline-bg)",
                      color: "var(--eco-mono-timeline-fg)",
                    }}
                    aria-label={`${t.colTimeline}: ${tl}`}
                  >
                    {tl}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={parseTimelineRange(tl)}
                    onSelect={(range) => {
                      onPatchItem(row.id, {
                        [fk]: formatTimelineRange(range),
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          )
        }
        case "priority": {
          const priority = itemPriority({ priority: d[fk] } as Record<
            string,
            unknown
          >)
          const pill = priorityPillStyle(priority)
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <Select
                value={priority}
                onValueChange={(v) => onPatchItem(row.id, { [fk]: v })}
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 w-[120px] rounded-full border-0 font-semibold shadow-none hover:opacity-95"
                  style={pill}
                  aria-label={t.colPriority}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          )
        }
        case "budget":
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <InputSpin
                className="max-w-[200px]"
                value={budgetNumber({ budget: d[fk] } as Record<
                  string,
                  unknown
                >)}
                min={0}
                max={1_000_000_000}
                step={100}
                formatDisplay={formatIdr}
                onChange={(n) => onPatchItem(row.id, { [fk]: n })}
                aria-label={t.colBudget}
              />
            </TableCell>
          )
        case "duePriority":
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <DuePill
                label={String(d[fk] ?? "—")}
                duePriorityLabel={t.dueDatePriorityLabel}
              />
            </TableCell>
          )
        case "notes":
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <InlineNotesPlain
                itemId={row.id}
                value={String(d[fk] ?? "")}
                ariaLabel={t.colNotes}
                placeholder={t.notesPlaceholder}
                onCommit={(next) => onPatchItem(row.id, { [fk]: next })}
              />
            </TableCell>
          )
        case "notesCategory": {
          const cat = normalizeNotesCategory(d[fk])
          const st = notesCategoryStyle(cat)
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps}>
              <Select
                value={cat}
                onValueChange={(v) => onPatchItem(row.id, { [fk]: v })}
              >
                <SelectTrigger
                  size="sm"
                  className={cn(
                    bookmark.bookmarkSelectTrigger,
                    "max-w-[200px] border-0 font-semibold shadow-none hover:opacity-95"
                  )}
                  style={st}
                  aria-label={t.colNotesCategory}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTES_CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          )
        }
        default:
          return (
            <TableCell key={col.id} {...boardAlign(col.id)} {...cellCommonProps} />
          )
      }
    }

    switch (col.id) {
      case "select":
        return (
          <TableCell
            key={col.id}
            {...boardAlign(col.id)}
            {...cellCommonProps}
            className="box-border min-w-0"
          >
            {/* `position:relative` on <td> would override `sticky` via Tailwind merge — keep sticky on td, relative on inner wrapper only. */}
            <div className="relative min-h-9 w-full min-w-0">
              {rowDragListeners ? (
                <button
                  type="button"
                  {...rowDragListeners}
                  aria-label={t.reorderRow}
                  className="absolute start-1 top-1/2 z-[1] -translate-y-1/2 shrink-0 rounded border-0 bg-muted/90 p-1 opacity-0 shadow-sm transition-opacity group-hover/row:opacity-100 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                </button>
              ) : null}
              <div className="flex w-full items-center justify-center">
                <Checkbox
                  aria-label={t.colSelect}
                  checked={selectedRowIds.has(row.id)}
                  onCheckedChange={(v) => setRowSelected(row.id, v === true)}
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
              </div>
            </div>
          </TableCell>
        )
      case "task": {
        const subs = row.subitems ?? []
        return (
          <TableRowHeaderCell
            key={col.id}
            {...boardAlign(col.id)}
            {...cellCommonProps}
            className="min-w-0"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {subs.length ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  aria-expanded={expandedSubitemRowId === row.id}
                  aria-controls={`subitems-${row.id}`}
                  onClick={() =>
                    setExpandedSubitemRowId(
                      expandedSubitemRowId === row.id ? null : row.id
                    )
                  }
                  aria-label={
                    expandedSubitemRowId === row.id
                      ? t.collapseGroup
                      : t.expandGroup
                  }
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      expandedSubitemRowId !== row.id && "-rotate-90"
                    )}
                    aria-hidden
                  />
                </Button>
              ) : (
                <span className="inline-block w-7" aria-hidden />
              )}
              <InlineTaskTitle
                itemId={row.id}
                name={row.name}
                ariaLabel={t.taskNameEditLabel}
                emptyErrorLabel={t.taskNameEmptyError}
                onCommit={(next) => onRenameItem(row.id, next)}
              />
              {subs.length > 0 ? (
                <span
                  className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums leading-none text-muted-foreground"
                  title={t.subitemCountTitle.replace(
                    "{n}",
                    String(subs.length)
                  )}
                >
                  {subs.length}
                </span>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground"
                    aria-label={t.taskRowActionsMenu}
                  >
                    <Info className="size-3.5" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDeleteItem(row.id)}
                  >
                    <Trash2 className="me-2 size-4" aria-hidden />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-[color:var(--eco-board-header-fg)] opacity-80 hover:opacity-100"
                      aria-label={t.taskAiHint}
                    >
                      <Sparkles className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.taskAiHint}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-[color:var(--eco-board-header-fg)] opacity-80 hover:opacity-100"
                      aria-label={t.taskComments}
                    >
                      <MessageSquarePlus className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.taskComments}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableRowHeaderCell>
        )
      }
      case "status": {
        const status = normalizeSubitemStatus(d.taskStatus)
        const pill = taskStatusPillStyle(status)
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <div className="flex min-w-0 max-w-full items-center gap-1">
              <Select
                value={status}
                onValueChange={(v) => onPatchItem(row.id, { taskStatus: v })}
              >
                <SelectTrigger
                  size="sm"
                  className="h-8 min-w-[120px] max-w-[180px] flex-1 rounded-full border-0 font-semibold shadow-none hover:opacity-95"
                  style={pill}
                  aria-label={t.colStatus}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBITEM_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status === "Done" ? (
                <Check
                  className="size-4 shrink-0 text-emerald-600"
                  aria-label={t.statusDoneHint}
                />
              ) : null}
            </div>
          </TableCell>
        )
      }
      case "dueDate": {
        const label = String(d.dueDate ?? "—")
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-border/80 px-2 font-normal"
                  aria-label={`${t.colDueDate}: ${label}`}
                >
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                  <span className="truncate">{label}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  onSelect={(date) => {
                    if (!date) return
                    onPatchItem(row.id, { dueDate: format(date, "MMM d") })
                  }}
                />
              </PopoverContent>
            </Popover>
          </TableCell>
        )
      }
      case "lastUpdated": {
        const rel = String(d.lastUpdatedLabel ?? "—")
        const by = String(d.lastUpdatedBy ?? "User").trim() || "User"
        const avatarUrl =
          (d.lastUpdated_avatarUrl as string | null | undefined) ?? null
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <EcosystraBoardLastUpdatedCell
              byName={by}
              avatarUrl={avatarUrl}
              relativeLabel={rel}
            />
          </TableCell>
        )
      }
      case "files": {
        const n =
          typeof d.filesCount === "number" && Number.isFinite(d.filesCount)
            ? d.filesCount
            : 0
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              aria-label={
                n > 0
                  ? t.filesAttachedCount.replace("{n}", String(n))
                  : t.filesNone
              }
            >
              <FileText className="size-4 shrink-0" aria-hidden />
              {n > 0 ? (
                <span className="text-xs font-medium text-foreground">{n}</span>
              ) : (
                <span className="text-xs">—</span>
              )}
            </div>
          </TableCell>
        )
      }
      case "owner": {
        const ownerName = String(d.owner ?? "").trim()
        const avatarUrl = (d.owner_avatarUrl as string | null | undefined) ?? null
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <EcosystraBoardAvatar name={ownerName} avatarUrl={avatarUrl} />
          </TableCell>
        )
      }
      case "assignee": {
        const assignees = parseAssigneesFromDynamic(d)
        const pendingInvites = parsePendingInvitesFromDynamic(d)
        const assigneeButtonLabel =
          assignees.length > 0 || pendingInvites.length > 0
            ? `${t.colAssignee}: ${assignees.length + pendingInvites.length}`
            : `${t.colAssignee}: ${t.assigneeUnassigned}`
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <AssigneePicker
              workspaceId={workspaceId}
              itemId={row.id}
              assignees={assignees}
              pendingInvites={pendingInvites}
              assigneeButtonLabel={assigneeButtonLabel}
              onCommit={(userIds, inviteEmails) =>
                onSetTaskAssignees(row.id, userIds, inviteEmails)
              }
              onOpenAssign={() => onPersonToolbarTarget(row.id)}
              filterPlaceholder={t.assigneeSearch}
              clearLabel={t.assigneeClear}
              inviteFooterLabel={t.assigneeInviteFooter}
              inviteHint={t.assigneeInviteHint}
            />
          </TableCell>
        )
      }
      case "timeline": {
        const tl = String(d.timeline ?? "—")
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 max-w-[200px] truncate rounded-full border-0 px-3 text-xs font-semibold shadow-none hover:opacity-95"
                  style={{
                    backgroundColor: "var(--eco-mono-timeline-bg)",
                    color: "var(--eco-mono-timeline-fg)",
                  }}
                  aria-label={`${t.colTimeline}: ${tl}`}
                >
                  {tl}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={parseTimelineRange(tl)}
                  onSelect={(range) => {
                    onPatchItem(row.id, {
                      timeline: formatTimelineRange(range),
                    })
                  }}
                />
              </PopoverContent>
            </Popover>
          </TableCell>
        )
      }
      case "priority": {
        const priority = itemPriority(d)
        const pill = priorityPillStyle(priority)
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <Select
              value={priority}
              onValueChange={(v) => onPatchItem(row.id, { priority: v })}
            >
              <SelectTrigger
                size="sm"
                className="h-8 w-[120px] rounded-full border-0 font-semibold shadow-none hover:opacity-95"
                style={pill}
                aria-label={t.colPriority}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        )
      }
      case "budget":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <InputSpin
              className="max-w-[200px]"
              value={budgetNumber(d)}
              min={0}
              max={1_000_000_000}
              step={100}
              formatDisplay={formatIdr}
              onChange={(n) => onPatchItem(row.id, { budget: n })}
              aria-label={t.colBudget}
            />
          </TableCell>
        )
      case "duePriority":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <DuePill
              label={String(d.dueDatePriority ?? "—")}
              duePriorityLabel={t.dueDatePriorityLabel}
            />
          </TableCell>
        )
      case "notes":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <InlineNotesPlain
              itemId={row.id}
              value={String(d.notesText ?? "")}
              ariaLabel={t.colNotes}
              placeholder={t.notesPlaceholder}
              onCommit={(next) => onPatchItem(row.id, { notesText: next })}
            />
          </TableCell>
        )
      case "notesCategory": {
        const cat = normalizeNotesCategory(d.notesCategory)
        const st = notesCategoryStyle(cat)
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <Select
              value={cat}
              onValueChange={(v) => onPatchItem(row.id, { notesCategory: v })}
            >
              <SelectTrigger
                size="sm"
                className={cn(
                  bookmark.bookmarkSelectTrigger,
                  "max-w-[200px] border-0 font-semibold shadow-none hover:opacity-95"
                )}
                style={st}
                aria-label={t.colNotesCategory}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTES_CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
        )
      }
      case "add":
        return (
          <TableCell
            key={col.id}
            {...boardAlign(col.id)}
            size="medium"
            stickyEnd
          />
        )
      default:
        return <TableCell key={col.id} {...boardAlign(col.id)} size="medium" />
    }
  }

  const renderExpandedSubitemsRow = (row: GqlBoardItem) => {
    const subs = row.subitems ?? []
    if (subs.length === 0 || expandedSubitemRowId !== row.id) return null
    return (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="bg-[color:var(--eco-board-row-hover)] p-0"
        >
          <div
            id={`subitems-${row.id}`}
            className="border-t border-[color:var(--eco-board-row-divider)] bg-[color:var(--eco-board-row-hover)] p-3 ps-4 [border-inline-start:4px_solid_var(--eco-group-todo)]"
            role="region"
            aria-label={t.subitemsRegionLabel}
          >
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[880px] grid-cols-7 gap-2 border-b border-border pb-2 text-xs font-medium text-muted-foreground"
                aria-hidden
              >
                <span>{t.subitemCol}</span>
                <span>{t.subitemOwner}</span>
                <span>{t.subitemStatus}</span>
                <span>{t.subitemDate}</span>
                <span>{t.subitemStatus1}</span>
                <span>{t.subitemStatus2}</span>
                <span>{t.subitemText}</span>
              </div>
              <ul className="m-0 list-none p-0">
                {subs.map((s: GqlBoardItem) => {
                  const sd = s.dynamicData || {}
                  const dropdown = normalizeSubitemDropdown(sd.dropdown)
                  const status = normalizeSubitemStatus(sd.status)
                  const status2 = normalizeSubitemStatus2(sd.subStatus2)
                  const subDateLabel = String(sd.subDueDate ?? "").trim()
                  const subAssignees = parseAssigneesFromDynamic(sd as Record<string, unknown>)
                  const subPending = parsePendingInvitesFromDynamic(
                    sd as Record<string, unknown>
                  )
                  const assigneeBtn =
                    subAssignees.length > 0 || subPending.length > 0
                      ? `${t.subitemOwner}: ${subAssignees.length + subPending.length}`
                      : `${t.subitemOwner}: ${t.assigneeUnassigned}`
                  return (
                    <li
                      key={s.id}
                      className="grid min-w-[880px] grid-cols-7 gap-2 border-b border-border/40 py-3 last:border-b-0"
                    >
                      <div
                        role="heading"
                        aria-level={3}
                        className="m-0 min-w-0 text-sm font-semibold text-foreground"
                      >
                        <InlineTaskTitle
                          itemId={s.id}
                          name={s.name}
                          ariaLabel={t.subitemNameEditLabel}
                          emptyErrorLabel={t.taskNameEmptyError}
                          className="font-semibold"
                          onCommit={(next) => onRenameItem(s.id, next)}
                        />
                      </div>
                      <div className="min-w-0">
                        <AssigneePicker
                          workspaceId={workspaceId}
                          itemId={s.id}
                          assignees={subAssignees}
                          pendingInvites={subPending}
                          assigneeButtonLabel={assigneeBtn}
                          onCommit={(userIds, inviteEmails) =>
                            onSetTaskAssignees(s.id, userIds, inviteEmails)
                          }
                          onOpenAssign={() => onPersonToolbarTarget(s.id)}
                          filterPlaceholder={t.assigneeSearch}
                          clearLabel={t.assigneeClear}
                          inviteFooterLabel={t.assigneeInviteFooter}
                          inviteHint={t.assigneeInviteHint}
                        />
                      </div>
                      <div className="min-w-0">
                        <Select
                          value={status}
                          onValueChange={(v) =>
                            onPatchItem(s.id, { status: v })
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-8 max-w-[160px] border-border/80"
                            aria-label={t.subitemStatus}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBITEM_STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 max-w-[120px] justify-start truncate px-2 font-normal"
                              aria-label={`${t.subitemDate}: ${subDateLabel || "—"}`}
                            >
                              {subDateLabel || "—"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              onSelect={(date) => {
                                if (!date) return
                                onPatchItem(s.id, {
                                  subDueDate: format(date, "MMM d"),
                                })
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="min-w-0">
                        <Select
                          value={dropdown}
                          onValueChange={(v) =>
                            onPatchItem(s.id, { dropdown: v })
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-8 max-w-[140px] border-border/80"
                            aria-label={t.subitemStatus1}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBITEM_DROPDOWN_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-0">
                        <Select
                          value={status2}
                          onValueChange={(v) =>
                            onPatchItem(s.id, { subStatus2: v })
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-8 max-w-[120px] border-border/80"
                            aria-label={t.subitemStatus2}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBITEM_STATUS2_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-0">
                        <Input
                          key={`${s.id}-subtext`}
                          className="h-8 max-w-full border-border/80 text-sm"
                          defaultValue={String(sd.subNotesText ?? "")}
                          placeholder={t.subitemTextPlaceholder}
                          aria-label={t.subitemText}
                          onBlur={(e) =>
                            onPatchItem(s.id, {
                              subNotesText: e.target.value,
                            })
                          }
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto p-0 text-primary"
              onClick={() => onAddSubitem(row.id)}
            >
              {t.addSubitem}
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <BoardRowDndContext
      enabled={!groupByPriority && items.length > 0}
      groupId={groupId}
      sensors={rowDndSensors}
      onDragEnd={handleRowDndEnd}
    >
      <Table
        id={`ecosystra-board-table-${groupId}`}
        columns={visibleColumns}
        columnWidthsPx={mergedWidths}
        emptyState={emptyState}
        errorState={errorState}
        isEmpty={items.length === 0}
        size={tableSize}
        className={cn(boardSurface.monoTableWrap, "bg-transparent")}
      >
        <TableCaption className="sr-only">
          {t.tableCaptionGroup.replace("{name}", groupName)}
        </TableCaption>
        <TableHeader>
          {enableColumnDrag ? (
            <Droppable
              droppableId="board-columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <TableRow
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  size={tableSize}
                >
                  {visibleColumns.map((col, hi) => (
                    <Draggable
                      key={col.id}
                      draggableId={`col-${col.id}`}
                      index={hi}
                      isDragDisabled={col.id === "add"}
                    >
                      {(prov, snapshot) =>
                        renderHeaderCell(col, hi, {
                          innerRef: prov.innerRef,
                          draggableProps: prov.draggableProps,
                          dragHandleProps: prov.dragHandleProps,
                          snapshot,
                        })
                      }
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableRow>
              )}
            </Droppable>
          ) : (
            <TableRow>
              {visibleColumns.map((col, hi) => renderHeaderCell(col, hi))}
            </TableRow>
          )}
        </TableHeader>
        {groupByPriority ? (
          <TableBody>
            {rowSegments.map((seg) => {
              if (seg.type === "header") {
                return (
                  <TableRow
                    key={seg.key}
                    className="bg-[color:var(--eco-board-row-hover)]"
                  >
                    <th
                      colSpan={colSpan}
                      scope="colgroup"
                      className="px-3 py-2 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {t.groupByPriorityHeading}: {seg.label}
                    </th>
                  </TableRow>
                )
              }
              const row = seg.item
              return (
                <Fragment key={seg.key}>
                  <TableRow
                    size={tableSize}
                    highlighted={selectedRowIds.has(row.id)}
                  >
                    {visibleColumns.map((col, ci) =>
                      renderBodyCell(col, row, ci)
                    )}
                  </TableRow>
                  {renderExpandedSubitemsRow(row)}
                </Fragment>
              )
            })}
            <TableRow className="border-dashed">
              <TableCell colSpan={colSpan} className="py-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onAddTask(groupId)}
                >
                  <Plus className="size-4" aria-hidden />
                  {t.addTask}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : items.length === 0 ? (
          <TableBody>
            <TableRow className="border-dashed">
              <TableCell colSpan={colSpan} className="py-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onAddTask(groupId)}
                >
                  <Plus className="size-4" aria-hidden />
                  {t.addTask}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <>
            <SortableContext
              items={rowIdsForSort}
              strategy={verticalListSortingStrategy}
            >
              {rowSegments.map((seg) => {
                if (seg.type !== "row") return null
                const row = seg.item
                const rowSortDisabled = !onRowOrderCommit
                return (
                  <SortableBoardRowTbody
                    key={seg.key}
                    id={row.id}
                    disabled={rowSortDisabled}
                  >
                    {({ listeners }) => (
                      <>
                        <TableRow
                          size={tableSize}
                          className="group/row"
                          highlighted={selectedRowIds.has(row.id)}
                        >
                          {visibleColumns.map((col, ci) =>
                            renderBodyCell(
                              col,
                              row,
                              ci,
                              !rowSortDisabled ? listeners : undefined
                            )
                          )}
                        </TableRow>
                        {renderExpandedSubitemsRow(row)}
                      </>
                    )}
                  </SortableBoardRowTbody>
                )
              })}
            </SortableContext>
            <tbody
              data-slot="table-body"
              className="[&_tr:last-child>td]:border-b-0"
            >
              <TableRow className="border-dashed">
                <TableCell colSpan={colSpan} className="py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => onAddTask(groupId)}
                  >
                    <Plus className="size-4" aria-hidden />
                    {t.addTask}
                  </Button>
                </TableCell>
              </TableRow>
            </tbody>
          </>
        )}
        {items.length > 0 ? (
          <TableFooter>
            <TableRow className="bg-[color:var(--eco-board-footer-bg)]">
              {visibleColumns.map((col) => {
                const footerStickyEnd = !!col.stickyEnd
                if (col.id === "budget") {
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                      className="text-sm font-semibold text-foreground"
                    >
                      <span className="sr-only">{t.colBudget}</span>
                      {`${formatIdr(budgetSum)} ${t.budgetSumLabel}`}
                    </TableCell>
                  )
                }
                if (col.id === "status") {
                  const segs = SUBITEM_STATUS_OPTIONS.map((opt) => ({
                    flex: items.filter(
                      (it) =>
                        normalizeSubitemStatus(
                          (it.dynamicData || {}).taskStatus
                        ) === opt
                    ).length,
                    color: taskStatusPillStyle(opt).backgroundColor,
                  }))
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                    >
                      <ColumnSummaryBar
                        segments={segs}
                        aria-label={t.footerStatusSummary}
                      />
                    </TableCell>
                  )
                }
                if (col.id === "priority") {
                  const order = ["Low", "Medium", "High"] as const
                  const segs = order.map((p) => ({
                    flex: items.filter(
                      (it) => itemPriority(it.dynamicData || {}) === p
                    ).length,
                    color: priorityPillStyle(p).backgroundColor,
                  }))
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                    >
                      <ColumnSummaryBar
                        segments={segs}
                        aria-label={t.footerPrioritySummary}
                      />
                    </TableCell>
                  )
                }
                if (col.id === "timeline") {
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                    >
                      <span
                        className="inline-flex max-w-full whitespace-normal break-words rounded-full px-2.5 py-0.5 text-center text-xs font-semibold [overflow-wrap:anywhere]"
                        style={{
                          backgroundColor: "var(--eco-mono-timeline-bg)",
                          color: "var(--eco-mono-timeline-fg)",
                        }}
                      >
                        {groupTimelineFooterLabel(items)}
                      </span>
                    </TableCell>
                  )
                }
                if (col.id === "notesCategory") {
                  const order = [...NOTES_CATEGORY_OPTIONS]
                  const segs = order.map((lab) => ({
                    flex: items.filter(
                      (it) =>
                        normalizeNotesCategory(
                          (it.dynamicData || {}).notesCategory
                        ) === lab
                    ).length,
                    color: notesCategoryStyle(lab).backgroundColor,
                  }))
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                    >
                      <ColumnSummaryBar
                        segments={segs}
                        aria-label={t.footerNotesCategorySummary}
                      />
                    </TableCell>
                  )
                }
                if (col.id === "duePriority") {
                  const labels = [
                    ...new Set(
                      items.map((it) =>
                        String(
                          (it.dynamicData || {}).dueDatePriority ??
                            "Critical Priority"
                        )
                      )
                    ),
                  ]
                  const segs = labels.map((lab) => ({
                    flex: items.filter(
                      (it) =>
                        String(
                          (it.dynamicData || {}).dueDatePriority ??
                            "Critical Priority"
                        ) === lab
                    ).length,
                    color: "var(--eco-mono-due-critical-bg)",
                  }))
                  return (
                    <TableCell
                      key={col.id}
                      {...boardAlign(col.id)}
                      size="medium"
                    >
                      <ColumnSummaryBar
                        segments={segs}
                        aria-label={t.footerDuePrioritySummary}
                      />
                    </TableCell>
                  )
                }
                return (
                  <TableCell
                    key={col.id}
                    {...boardAlign(col.id)}
                    size="medium"
                    stickyEnd={footerStickyEnd}
                  />
                )
              })}
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </BoardRowDndContext>
  )
}
