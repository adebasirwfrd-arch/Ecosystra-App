"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useApolloClient } from "@apollo/client"

import type { ReactNode } from "react"

import { ME_NAV_BOOTSTRAP } from "@/lib/ecosystra/board-gql"

export type WorkspaceMemberRole = "ADMIN" | "MEMBER" | string

type Ctx = {
  workspaceId: string | null
  viewerWorkspaceRole: WorkspaceMemberRole | null
  setBoardAccess: (workspaceId: string, role: string) => void
  isWorkspaceAdmin: boolean
}

const EcosystraWorkspaceNavContext = createContext<Ctx | null>(null)

export function EcosystraWorkspaceNavProvider({
  children,
}: {
  children: ReactNode
}) {
  const client = useApolloClient()
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [viewerWorkspaceRole, setViewerWorkspaceRole] =
    useState<WorkspaceMemberRole | null>(null)

  const setBoardAccess = useCallback((wsId: string, role: string) => {
    setWorkspaceId(wsId)
    setViewerWorkspaceRole(
      (role || "MEMBER").toUpperCase() as WorkspaceMemberRole
    )
  }, [])

  useEffect(() => {
    if (workspaceId) return
    let cancelled = false
    void (async () => {
      try {
        const { data } = await client.query<{
          me: {
            memberships: Array<{ workspaceId: string; role: string }>
          } | null
        }>({
          query: ME_NAV_BOOTSTRAP,
          fetchPolicy: "network-only",
        })
        if (cancelled) return
        const first = data?.me?.memberships?.[0]
        if (first?.workspaceId) {
          setWorkspaceId(first.workspaceId)
          setViewerWorkspaceRole(
            (first.role || "MEMBER").toUpperCase() as WorkspaceMemberRole
          )
        }
      } catch {
        /* unauthenticated or network */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client, workspaceId])

  const value = useMemo((): Ctx => {
    const r = viewerWorkspaceRole?.toUpperCase() ?? ""
    const isWorkspaceAdmin = r === "ADMIN"
    return {
      workspaceId,
      viewerWorkspaceRole,
      setBoardAccess,
      isWorkspaceAdmin,
    }
  }, [workspaceId, viewerWorkspaceRole, setBoardAccess])

  return (
    <EcosystraWorkspaceNavContext.Provider value={value}>
      {children}
    </EcosystraWorkspaceNavContext.Provider>
  )
}

export function useEcosystraWorkspaceNav(): Ctx {
  const v = useContext(EcosystraWorkspaceNavContext)
  if (!v) {
    throw new Error(
      "useEcosystraWorkspaceNav must be used under EcosystraWorkspaceNavProvider"
    )
  }
  return v
}

/** Safe when provider is optional (e.g. tests); returns permissive defaults. */
export function useOptionalEcosystraWorkspaceNav(): Ctx {
  const v = useContext(EcosystraWorkspaceNavContext)
  return (
    v ?? {
      workspaceId: null,
      viewerWorkspaceRole: null,
      setBoardAccess: () => {},
      isWorkspaceAdmin: true,
    }
  )
}
