"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@apollo/client"
import { format, isValid, parseISO } from "date-fns"
import { toast } from "sonner"
import { Bell, Inbox, LayoutDashboard, ListTodo, Users } from "lucide-react"

import type { LocaleType } from "@/types"
import type { ReactNode } from "react"
import type { EcosystraShellUser } from "./ecosystra-embedded-root"
import type { GqlBoard } from "./hooks/use-ecosystra-board-apollo"

import {
  ASSIGN_MEMBER_ROLE,
  ECOSYSTRA_EMAILS_INBOX,
  ECOSYSTRA_NOTIFICATIONS,
  GET_OR_CREATE_BOARD,
  WORKSPACE_MEMBERS_LIST,
} from "@/lib/ecosystra/board-gql"
import { boardHrefFromNotificationLink } from "@/lib/ecosystra/notification-board-link"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { readAssigneeUserIdsFromDynamic } from "./hooks/use-ecosystra-board-apollo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEcosystraDictionary } from "./ecosystra-dictionary-context"
import { VIEW_TO_RELATIVE } from "./ecosystra-routes"
import { useOptionalEcosystraWorkspaceNav } from "./ecosystra-workspace-nav-context"

function ShellChrome({
  eyebrow,
  title,
  subtitle,
  footerNote,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle: string
  footerNote?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70",
        "bg-gradient-to-br from-background via-background to-muted/25",
        "p-[1px] shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]"
      )}
    >
      <div className="rounded-2xl bg-card/90 p-6 backdrop-blur-md sm:p-8 md:p-10">
        {eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {subtitle}
        </p>
        <Separator className="my-6 sm:my-8" />
        {children}
        {footerNote ? (
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground/90">
            {footerNote}
          </p>
        ) : null}
      </div>
    </div>
  )
}

type ShellTaskRow = {
  id: string
  name: string
  groupId: string
  groupName: string
  timeline: string
  dueLabel: string
  status: string
  shellRole: "owner" | "assignee" | "owner_and_assignee" | null
}

function pickTaskStatus(d: Record<string, unknown>): string {
  const v = d.taskStatus
  if (typeof v === "string" && v.trim()) return v.trim()
  return "—"
}

function pickTimeline(d: Record<string, unknown>): string {
  const v = d.timeline
  if (typeof v === "string" && v.trim()) return v.trim()
  return "—"
}

function formatTaskDueDisplay(d: Record<string, unknown>): string {
  const rawIso =
    typeof d.dueDateIso === "string" && d.dueDateIso.trim()
      ? d.dueDateIso.trim().slice(0, 10)
      : ""
  if (rawIso) {
    const parsed = parseISO(rawIso)
    if (isValid(parsed)) return format(parsed, "MMM d, yyyy")
  }
  const disp = typeof d.dueDate === "string" ? d.dueDate.trim() : ""
  return disp || "—"
}

function normEmail(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase()
}

function normLabel(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase()
}

/** Mirrors board “People” column: `assignees[]`, `assigneeUserIds`, invites, legacy single assignee. */
function collectPeopleAssigneeIdsAndEmails(d: Record<string, unknown>): {
  userIds: Set<string>
  emails: Set<string>
} {
  const userIds = new Set(readAssigneeUserIdsFromDynamic(d))
  const emails = new Set<string>()
  const raw = d.assignees
  if (Array.isArray(raw)) {
    for (const x of raw) {
      if (!x || typeof x !== "object") continue
      const o = x as Record<string, unknown>
      const id = String(o.id ?? "").trim()
      if (id) userIds.add(id)
      const em = String(o.email ?? "").trim()
      if (em) emails.add(normEmail(em))
    }
  }
  const legacy = String(d.assigneeEmail ?? "").trim()
  if (legacy) emails.add(normEmail(legacy))
  const invites = d.assigneePendingInvites
  if (Array.isArray(invites)) {
    for (const x of invites) {
      if (!x || typeof x !== "object") continue
      const em = String((x as { email?: string }).email ?? "").trim()
      if (em) emails.add(normEmail(em))
    }
  }
  return { userIds, emails }
}

/** Mirrors board “Owner” column + `ownerUserId` / `createdByUserId`. */
function viewerIsTaskOwner(
  shell: EcosystraShellUser | null,
  d: Record<string, unknown>,
  createdByUserId: string | null | undefined
): boolean {
  if (!shell) return false
  const sid = shell.id?.trim() ?? ""
  const ownerId =
    typeof d.ownerUserId === "string" && d.ownerUserId.trim()
      ? d.ownerUserId.trim()
      : (createdByUserId ?? "").trim()
  if (sid && ownerId && sid === ownerId) return true

  const shellEmail = normEmail(shell.email)
  const shellName = normLabel(shell.name)
  const ownerDisp = typeof d.owner === "string" ? d.owner.trim() : ""
  if (shellEmail && ownerDisp && normEmail(ownerDisp) === shellEmail)
    return true
  if (shellName && ownerDisp && normLabel(ownerDisp) === shellName) return true

  const nested = d.owner
  if (nested && typeof nested === "object") {
    const o = nested as Record<string, unknown>
    const n = String(o.owner ?? "").trim()
    const em = String(o.email ?? "").trim()
    if (shellEmail && em && normEmail(em) === shellEmail) return true
    if (shellName && n && normLabel(n) === shellName) return true
  }
  return false
}

function viewerIsTaskAssignee(
  shell: EcosystraShellUser | null,
  d: Record<string, unknown>
): boolean {
  if (!shell) return false
  const sid = shell.id?.trim() ?? ""
  const { userIds, emails } = collectPeopleAssigneeIdsAndEmails(d)
  if (sid && userIds.has(sid)) return true
  const shellEmail = normEmail(shell.email)
  if (shellEmail && emails.has(shellEmail)) return true
  return false
}

function viewerTaskShellRole(
  shell: EcosystraShellUser | null,
  d: Record<string, unknown>,
  createdByUserId: string | null | undefined
): ShellTaskRow["shellRole"] {
  const isOwner = viewerIsTaskOwner(shell, d, createdByUserId)
  const isAssignee = viewerIsTaskAssignee(shell, d)
  if (isOwner && isAssignee) return "owner_and_assignee"
  if (isOwner) return "owner"
  if (isAssignee) return "assignee"
  return null
}

function flattenRootTasks(
  board: GqlBoard | undefined,
  shell: EcosystraShellUser | null
): ShellTaskRow[] {
  if (!board?.groups) return []
  const rows: ShellTaskRow[] = []
  for (const g of board.groups) {
    for (const it of g.items) {
      if (it.parentItemId) continue
      const d = (it.dynamicData ?? {}) as Record<string, unknown>
      rows.push({
        id: it.id,
        name: it.name,
        groupId: g.id,
        groupName: g.name,
        timeline: pickTimeline(d),
        dueLabel: formatTaskDueDisplay(d),
        status: pickTaskStatus(d),
        shellRole: viewerTaskShellRole(shell, d, it.createdByUserId),
      })
    }
  }
  return rows
}

export function EcosystraShellViewBody({
  view,
  shellUser,
  locale,
}: {
  view: string
  shellUser: EcosystraShellUser
  locale: LocaleType
}) {
  const dictionary = useEcosystraDictionary()
  const sv = (
    dictionary.ecosystraApp as {
      shellViews?: Record<string, string>
    }
  ).shellViews
  const lv = (k: string, fb: string) => sv?.[k] ?? fb
  const foot = lv(
    "rebacNote",
    "Access is enforced on the API for your signed-in user."
  )
  const { workspaceId, isWorkspaceAdmin, viewerWorkspaceRole } =
    useOptionalEcosystraWorkspaceNav()
  const router = useRouter()

  const { data: boardData, loading: boardLoading } = useQuery<{
    getOrCreateBoard: GqlBoard
  }>(GET_OR_CREATE_BOARD, {
    fetchPolicy: "cache-first",
    skip: view !== "board" && view !== "tasks" && view !== "dashboard",
  })

  const board = boardData?.getOrCreateBoard
  const tasks = useMemo(
    () => flattenRootTasks(board, shellUser),
    [board, shellUser]
  )

  const { data: notifData, loading: notifLoading } = useQuery<{
    notifications: Array<{
      id: string
      title: string
      message: string
      isRead: boolean
      link?: string | null
      createdAt: string
    }>
  }>(ECOSYSTRA_NOTIFICATIONS, {
    skip: view !== "notifications",
    fetchPolicy: "network-only",
  })

  const { data: inboxData, loading: inboxLoading } = useQuery<{
    emails: Array<{
      id: string
      subject: string
      read: boolean
      createdAt: string
      sender: { name: string; email: string }
    }>
    emailCounts: { inbox: number }
  }>(ECOSYSTRA_EMAILS_INBOX, {
    skip: view !== "inbox",
    fetchPolicy: "network-only",
  })

  const {
    data: membersData,
    loading: membersLoading,
    refetch: refetchMembers,
  } = useQuery<{
    workspaceMembers: Array<{
      id: string
      role: string
      user: {
        id: string
        name: string | null
        email: string
        avatarUrl: string | null
      }
    }>
  }>(WORKSPACE_MEMBERS_LIST, {
    variables: { workspaceId: workspaceId ?? "" },
    skip: view !== "members" || !workspaceId,
    fetchPolicy: "network-only",
  })

  const [assignRole, { loading: assignLoading }] = useMutation(
    ASSIGN_MEMBER_ROLE,
    {
      onCompleted: () => {
        toast.success("Role updated")
        void refetchMembers()
      },
      onError: (e) => toast.error(e.message || "Could not update role"),
    }
  )

  if (view === "tasks") {
    return (
      <ShellChrome
        eyebrow={lv("eyebrowWorkspace", "Workspace")}
        title={lv("tasksTitle", "Tasks")}
        subtitle={lv("tasksSubtitle", "Root tasks from your board.")}
        footerNote={foot}
      >
        {boardLoading && !board ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {lv("tasksEmpty", "No tasks.")}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[180px] max-w-[280px]">
                    {lv("tasksColName", "Task")}
                  </TableHead>
                  <TableHead className="min-w-[140px] whitespace-nowrap">
                    {lv("tasksColGroup", "Group")}
                  </TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap">
                    {lv("tasksColRole", "Role")}
                  </TableHead>
                  <TableHead className="min-w-[140px] whitespace-nowrap">
                    {lv("tasksColTimeline", "Timeline")}
                  </TableHead>
                  <TableHead className="min-w-[120px] whitespace-nowrap">
                    {lv("tasksColDueDate", "Due date")}
                  </TableHead>
                  <TableHead className="min-w-[120px] whitespace-nowrap">
                    {lv("tasksColStatus", "Status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => {
                  const boardHref = ensureLocalizedPathname(
                    `${VIEW_TO_RELATIVE.board}?task=${encodeURIComponent(t.id)}&group=${encodeURIComponent(t.groupId)}`,
                    locale
                  )
                  const openOnBoard = () => {
                    router.push(boardHref)
                  }
                  const roleLabel =
                    t.shellRole === "owner"
                      ? lv("tasksRoleOwner", "Owner")
                      : t.shellRole === "assignee"
                        ? lv("tasksRoleAssignee", "Assignee")
                        : t.shellRole === "owner_and_assignee"
                          ? lv("tasksRoleOwnerAndAssignee", "Owner & Assignee")
                          : lv("tasksRoleNone", "—")
                  return (
                    <TableRow
                      key={t.id}
                      tabIndex={0}
                      role="link"
                      aria-label={lv(
                        "tasksOpenOnBoardAria",
                        "Open this task on the board"
                      )}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={openOnBoard}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          openOnBoard()
                        }
                      }}
                    >
                      <TableCell className="max-w-[280px] font-medium">
                        <span className="line-clamp-2">{t.name}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {t.groupName}
                      </TableCell>
                      <TableCell>
                        {t.shellRole ? (
                          <Badge
                            variant={
                              t.shellRole === "owner"
                                ? "default"
                                : t.shellRole === "owner_and_assignee"
                                  ? "default"
                                  : "secondary"
                            }
                            className="max-w-[200px] whitespace-normal text-center font-normal leading-snug"
                          >
                            {roleLabel}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground tabular-nums">
                            {roleLabel}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {t.timeline}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                        {t.dueLabel}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {t.status}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </ShellChrome>
    )
  }

  if (view === "inbox") {
    const emails = inboxData?.emails ?? []
    const unread =
      inboxData?.emailCounts?.inbox ?? emails.filter((e) => !e.read).length
    return (
      <ShellChrome
        eyebrow={lv("eyebrowWorkspace", "Workspace")}
        title={lv("inboxTitle", "Inbox")}
        subtitle={lv("inboxSubtitle", "Your inbox.")}
        footerNote={foot}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1 font-normal">
            <Inbox className="size-3.5 opacity-70" aria-hidden />
            {lv("inboxUnreadHint", "{n} unread").replace("{n}", String(unread))}
          </Badge>
        </div>
        {inboxLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {lv("inboxEmpty", "Empty.")}
          </p>
        ) : (
          <ul className="divide-y divide-border/60 rounded-xl border border-border/60">
            {emails.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.sender.name} · {e.sender.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!e.read ? <Badge variant="default">New</Badge> : null}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {format(new Date(e.createdAt), "MMM d, HH:mm")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ShellChrome>
    )
  }

  if (view === "notifications") {
    const list = notifData?.notifications ?? []
    return (
      <ShellChrome
        eyebrow={lv("eyebrowWorkspace", "Workspace")}
        title={lv("notificationsTitle", "Notifications")}
        subtitle={lv("notificationsSubtitle", "Alerts.")}
        footerNote={foot}
      >
        {notifLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {lv("notificationsEmpty", "None.")}
          </p>
        ) : (
          <ul className="space-y-2">
            {list.map((n) => {
              const boardHref = boardHrefFromNotificationLink(n.link, locale)
              const go = () => {
                if (boardHref) router.push(boardHref)
              }
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    disabled={!boardHref}
                    onClick={go}
                    aria-label={
                      boardHref
                        ? lv(
                            "notificationsOpenTaskAria",
                            "Open related task on the board"
                          )
                        : undefined
                    }
                    className={cn(
                      "w-full rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-start transition-colors",
                      boardHref
                        ? "cursor-pointer hover:border-border hover:bg-muted/25"
                        : "cursor-default opacity-95"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="mt-0.5 size-4 shrink-0 text-primary opacity-80" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">{n.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {n.message}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                          {format(new Date(n.createdAt), "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                      {!n.isRead ? <Badge>New</Badge> : null}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </ShellChrome>
    )
  }

  if (view === "members") {
    const members = membersData?.workspaceMembers ?? []
    return (
      <ShellChrome
        eyebrow={lv("eyebrowWorkspace", "Workspace")}
        title={lv("membersTitle", "Members")}
        subtitle={lv("membersSubtitle", "Workspace roster.")}
        footerNote={foot}
      >
        {!workspaceId ? (
          <p className="text-sm text-muted-foreground">
            {lv("tasksEmpty", "Open Board to sync workspace.")}
          </p>
        ) : membersLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {lv("membersEmpty", "None.")}
          </p>
        ) : (
          <>
            <p className="mb-4 text-xs text-muted-foreground">
              {isWorkspaceAdmin
                ? lv("membersAdminHint", "Admin: you can change roles.")
                : lv("membersReadHint", "Read-only roster.")}
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>{lv("membersColPerson", "Person")}</TableHead>
                    <TableHead className="w-[200px]">
                      {lv("membersColRole", "Role")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {m.user.name?.trim() || m.user.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {m.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isWorkspaceAdmin ? (
                          <Select
                            disabled={
                              assignLoading ||
                              (!!shellUser?.email &&
                                m.user.email.toLowerCase() ===
                                  shellUser.email.toLowerCase())
                            }
                            value={m.role.toUpperCase()}
                            onValueChange={(next) => {
                              void assignRole({
                                variables: {
                                  workspaceId,
                                  userId: m.user.id,
                                  role: next,
                                },
                              })
                            }}
                          >
                            <SelectTrigger className="h-9 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MEMBER">MEMBER</SelectItem>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{m.role}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </ShellChrome>
    )
  }

  if (view === "dashboard") {
    const kpiTasks = tasks.length
    const kpiGroups = board?.groups?.length ?? 0
    return (
      <ShellChrome
        eyebrow={lv("eyebrowWorkspace", "Workspace")}
        title={lv("dashboardTitle", "Dashboard")}
        subtitle={lv("dashboardSubtitle", "Snapshot.")}
        footerNote={foot}
      >
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">
            {lv("yourRole", "Your role")}: {viewerWorkspaceRole ?? "—"}
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                <ListTodo className="size-4 opacity-70" aria-hidden />
                {lv("kpiTasks", "Tasks")}
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {boardLoading ? "—" : kpiTasks}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {board?.name ?? "—"}
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                <Users className="size-4 opacity-70" aria-hidden />
                {lv("kpiGroups", "Groups")}
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {boardLoading ? "—" : kpiGroups}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {lv("kpiBoard", "Board")}
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                <LayoutDashboard className="size-4 opacity-70" aria-hidden />
                {lv("kpiBoard", "Board")}
              </CardDescription>
              <CardTitle className="truncate text-lg font-semibold leading-tight">
                {boardLoading ? "—" : (board?.name ?? "—")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Link
                  href={ensureLocalizedPathname(VIEW_TO_RELATIVE.board, locale)}
                  scroll={false}
                >
                  {dictionary.ecosystraApp.board}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ShellChrome>
    )
  }

  return null
}
