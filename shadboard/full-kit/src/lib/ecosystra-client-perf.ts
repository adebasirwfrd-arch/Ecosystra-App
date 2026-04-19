"use client"

import { ApolloLink, Observable } from "@apollo/client"
import type { Operation } from "@apollo/client/core"
import type { FetchResult } from "@apollo/client/link/core"
import type { OperationDefinitionNode } from "graphql"

export type EcosystraPerfEntry = {
  id: string
  atIso: string
  operationName: string
  durationMs: number
  ok: boolean
  errorMessage?: string
  graphqlErrors?: string[]
}

const MAX_ENTRIES = 250
const entries: EcosystraPerfEntry[] = []

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function isEcosystraClientPerfEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_ECOSYSTRA_PERF_LOG?.trim().toLowerCase()
  return v === "true" || v === "1" || v === "yes"
}

function operationDisplayName(operation: Operation): string {
  if (operation.operationName) return operation.operationName
  const def = operation.query.definitions.find(
    (d): d is OperationDefinitionNode => d.kind === "OperationDefinition"
  )
  return def?.name?.value || "AnonymousOperation"
}

export function recordGraphqlRoundTrip(opts: {
  operationName: string
  durationMs: number
  ok: boolean
  errorMessage?: string
  graphqlErrors?: readonly { message?: string }[] | undefined
}): void {
  if (!isEcosystraClientPerfEnabled()) return

  const gqlMsgs =
    opts.graphqlErrors
      ?.map((e) => (typeof e?.message === "string" ? e.message : ""))
      .filter(Boolean) ?? []

  const row: EcosystraPerfEntry = {
    id: nextId(),
    atIso: new Date().toISOString(),
    operationName: opts.operationName,
    durationMs: Math.round(opts.durationMs * 1000) / 1000,
    ok: opts.ok,
    errorMessage: opts.errorMessage,
    graphqlErrors: gqlMsgs.length ? gqlMsgs : undefined,
  }

  entries.push(row)
  while (entries.length > MAX_ENTRIES) entries.shift()

  const icon = row.ok ? "ok" : "ERR"
  // eslint-disable-next-line no-console -- intentional perf harness for manual QA
  console.info(
    `[ecosystra-perf] ${icon} ${row.operationName} ${row.durationMs.toFixed(1)}ms`,
    {
      at: row.atIso,
      ...(row.errorMessage ? { networkOrClientError: row.errorMessage } : {}),
      ...(row.graphqlErrors?.length ? { graphQLErrors: row.graphqlErrors } : {}),
    }
  )
}

/** Optional manual span (e.g. wrap a click handler) — same buffer + console as GraphQL rows. */
export function recordUiSpan(
  label: string,
  durationMs: number,
  extra?: Record<string, unknown>
): void {
  if (!isEcosystraClientPerfEnabled()) return
  const row: EcosystraPerfEntry = {
    id: nextId(),
    atIso: new Date().toISOString(),
    operationName: `ui:${label}`,
    durationMs: Math.round(durationMs * 1000) / 1000,
    ok: true,
  }
  entries.push(row)
  while (entries.length > MAX_ENTRIES) entries.shift()
  // eslint-disable-next-line no-console -- intentional perf harness for manual QA
  console.info(`[ecosystra-perf] ui ${label} ${row.durationMs.toFixed(1)}ms`, extra ?? {})
}

export function installEcosystraPerfGlobal(): void {
  if (typeof window === "undefined" || !isEcosystraClientPerfEnabled()) return

  const api = {
    entries: (): readonly EcosystraPerfEntry[] => [...entries],
    clear: (): void => {
      entries.length = 0
      // eslint-disable-next-line no-console -- intentional perf harness for manual QA
      console.info("[ecosystra-perf] buffer cleared")
    },
    dump: (): void => {
      // eslint-disable-next-line no-console -- intentional perf harness for manual QA
      console.table(
        entries.map((e) => ({
          op: e.operationName,
          ms: e.durationMs,
          ok: e.ok,
          at: e.atIso,
          err: e.errorMessage ?? (e.graphqlErrors?.join("; ") || ""),
        }))
      )
      // eslint-disable-next-line no-console -- intentional perf harness for manual QA
      console.info(`[ecosystra-perf] ${entries.length} row(s). Copy table above for your report.`)
    },
    help: (): void => {
      // eslint-disable-next-line no-console -- intentional perf harness for manual QA
      console.info(
        "[ecosystra-perf] Client: set NEXT_PUBLIC_ECOSYSTRA_PERF_LOG=true, restart dev, reproduce, then __ecosystraPerf.dump()."
      )
      console.info(
        "[ecosystra-perf] Server DB phases: set ECOSYSTRA_SERVER_PERF=1 in .env.local, restart dev; compare terminal [ecosystra-server-perf] lines to DevTools Performance (Network + main thread)."
      )
      console.info(
        "[ecosystra-perf] EXPLAIN board audit query: pnpm perf:explain-board (optionally pass board UUID after --)."
      )
      console.info(
        "[ecosystra-perf] DB cepat tapi UI lambat? Cek Chrome Performance (Main) + Network — Index Only Scan tidak membantu jika Main Thread atau refetch JSON besar memblokir sebelum/sesudah request."
      )
    },
  }

  ;(window as unknown as { __ecosystraPerf: typeof api }).__ecosystraPerf = api

  // eslint-disable-next-line no-console -- intentional perf harness for manual QA
  console.info(
    "[ecosystra-perf] Recording is ON. After testing: __ecosystraPerf.dump() | .clear() | .help()"
  )
}

/** Apollo link: one log line per GraphQL round-trip (network + JSON parse + Apollo). */
export function createEcosystraPerfApolloLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (!isEcosystraClientPerfEnabled()) {
      return forward(operation)
    }
    const opName = operationDisplayName(operation)
    const t0 = performance.now()

    return new Observable<FetchResult>((observer) => {
      const sub = forward(operation).subscribe({
        next(result: FetchResult) {
          const ms = performance.now() - t0
          recordGraphqlRoundTrip({
            operationName: opName,
            durationMs: ms,
            ok: !result.errors?.length,
            graphqlErrors: result.errors,
          })
          observer.next(result)
        },
        error(err: unknown) {
          const ms = performance.now() - t0
          recordGraphqlRoundTrip({
            operationName: opName,
            durationMs: ms,
            ok: false,
            errorMessage: err instanceof Error ? err.message : String(err),
          })
          observer.error(err)
        },
        complete() {
          observer.complete()
        },
      })
      return () => sub.unsubscribe()
    })
  })
}
