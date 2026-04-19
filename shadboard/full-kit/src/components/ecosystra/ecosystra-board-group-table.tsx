"use client"

import {
  Fragment,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react"
import { useApolloClient } from "@apollo/client"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
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
import { format } from "date-fns"
import { useMedia } from "react-use"
import { toast } from "sonner"
import {
  Check,
  ChevronDown,
  CirclePlus,
  FileText,
  GripVertical,
  Info,
  Mail,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  UserPlus,
  X,
} from "lucide-react"

import boardSurface from "./ecosystra-board-surface.module.css"
import { BoardTimelineRangeCommitPopover } from "./board-timeline-range-commit-popover"

import type { TableColumn } from "@/components/ui/ecosystra-table"
import type { DragEndEvent, DraggableSyntheticListeners } from "@dnd-kit/core"
import type {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import type { CSSProperties, ReactNode, Ref } from "react"
import type { DateRange } from "react-day-picker"
import type {
  DuePriorityLabel,
  GqlBoardGroup,
  GqlBoardItem,
  HidableBoardColumnId,
  SubitemBoardTableUi,
  TableCustomColumnDef,
} from "./hooks/use-ecosystra-board-apollo"

import {
  getTimelineDuration,
  parseTimelineRange,
} from "@/lib/ecosystra/board-timeline-format"
import { WORKSPACE_USERS } from "@/lib/ecosystra/board-gql"
import { cn, getInitials } from "@/lib/utils"

import {
  ALWAYS_STICKY_BOARD_COLUMN_IDS,
  sortItemsByOrder,
} from "./hooks/use-ecosystra-board-apollo"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BoardColumnLabelPicker } from "./board-column-label-picker"
import { DuePriorityPicker } from "./due-priority-picker"
import { EcosystraBoardAddColumnPopover } from "./ecosystra-board-add-column-popover"
import {
  EcosystraBoardAvatar,
  EcosystraBoardAvatarGroup,
  EcosystraBoardLastUpdatedCell,
} from "./ecosystra-board-avatars"
import type {
  BoardFacetLabels,
  BoardFilterColumnMeta,
} from "./ecosystra-board-filter-engine"
import { buildBoardGroupRowSegments } from "./ecosystra-board-group-by-engine"
import type { BoardGroupBySuite } from "./ecosystra-board-group-by-engine"
import { ecoCcFieldKey } from "./ecosystra-board-cc-field-key"
import { EcosystraBoardEditableColumnHeader } from "./ecosystra-board-editable-column-header"
import { formatIdr } from "./ecosystra-board-format-idr"
import { SortableBoardRowTbody } from "./ecosystra-board-sortable-row-tbody"
import { SortableSubitemTableRow } from "./ecosystra-board-sortable-subitem-row"
import { EcosystraGrandbookNewList } from "./ecosystra-grandbook"

const NOTES_CATEGORY_OPTIONS = [
  "General Note",
  "Action Item",
  "Meeting Summary",
] as const

function normalizeNotesCategory(v: unknown): string {
  const s = String(v ?? "General Note")
  return (NOTES_CATEGORY_OPTIONS as readonly string[]).includes(s)
    ? s
    : "General Note"
}

function resolveTaskStatusDisplayLabel(
  raw: unknown,
  labels: DuePriorityLabel[]
): string {
  const s = String(raw ?? "")
  const hit = labels.find((l) => l.label === s || l.id === s)
  if (hit) return hit.label
  const norm = normalizeSubitemStatus(s)
  return labels.find((l) => l.label === norm)?.label ?? norm
}

function resolveNotesCategoryDisplayLabel(
  raw: unknown,
  labels: DuePriorityLabel[]
): string {
  const s = String(raw ?? "")
  const hit = labels.find((l) => l.label === s || l.id === s)
  if (hit) return hit.label
  const norm = normalizeNotesCategory(s)
  return labels.find((l) => l.label === norm)?.label ?? norm
}

function clampBoardRating(raw: unknown): number {
  const x = typeof raw === "number" ? raw : Number(raw)
  if (!Number.isFinite(x)) return 0
  return Math.max(0, Math.min(5, Math.round(x)))
}

const BoardRatingStars = memo(function BoardRatingStars({
  value,
  onCommit,
  ariaLabel,
}: {
  value: unknown
  /** Persists when focus leaves the star group (click elsewhere / Tab) or on Enter. */
  onCommit: (next: number) => void
  ariaLabel: string
}) {
  const committed = clampBoardRating(value)
  const [draft, setDraft] = useState(committed)
  const [hover, setHover] = useState<number | null>(null)
  const draftRef = useRef(draft)
  draftRef.current = draft
  const display = hover ?? draft

  useEffect(() => {
    setDraft(committed)
  }, [committed])

  const flushIfDirty = useCallback(() => {
    const cur = draftRef.current
    if (cur !== committed) onCommit(cur)
  }, [committed, onCommit])

  const handleContainerBlur = (e: FocusEvent<HTMLDivElement>) => {
    const rt = e.relatedTarget
    if (rt instanceof Node && e.currentTarget.contains(rt)) return
    setHover(null)
    flushIfDirty()
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center justify-center gap-0.5 py-0.5"
      onMouseLeave={() => setHover(null)}
      onBlur={handleContainerBlur}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "rounded p-0.5 outline-offset-2 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
            i <= display ? "text-amber-400" : "text-muted-foreground/35"
          )}
          aria-label={`${i} of 5`}
          aria-pressed={i <= display}
          onMouseEnter={() => setHover(i)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          onClick={() => setDraft((cur) => (cur === i ? 0 : i))}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(committed)
              setHover(null)
              e.currentTarget.blur()
            }
            if (e.key === "Enter") {
              e.preventDefault()
              flushIfDirty()
              e.currentTarget.blur()
            }
          }}
        >
          <Star
            className={cn("size-[1.05rem]", i <= display && "fill-current")}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      ))}
    </div>
  )
})

const TimelinePill = memo(
  forwardRef<
    HTMLDivElement,
    {
      tl: string
      range: DateRange | undefined
      onClear: () => void
      t: any
    }
  >(({ tl, range, onClear, t, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const duration = getTimelineDuration(range)

    // Use Screenshot 1 aesthetics: light blue circular clear button with white X
    return (
      <div
        ref={ref}
        className="relative flex w-full max-w-[200px] items-center justify-center p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full truncate rounded-full border-0 px-3 text-[13px] font-semibold text-white shadow-none transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: "var(--eco-brand)",
          }}
          aria-label={`${t.colTimeline}: ${tl}`}
        >
          {isHovered && duration ? duration : tl}
        </Button>
        {range?.from && isHovered && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onClear()
            }}
            className="absolute end-1.5 flex size-5.5 items-center justify-center rounded-full bg-white/30 text-white transition-opacity hover:bg-white/50"
            title="Clear timeline"
          >
            <X className="size-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    )
  })
)
TimelinePill.displayName = "TimelinePill"

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

function BudgetInlineEdit({
  itemId: _itemId,
  value,
  ariaLabel,
  onCommit,
}: {
  itemId: string
  value: number
  ariaLabel: string
  onCommit: (next: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const handleCommit = () => {
    const next = parseFloat(draft)
    if (!isNaN(next) && next !== value) {
      onCommit(next)
    } else {
      setDraft(String(value))
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Input
        type="number"
        autoFocus
        className="h-8 max-w-[200px] border-none bg-muted/40 px-2 py-0 text-center shadow-none focus-visible:ring-1 focus-visible:ring-ring"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCommit()
          if (e.key === "Escape") {
            setDraft(String(value))
            setIsEditing(false)
          }
        }}
      />
    )
  }

  return (
    <button
      type="button"
      className="flex h-8 min-w-[100px] items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      onClick={() => setIsEditing(true)}
      aria-label={`${ariaLabel}: ${formatIdr(value)}`}
    >
      <span className="truncate">{formatIdr(value)}</span>
    </button>
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

function normalizeSubitemStatus(
  v: unknown
): (typeof SUBITEM_STATUS_OPTIONS)[number] {
  const s = String(v ?? "Working on it")
  return (SUBITEM_STATUS_OPTIONS as readonly string[]).includes(s)
    ? (s as (typeof SUBITEM_STATUS_OPTIONS)[number])
    : "Working on it"
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
  if (columnId === "rating") return { min: 120, max: 220 }
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

function resolvePriorityBucketLabel(
  d: Record<string, unknown>,
  priorityLabels: DuePriorityLabel[]
): string {
  const raw = String(d.priority ?? "")
  const hit = priorityLabels.find((l) => l.label === raw || l.id === raw)
  if (hit) return hit.label
  const leg = itemPriority(d)
  return priorityLabels.find((l) => l.label === leg)?.label ?? leg
}

type AssigneeDisplay = {
  id: string
  name: string
  avatarUrl?: string | null
}

function parseAssigneesFromDynamic(
  d: Record<string, unknown>
): AssigneeDisplay[] {
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
      <PopoverContent
        className="w-[calc(100dvw-32px)] p-3 sm:w-80"
        align="start"
      >
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
                      <AvatarImage
                        src={a.avatarUrl}
                        alt=""
                        className="rounded-full"
                      />
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
          <UserPlus
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          {inviteFooterLabel}
        </button>
      </PopoverContent>
    </Popover>
  )
}

/** Drop target when a group has no rows — parent `DndContext` moves tasks into this group. */
function BoardRowEmptyGroupDropTarget({
  groupId,
  children,
}: {
  groupId: string
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `board-row-drop-${groupId}`,
    data: { type: "board-row-list", groupId },
  })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        isOver && "rounded-xl ring-2 ring-primary/25 ring-offset-2"
      )}
    >
      {children}
    </div>
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
  groupBySuite: BoardGroupBySuite | null
  /** Resolved column meta for `groupBySuite.columnId` (parent derives from visible columns). */
  groupByColumn: BoardFilterColumnMeta | null
  groupByLabels: BoardFacetLabels
  workspaceUsersForGroupBy: { id: string; name: string | null; email: string }[]
  groupByUnassignedLabel: string
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
  /** Extra sticky column ids (`tablePinnedColumnIds` in board metadata). */
  tablePinnedColumnIds: readonly string[]
  /** User-added columns (`c_…` ids) from board metadata (`tableCustomColumns`). */
  tableCustomColumns: Record<string, TableCustomColumnDef>
  /** When true, column headers participate in board-level column drag (`DragDropContext`). */
  enableColumnDrag?: boolean
  /** Append a new column instance (`c_…`) before the + column. */
  onAddBoardColumn?: (kind: HidableBoardColumnId) => void
  /** Sub-item nested table layout (persisted `Board.subitemColumns`). */
  subitemTableUi: SubitemBoardTableUi
  /** Add a column kind to the sub-item table (new `c_…` id). */
  onAddSubitemBoardColumn?: (kind: HidableBoardColumnId) => void
  /** Persist sub-item table column widths (`Board.subitemColumns`). */
  onSubitemColumnWidthCommit?: (columnId: string, widthPx: number) => void
  /** When true, sub-item column headers use `DragDropContext` with type `SUBITEM_COLUMN`. */
  enableSubitemColumnDrag?: boolean
  onDuplicateSubitemBoardColumn?: (columnId: string) => void
  onDeleteSubitemBoardColumn?: (columnId: string) => void
  onSubitemColumnTitleCommit?: (
    columnId: string,
    nextTitle: string,
    fallbackTitle: string
  ) => void
  /** Persist per-parent sub-item row order (`itemOrdersByParent`). */
  onSubitemRowOrderCommit?: (parentItemId: string, orderedIds: string[]) => void
  /** Group accent color for nested sub-item border (hex). */
  groupColor?: string | null
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
  /** Board metadata `duePriorityLabels` — options for the Due priority column. */
  duePriorityLabels: DuePriorityLabel[]
  /** Board metadata `statusLabels` — Status column options. */
  statusLabels: DuePriorityLabel[]
  /** Board metadata `priorityLabels` — Priority column options. */
  priorityLabels: DuePriorityLabel[]
  /** Board metadata `notesCategoryLabels` — Notes category column options. */
  notesCategoryLabels: DuePriorityLabel[]
  /** Persist board-table label sets (metadata). */
  patchBoardTableUi: (partial: {
    duePriorityLabels?: DuePriorityLabel[]
    statusLabels?: DuePriorityLabel[]
    priorityLabels?: DuePriorityLabel[]
    notesCategoryLabels?: DuePriorityLabel[]
  }) => void | Promise<void | boolean>
}

function EcosystraBoardGroupTableImpl({
  groupId,
  groupName,
  workspaceId,
  items,
  t,
  expandedSubitemRowId,
  setExpandedSubitemRowId,
  hiddenColumnIds,
  groupBySuite,
  groupByColumn,
  groupByLabels,
  workspaceUsersForGroupBy,
  groupByUnassignedLabel,
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
  tablePinnedColumnIds,
  tableCustomColumns,
  enableColumnDrag = false,
  onAddBoardColumn,
  onRowSelectionChange,
  selectionClearVersion = 0,
  tableColumnTitles = {},
  onColumnTitleCommit,
  onDuplicateBoardColumn,
  onDeleteBoardColumn,
  duePriorityLabels,
  statusLabels,
  priorityLabels,
  notesCategoryLabels,
  patchBoardTableUi,
  subitemTableUi,
  onAddSubitemBoardColumn,
  onSubitemColumnWidthCommit,
  enableSubitemColumnDrag = false,
  onDuplicateSubitemBoardColumn,
  onDeleteSubitemBoardColumn,
  onSubitemColumnTitleCommit,
  onSubitemRowOrderCommit,
  groupColor = null,
}: Props) {
  const isDesktop = useMedia("(min-width: 640px)", false)
  const hidden = useMemo(() => new Set(hiddenColumnIds), [hiddenColumnIds])
  const subHidden = useMemo(
    () => new Set(subitemTableUi.hiddenColumnIds),
    [subitemTableUi.hiddenColumnIds]
  )
  const groupAccent = (groupColor && groupColor.trim()) || "#579BFC"
  /** Row selection for highlight (Vibe: highlighted row + side panel trigger). */
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set<string>())
  const [selectedSubitemIds, setSelectedSubitemIds] = useState(
    () => new Set<string>()
  )

  useEffect(() => {
    setSelectedRowIds(new Set())
  }, [selectionClearVersion])

  useEffect(() => {
    setSelectedSubitemIds(new Set())
  }, [expandedSubitemRowId])

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
        id: "date",
        title: t.colDate,
        loadingStateType: "medium-text",
        infoContent: t.colDateInfo,
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
        id: "rating",
        title: t.colRating,
        loadingStateType: "short-text",
        width: 140,
        infoContent: t.colRatingInfo,
      },
      {
        id: "add",
        title: t.colAdd,
        loadingStateType: "short-text",
        width: 52,
        stickyEnd: true,
      },
    ],
    [t, isDesktop]
  )

  const visibleColumns = useMemo(() => {
    const byId = new Map(allColumns.map((c) => [c.id, c]))
    const lockedSticky = new Set<string>(ALWAYS_STICKY_BOARD_COLUMN_IDS)
    const extraSticky = new Set(tablePinnedColumnIds)
    const base = tableColumnOrder
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
        (c) => !!c && !hidden.has(c.id as HidableBoardColumnId)
      ) as TableColumn[]
    return base.map(
      (c): TableColumn => ({
        ...c,
        sticky: lockedSticky.has(c.id) || extraSticky.has(c.id),
      })
    )
  }, [allColumns, hidden, tableColumnOrder, tableCustomColumns, tablePinnedColumnIds])

  const subVisibleColumns = useMemo(() => {
    const byId = new Map(allColumns.map((c) => [c.id, c]))
    const lockedSticky = new Set<string>(ALWAYS_STICKY_BOARD_COLUMN_IDS)
    const extraSticky = new Set(subitemTableUi.pinnedColumnIds)
    const base = subitemTableUi.tableColumnOrder
      .map((id) => {
        const built = byId.get(id)
        if (built) {
          const title = subitemTableUi.tableColumnTitles[id] ?? built.title
          return { ...built, title } satisfies TableColumn
        }
        const def = subitemTableUi.tableCustomColumns[id]
        if (!def) return undefined
        const tmpl = byId.get(def.kind)
        if (!tmpl) return undefined
        const title = subitemTableUi.tableColumnTitles[id] ?? tmpl.title
        return {
          id,
          title,
          loadingStateType: tmpl.loadingStateType,
          width: tmpl.width,
          infoContent: tmpl.infoContent,
        } satisfies TableColumn
      })
      .filter(
        (c) => !!c && !subHidden.has(c.id as HidableBoardColumnId)
      ) as TableColumn[]
    return base.map(
      (c): TableColumn => ({
        ...c,
        sticky: lockedSticky.has(c.id) || extraSticky.has(c.id),
      })
    )
  }, [allColumns, subHidden, subitemTableUi])

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

  const subColumnWidthsPx = subitemTableUi.columnWidthsPx

  const [subDragWidthById, setSubDragWidthById] = useState<
    Partial<Record<string, number>>
  >({})

  const subMergedWidths = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of subVisibleColumns) {
      const d = subDragWidthById[c.id]
      if (typeof d === "number" && Number.isFinite(d) && d > 0) {
        m[c.id] = d
      } else {
        m[c.id] = resolveTableColumnWidthPx(c, subColumnWidthsPx)
      }
    }
    return m
  }, [subVisibleColumns, subColumnWidthsPx, subDragWidthById])

  useEffect(() => {
    if (!subColumnWidthsPx) return
    setSubDragWidthById((prev) => {
      const keys = Object.keys(prev)
      if (keys.length === 0) return prev
      const next = { ...prev }
      let changed = false
      for (const k of keys) {
        const sv = subColumnWidthsPx[k]
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
  }, [subColumnWidthsPx])

  const getSubColumnResize = useCallback(
    (col: TableColumn, index: number) => {
      if (!onSubitemColumnWidthCommit || index >= subVisibleColumns.length - 1)
        return undefined
      const w =
        subMergedWidths[col.id] ??
        resolveTableColumnWidthPx(col, subColumnWidthsPx)
      const b = boardColumnResizeBounds(col.id)
      return {
        minPx: b.min,
        maxPx: b.max,
        widthPx: w,
        showHandle: true as const,
        ariaLabel: t.resizeColumn,
        onResize: (next: number) =>
          setSubDragWidthById((prev) => ({ ...prev, [col.id]: next })),
        onResizeCommit: (final: number) => {
          onSubitemColumnWidthCommit(col.id, final)
        },
      }
    },
    [
      subColumnWidthsPx,
      subMergedWidths,
      onSubitemColumnWidthCommit,
      t.resizeColumn,
      subVisibleColumns.length,
    ]
  )

  const subitemRowSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const groupByActive = Boolean(groupBySuite?.columnId && groupByColumn)

  const groupStub: GqlBoardGroup = useMemo(
    () => ({
      id: groupId,
      name: groupName,
      color: groupColor ?? null,
      items,
    }),
    [groupColor, groupId, groupName, items]
  )

  const rowSegments = useMemo(
    () =>
      buildBoardGroupRowSegments(
        items,
        groupStub,
        groupBySuite,
        groupByColumn,
        tableCustomColumns,
        groupByLabels,
        workspaceUsersForGroupBy,
        groupByUnassignedLabel
      ),
    [
      groupByColumn,
      groupByLabels,
      groupBySuite,
      groupStub,
      items,
      tableCustomColumns,
      workspaceUsersForGroupBy,
      groupByUnassignedLabel,
    ]
  )

  const rowIdsForSort = useMemo(
    () =>
      rowSegments
        .filter((s) => s.type === "row")
        .map((s) => s.item.id),
    [rowSegments]
  )

  const colSpan = visibleColumns.length

  /**
   * Unused when `items.length === 0` — we render empty groups **outside** `Table` so the CTA is
   * never lost to `ecosystra-table`’s `isEmpty` early return. Kept for `errorState` typing.
   */
  const tableErrorFallback = (
    <div className="p-6 text-center text-sm text-muted-foreground">
      Unable to load this table.
    </div>
  )

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

  const renderSubitemColumnMenu = (col: TableColumn) => {
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
            onClick={() => onDuplicateSubitemBoardColumn?.(col.id)}
          >
            <Plus className="size-4 opacity-70" />
            {t.duplicateColumn}
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2 text-destructive"
            onClick={() => onDeleteSubitemBoardColumn?.(col.id)}
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

  const renderSubitemHeaderCell = (
    col: TableColumn,
    index: number,
    dnd?: HeaderCellDnd
  ) => {
    const sticky = !!col.sticky
    const stickyLeftPx = stickyLeftPxForColumnIndex(
      subVisibleColumns,
      subMergedWidths,
      index
    )
    const columnResize = getSubColumnResize(col, index)

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
          {onAddSubitemBoardColumn ? (
            <EcosystraBoardAddColumnPopover
              t={t as Record<string, string>}
              onAddColumn={onAddSubitemBoardColumn}
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
    const displayTitle =
      subitemTableUi.tableColumnTitles[col.id] ?? fallbackTitle
    if (onSubitemColumnTitleCommit) {
      return (
        <TableHeaderCell
          key={col.id}
          {...mergeHeaderDnd(dnd)}
          {...boardHeaderAlign}
          {...cellCommonProps}
          columnResize={columnResize}
          infoContent={col.infoContent}
          menu={renderSubitemColumnMenu(col)}
        >
          <span className="inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 font-medium text-muted-foreground">
            <EcosystraBoardEditableColumnHeader
              label={displayTitle}
              fallbackLabel={fallbackTitle}
              ariaLabel={`${displayTitle}: ${t.editColumnTitle}`}
              onCommit={(next) =>
                onSubitemColumnTitleCommit(col.id, next, fallbackTitle)
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
        title={subitemTableUi.tableColumnTitles[col.id] ?? col.title}
        size="medium"
        sticky={sticky}
        stickyLeftPx={stickyLeftPx}
        columnResize={columnResize}
        infoContent={col.infoContent}
        menu={renderSubitemColumnMenu(col)}
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
          const statusVal = resolveTaskStatusDisplayLabel(d[fk], statusLabels)
          const isDone = statusVal === "Done"
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BoardColumnLabelPicker
                variant="status"
                labels={statusLabels}
                value={String(d[fk] ?? "")}
                onSelect={(next) => onPatchItem(row.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ statusLabels: next })
                }
                ariaLabel={t.colStatus}
                trailing={
                  isDone ? (
                    <Check
                      className="size-4 shrink-0 text-emerald-600"
                      aria-label={t.statusDoneHint}
                    />
                  ) : null
                }
              />
            </TableCell>
          )
        }
        case "dueDate": {
          const label = String(d[fk] ?? "—")
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
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
        case "date": {
          const isoKey = `${fk}Iso`
          const label = String(d[fk] ?? "—")
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
                    aria-label={`${t.colDate}: ${label}`}
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
                        [isoKey]: format(date, "yyyy-MM-dd"),
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          )
        }
        case "lastUpdated": {
          const by =
            row.lastUpdatedBy?.name?.trim() ||
            (typeof d.lastUpdatedBy === "string"
              ? d.lastUpdatedBy.trim()
              : "") ||
            "User"
          const avatarUrl = row.lastUpdatedBy?.avatarUrl || null
          const updatedAt = row.updatedAt
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <EcosystraBoardLastUpdatedCell
                byName={by}
                avatarUrl={avatarUrl}
                updatedAt={updatedAt}
                fallbackTimeLabel={
                  typeof d.lastUpdatedLabel === "string"
                    ? d.lastUpdatedLabel
                    : null
                }
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
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
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
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
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
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
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
          const range = parseTimelineRange(tl)
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BoardTimelineRangeCommitPopover
                draftStorageId={`${row.id}:${fk}`}
                timelineLabel={tl}
                onCommit={(formatted) =>
                  onPatchItem(row.id, { [fk]: formatted })
                }
                applyLabel={t.timelineApply}
                cancelLabel={t.timelineCancel}
              >
                <TimelinePill
                  tl={tl}
                  range={range}
                  t={t}
                  onClear={() => onPatchItem(row.id, { [fk]: null })}
                />
              </BoardTimelineRangeCommitPopover>
            </TableCell>
          )
        }
        case "priority": {
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BoardColumnLabelPicker
                variant="priority"
                labels={priorityLabels}
                value={String(d[fk] ?? "")}
                onSelect={(next) => onPatchItem(row.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ priorityLabels: next })
                }
                ariaLabel={t.colPriority}
              />
            </TableCell>
          )
        }
        case "budget":
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BudgetInlineEdit
                itemId={row.id}
                value={budgetNumber({ budget: d[fk] } as Record<
                  string,
                  unknown
                >)}
                onCommit={(n) => onPatchItem(row.id, { [fk]: n })}
                ariaLabel={t.colBudget}
              />
            </TableCell>
          )
        case "rating":
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BoardRatingStars
                value={d[fk]}
                onCommit={(n) => onPatchItem(row.id, { [fk]: n })}
                ariaLabel={t.colRating}
              />
            </TableCell>
          )
        case "duePriority":
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <DuePriorityPicker
                value={String(d[fk] ?? "")}
                labels={duePriorityLabels}
                onSelect={(labelId) => onPatchItem(row.id, { [fk]: labelId })}
                onUpdateLabels={(newLabels) =>
                  void patchBoardTableUi({ duePriorityLabels: newLabels })
                }
              />
            </TableCell>
          )
        case "notes":
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
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
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            >
              <BoardColumnLabelPicker
                variant="notesCategory"
                labels={notesCategoryLabels}
                value={String(d[fk] ?? "")}
                onSelect={(next) => onPatchItem(row.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ notesCategoryLabels: next })
                }
                ariaLabel={t.colNotesCategory}
              />
            </TableCell>
          )
        }
        default:
          return (
            <TableCell
              key={col.id}
              {...boardAlign(col.id)}
              {...cellCommonProps}
            />
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
        const hasSubs = subs.length > 0
        const toggleExpand = () =>
          setExpandedSubitemRowId(
            expandedSubitemRowId === row.id ? null : row.id
          )
        const addSubitemAndExpand = () => {
          onAddSubitem(row.id)
          setExpandedSubitemRowId(row.id)
        }
        return (
          <TableRowHeaderCell
            key={col.id}
            {...boardAlign(col.id)}
            {...cellCommonProps}
            className="min-w-0"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {hasSubs ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  aria-expanded={expandedSubitemRowId === row.id}
                  aria-controls={`subitems-${row.id}`}
                  onClick={toggleExpand}
                  aria-label={
                    expandedSubitemRowId === row.id
                      ? t.collapseGroup
                      : t.expandSubitemsHint
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
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                        aria-controls={`subitems-${row.id}`}
                        onClick={addSubitemAndExpand}
                        aria-label={t.addSubitemChevronHint}
                      >
                        <ChevronDown className="size-4" aria-hidden />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {t.addSubitemChevronHint}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                      className="size-7 text-[color:var(--eco-board-header-fg)] opacity-0 transition-opacity group-hover/row:opacity-80 hover:opacity-100"
                      aria-label={t.addSubitemPlusHint}
                      onClick={addSubitemAndExpand}
                    >
                      <CirclePlus className="size-3.5" aria-hidden />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.addSubitemPlusHint}</TooltipContent>
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
        const statusVal = resolveTaskStatusDisplayLabel(
          d.taskStatus,
          statusLabels
        )
        const isDone = statusVal === "Done"
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BoardColumnLabelPicker
              variant="status"
              labels={statusLabels}
              value={String(d.taskStatus ?? "")}
              onSelect={(next) => onPatchItem(row.id, { taskStatus: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ statusLabels: next })
              }
              ariaLabel={t.colStatus}
              trailing={
                isDone ? (
                  <Check
                    className="size-4 shrink-0 text-emerald-600"
                    aria-label={t.statusDoneHint}
                  />
                ) : null
              }
            />
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
                  variant="ghost"
                  size="sm"
                  className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
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
                      dueDate: format(date, "MMM d"),
                      dueDateIso: format(date, "yyyy-MM-dd"),
                    })
                  }}
                />
              </PopoverContent>
            </Popover>
          </TableCell>
        )
      }
      case "lastUpdated": {
        const by =
          row.lastUpdatedBy?.name?.trim() ||
          (typeof d.lastUpdatedBy === "string" ? d.lastUpdatedBy.trim() : "") ||
          "User"
        const avatarUrl = row.lastUpdatedBy?.avatarUrl || null
        const updatedAt = row.updatedAt
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <EcosystraBoardLastUpdatedCell
              byName={by}
              avatarUrl={avatarUrl}
              updatedAt={updatedAt}
              fallbackTimeLabel={
                typeof d.lastUpdatedLabel === "string"
                  ? d.lastUpdatedLabel
                  : null
              }
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
        const avatarUrl =
          (d.owner_avatarUrl as string | null | undefined) ?? null
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
        const range = parseTimelineRange(tl)
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BoardTimelineRangeCommitPopover
              draftStorageId={`${row.id}:timeline`}
              timelineLabel={tl}
              onCommit={(formatted) =>
                onPatchItem(row.id, { timeline: formatted })
              }
              applyLabel={t.timelineApply}
              cancelLabel={t.timelineCancel}
            >
              <TimelinePill
                tl={tl}
                range={range}
                t={t}
                onClear={() => onPatchItem(row.id, { timeline: null })}
              />
            </BoardTimelineRangeCommitPopover>
          </TableCell>
        )
      }
      case "priority": {
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BoardColumnLabelPicker
              variant="priority"
              labels={priorityLabels}
              value={String(d.priority ?? "")}
              onSelect={(next) => onPatchItem(row.id, { priority: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ priorityLabels: next })
              }
              ariaLabel={t.colPriority}
            />
          </TableCell>
        )
      }
      case "budget":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BudgetInlineEdit
              itemId={row.id}
              value={budgetNumber(d)}
              onCommit={(n) => onPatchItem(row.id, { budget: n })}
              ariaLabel={t.colBudget}
            />
          </TableCell>
        )
      case "duePriority":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <DuePriorityPicker
              value={String(d.dueDatePriority ?? "")}
              labels={duePriorityLabels}
              onSelect={(labelId) =>
                onPatchItem(row.id, { dueDatePriority: labelId })
              }
              onUpdateLabels={(newLabels) =>
                void patchBoardTableUi({ duePriorityLabels: newLabels })
              }
            />
          </TableCell>
        )
      case "rating":
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BoardRatingStars
              value={d.rating}
              onCommit={(n) => onPatchItem(row.id, { rating: n })}
              ariaLabel={t.colRating}
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
        return (
          <TableCell key={col.id} {...boardAlign(col.id)} size="medium">
            <BoardColumnLabelPicker
              variant="notesCategory"
              labels={notesCategoryLabels}
              value={String(d.notesCategory ?? "")}
              onSelect={(next) => onPatchItem(row.id, { notesCategory: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ notesCategoryLabels: next })
              }
              ariaLabel={t.colNotesCategory}
            />
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

  const renderSubitemDataCell = (
    col: TableColumn,
    s: GqlBoardItem,
    rowDragListeners?: DraggableSyntheticListeners | null
  ) => {
    const sd = s.dynamicData || {}
    const customDef = subitemTableUi.tableCustomColumns[col.id]
    if (customDef) {
      const fk = ecoCcFieldKey(col.id)
      switch (customDef.kind) {
        case "status":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BoardColumnLabelPicker
                variant="status"
                labels={statusLabels}
                value={String(sd[fk] ?? sd.status ?? "")}
                onSelect={(next) => onPatchItem(s.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ statusLabels: next })
                }
                ariaLabel={t.colStatus}
              />
            </div>
          )
        case "dueDate": {
          const label = String(sd[fk] ?? sd.subDueDate ?? "—")
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
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
                      onPatchItem(s.id, {
                        [fk]: format(date, "MMM d"),
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        }
        case "date": {
          const isoKey = `${fk}Iso`
          const label = String(sd[fk] ?? "—")
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
                    aria-label={`${t.colDate}: ${label}`}
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
                      onPatchItem(s.id, {
                        [fk]: format(date, "MMM d"),
                        [isoKey]: format(date, "yyyy-MM-dd"),
                      })
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )
        }
        case "notes":
          return (
            <div key={col.id} className="min-w-0 px-0.5">
              <InlineNotesPlain
                itemId={s.id}
                value={String(sd[fk] ?? sd.subNotesText ?? "")}
                ariaLabel={t.colNotes}
                placeholder={t.notesPlaceholder}
                onCommit={(next) => onPatchItem(s.id, { [fk]: next })}
              />
            </div>
          )
        case "priority":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BoardColumnLabelPicker
                variant="priority"
                labels={priorityLabels}
                value={String(sd[fk] ?? sd.priority ?? "")}
                onSelect={(next) => onPatchItem(s.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ priorityLabels: next })
                }
                ariaLabel={t.colPriority}
              />
            </div>
          )
        case "budget":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BudgetInlineEdit
                itemId={s.id}
                value={budgetNumber({ budget: sd[fk] } as Record<
                  string,
                  unknown
                >)}
                onCommit={(n) => onPatchItem(s.id, { [fk]: n })}
                ariaLabel={t.colBudget}
              />
            </div>
          )
        case "rating":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BoardRatingStars
                value={sd[fk] ?? sd.rating}
                onCommit={(n) => onPatchItem(s.id, { [fk]: n })}
                ariaLabel={t.colRating}
              />
            </div>
          )
        case "duePriority":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <DuePriorityPicker
                value={String(sd[fk] ?? sd.dueDatePriority ?? "")}
                labels={duePriorityLabels}
                onSelect={(labelId) => onPatchItem(s.id, { [fk]: labelId })}
                onUpdateLabels={(newLabels) =>
                  void patchBoardTableUi({ duePriorityLabels: newLabels })
                }
              />
            </div>
          )
        case "notesCategory":
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BoardColumnLabelPicker
                variant="notesCategory"
                labels={notesCategoryLabels}
                value={String(sd[fk] ?? sd.notesCategory ?? "")}
                onSelect={(next) => onPatchItem(s.id, { [fk]: next })}
                onUpdateLabels={(next) =>
                  void patchBoardTableUi({ notesCategoryLabels: next })
                }
                ariaLabel={t.colNotesCategory}
              />
            </div>
          )
        case "files": {
          const n =
            typeof sd[fk] === "number" && Number.isFinite(sd[fk] as number)
              ? (sd[fk] as number)
              : typeof sd.filesCount === "number"
                ? sd.filesCount
                : 0
          return (
            <div
              key={col.id}
              className="flex items-center justify-center gap-1.5 text-muted-foreground"
            >
              <FileText className="size-4 shrink-0" aria-hidden />
              {n > 0 ? (
                <span className="text-xs font-medium text-foreground">{n}</span>
              ) : (
                <span className="text-xs">—</span>
              )}
            </div>
          )
        }
        case "timeline": {
          const tl = String(sd[fk] ?? sd.timeline ?? "—")
          const range = parseTimelineRange(tl)
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <BoardTimelineRangeCommitPopover
                draftStorageId={`${s.id}:${fk}`}
                timelineLabel={tl}
                onCommit={(formatted) =>
                  onPatchItem(s.id, { [fk]: formatted })
                }
                applyLabel={t.timelineApply}
                cancelLabel={t.timelineCancel}
              >
                <TimelinePill
                  tl={tl}
                  range={range}
                  t={t}
                  onClear={() => onPatchItem(s.id, { [fk]: null })}
                />
              </BoardTimelineRangeCommitPopover>
            </div>
          )
        }
        case "lastUpdated": {
          const by =
            s.lastUpdatedBy?.name?.trim() ||
            (typeof sd.lastUpdatedBy === "string"
              ? sd.lastUpdatedBy.trim()
              : "") ||
            "User"
          const avatarUrl = s.lastUpdatedBy?.avatarUrl || null
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <EcosystraBoardLastUpdatedCell
                byName={by}
                avatarUrl={avatarUrl}
                updatedAt={s.updatedAt}
                fallbackTimeLabel={
                  typeof sd.lastUpdatedLabel === "string"
                    ? sd.lastUpdatedLabel
                    : null
                }
              />
            </div>
          )
        }
        case "owner": {
          const ownerName = String(sd[fk] ?? sd.owner ?? "").trim()
          const avatarUrl =
            (sd.owner_avatarUrl as string | null | undefined) ?? null
          return (
            <div key={col.id} className="flex min-w-0 justify-center px-0.5">
              <EcosystraBoardAvatar name={ownerName} avatarUrl={avatarUrl} />
            </div>
          )
        }
        case "assignee": {
          const assignees = parseAssigneesFromDynamic(sd)
          const pendingInvites = parsePendingInvitesFromDynamic(sd)
          const assigneeButtonLabel =
            assignees.length > 0 || pendingInvites.length > 0
              ? `${t.colAssignee}: ${assignees.length + pendingInvites.length}`
              : `${t.colAssignee}: ${t.assigneeUnassigned}`
          return (
            <div key={col.id} className="min-w-0 px-0.5">
              <AssigneePicker
                workspaceId={workspaceId}
                itemId={s.id}
                assignees={assignees}
                pendingInvites={pendingInvites}
                assigneeButtonLabel={assigneeButtonLabel}
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
          )
        }
        default:
          return <div key={col.id} className="h-8" />
      }
    }

    switch (col.id) {
      case "select":
        return (
          <div className="relative min-h-9 w-full min-w-0 px-0.5">
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
                checked={selectedSubitemIds.has(s.id)}
                onCheckedChange={(v) =>
                  setSelectedSubitemIds((prev) => {
                    const next = new Set(prev)
                    if (v === true) next.add(s.id)
                    else next.delete(s.id)
                    return next
                  })
                }
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              />
            </div>
          </div>
        )
      case "task":
        return (
          <div key={col.id} className="flex min-w-0 items-center gap-1 px-0.5">
            <InlineTaskTitle
              itemId={s.id}
              name={s.name}
              ariaLabel={t.subitemNameEditLabel}
              emptyErrorLabel={t.taskNameEmptyError}
              className="font-semibold"
              onCommit={(next) => onRenameItem(s.id, next)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground"
                  aria-label={t.taskRowActionsMenu}
                >
                  <Info className="size-3.5" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDeleteItem(s.id)}
                >
                  <Trash2 className="me-2 size-4" aria-hidden />
                  {t.deleteConfirm}
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
                    className="size-7 shrink-0 text-muted-foreground opacity-80 hover:opacity-100"
                    aria-label={t.taskComments}
                  >
                    <MessageSquarePlus className="size-3.5" aria-hidden />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.taskComments}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "owner": {
        const ownerName = String(sd.owner ?? "").trim()
        const avatarUrl =
          (sd.owner_avatarUrl as string | null | undefined) ?? null
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <EcosystraBoardAvatar name={ownerName} avatarUrl={avatarUrl} />
          </div>
        )
      }
      case "assignee": {
        const assignees = parseAssigneesFromDynamic(sd)
        const pendingInvites = parsePendingInvitesFromDynamic(sd)
        const assigneeButtonLabel =
          assignees.length > 0 || pendingInvites.length > 0
            ? `${t.colAssignee}: ${assignees.length + pendingInvites.length}`
            : `${t.colAssignee}: ${t.assigneeUnassigned}`
        return (
          <div key={col.id} className="min-w-0 px-0.5">
            <AssigneePicker
              workspaceId={workspaceId}
              itemId={s.id}
              assignees={assignees}
              pendingInvites={pendingInvites}
              assigneeButtonLabel={assigneeButtonLabel}
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
        )
      }
      case "status": {
        const statusVal = resolveTaskStatusDisplayLabel(sd.status, statusLabels)
        const isDone = statusVal === "Done"
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BoardColumnLabelPicker
              variant="status"
              labels={statusLabels}
              value={String(sd.status ?? "")}
              onSelect={(next) => onPatchItem(s.id, { status: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ statusLabels: next })
              }
              ariaLabel={t.colStatus}
              trailing={
                isDone ? (
                  <Check
                    className="size-4 shrink-0 text-emerald-600"
                    aria-label={t.statusDoneHint}
                  />
                ) : null
              }
            />
          </div>
        )
      }
      case "dueDate": {
        const label = String(sd.subDueDate ?? "—")
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 max-w-[140px] justify-start gap-1.5 rounded-md border-0 px-2 font-normal shadow-none hover:bg-muted/50"
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
                    onPatchItem(s.id, {
                      subDueDate: format(date, "MMM d"),
                      subDueDateIso: format(date, "yyyy-MM-dd"),
                    })
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )
      }
      case "notes":
        return (
          <div key={col.id} className="min-w-0 px-0.5">
            <InlineNotesPlain
              itemId={s.id}
              value={String(sd.subNotesText ?? "")}
              ariaLabel={t.colNotes}
              placeholder={t.notesPlaceholder}
              onCommit={(next) => onPatchItem(s.id, { subNotesText: next })}
            />
          </div>
        )
      case "notesCategory":
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BoardColumnLabelPicker
              variant="notesCategory"
              labels={notesCategoryLabels}
              value={String(sd.notesCategory ?? "")}
              onSelect={(next) => onPatchItem(s.id, { notesCategory: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ notesCategoryLabels: next })
              }
              ariaLabel={t.colNotesCategory}
            />
          </div>
        )
      case "priority":
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BoardColumnLabelPicker
              variant="priority"
              labels={priorityLabels}
              value={String(sd.priority ?? "")}
              onSelect={(next) => onPatchItem(s.id, { priority: next })}
              onUpdateLabels={(next) =>
                void patchBoardTableUi({ priorityLabels: next })
              }
              ariaLabel={t.colPriority}
            />
          </div>
        )
      case "budget":
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BudgetInlineEdit
              itemId={s.id}
              value={budgetNumber(sd)}
              onCommit={(n) => onPatchItem(s.id, { budget: n })}
              ariaLabel={t.colBudget}
            />
          </div>
        )
      case "rating":
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BoardRatingStars
              value={sd.rating}
              onCommit={(n) => onPatchItem(s.id, { rating: n })}
              ariaLabel={t.colRating}
            />
          </div>
        )
      case "duePriority":
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <DuePriorityPicker
              value={String(sd.dueDatePriority ?? "")}
              labels={duePriorityLabels}
              onSelect={(labelId) =>
                onPatchItem(s.id, { dueDatePriority: labelId })
              }
              onUpdateLabels={(newLabels) =>
                void patchBoardTableUi({ duePriorityLabels: newLabels })
              }
            />
          </div>
        )
      case "files": {
        const n =
          typeof sd.filesCount === "number" && Number.isFinite(sd.filesCount)
            ? sd.filesCount
            : 0
        return (
          <div
            key={col.id}
            className="flex items-center justify-center gap-1.5 text-muted-foreground"
          >
            <FileText className="size-4 shrink-0" aria-hidden />
            {n > 0 ? (
              <span className="text-xs font-medium text-foreground">{n}</span>
            ) : (
              <span className="text-xs">—</span>
            )}
          </div>
        )
      }
      case "timeline": {
        const tl = String(sd.timeline ?? "—")
        const range = parseTimelineRange(tl)
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <BoardTimelineRangeCommitPopover
              draftStorageId={`${s.id}:subtimeline`}
              timelineLabel={tl}
              onCommit={(formatted) =>
                onPatchItem(s.id, { timeline: formatted })
              }
              applyLabel={t.timelineApply}
              cancelLabel={t.timelineCancel}
            >
              <TimelinePill
                tl={tl}
                range={range}
                t={t}
                onClear={() => onPatchItem(s.id, { timeline: null })}
              />
            </BoardTimelineRangeCommitPopover>
          </div>
        )
      }
      case "lastUpdated": {
        const by =
          s.lastUpdatedBy?.name?.trim() ||
          (typeof sd.lastUpdatedBy === "string"
            ? sd.lastUpdatedBy.trim()
            : "") ||
          "User"
        const avatarUrl = s.lastUpdatedBy?.avatarUrl || null
        return (
          <div key={col.id} className="flex min-w-0 justify-center px-0.5">
            <EcosystraBoardLastUpdatedCell
              byName={by}
              avatarUrl={avatarUrl}
              updatedAt={s.updatedAt}
              fallbackTimeLabel={
                typeof sd.lastUpdatedLabel === "string"
                  ? sd.lastUpdatedLabel
                  : null
              }
            />
          </div>
        )
      }
      case "add":
        return <div key={col.id} className="h-8 w-full" aria-hidden />
      default:
        return <div key={col.id} className="h-8" />
    }
  }

  const renderExpandedSubitemsRow = (row: GqlBoardItem) => {
    if (expandedSubitemRowId !== row.id) return null
    const subs = row.subitems ?? []
    const sortedSubs = sortItemsByOrder(
      subs,
      subitemTableUi.itemOrdersByParent[row.id]
    )
    const sortableIds = sortedSubs.map((s) => s.id)

    const onSubitemRowsDragEnd = (event: DragEndEvent) => {
      if (!onSubitemRowOrderCommit) return
      const { active, over } = event
      if (!over) return
      const activeId = String(active.id)
      const overId = String(over.id)
      if (activeId === overId) return
      const orderIds = sortedSubs.map((x) => x.id)
      const oldI = orderIds.indexOf(activeId)
      const newI = orderIds.indexOf(overId)
      if (oldI < 0 || newI < 0) return
      onSubitemRowOrderCommit(row.id, arrayMove(orderIds, oldI, newI))
    }

    const subTableEmptyFallback = (
      <div className="p-4 text-center text-sm text-muted-foreground">—</div>
    )

    return (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="bg-sky-50/60 p-0 dark:bg-sky-950/20"
        >
          <div
            id={`subitems-${row.id}`}
            className="border-t border-sky-200/80 p-3 ps-4 dark:border-sky-800/60"
            style={{
              borderInlineStartWidth: 4,
              borderInlineStartStyle: "solid",
              borderInlineStartColor: groupAccent,
            }}
            role="region"
            aria-label={t.subitemsRegionLabel}
          >
            <div className="overflow-x-auto rounded-md border border-sky-200/70 bg-background/90 dark:border-sky-900/50">
              <DndContext
                sensors={subitemRowSensors}
                collisionDetection={closestCenter}
                onDragEnd={onSubitemRowsDragEnd}
              >
                <Table
                  id={`eco-subtbl-${groupId}-${row.id}`}
                  columns={subVisibleColumns}
                  columnWidthsPx={subMergedWidths}
                  emptyState={subTableEmptyFallback}
                  errorState={subTableEmptyFallback}
                  isEmpty={false}
                  size={tableSize}
                  withoutBorder
                  className="rounded-none border-0 bg-transparent shadow-none"
                >
                  <TableHeader>
                    {enableSubitemColumnDrag ? (
                      <Droppable
                        droppableId={`eco-subcols|${groupId}|${row.id}`}
                        direction="horizontal"
                        type="SUBITEM_COLUMN"
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            size={tableSize}
                          >
                            {subVisibleColumns.map((col, hi) => (
                              <Draggable
                                key={col.id}
                                draggableId={`subg-${groupId}-p-${row.id}-col-${col.id}`}
                                index={hi}
                                isDragDisabled={col.id === "add"}
                              >
                                {(prov, snapshot) =>
                                  renderSubitemHeaderCell(col, hi, {
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
                      <TableRow size={tableSize}>
                        {subVisibleColumns.map((col, hi) =>
                          renderSubitemHeaderCell(col, hi)
                        )}
                      </TableRow>
                    )}
                  </TableHeader>
                  <TableBody>
                    {sortableIds.length === 0 ? null : (
                      <SortableContext
                        items={sortableIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {sortedSubs.map((s) => (
                          <SortableSubitemTableRow
                            key={s.id}
                            id={s.id}
                            size={tableSize}
                            highlighted={selectedSubitemIds.has(s.id)}
                          >
                            {(listeners) =>
                              subVisibleColumns.map((c, ci) => {
                                const sticky = !!c.sticky
                                const stickyLeftPx = stickyLeftPxForColumnIndex(
                                  subVisibleColumns,
                                  subMergedWidths,
                                  ci
                                )
                                return (
                                  <TableCell
                                    key={c.id}
                                    {...boardAlign(c.id)}
                                    sticky={sticky}
                                    stickyLeftPx={stickyLeftPx}
                                    size="medium"
                                    className={
                                      c.id === "select"
                                        ? "box-border min-w-0"
                                        : undefined
                                    }
                                  >
                                    {renderSubitemDataCell(c, s, listeners)}
                                  </TableCell>
                                )
                              })
                            }
                          </SortableSubitemTableRow>
                        ))}
                      </SortableContext>
                    )}
                  </TableBody>
                </Table>
              </DndContext>
              <div className="border-t border-border/60 px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onAddSubitem(row.id)}
                >
                  <Plus className="size-4" aria-hidden />
                  {t.addSubitem}
                </Button>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const emptyGroupBody = (
    <div
      className={cn(
        boardSurface.monoTableWrap,
        "w-full min-w-0 overflow-hidden rounded-lg border border-[color:var(--eco-board-outer-border)] bg-[color:var(--eco-board-card-bg)] text-sm"
      )}
      data-ecosystra-group-empty=""
    >
      <p className="sr-only">
        {t.tableCaptionGroup.replace("{name}", groupName)}
      </p>
      <div
        className="flex min-h-[min(280px,45vh)] w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center"
        role="region"
        aria-label={t.emptyGroup}
      >
        <button
          type="button"
          data-testid="ecosystra-group-add-task"
          className="inline-flex h-11 min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold shadow-md outline-none ring-offset-2 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#0073ea] focus-visible:ring-offset-2"
          style={{ backgroundColor: "#0073ea", color: "#ffffff" }}
          onClick={() => onAddTask(groupId)}
        >
          <Plus className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          {t.addTask}
        </button>
        <p className="max-w-sm text-sm text-muted-foreground">{t.emptyGroup}</p>
      </div>
    </div>
  )

  return (
    <>
      {items.length === 0 ? (
        !groupByActive ? (
          <BoardRowEmptyGroupDropTarget groupId={groupId}>
            {emptyGroupBody}
          </BoardRowEmptyGroupDropTarget>
        ) : (
          emptyGroupBody
        )
      ) : (
        <Table
          id={`ecosystra-board-table-${groupId}`}
          columns={visibleColumns}
          columnWidthsPx={mergedWidths}
          emptyState={tableErrorFallback}
          errorState={tableErrorFallback}
          isEmpty={false}
          size={tableSize}
          className={cn(boardSurface.monoTableWrap, "bg-transparent")}
        >
          <TableCaption className="sr-only">
            {t.tableCaptionGroup.replace("{name}", groupName)}
          </TableCaption>
          <TableHeader>
            {enableColumnDrag ? (
              <Droppable
                droppableId={`board-columns-${groupId}`}
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
                        draggableId={`g-${groupId}-col-${col.id}`}
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
          {groupByActive ? (
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
                        {groupByColumn
                          ? t.groupByBucketHeader
                              .replace("{column}", groupByColumn.title)
                              .replace("{value}", seg.label)
                          : seg.label}
                      </th>
                    </TableRow>
                  )
                }
                const row = seg.item
                return (
                  <Fragment key={seg.key}>
                    <TableRow
                      size={tableSize}
                      className="group/row"
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
                  return (
                    <SortableBoardRowTbody
                      key={seg.key}
                      id={row.id}
                      disabled={false}
                      groupId={groupId}
                    >
                      {({ listeners }) => (
                        <>
                          <TableRow
                            size={tableSize}
                            className="group/row"
                            highlighted={selectedRowIds.has(row.id)}
                          >
                            {visibleColumns.map((col, ci) =>
                              renderBodyCell(col, row, ci, listeners)
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
                    const segs = statusLabels.map((l) => ({
                      flex: items.filter(
                        (it) =>
                          resolveTaskStatusDisplayLabel(
                            (it.dynamicData || {}).taskStatus,
                            statusLabels
                          ) === l.label
                      ).length,
                      color: l.color,
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
                    const segs = priorityLabels.map((l) => ({
                      flex: items.filter(
                        (it) =>
                          resolvePriorityBucketLabel(
                            it.dynamicData || {},
                            priorityLabels
                          ) === l.label
                      ).length,
                      color: l.color,
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
                    const segs = notesCategoryLabels.map((l) => ({
                      flex: items.filter(
                        (it) =>
                          resolveNotesCategoryDisplayLabel(
                            (it.dynamicData || {}).notesCategory,
                            notesCategoryLabels
                          ) === l.label
                      ).length,
                      color: l.color,
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
      )}
    </>
  )
}

EcosystraBoardGroupTableImpl.displayName = "EcosystraBoardGroupTable"
export const EcosystraBoardGroupTable = memo(EcosystraBoardGroupTableImpl)
