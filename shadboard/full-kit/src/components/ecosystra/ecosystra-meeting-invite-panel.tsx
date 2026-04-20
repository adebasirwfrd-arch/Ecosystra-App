"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@apollo/client"
import { toast } from "sonner"
import { Copy, Loader2, Mail, UserPlus } from "lucide-react"

import type { LocaleType } from "@/types"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"
import { WORKSPACE_MEMBERS_LIST } from "@/lib/ecosystra/board-gql"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { sanitizeZegoUserId } from "@/lib/ecosystra/zego-user-id"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type MemberRow = {
  user: { id: string; name: string | null; email: string }
}

export type MeetingInviteContext = {
  workspaceId: string
  taskTitle: string
  groupName: string | null
  personUserIds: string[]
}

export function EcosystraMeetingInvitePanel({
  roomId,
  invite,
  joinedZegoUserIds,
  currentUserId,
}: {
  roomId: string
  invite: MeetingInviteContext
  joinedZegoUserIds: ReadonlySet<string>
  currentUserId: string
}) {
  const params = useParams()
  const lang = (params.lang as LocaleType) || "en"
  const client = useMemo(() => createEcosystraGraphqlClient(), [])
  const [emailInput, setEmailInput] = useState("")
  const [sending, setSending] = useState(false)

  const { data: membersData, loading: membersLoading } = useQuery<{
    workspaceMembers: MemberRow[]
  }>(WORKSPACE_MEMBERS_LIST, {
    client,
    variables: { workspaceId: invite.workspaceId },
    skip: !invite.workspaceId,
  })

  const joinUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    const q = new URLSearchParams({
      room: roomId,
      title: invite.taskTitle,
    })
    const path = `/apps/calendar/meeting/join?${q.toString()}`
    return `${window.location.origin}${ensureLocalizedPathname(path, lang)}`
  }, [roomId, invite.taskTitle, lang])

  const roster = useMemo(() => {
    const list = membersData?.workspaceMembers ?? []
    const map = new Map<string, { name: string; email: string }>()
    for (const row of list) {
      const u = row.user
      map.set(u.id, {
        name: u.name?.trim() || u.email,
        email: u.email,
      })
    }
    return map
  }, [membersData?.workspaceMembers])

  const peopleRows = useMemo(() => {
    return invite.personUserIds.map((id) => {
      const r = roster.get(id)
      const inCall = joinedZegoUserIds.has(sanitizeZegoUserId(id))
      return {
        id,
        name: r?.name ?? id.slice(0, 8),
        email: r?.email ?? null,
        inCall,
        isSelf: id === currentUserId,
      }
    })
  }, [invite.personUserIds, roster, joinedZegoUserIds, currentUserId])

  const copyLink = async () => {
    if (!joinUrl) return
    try {
      await navigator.clipboard.writeText(joinUrl)
      toast.success("Meeting link copied")
    } catch {
      toast.error("Could not copy link")
    }
  }

  const sendInvites = async (emails: string[]) => {
    const clean = [...new Set(emails.map((e) => e.trim().toLowerCase()))].filter(
      Boolean
    )
    if (clean.length === 0) {
      toast.error("Add at least one email address")
      return
    }
    if (!joinUrl) {
      toast.error("Could not build join link")
      return
    }
    setSending(true)
    try {
      const res = await fetch("/api/meeting/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          taskTitle: invite.taskTitle,
          groupName: invite.groupName,
          recipientEmails: clean,
          joinUrl,
        }),
      })
      const body = (await res.json()) as {
        sent?: number
        failed?: number
        error?: string
      }
      if (!res.ok) {
        toast.error(body.error ?? "Failed to send invites")
        return
      }
      toast.success(
        `Sent ${body.sent ?? 0} invitation(s)${body.failed ? `, ${body.failed} failed` : ""}`
      )
    } catch {
      toast.error("Network error")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex max-h-[min(70vh,520px)] w-full max-w-sm flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-lg">
      <div className="flex items-center gap-2">
        <UserPlus className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-semibold">Invite people</span>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Meeting link</Label>
        <div className="flex gap-1">
          <Input
            readOnly
            value={joinUrl}
            className="h-8 font-mono text-[10px]"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => void copyLink()}
            aria-label="Copy meeting link"
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">
          People on this task
        </Label>
        <ScrollArea className="h-[140px] rounded-md border border-border/60">
          <ul className="divide-y divide-border/60 p-1">
            {membersLoading ? (
              <li className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Loading roster…
              </li>
            ) : peopleRows.length === 0 ? (
              <li className="p-2 text-xs text-muted-foreground">
                No owner or assignees on this task.
              </li>
            ) : (
              peopleRows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2 pe-1 ps-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium">{row.name}</div>
                    {row.email ? (
                      <div className="truncate text-[10px] text-muted-foreground">
                        {row.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {row.isSelf ? (
                      <Badge variant="outline" className="text-[10px]">
                        You
                      </Badge>
                    ) : row.inCall ? (
                      <Badge variant="secondary" className="text-[10px]">
                        In call
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Not joined
                      </Badge>
                    )}
                    {row.email && !row.isSelf ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={sending}
                        title="Send email invite"
                        onClick={() => void sendInvites([row.email!])}
                      >
                        <Mail className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="eco-meet-invite-email" className="text-xs">
          Invite by email
        </Label>
        <Input
          id="eco-meet-invite-email"
          placeholder="colleague@company.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="h-9"
        />
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          size="sm"
          disabled={sending}
          onClick={() => {
            void sendInvites(emailInput.split(/[\s,;]+/))
            setEmailInput("")
          }}
        >
          {sending ? (
            <Loader2 className="me-2 size-4 animate-spin" />
          ) : (
            <Mail className="me-2 size-4" />
          )}
          Send invitation
        </Button>
      </div>
    </div>
  )
}
