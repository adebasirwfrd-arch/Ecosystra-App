"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useQuery } from "@apollo/client"
import { toast } from "sonner"
import { ExternalLink, Loader2, Mail, UserPlus, Video } from "lucide-react"

import type { LocaleType } from "@/types"
import type { EventType } from "../types"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"
import {
  SET_TASK_ASSIGNEES,
  UPDATE_ITEM,
  UPDATE_ITEM_DYNAMIC_DATA,
  WORKSPACE_MEMBERS_LIST,
} from "@/lib/ecosystra/board-gql"
import { readAssigneeUserIdsFromDynamic } from "@/components/ecosystra/hooks/use-ecosystra-board-apollo"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { EcosystraZegoMeetingView } from "@/components/ecosystra/ecosystra-meeting"
import { mergeTaskDynamicFromCalendarForm } from "../_lib/board-to-calendar-events"
import { collectTaskPersonUserIds } from "../_lib/task-person-ids"

function generateZegoRoomId(itemId: string): string {
  const safe = itemId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 24)
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : String(Date.now())
  return `ecosystra_${safe}_${rand}`
}

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
  const { data: session } = useSession()
  const client = useMemo(() => createEcosystraGraphqlClient(), [])

  const eco = selectedEvent?.extendedProps?.ecosystra

  const [name, setName] = useState("")
  const [status, setStatus] = useState("Working on it")
  const [notes, setNotes] = useState("")
  const [due, setDue] = useState<Date>(new Date())
  const [tlStart, setTlStart] = useState<Date>(new Date())
  const [tlEnd, setTlEnd] = useState<Date>(new Date())
  const [videoMeeting, setVideoMeeting] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [meetingUiOpen, setMeetingUiOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [meetingPortalReady, setMeetingPortalReady] = useState(false)
  const [inviteExtraEmails, setInviteExtraEmails] = useState("")
  const [sendingInvites, setSendingInvites] = useState(false)
  const [addPersonOpen, setAddPersonOpen] = useState(false)
  const [addingPerson, setAddingPerson] = useState(false)

  useEffect(() => {
    setMeetingPortalReady(true)
  }, [])

  useEffect(() => {
    if (!eco || !selectedEvent) return
    const snap = eco.dynamicDataSnapshot
    setName(eco.taskName)
    setStatus(
      typeof snap.taskStatus === "string" ? snap.taskStatus : "Working on it"
    )
    setNotes(typeof snap.notesText === "string" ? snap.notesText : "")
    const existingRoom =
      typeof snap.zegoRoomId === "string" ? snap.zegoRoomId.trim() : ""
    setRoomId(existingRoom)
    setVideoMeeting(existingRoom.length > 0)
    const start =
      selectedEvent.start instanceof Date
        ? selectedEvent.start
        : new Date(selectedEvent.start)
    const endRaw =
      selectedEvent.end instanceof Date
        ? selectedEvent.end
        : new Date(selectedEvent.end)
    if (eco.eventKind === "due" || eco.eventKind === "meeting") {
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

  /** Close meeting only when user selects a different task (not on referential churn). */
  useEffect(() => {
    setMeetingUiOpen(false)
  }, [eco?.itemId])

  const boardHref =
    eco &&
    ensureLocalizedPathname(
      `/apps/ecosystra/board?task=${encodeURIComponent(eco.itemId)}&group=${encodeURIComponent(eco.groupId)}`,
      locale
    )

  const personUserIds = useMemo(
    () => collectTaskPersonUserIds(eco?.dynamicDataSnapshot ?? {}),
    [eco?.dynamicDataSnapshot]
  )

  const { data: rosterData } = useQuery<{
    workspaceMembers: {
      user: { id: string; name: string | null; email: string }
    }[]
  }>(WORKSPACE_MEMBERS_LIST, {
    client,
    skip: !open || !eco?.workspaceId,
    variables: { workspaceId: eco?.workspaceId ?? "" },
  })

  const rosterMap = useMemo(() => {
    const m = new Map<string, { name: string; email: string }>()
    for (const row of rosterData?.workspaceMembers ?? []) {
      m.set(row.user.id, {
        name: row.user.name?.trim() || row.user.email,
        email: row.user.email,
      })
    }
    return m
  }, [rosterData?.workspaceMembers])

  const joinPreviewUrl = useMemo(() => {
    if (typeof window === "undefined" || !roomId.trim() || !eco) return ""
    const q = new URLSearchParams({
      room: roomId.trim(),
      title: name.trim() || eco.taskName,
    })
    return `${window.location.origin}${ensureLocalizedPathname(
      `/apps/calendar/meeting/join?${q.toString()}`,
      locale
    )}`
  }, [roomId, name, eco, locale])

  const sendMeetingInvites = async () => {
    if (!eco) return
    if (!roomId.trim()) {
      toast.error("Enable video meeting and save a room first")
      return
    }
    if (!joinPreviewUrl) {
      toast.error("Could not build join link")
      return
    }
    const selfEmail = session?.user?.email?.trim().toLowerCase()
    const fromPeople: string[] = []
    for (const id of personUserIds) {
      const e = rosterMap.get(id)?.email
      if (e) fromPeople.push(e.toLowerCase())
    }
    const extras = inviteExtraEmails
      .split(/[\s,;]+/)
      .map((x) => x.trim().toLowerCase())
      .filter((x) => x.includes("@"))
    const merged = [...new Set([...fromPeople, ...extras])].filter(
      (e) => !selfEmail || e !== selfEmail
    )
    if (merged.length < 1) {
      toast.error("Add people on the task or type at least one email")
      return
    }
    setSendingInvites(true)
    try {
      const res = await fetch("/api/meeting/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomId.trim(),
          taskTitle: name.trim() || eco.taskName,
          groupName: eco.groupName,
          recipientEmails: merged,
          joinUrl: joinPreviewUrl,
        }),
      })
      const body = (await res.json()) as {
        sent?: number
        failed?: number
        error?: string
      }
      if (!res.ok) {
        toast.error(body.error ?? "Failed to send invitations")
        return
      }
      toast.success(
        `Sent ${body.sent ?? 0} invitation(s)${body.failed ? ` (${body.failed} failed)` : ""}`
      )
    } catch {
      toast.error("Network error")
    } finally {
      setSendingInvites(false)
    }
  }

  const roleLabel = eco?.viewerWorkspaceRole ?? "—"
  const roleUpper = roleLabel.toUpperCase()
  const readOnly =
    roleUpper === "VIEWER" || roleUpper === "GUEST" || roleUpper === "READER"

  const workspaceMembersAvailable = useMemo(() => {
    const ids = new Set(personUserIds)
    return (rosterData?.workspaceMembers ?? []).filter((m) => !ids.has(m.user.id))
  }, [rosterData?.workspaceMembers, personUserIds])

  const addWorkspaceMemberAsAssignee = async (userId: string) => {
    if (!eco || readOnly) return
    const cur = readAssigneeUserIdsFromDynamic(eco.dynamicDataSnapshot)
    if (cur.includes(userId)) {
      setAddPersonOpen(false)
      return
    }
    setAddingPerson(true)
    try {
      await client.mutate({
        mutation: SET_TASK_ASSIGNEES,
        variables: {
          itemId: eco.itemId,
          assigneeUserIds: [...cur, userId],
          inviteEmails: [],
        },
      })
      toast.success("Person added to the task")
      setAddPersonOpen(false)
      onSaved()
    } catch (e) {
      toast.error(gqlErr(e))
    } finally {
      setAddingPerson(false)
    }
  }

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
      const nextRoom =
        videoMeeting && roomId.trim().length > 0 ? roomId.trim() : null
      const nextDynamic = mergeTaskDynamicFromCalendarForm({
        snapshot: eco.dynamicDataSnapshot,
        notesText: notes,
        taskStatus: status,
        dueDateStart: due,
        timelineStart: tlStart,
        timelineEnd: tlEnd,
        zegoRoomId: nextRoom,
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

  const eventLabel =
    eco.eventKind === "due"
      ? "Due date"
      : eco.eventKind === "meeting"
        ? "Video meeting"
        : "Timeline"

  const meetingUserId = String(session?.user?.id ?? "guest")
  const meetingUserName =
    session?.user?.name?.trim() || session?.user?.email?.trim() || "Participant"

  const meetingOverlay =
    meetingPortalReady &&
    meetingUiOpen &&
    roomId.trim().length > 0 &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Video meeting preview"
            className="pointer-events-auto fixed inset-0 z-[10000] isolate flex h-[100dvh] min-h-0 w-full flex-col bg-background"
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            <EcosystraZegoMeetingView
              roomID={roomId.trim()}
              userID={meetingUserId}
              userName={meetingUserName}
              open={meetingUiOpen}
              onClose={() => setMeetingUiOpen(false)}
              viewerUserId={String(session?.user?.id ?? "")}
              inviteContext={
                eco.workspaceId
                  ? {
                      workspaceId: eco.workspaceId,
                      taskTitle: name.trim() || eco.taskName,
                      groupName: eco.groupName,
                      personUserIds,
                    }
                  : null
              }
            />
          </div>,
          document.body
        )
      : null

  return (
    <>
      {meetingOverlay}

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="flex h-full max-h-[100dvh] w-full flex-col gap-0 overflow-hidden px-0 pt-0 sm:max-w-md"
          onInteractOutside={(e) => {
            if (meetingUiOpen) e.preventDefault()
          }}
          onPointerDownOutside={(e) => {
            if (meetingUiOpen) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (meetingUiOpen) e.preventDefault()
          }}
        >
          <SheetHeader className="text-start px-4 pt-4">
            <SheetTitle>Task details</SheetTitle>
            <SheetDescription>
              {eventLabel} · {eco.groupName}
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain px-4 py-2">
            <Alert className="border-muted-foreground/20 bg-muted/40 py-2">
              <AlertDescription className="text-xs leading-relaxed">
                Workspace access:{" "}
                <Badge variant="outline" className="align-middle">
                  {roleLabel}
                </Badge>
                . Saving uses the same rules as the board (task edit
                permission).
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

            <div className="rounded-xl border border-border bg-muted/15 p-4 shadow-sm">
              <div className="space-y-1 pb-3">
                <h3 className="text-base font-semibold leading-tight">
                  Meeting details
                </h3>
                <p className="text-xs text-muted-foreground">
                  Video room, people on this task, and email invitations.
                </p>
              </div>

              <div className="flex flex-row items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/80 p-3">
                <div className="space-y-0.5 pe-2">
                  <Label htmlFor="eco-video-meeting" className="text-sm">
                    Create video meeting
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    ZEGOCLOUD room · mint chip on calendar (#00FFCC). Needs due
                    date or timeline.
                  </p>
                </div>
                <Switch
                  id="eco-video-meeting"
                  checked={videoMeeting}
                  disabled={readOnly}
                  onCheckedChange={(checked) => {
                    setVideoMeeting(checked)
                    if (checked) {
                      setRoomId((prev) =>
                        prev.trim().length > 0
                          ? prev
                          : generateZegoRoomId(eco.itemId)
                      )
                    } else {
                      setRoomId("")
                      setMeetingUiOpen(false)
                    }
                  }}
                />
              </div>

              {videoMeeting && roomId.trim().length > 0 ? (
                <div className="mt-3 space-y-2">
                  <Label className="text-xs">Room ID</Label>
                  <Input
                    readOnly
                    value={roomId}
                    className="bg-muted/40 font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={readOnly}
                    onClick={() => setMeetingUiOpen(true)}
                  >
                    <Video className="me-2 size-4" />
                    Join video meeting
                  </Button>
                </div>
              ) : null}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Label className="text-sm font-medium">Person</Label>
                    <p className="text-xs text-muted-foreground">
                      Owner & assignees (board). Add workspace members as
                      assignees.
                    </p>
                  </div>
                  <Popover open={addPersonOpen} onOpenChange={setAddPersonOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={
                          readOnly || !eco.workspaceId || addingPerson
                        }
                        className="shrink-0"
                      >
                        {addingPerson ? (
                          <Loader2 className="me-1 size-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="me-1 size-3.5" />
                        )}
                        Add person
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-72 p-0"
                      align="end"
                      sideOffset={6}
                    >
                      <div className="max-h-56 overflow-y-auto p-1">
                        {workspaceMembersAvailable.length === 0 ? (
                          <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                            Everyone on this task is already listed, or roster
                            is loading.
                          </p>
                        ) : (
                          workspaceMembersAvailable.map((m) => (
                            <button
                              key={m.user.id}
                              type="button"
                              className="flex w-full flex-col items-start rounded-sm px-2 py-2 text-start text-sm hover:bg-accent"
                              onClick={() =>
                                void addWorkspaceMemberAsAssignee(m.user.id)
                              }
                            >
                              <span className="font-medium">
                                {m.user.name?.trim() || m.user.email}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {m.user.email}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <ul className="max-h-36 space-y-1.5 overflow-y-auto rounded-md border border-border/60 bg-background/50 p-2 text-xs">
                  {personUserIds.length === 0 ? (
                    <li className="text-muted-foreground">
                      No owner or assignees yet — use Add person.
                    </li>
                  ) : (
                    personUserIds.map((id) => {
                      const r = rosterMap.get(id)
                      return (
                        <li
                          key={id}
                          className="flex flex-col rounded-md border border-border/40 px-2 py-1.5"
                        >
                          <span className="font-medium">
                            {r?.name ?? `User ${id.slice(0, 8)}…`}
                          </span>
                          {r?.email ? (
                            <span className="text-[11px] text-muted-foreground">
                              {r.email}
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-700 dark:text-amber-400">
                              Not in workspace roster — use email below
                            </span>
                          )}
                        </li>
                      )
                    })
                  )}
                </ul>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="eco-invite-extra" className="text-sm">
                  Invite by email
                </Label>
                <Input
                  id="eco-invite-extra"
                  placeholder="guest@example.com, other@…"
                  value={inviteExtraEmails}
                  onChange={(e) => setInviteExtraEmails(e.target.value)}
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted/40" : undefined}
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="default"
                    className="flex-1"
                    disabled={
                      readOnly ||
                      sendingInvites ||
                      !roomId.trim() ||
                      !videoMeeting
                    }
                    onClick={() => void sendMeetingInvites()}
                  >
                    {sendingInvites ? (
                      <Loader2 className="me-2 size-4 animate-spin" />
                    ) : (
                      <Mail className="me-2 size-4" />
                    )}
                    Send invitations
                  </Button>
                  {joinPreviewUrl && videoMeeting && roomId.trim().length > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(joinPreviewUrl)
                          toast.success("Meeting link copied")
                        } catch {
                          toast.error("Could not copy")
                        }
                      }}
                    >
                      Copy meeting link
                    </Button>
                  ) : null}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Email uses the meeting preview page (sign in → join). People
                  listed above are included when you send.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-border px-4 pb-4 pt-4">
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
    </>
  )
}
