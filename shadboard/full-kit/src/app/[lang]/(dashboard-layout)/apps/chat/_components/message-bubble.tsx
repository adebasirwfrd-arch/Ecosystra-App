"use client"

import { useState } from "react"
import { EllipsisVertical } from "lucide-react"
import { toast } from "sonner"

import type { MessageType, UserType } from "../types"

import { cn, formatDistance, getInitials } from "@/lib/utils"

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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatAvatar } from "./chat-avatar"
import { MessageBubbleContent } from "./message-bubble-content"
import { MessageBubbleStatusIcon } from "./message-bubble-status-icon"
import { MessageForwardDialog } from "./message-forward-dialog"
import { useChatContext } from "../_hooks/use-chat-context"

export function MessageBubble({
  threadId,
  sender,
  message,
  isByCurrentUser,
  replyToMessage,
  replySenderName,
}: {
  threadId: string
  sender: UserType
  message: MessageType
  isByCurrentUser: boolean
  /** Parent message when this is a reply (same thread). */
  replyToMessage?: MessageType
  replySenderName?: string
}) {
  const {
    setReplyingTo,
    handleEditMessage,
    handleDeleteMessage,
    handleForwardMessage,
    copyMessageToClipboard,
    chatState,
  } = useChatContext()

  const [editOpen, setEditOpen] = useState(false)
  const [editText, setEditText] = useState("")
  const [forwardOpen, setForwardOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const openEdit = () => {
    setEditText(message.text ?? "")
    setEditOpen(true)
  }

  const saveEdit = async () => {
    await handleEditMessage(threadId, message.id, editText)
    setEditOpen(false)
  }

  return (
    <>
      <li className={cn("flex gap-2", isByCurrentUser && "flex-row-reverse")}>
        <ChatAvatar
          src={sender.avatar}
          fallback={getInitials(sender.name)}
          status={sender.status}
          size={1.75}
          className="shrink-0"
        />
        <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <span
            className={cn(
              "text-sm font-semibold text-foreground",
              isByCurrentUser && "text-end"
            )}
          >
            {sender.name}
          </span>
          <MessageBubbleContent
            message={message}
            isByCurrentUser={isByCurrentUser}
            replyToMessage={replyToMessage}
            replySenderName={replySenderName}
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-normal text-muted-foreground">
              {formatDistance(message.createdAt)}
            </span>
            {isByCurrentUser && (
              <MessageBubbleStatusIcon status={message.status} />
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="mt-8" asChild>
            <Button variant="ghost" size="icon" aria-label="More actions">
              <EllipsisVertical className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isByCurrentUser ? "start" : "end"}>
            {isByCurrentUser && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  openEdit()
                }}
              >
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setReplyingTo(message)
              }}
            >
              Reply
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setForwardOpen(true)
              }}
            >
              Forward
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                void copyMessageToClipboard(message)
              }}
            >
              Copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isByCurrentUser && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault()
                  toast.message("Report received — thank you.")
                }}
              >
                Report
              </DropdownMenuItem>
            )}
            {isByCurrentUser && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault()
                  setDeleteOpen(true)
                }}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-lg sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor={`edit-msg-${message.id}`}>Text</Label>
            <Input
              id={`edit-msg-${message.id}`}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={280}
              className="bg-accent"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveEdit()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MessageForwardDialog
        open={forwardOpen}
        onOpenChange={setForwardOpen}
        chats={chatState.chats}
        currentThreadId={threadId}
        onForward={(targetThreadId) =>
          void handleForwardMessage(threadId, message.id, targetThreadId)
        }
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the message for everyone in this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteMessage(threadId, message.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
