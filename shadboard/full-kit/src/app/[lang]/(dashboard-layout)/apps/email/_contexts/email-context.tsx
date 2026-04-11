"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"

import type { ReactNode } from "react"
import type { EmailAttachmentItem, EmailContextType, EmailType } from "../types"

import { EmailReducer } from "../_reducers/email-reducer"
import {
  fetchEmails,
  fetchEmailCounts,
  buildSidebarItems,
  toggleStarMutation,
  markReadMutation,
  markEmailAsUnreadMutation,
  deleteEmailMutation,
  sendEmailMutation,
  archiveEmailMutation,
  markEmailAsSpamMutation,
  setEmailLabelMutation,
  toggleMuteEmailMutation,
} from "../_lib/email-gql"
import { toast } from "@/hooks/use-toast"

export const EmailContext = createContext<EmailContextType | undefined>(
  undefined
)

export function EmailProvider({
  apiAccessToken,
  children,
}: {
  apiAccessToken: string | null
  children: ReactNode
}) {
  const tokenRef = useRef(apiAccessToken)
  const currentFilterRef = useRef("inbox")

  useEffect(() => {
    tokenRef.current = apiAccessToken ?? null
  }, [apiAccessToken])

  const [emailState, dispatch] = useReducer(EmailReducer, {
    emails: [],
    selectedEmails: [],
    sidebarItems: {
      folders: [
        { iconName: "Inbox", name: "inbox", unreadCount: 0 },
        { iconName: "Send", name: "sent", unreadCount: 0 },
        { iconName: "File", name: "draft", unreadCount: 0 },
        { iconName: "Star", name: "starred", unreadCount: 0 },
        { iconName: "AlertOctagon", name: "spam", unreadCount: 0 },
        { iconName: "Trash2", name: "trash", unreadCount: 0 },
      ],
      labels: [
        { iconName: "User", name: "personal", unreadCount: 0 },
        { iconName: "Briefcase", name: "work", unreadCount: 0 },
        { iconName: "AlertTriangle", name: "important", unreadCount: 0 },
      ],
    },
    listSearchTerm: "",
    loading: true,
  })

  const [isEmailSidebarOpen, setIsEmailSidebarOpen] = useState(false)

  const loadEmails = useCallback(
    async (filter: string, resetSearch: boolean, silent = false) => {
      if (!silent) {
        dispatch({ type: "setLoading", loading: true })
      }
      if (resetSearch) {
        dispatch({ type: "setListSearchTerm", term: "" })
      }
      try {
        const [emails, counts] = await Promise.all([
          fetchEmails(filter, tokenRef.current),
          fetchEmailCounts(tokenRef.current),
        ])
        const sidebarItems = buildSidebarItems(counts)
        dispatch({ type: "setEmails", emails, sidebarItems })
      } catch (e) {
        console.error("[email] load failed", e)
        if (!silent) {
          dispatch({ type: "setLoading", loading: false })
        }
      }
    },
    []
  )

  const setListSearchTerm = useCallback((term: string) => {
    dispatch({ type: "setListSearchTerm", term })
  }, [])

  const handleGetFilteredEmails = useCallback(
    (filter: string, _currentPage: number) => {
      currentFilterRef.current = filter
      void loadEmails(filter, true)
    },
    [loadEmails]
  )

  const handleGetFilteredEmailsBySearchTerm = useCallback(
    (term: string, filter: string, _currentPage: number) => {
      currentFilterRef.current = filter
      setListSearchTerm(term)
      if (!term.trim()) {
        void loadEmails(filter, false)
      }
    },
    [loadEmails, setListSearchTerm]
  )

  const handleToggleSelectEmail = useCallback((email: EmailType) => {
    dispatch({ type: "toggleSelectEmail", email })
  }, [])

  const handleToggleSelectAllFiltered = useCallback((filtered: EmailType[]) => {
    dispatch({ type: "toggleSelectFiltered", filtered })
  }, [])

  const handleToggleStarEmail = useCallback(
    async (email: EmailType) => {
      dispatch({ type: "toggleStarEmail", email })
      try {
        await toggleStarMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
      } catch (e) {
        console.error("[email] star failed", e)
        dispatch({ type: "toggleStarEmail", email })
      }
    },
    [loadEmails]
  )

  const handleSetRead = useCallback(
    async (email: EmailType) => {
      dispatch({ type: "setRead", email })
      try {
        await markReadMutation(email.id, tokenRef.current)
      } catch (e) {
        console.error("[email] mark read failed", e)
      }
    },
    []
  )

  const handleMarkEmailUnread = useCallback(
    async (email: EmailType) => {
      try {
        await markEmailAsUnreadMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
      } catch (e) {
        console.error("[email] mark unread failed", e)
      }
    },
    [loadEmails]
  )

  const handleSendEmail = useCallback(
    async (
      to: string,
      subject: string,
      content: string,
      label?: string,
      cc?: string,
      bcc?: string,
      attachments?: EmailAttachmentItem[]
    ): Promise<boolean> => {
      try {
        await sendEmailMutation(
          to,
          subject,
          content,
          label,
          tokenRef.current,
          cc,
          bcc,
          attachments
        )
        await loadEmails(currentFilterRef.current, false, true)
        return true
      } catch (e) {
        console.error("[email] send failed", e)
        return false
      }
    },
    [loadEmails]
  )

  const handleDeleteEmail = useCallback(
    async (email: EmailType) => {
      dispatch({ type: "removeEmail", emailId: email.id })
      try {
        await deleteEmailMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
      } catch (e) {
        console.error("[email] delete failed", e)
        await loadEmails(currentFilterRef.current, false, true)
      }
    },
    [loadEmails]
  )

  const handleArchiveEmail = useCallback(
    async (email: EmailType) => {
      dispatch({ type: "removeEmail", emailId: email.id })
      try {
        await archiveEmailMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
      } catch (e) {
        console.error("[email] archive failed", e)
        await loadEmails(currentFilterRef.current, false, true)
      }
    },
    [loadEmails]
  )

  const handleMarkEmailSpam = useCallback(
    async (email: EmailType) => {
      dispatch({ type: "removeEmail", emailId: email.id })
      try {
        await markEmailAsSpamMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
      } catch (e) {
        console.error("[email] mark spam failed", e)
        await loadEmails(currentFilterRef.current, false, true)
      }
    },
    [loadEmails]
  )

  const handleSetEmailLabel = useCallback(
    async (email: EmailType, label: string) => {
      try {
        await setEmailLabelMutation(email.id, label, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
        const trimmed = label.trim().toLowerCase()
        const name =
          trimmed === "personal" || trimmed === "work" || trimmed === "important"
            ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
            : null
        toast({
          title: name ? "Label applied" : "Label removed",
          description: name
            ? `This message is now in ${name}.`
            : "The label was cleared for this message.",
        })
      } catch (e) {
        console.error("[email] set label failed", e)
        toast({
          title: "Could not update label",
          description:
            e instanceof Error ? e.message : "Check your connection and try again.",
          variant: "destructive",
        })
      }
    },
    [loadEmails]
  )

  const handleToggleMuteEmail = useCallback(
    async (email: EmailType) => {
      const wasMuted = email.muted === true
      try {
        await toggleMuteEmailMutation(email.id, tokenRef.current)
        await loadEmails(currentFilterRef.current, false, true)
        toast({
          title: wasMuted ? "Thread unmuted" : "Thread muted",
          description: wasMuted
            ? "This conversation can appear in your inbox again."
            : "Muted threads stay out of the main inbox.",
        })
      } catch (e) {
        console.error("[email] toggle mute failed", e)
        toast({
          title: "Could not update mute",
          description:
            e instanceof Error ? e.message : "Check your connection and try again.",
          variant: "destructive",
        })
      }
    },
    [loadEmails]
  )

  const handleBulkArchive = useCallback(async () => {
    const ids = emailState.selectedEmails.map((e) => e.id)
    if (!ids.length) return
    try {
      for (const id of ids) {
        await archiveEmailMutation(id, tokenRef.current)
      }
      await loadEmails(currentFilterRef.current, false, true)
    } catch (e) {
      console.error("[email] bulk archive failed", e)
      await loadEmails(currentFilterRef.current, false, true)
    }
  }, [emailState.selectedEmails, loadEmails])

  const handleBulkMarkSpam = useCallback(async () => {
    const ids = emailState.selectedEmails.map((e) => e.id)
    if (!ids.length) return
    try {
      for (const id of ids) {
        await markEmailAsSpamMutation(id, tokenRef.current)
      }
      await loadEmails(currentFilterRef.current, false, true)
    } catch (e) {
      console.error("[email] bulk spam failed", e)
      await loadEmails(currentFilterRef.current, false, true)
    }
  }, [emailState.selectedEmails, loadEmails])

  const handleBulkDelete = useCallback(async () => {
    const list = [...emailState.selectedEmails]
    if (!list.length) return
    try {
      for (const email of list) {
        await deleteEmailMutation(email.id, tokenRef.current)
      }
      await loadEmails(currentFilterRef.current, false, true)
    } catch (e) {
      console.error("[email] bulk delete failed", e)
      await loadEmails(currentFilterRef.current, false, true)
    }
  }, [emailState.selectedEmails, loadEmails])

  const refetchEmails = useCallback(() => {
    void loadEmails(currentFilterRef.current, false, true)
  }, [loadEmails])

  return (
    <EmailContext.Provider
      value={{
        emailState,
        handleGetFilteredEmails,
        handleGetFilteredEmailsBySearchTerm,
        handleToggleSelectEmail,
        handleToggleSelectAllFiltered,
        handleToggleStarEmail,
        handleSetRead,
        handleMarkEmailUnread,
        handleSendEmail,
        handleDeleteEmail,
        handleArchiveEmail,
        handleMarkEmailSpam,
        handleSetEmailLabel,
        handleToggleMuteEmail,
        handleBulkArchive,
        handleBulkMarkSpam,
        handleBulkDelete,
        setListSearchTerm,
        isEmailSidebarOpen,
        setIsEmailSidebarOpen,
        refetchEmails,
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}
