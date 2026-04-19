"use client"

import { useMemo, useState } from "react"

import type { ChatType, MessageType } from "../types"

import { formatDistance } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

function snippet(m: MessageType): string {
  if (m.text?.trim()) return m.text.trim().slice(0, 160)
  if (m.images?.length) return m.images.length > 1 ? "Photos" : "Photo"
  if (m.files?.length) return m.files.map((f) => f.name).join(", ")
  if (m.voiceMessage) return "Voice message"
  return "Message"
}

function matchesQuery(m: MessageType, q: string): boolean {
  const s = q.trim().toLowerCase()
  if (!s) return false
  if (m.text?.toLowerCase().includes(s)) return true
  if (m.images?.some((i) => i.name.toLowerCase().includes(s))) return true
  if (m.files?.some((f) => f.name.toLowerCase().includes(s))) return true
  return false
}

export function ChatThreadSearchDialog({
  chat,
  open,
  onOpenChange,
}: {
  chat: ChatType
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    return chat.messages.filter((m) => matchesQuery(m, query))
  }, [chat.messages, query])

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) {
          setQuery("")
          queueMicrotask(() => {
            document.body.style.removeProperty("pointer-events")
          })
        }
      }}
    >
      <DialogContent
        className="rounded-lg sm:max-w-md"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Search in this chat</DialogTitle>
          <DialogDescription>
            Find messages by text or attachment name.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-accent"
          autoFocus
        />
        <ScrollArea className="max-h-64 rounded-md border">
          <ul className="p-2 space-y-2 text-sm">
            {!query.trim() && (
              <li className="text-muted-foreground px-2 py-4 text-center">
                Type to search
              </li>
            )}
            {query.trim() && results.length === 0 && (
              <li className="text-muted-foreground px-2 py-4 text-center">
                No results
              </li>
            )}
            {results.map((m) => (
              <li
                key={m.id}
                className="rounded-md border bg-muted/30 px-2 py-1.5"
              >
                <p className="line-clamp-2 text-foreground">{snippet(m)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistance(m.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
