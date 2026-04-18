"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  CircleDot,
  Clock,
  FileText,
  GanttChart,
  Hash,
  Layers,
  Search,
  Sparkles,
  Star,
  Type,
  UserCircle,
  Users,
} from "lucide-react"

import type { LucideIcon } from "lucide-react"
import type { HidableBoardColumnId } from "./hooks/use-ecosystra-board-apollo"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

const ESSENTIALS: {
  id: HidableBoardColumnId
  icon: LucideIcon
  iconClass: string
}[] = [
  { id: "status", icon: CircleDot, iconClass: "bg-emerald-500" },
  { id: "notes", icon: Type, iconClass: "bg-amber-400" },
  { id: "owner", icon: UserCircle, iconClass: "bg-indigo-500" },
  { id: "assignee", icon: Users, iconClass: "bg-sky-400" },
  { id: "notesCategory", icon: ChevronDown, iconClass: "bg-emerald-600" },
  { id: "dueDate", icon: Calendar, iconClass: "bg-violet-500" },
  { id: "budget", icon: Hash, iconClass: "bg-amber-500" },
  { id: "rating", icon: Star, iconClass: "bg-amber-300" },
]

const SUPER_USEFUL: {
  id: HidableBoardColumnId
  icon: LucideIcon
  iconClass: string
}[] = [
  { id: "files", icon: FileText, iconClass: "bg-red-500" },
  { id: "timeline", icon: GanttChart, iconClass: "bg-violet-600" },
  { id: "priority", icon: Layers, iconClass: "bg-amber-600" },
  { id: "duePriority", icon: AlertTriangle, iconClass: "bg-orange-500" },
  { id: "lastUpdated", icon: Clock, iconClass: "bg-slate-500" },
]

function pickerLabel(
  id: HidableBoardColumnId,
  dict: Record<string, string>
): string {
  if (id === "notes") return dict.addColumnPickerText
  const keyMap: Record<HidableBoardColumnId, string> = {
    status: "hideColStatus",
    dueDate: "hideColDueDate",
    lastUpdated: "hideColLastUpdated",
    files: "hideColFiles",
    owner: "hideColOwner",
    assignee: "hideColAssignee",
    timeline: "hideColTimeline",
    priority: "hideColPriority",
    budget: "hideColBudget",
    rating: "hideColRating",
    duePriority: "hideColDue",
    notes: "addColumnPickerText",
    notesCategory: "hideColNotesCategory",
  }
  return dict[keyMap[id]] ?? id
}

export function EcosystraBoardAddColumnPopover({
  t,
  onAddColumn,
  children,
}: {
  t: Record<string, string>
  /** Adds a **new** column instance (new id) to the right of the last data column. */
  onAddColumn: (kind: HidableBoardColumnId) => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  /** All types always listed; search only filters by label (Monday-style). */
  const filterIds = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matchLabel = (id: HidableBoardColumnId) => {
      if (!q) return true
      return pickerLabel(id, t).toLowerCase().includes(q)
    }
    return {
      essentials: ESSENTIALS.filter((x) => matchLabel(x.id)).map((x) => x.id),
      super: SUPER_USEFUL.filter((x) => matchLabel(x.id)).map((x) => x.id),
    }
  }, [query, t])

  const meta = useMemo(() => {
    const m = new Map<
      HidableBoardColumnId,
      { icon: LucideIcon; iconClass: string }
    >()
    for (const x of ESSENTIALS) m.set(x.id, x)
    for (const x of SUPER_USEFUL) m.set(x.id, x)
    return m
  }, [])

  const hasResults =
    filterIds.essentials.length > 0 || filterIds.super.length > 0

  const renderGrid = (ids: HidableBoardColumnId[]) => (
    <div className="grid grid-cols-2 gap-1.5">
      {ids.map((id) => {
        const def = meta.get(id)
        if (!def) return null
        const Icon = def.icon
        const label = pickerLabel(id, t)
        return (
          <div key={id} className="min-w-0">
            <button
              type="button"
              title={`${label} — ${t.addColumnNewColumnHint}`}
              onClick={() => {
                onAddColumn(id)
                setOpen(false)
                setQuery("")
              }}
              className="flex min-h-10 w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-start text-sm transition-colors hover:bg-muted/80"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md text-white shadow-sm",
                  def.iconClass
                )}
              >
                <Icon className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="text-foreground">{label}</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {t.addColumnNewColumnHint}
                </span>
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(100vw-2rem,22rem)] p-0 shadow-lg"
        sideOffset={8}
      >
        <div className="flex flex-col gap-0">
          <div className="border-b border-border p-3 pb-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.addColumnSearchPlaceholder}
                className="h-9 ps-8"
                aria-label={t.addColumnSearchPlaceholder}
              />
            </div>
          </div>

          <div className="max-h-[min(60vh,24rem)] overflow-y-auto px-3 py-2">
            {!hasResults ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t.addColumnNoMatch}
              </p>
            ) : (
              <>
                {filterIds.essentials.length > 0 ? (
                  <section className="mb-3">
                    <h3 className="mb-2 px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.addColumnEssentials}
                    </h3>
                    {renderGrid(filterIds.essentials)}
                  </section>
                ) : null}

                {filterIds.super.length > 0 ? (
                  <section
                    id="add-column-super-useful"
                    className={cn(filterIds.essentials.length > 0 && "mt-3")}
                  >
                    <h3 className="mb-2 px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.addColumnSuperUseful}
                    </h3>
                    {renderGrid(filterIds.super)}
                  </section>
                ) : null}
              </>
            )}
          </div>

          <Separator />
          <div className="flex justify-center p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                document
                  .getElementById("add-column-super-useful")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              <Sparkles className="me-1.5 size-3.5 opacity-70" aria-hidden />
              {t.addColumnMoreColumns}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
