"use client"

import { useMemo } from "react"
import { ApolloProvider } from "@apollo/client"

import type { ReactNode } from "react"

import { createEcosystraGraphqlClient } from "@/lib/ecosystra-graphql-client"

import { EcosystraOutboxRecovery } from "./ecosystra-outbox-recovery"
import { EcosystraWorkspaceNavProvider } from "./ecosystra-workspace-nav-context"

/** Apollo client for Ecosystra GraphQL (`/api/graphql` or `NEXT_PUBLIC_ECOSYSTRA_GRAPHQL_URL`). */
export function EcosystraProviders({ children }: { children: ReactNode }) {
  const client = useMemo(() => createEcosystraGraphqlClient(), [])
  return (
    <ApolloProvider client={client}>
      <EcosystraWorkspaceNavProvider>
        <EcosystraOutboxRecovery />
        {children}
      </EcosystraWorkspaceNavProvider>
    </ApolloProvider>
  )
}
