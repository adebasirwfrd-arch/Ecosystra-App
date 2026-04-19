"use client"

import { useCallback, useEffect, useState } from "react"

import { useChatContext } from "../_hooks/use-chat-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatBlockedChatsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { updateThreadPreferences } = useChatContext()
  const [threads, setThreads] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/chat/blocked")
      if (!res.ok) {
        setThreads([])
        return
      }
      const data = (await res.json()) as { threads?: { id: string; name: string }[] }
      setThreads(data.threads ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Blocked chats</DialogTitle>
          <DialogDescription>
            Chats you have blocked are hidden from the list. Unblock to show them
            again.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Loading…
          </p>
        ) : threads.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No blocked chats
          </p>
        ) : (
          <ScrollArea className="max-h-60 rounded-md border">
            <ul className="p-2 space-y-2">
              {threads.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5"
                >
                  <span className="truncate text-sm font-medium">{t.name}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      const ok = await updateThreadPreferences(t.id, {
                        blocked: false,
                      })
                      if (ok) void load()
                    }}
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
