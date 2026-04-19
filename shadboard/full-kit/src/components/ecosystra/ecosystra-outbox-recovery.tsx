"use client"

import { type ApolloClient, useApolloClient } from "@apollo/client"
import { useEffect } from "react"

import { isBoardLocalDbAvailable } from "@/lib/ecosystra/board-local-db"
import { scheduleUpdateItemDynamicDataDrain } from "@/lib/ecosystra/board-mutation-outbox-drain"

/**
 * God-mode recovery: flush Dexie mutation outbox on mount and whenever the browser
 * goes online again (e.g. user closed tab offline and reopened days later).
 */
export function EcosystraOutboxRecovery() {
  const client = useApolloClient()

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncOfflineMutations = () => {
      if (!isBoardLocalDbAvailable()) return
      scheduleUpdateItemDynamicDataDrain(client as ApolloClient<object>)
    }

    syncOfflineMutations()
    window.addEventListener("online", syncOfflineMutations)
    return () => window.removeEventListener("online", syncOfflineMutations)
  }, [client])

  return null
}
