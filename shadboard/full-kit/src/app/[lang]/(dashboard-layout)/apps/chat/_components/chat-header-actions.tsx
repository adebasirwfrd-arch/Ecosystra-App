"use client"

import { useState } from "react"
import { EllipsisVertical, Phone, Video } from "lucide-react"
import { toast } from "sonner"

import type { ChatType } from "../types"

import { useWebRtcCall } from "../_contexts/webrtc-call-context"
import { useChatContext } from "../_hooks/use-chat-context"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatThreadSearchDialog } from "./chat-thread-search-dialog"

export function ChatHeaderActions({ chat }: { chat: ChatType }) {
  const { startAudioCall, startVideoCall, status, channelReady } = useWebRtcCall()
  const { currentUser, updateThreadPreferences } = useChatContext()
  const busy = status !== "idle"
  const hasCallPeer = chat.users.some((u) => u.id !== currentUser.id)
  const signalingOk = channelReady

  const [searchOpen, setSearchOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)

  const muted = chat.muted ?? false

  return (
    <>
      <div className="flex gap-1 ms-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Voice call"
          title={
            !hasCallPeer
              ? "Add people to this chat to start a call"
              : !signalingOk
                ? "Connecting signaling — wait a moment"
                : "Voice call"
          }
          disabled={busy || !hasCallPeer || !signalingOk}
          onClick={() => void startAudioCall()}
        >
          <Phone className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Video call"
          title={
            !hasCallPeer
              ? "Add people to this chat to start a call"
              : !signalingOk
                ? "Connecting signaling — wait a moment"
                : "Video call"
          }
          disabled={busy || !hasCallPeer || !signalingOk}
          onClick={() => void startVideoCall()}
        >
          <Video className="size-4" />
        </Button>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="self-center" asChild>
            <Button variant="ghost" size="icon" aria-label="More actions">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setSearchOpen(true)
              }}
            >
              Search
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault()
                toast.message("Report received — we will review this chat.")
              }}
            >
              Report
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                void updateThreadPreferences(chat.id, { muted: !muted })
              }}
            >
              {muted ? "Unmute" : "Mute"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault()
                setBlockOpen(true)
              }}
            >
              Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChatThreadSearchDialog
        chat={chat}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <AlertDialog
        open={blockOpen}
        onOpenChange={(o) => {
          setBlockOpen(o)
          if (!o) {
            queueMicrotask(() => {
              document.body.style.removeProperty("pointer-events")
            })
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              It will disappear from your list. You can unblock it later from
              the sidebar menu &quot;Blocked chats&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setBlockOpen(false)
                void updateThreadPreferences(chat.id, { blocked: true })
              }}
            >
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
