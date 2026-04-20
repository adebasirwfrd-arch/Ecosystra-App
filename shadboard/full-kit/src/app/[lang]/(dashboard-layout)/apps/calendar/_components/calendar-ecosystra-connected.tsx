"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import type { GqlBoard } from "@/components/ecosystra/hooks/use-ecosystra-board-apollo"
import type { EventType } from "../types"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"
import { GET_OR_CREATE_BOARD } from "@/lib/ecosystra/board-gql"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { boardToCalendarEvents } from "../_lib/board-to-calendar-events"
import { CalendarContent } from "./calendar-content"
import { CalendarHeader } from "./calendar-header"
import { CalendarWrapper } from "./calendar-wrapper"

type BoardQuery = { getOrCreateBoard: GqlBoard }

function gqlErr(e: unknown): string {
  const x = e as { graphQLErrors?: { message?: string }[]; message?: string }
  return x.graphQLErrors?.[0]?.message ?? x.message ?? "Request failed"
}

export function CalendarEcosystraConnected() {
  const client = useMemo(() => createEcosystraGraphqlClient(), [])
  const [board, setBoard] = useState<GqlBoard | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchBoardEvents = useCallback(async () => {
    const { data } = await client.query<BoardQuery>({
      query: GET_OR_CREATE_BOARD,
      fetchPolicy: "network-only",
    })
    setBoard(data.getOrCreateBoard)
  }, [client])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        await refetchBoardEvents()
      } catch (e) {
        if (!cancelled) setError(gqlErr(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refetchBoardEvents])

  const events: EventType[] = useMemo(
    () => boardToCalendarEvents(board),
    [board]
  )

  if (loading) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <CalendarWrapper
      events={events}
      allowAddEvent={false}
      refetchBoardEvents={() => void refetchBoardEvents()}
    >
      <Card>
        <CalendarHeader />
        <CalendarContent />
      </Card>
    </CalendarWrapper>
  )
}
