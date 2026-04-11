"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"

import type { EmailType } from "../types"

import { fetchEmailById } from "../_lib/email-gql"
import { useEmailContext } from "../_hooks/use-email-context"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmailNotFound } from "./email-not-found"
import { EmailViewContent } from "./email-view-content"
import { EmailViewHeader } from "./email-view-header"

export function EmailView() {
  const { emailState } = useEmailContext()
  const params = useParams()
  const { data: session, status } = useSession()

  const emailIdParam = params.id as string | undefined
  const [remoteEmail, setRemoteEmail] = useState<EmailType | null>(null)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [fetchingRemote, setFetchingRemote] = useState(false)

  const fromList = useMemo(() => {
    if (!emailIdParam) return null
    return emailState.emails.find((e) => e.id === emailIdParam) ?? null
  }, [emailIdParam, emailState.emails])

  const hasListCopy = fromList != null

  const refreshDetailFromServer = useCallback(async () => {
    if (!emailIdParam || hasListCopy) return
    try {
      const row = await fetchEmailById(
        emailIdParam,
        session?.apiAccessToken ?? null
      )
      if (row) setRemoteEmail(row)
    } catch {
      /* keep previous remoteEmail */
    }
  }, [emailIdParam, hasListCopy, session?.apiAccessToken])

  useEffect(() => {
    if (!emailIdParam || fromList) {
      setRemoteEmail(null)
      setFetchFailed(false)
      setFetchingRemote(false)
      return
    }
    if (status === "loading") return

    let cancelled = false
    setFetchFailed(false)
    setFetchingRemote(true)

    void (async () => {
      try {
        const row = await fetchEmailById(
          emailIdParam,
          session?.apiAccessToken ?? null
        )
        if (cancelled) return
        if (row) {
          setRemoteEmail(row)
          setFetchFailed(false)
        } else {
          setRemoteEmail(null)
          setFetchFailed(true)
        }
      } catch {
        if (!cancelled) {
          setRemoteEmail(null)
          setFetchFailed(true)
        }
      } finally {
        if (!cancelled) setFetchingRemote(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [emailIdParam, fromList, status, session?.apiAccessToken])

  const email = fromList ?? remoteEmail

  if (!emailIdParam) {
    return <EmailNotFound />
  }

  if (fetchFailed) {
    return <EmailNotFound />
  }

  if (!email && (status === "loading" || fetchingRemote || (fromList === null && emailIdParam))) {
    return (
      <Card className="flex-1 w-full md:w-auto p-6 space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    )
  }

  if (!email) {
    return <EmailNotFound />
  }

  return (
    <Card className="flex-1 w-full md:w-auto">
      <EmailViewHeader email={email} />
      <EmailViewContent
        email={email}
        onAfterDetailMutation={
          hasListCopy ? undefined : refreshDetailFromServer
        }
      />
    </Card>
  )
}
