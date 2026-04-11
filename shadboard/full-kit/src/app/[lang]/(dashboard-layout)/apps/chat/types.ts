import type { FileType } from "@/types"
import type { z } from "zod"
import type { FilesUploaderSchema } from "./_schemas/files-uploader-schema"
import type { ImagesUploaderSchema } from "./_schemas/images-uploader-schema"
import type { TextMessageSchema } from "./_schemas/text-message-schema"

export interface ChatContextType {
  currentUser: UserType
  chatState: ChatStateType
  isChatSidebarOpen: boolean
  setIsChatSidebarOpen: (val: boolean) => void
  handleSelectChat: (chat: ChatType) => void
  handleAddTextMessage: (text: string) => Promise<void>
  handleAddImagesMessage: (images: FileType[]) => Promise<void>
  handleAddFilesMessage: (files: FileType[]) => Promise<void>
  /** Persist “read” cursor for this thread and refresh list state. */
  handleMarkThreadRead: (threadId: string) => Promise<void>
  refreshChats: () => Promise<void>
  /**
   * Create a thread with title, optional members (EcoUser ids), optional linked task (EcoItem).
   * Hydrates state and navigates to the new thread. Returns false on failure.
   */
  createThreadWithOptions: (opts: {
    name: string
    memberUserIds: string[]
    ecoItemId: string | null
  }) => Promise<boolean>
  /** Reply: next text message includes this id until cleared. */
  replyingTo: MessageType | null
  setReplyingTo: (message: MessageType | null) => void
  handleEditMessage: (
    threadId: string,
    messageId: string,
    text: string
  ) => Promise<void>
  handleDeleteMessage: (threadId: string, messageId: string) => Promise<void>
  handleForwardMessage: (
    sourceThreadId: string,
    messageId: string,
    targetThreadId: string
  ) => Promise<void>
  copyMessageToClipboard: (message: MessageType) => Promise<void>
  /** Mute / block this thread for the current user (persisted on EcoChatMember). */
  updateThreadPreferences: (
    threadId: string,
    prefs: { muted?: boolean; blocked?: boolean }
  ) => Promise<boolean>
}

export type ChatStatusType = "READ" | "DELIVERED" | "SENT" | null

export interface MessageType {
  id: string
  senderId: string
  text?: string
  images?: FileType[]
  files?: FileType[]
  voiceMessage?: FileType
  status: string
  createdAt: Date
  editedAt?: Date
  replyToMessageId?: string
  forwardedFromMessageId?: string
}

export type NewMessageType = Omit<
  MessageType,
  "id" | "senderId" | "createdAt" | "images" | "files" | "voiceMessage"
> & {
  images?: FileType[]
  files?: FileType[]
  voiceMessage?: FileType
}

export interface UserType {
  id: string
  name: string
  avatar?: string
  status: string
}

export interface LastMessageType {
  content: string
  createdAt: Date
}

export interface ChatType {
  id: string
  lastMessage: LastMessageType
  name: string
  avatar?: string
  status?: string
  messages: MessageType[]
  users: UserType[]
  typingUsers: UserType[]
  unreadCount?: number
  /** Notifications muted for this thread (viewer). */
  muted?: boolean
  /** Linked task (board item) when thread is tied to task management. */
  linkedTask?: {
    id: string
    name: string
    boardName?: string
  }
}

export interface ChatStateType {
  chats: ChatType[]
  selectedChat?: ChatType | null
}

export type ChatActionType =
  | {
      type: "selectChat"
      chat: ChatType
    }
  | {
      type: "hydrateChats"
      chats: ChatType[]
    }

export type TextMessageFormType = z.infer<typeof TextMessageSchema>

export type FilesUploaderFormType = z.infer<typeof FilesUploaderSchema>

export type ImagesUploaderFormType = z.infer<typeof ImagesUploaderSchema>
