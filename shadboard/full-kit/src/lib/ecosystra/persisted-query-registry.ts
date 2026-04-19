/**
 * In-memory APQ (Automatic Persisted Queries) registry for `/api/graphql`.
 * Populated when the client sends a full `query` plus `extensions.persistedQuery.sha256Hash`;
 * subsequent requests may omit `query` and send only the hash.
 *
 * Note: each server instance / lambda has its own map; cold starts may see
 * one extra full-query round-trip until the hash is registered again.
 */

const MAX_ENTRIES = 2000

const hashToQuery = new Map<string, string>()

function touchOrder(hash: string, query: string): void {
  hashToQuery.delete(hash)
  if (hashToQuery.size >= MAX_ENTRIES) {
    const first = hashToQuery.keys().next().value
    if (first !== undefined) hashToQuery.delete(first)
  }
  hashToQuery.set(hash, query)
}

export function registerPersistedQueryHash(hash: string, query: string): void {
  const h = hash.trim()
  if (!h || !query.trim()) return
  touchOrder(h, query)
}

export function lookupPersistedQuery(hash: string): string | undefined {
  const h = hash.trim()
  const q = hashToQuery.get(h)
  if (!q) return undefined
  touchOrder(h, q)
  return q
}

export type PersistedQueryResolve =
  | { ok: true; query: string; variables?: unknown; operationName?: string }
  | { ok: false; kind: "missing_query" }
  | { ok: false; kind: "persisted_query_not_found" }

type ExtensionsShape = {
  persistedQuery?: { sha256Hash?: unknown; version?: unknown }
}

export function resolvePersistedGraphqlPayload(
  body: Record<string, unknown>
): PersistedQueryResolve {
  const queryRaw = body.query
  const query = typeof queryRaw === "string" ? queryRaw : ""
  const extensions = body.extensions as ExtensionsShape | undefined
  const hashRaw = extensions?.persistedQuery?.sha256Hash
  const hash = typeof hashRaw === "string" ? hashRaw.trim() : ""

  if (query.trim().length > 0) {
    if (hash) registerPersistedQueryHash(hash, query)
    return {
      ok: true,
      query,
      variables: body.variables,
      operationName: typeof body.operationName === "string" ? body.operationName : undefined,
    }
  }

  if (!hash) {
    return { ok: false, kind: "missing_query" }
  }

  const cached = lookupPersistedQuery(hash)
  if (!cached) {
    return { ok: false, kind: "persisted_query_not_found" }
  }

  return {
    ok: true,
    query: cached,
    variables: body.variables,
    operationName: typeof body.operationName === "string" ? body.operationName : undefined,
  }
}

export function apolloPersistedQueryNotFoundBody(): {
  data: null
  errors: Array<{ message: string; extensions: { code: string } }>
} {
  return {
    data: null,
    errors: [
      {
        message: "PersistedQueryNotFound",
        extensions: { code: "PERSISTED_QUERY_NOT_FOUND" },
      },
    ],
  }
}
