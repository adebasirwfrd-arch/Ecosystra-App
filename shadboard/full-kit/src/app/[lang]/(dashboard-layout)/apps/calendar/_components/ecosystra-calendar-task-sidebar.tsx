"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ExternalLink, Loader2 } from "lucide-react"

import type { LocaleType } from "@/types"
import type { EventType } from "../types"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"
import {
  UPDATE_ITEM,
  UPDATE_ITEM_DYNAMIC_DATA,
} from "@/lib/ecosystra/board-gql"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { mergeTaskDynamicFromCalendarForm } from "../_lib/board-to-calendar-events"

function gqlErr(e: unknown): string {
  const x = e as { graphQLErrors?: { message?: string }[]; message?: string }
  return x.graphQLErrors?.[0]?.message ?? x.message ?? "Request failed"
}

export function EcosystraCalendarTaskSidebar({
  open,
  onOpenChange,
  selectedEvent,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedEvent: EventType | undefined
  onSaved: () => void
}) {
  const params = useParams()
  const locale = params.lang as LocaleType
  const client = useMemo(() => createEcosystraGraphqlClient(), [])

  const eco = selectedEvent?.extendedProps?.ecosystra

  const [name, setName] = useState("")
  const [status, setStatus] = useState("Working on it")
  const [notes, setNotes] = useState("")
  const [due, setDue] = useState<Date>(new Date())
  const [tlStart, setTlStart] = useState<Date>(new Date())
  const [tlEnd, setTlEnd] = useState<Date>(new Date())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!eco || !selectedEvent) return
    const snap = eco.dynamicDataSnapshot
    setName(eco.taskName)
    setStatus(
      typeof snap.taskStatus === "string" ? snap.taskStatus : "Working on it"
    )
    setNotes(typeof snap.notesText === "string" ? snap.notesText : "")
    const start =
      selectedEvent.start instanceof Date
        ? selectedEvent.start
        : new Date(selectedEvent.start)
    const endRaw =
      selectedEvent.end instanceof Date
        ? selectedEvent.end
        : new Date(selectedEvent.end)
    if (eco.eventKind === "due") {
      setDue(start)
      setTlStart(start)
      setTlEnd(start)
    } else {
      const endInclusive = new Date(endRaw)
      endInclusive.setDate(endInclusive.getDate() - 1)
      setTlStart(start)
      setTlEnd(endInclusive)
      const dueIso = typeof snap.dueDateIso === "string" ? snap.dueDateIso : ""
      if (dueIso.length >= 10) {
        setDue(new Date(`${dueIso.slice(0, 10)}T12:00:00`))
      } else {
        setDue(start)
      }
    }
  }, [eco, selectedEvent])

  const boardHref =
    eco &&
    ensureLocalizedPathname(
      `/apps/ecosystra/board?task=${encodeURIComponent(eco.itemId)}&group=${encodeURIComponent(eco.groupId)}`,
      locale
    )

  const roleLabel = eco?.viewerWorkspaceRole ?? "—"
  const roleUpper = roleLabel.toUpperCase()
  const readOnly =
    roleUpper === "VIEWER" || roleUpper === "GUEST" || roleUpper === "READER"

  const handleSave = async () => {
    if (!eco || readOnly) return
    if (tlEnd < tlStart) {
      toast.error("Timeline end must be on or after timeline start")
      return
    }
    setSaving(true)
    try {
      const trimmed = name.trim()
      if (trimmed.length < 1) {
        toast.error("Task name is required")
        return
      }
      const nextDynamic = mergeTaskDynamicFromCalendarForm({
        snapshot: eco.dynamicDataSnapshot,
        notesText: notes,
        taskStatus: status,
        dueDateStart: due,
        timelineStart: tlStart,
        timelineEnd: tlEnd,
      })
      if (trimmed !== eco.taskName) {
        await client.mutate({
          mutation: UPDATE_ITEM,
          variables: { id: eco.itemId, name: trimmed },
        })
      }
      await client.mutate({
        mutation: UPDATE_ITEM_DYNAMIC_DATA,
        variables: { id: eco.itemId, dynamicData: nextDynamic },
      })
      toast.success("Task updated")
      onSaved()
      onOpenChange(false)
    } catch (e) {
      toast.error(gqlErr(e))
    } finally {
      setSaving(false)
    }
  }

  if (!eco) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-md">
        <SheetHeader className="text-start">
          <SheetTitle>Task details</SheetTitle>
          <SheetDescription>
            {eco.eventKind === "due" ? "Due date" : "Timeline"} ·{" "}
            {eco.groupName}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-2">
          <Alert className="border-muted-foreground/20 bg-muted/40 py-2">
            <AlertDescription className="text-xs leading-relaxed">
              Workspace access:{" "}
              <Badge variant="outline" className="align-middle">
                {roleLabel}
              </Badge>
              . Saving uses the same rules as the board (task edit permission).
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="eco-task-name">Task</Label>
            <Input
              id="eco-task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={500}
              readOnly={readOnly}
              className={readOnly ? "bg-muted/40" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label>Group</Label>
            <Input readOnly value={eco.groupName} className="bg-muted/40" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eco-status">Status</Label>
            <Input
              id="eco-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              readOnly={readOnly}
              className={readOnly ? "bg-muted/40" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label>Due date</Label>
            <DatePicker
              formatStr="PPP"
              value={due}
              onValueChange={(v) => v && !readOnly && setDue(v)}
              buttonOptions={{ disabled: readOnly }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Timeline start</Label>
              <DatePicker
                formatStr="PPP"
                value={tlStart}
                onValueChange={(v) => v && !readOnly && setTlStart(v)}
                buttonOptions={{ disabled: readOnly }}
              />
            </div>
            <div className="space-y-2">
              <Label>Timeline end</Label>
              <DatePicker
                formatStr="PPP"
                value={tlEnd}
                onValueChange={(v) => v && !readOnly && setTlEnd(v)}
                buttonOptions={{ disabled: readOnly }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eco-notes">Notes</Label>
            <Textarea
              id="eco-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <Button
            type="button"
            disabled={saving || readOnly}
            className="w-full"
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {boardHref ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              asChild
            >
              <Link href={boardHref} onClick={() => onOpenChange(false)}>
                <ExternalLink className="me-2 size-4" />
                Go to detail
              </Link>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
