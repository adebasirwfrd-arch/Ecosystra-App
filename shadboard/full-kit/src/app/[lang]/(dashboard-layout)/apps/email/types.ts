import type { DynamicIconNameType } from "@/types"
import type { z } from "zod"
import type { EmailComposerSchema } from "./_schemas/email-composer-schema"
import type { EmailListSearchSchema } from "./_schemas/email-list-search-schema"

export interface UserType {
  id: string
  name: string
  avatar?: string
  email: string
  status: string
}

export interface EmailAttachmentItem {
  fileName: string
  mimeType: string
  contentBase64: string
}

export interface EmailType {
  id: string
  sender: UserType
  recipientId?: string
  subject: string
  content: string
  read: boolean
  starred: boolean
  createdAt: Date | string
  label?: "personal" | "important" | "work" | string
  isDraft: boolean
  isSent: boolean
  isStarred: boolean
  isSpam: boolean
  isDeleted: boolean
  muted?: boolean
  cc?: string | null
  bcc?: string | null
  attachments?: EmailAttachmentItem[] | unknown
}

export interface EmailStateType {
  /** Full list for the active folder (from GraphQL). */
  emails: EmailType[]
  selectedEmails: EmailType[]
  sidebarItems: EmailSidebarItemsType
  listSearchTerm: string
  loading: boolean
}

export interface EmailSidebarItemType {
  iconName: DynamicIconNameType
  name: string
  unreadCount: number
}

export interface EmailSidebarItemsType {
  folders: Array<EmailSidebarItemType>
  labels: Array<EmailSidebarItemType>
}

export interface EmailContextType {
  emailState: EmailStateType
  isEmailSidebarOpen: boolean
  setIsEmailSidebarOpen: (val: boolean) => void
  handleGetFilteredEmails: (filter: string, currentPage: number) => void
  handleGetFilteredEmailsBySearchTerm: (
    term: string,
    filter: string,
    currentPage: number
  ) => void
  handleToggleSelectEmail: (email: EmailType) => void
  /** Select all emails in the current filtered list, or clear selection if already all selected. */
  handleToggleSelectAllFiltered: (filteredEmails: EmailType[]) => void
  handleToggleStarEmail: (email: EmailType) => void
  handleSetRead: (email: EmailType) => void
  handleMarkEmailUnread: (email: EmailType) => Promise<void>
  handleSendEmail: (
    to: string,
    subject: string,
    content: string,
    label?: string,
    cc?: string,
    bcc?: string,
    attachments?: EmailAttachmentItem[]
  ) => Promise<boolean>
  handleDeleteEmail: (email: EmailType) => void
  handleArchiveEmail: (email: EmailType) => Promise<void>
  handleMarkEmailSpam: (email: EmailType) => Promise<void>
  /** Persist label for sidebar filters (personal / important / work); pass empty string to clear. */
  handleSetEmailLabel: (email: EmailType, label: string) => Promise<void>
  handleToggleMuteEmail: (email: EmailType) => Promise<void>
  handleBulkArchive: () => Promise<void>
  handleBulkMarkSpam: () => Promise<void>
  handleBulkDelete: () => Promise<void>
  setListSearchTerm: (term: string) => void
  refetchEmails: () => void
}

export type EmailActionType =
  | {
      type: "setEmails"
      emails: EmailType[]
      sidebarItems: EmailSidebarItemsType
    }
  | {
      type: "setLoading"
      loading: boolean
    }
  | {
      type: "toggleSelectEmail"
      email: EmailType
    }
  | {
      type: "toggleStarEmail"
      email: EmailType
    }
  | {
      type: "toggleSelectFiltered"
      filtered: EmailType[]
    }
  | {
      type: "setRead"
      email: EmailType
    }
  | {
      type: "removeEmail"
      emailId: string
    }
  | {
      type: "setListSearchTerm"
      term: string
    }

export type EmailComposerFormType = z.infer<typeof EmailComposerSchema>

export type EmailListSearchFormType = z.infer<typeof EmailListSearchSchema>
