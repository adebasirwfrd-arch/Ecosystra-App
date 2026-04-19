"use client"

import { useState } from "react"

import type { ChatType } from "../types"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MessageForwardDialog({
  open,
  onOpenChange,
  chats,
  currentThreadId,
  onForward,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  chats: ChatType[]
  currentThreadId: string
  onForward: (targetThreadId: string) => void
}) {
  const targets = chats.filter((c) => c.id !== currentThreadId)
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setPicked(null)
      }}
    >
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
          <DialogDescription>
            Choose a chat to forward this message to.
          </DialogDescription>
        </DialogHeader>
        {targets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create another chat first to forward messages.
          </p>
        ) : (
          <>
            <ScrollArea className="max-h-60 rounded-md border">
              <ul className="p-2 space-y-1">
                {targets.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setPicked(c.id)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        picked === c.id ? "bg-accent" : "hover:bg-muted"
                      }`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <Button
              className="w-full"
              disabled={!picked}
              onClick={() => {
                if (picked) {
                  onForward(picked)
                  onOpenChange(false)
                  setPicked(null)
                }
              }}
            >
              Forward
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
