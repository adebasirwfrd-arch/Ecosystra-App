import type { ReactNode } from "react"
import type { MessageType } from "../types"

import { cn } from "@/lib/utils"

import { MessageBubbleContentFiles } from "./message-bubble-content-files"
import { MessageBubbleContentImages } from "./message-bubble-content-images"
import { MessageBubbleContentText } from "./message-bubble-content-text"

function parentSnippet(m: MessageType): string {
  if (m.text?.trim()) return m.text.trim().slice(0, 120)
  if (m.images?.length) return m.images.length > 1 ? "Photos" : "Photo"
  if (m.files?.length) return "File"
  return "Message"
}

export function MessageBubbleContent({
  message,
  isByCurrentUser,
  replyToMessage,
  replySenderName,
}: {
  message: MessageType
  isByCurrentUser: boolean
  replyToMessage?: MessageType
  replySenderName?: string
}) {
  const blocks: ReactNode[] = []

  if (message.forwardedFromMessageId) {
    blocks.push(
      <p
        key="fwd"
        className="text-xs font-medium text-muted-foreground border-b border-border/60 pb-1 mb-1"
      >
        Forwarded
      </p>
    )
  }

  if (replyToMessage) {
    const who = replySenderName?.trim() || "User"
    blocks.push(
      <div
        key="reply"
        className="text-xs opacity-90 border-l-2 border-current pl-2 mb-1 space-y-0.5"
      >
        <span className="font-medium block">{who}</span>
        <span className="line-clamp-2">{parentSnippet(replyToMessage)}</span>
      </div>
    )
  }

  if (message.text) {
    blocks.push(
      <MessageBubbleContentText key="text" text={message.text} />
    )
  }
  if (message.images?.length) {
    blocks.push(
      <MessageBubbleContentImages key="img" images={message.images} />
    )
  }
  if (message.files?.length) {
    blocks.push(
      <MessageBubbleContentFiles
        key="files"
        files={message.files}
        isByCurrentUser={isByCurrentUser}
      />
    )
  }
  if (message.voiceMessage) {
    blocks.push(
      <audio
        key="voice"
        controls
        src={message.voiceMessage.url}
        className="w-full"
      />
    )
  }

  const content =
    blocks.length > 0 ? (
      <div className="space-y-2">{blocks}</div>
    ) : null

  return (
    <div
      className={cn(
        "text-sm text-accent-foreground bg-accent p-2 space-y-2 rounded-lg break-all",
        isByCurrentUser
          ? "bg-primary text-primary-foreground rounded-se-none"
          : "rounded-ss-none"
      )}
    >
      {content}
      {message.editedAt && (
        <p className="text-[10px] opacity-70 pt-1">Edited</p>
      )}
    </div>
  )
}
