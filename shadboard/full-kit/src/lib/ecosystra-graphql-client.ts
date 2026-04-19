import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client"

import {
  createEcosystraPerfApolloLink,
  installEcosystraPerfGlobal,
  isEcosystraClientPerfEnabled,
} from "@/lib/ecosystra-client-perf"

/**
 * Vercel / docs typo: `https://host/graphql` hits no Next route → HTML 404.
 * This app serves GraphQL at `/api/graphql` only.
 */
function normalizeExplicitGraphqlUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  try {
    const u = new URL(trimmed)
    const path = u.pathname.replace(/\/$/, "") || "/"
    if (path === "/graphql") {
      u.pathname = "/api/graphql"
      return u.toString()
    }
    return trimmed
  } catch {
    return trimmed
  }
}

/**
 * Resolves the browser GraphQL HTTP endpoint.
 * - Defaults to same-origin `/api/graphql` (correct for Vercel and local Next).
 * - Honors `NEXT_PUBLIC_GRAPHQL_URL` / `NEXT_PUBLIC_ECOSYSTRA_GRAPHQL_URL` when set,
 *   except when they still point at `localhost` while the app runs on a real hostname
 *   (common mistake: env copied into Vercel — breaks the board with "Unexpected token '<'").
 */
function resolveGraphqlUri(): string {
  const explicit = (
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTRA_GRAPHQL_URL ||
    ""
  ).trim()

  if (typeof window === "undefined") {
    if (explicit) return normalizeExplicitGraphqlUrl(explicit)
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/graphql`
    return "http://localhost:4000/graphql"
  }

  const host = window.location.hostname
  const isLocal = host === "localhost" || host === "127.0.0.1"

  if (explicit) {
    if (!isLocal && /localhost|127\.0\.0\.1/.test(explicit)) {
      return `${window.location.origin}/api/graphql`
    }
    return normalizeExplicitGraphqlUrl(explicit)
  }

  return `${window.location.origin}/api/graphql`
}

/** Reject HTML bodies early so Apollo shows a clear message instead of JSON parse noise. */
async function ecosystraGraphqlFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init)
  const text = await res.text()
  const trimmed = text.trimStart()
  const lower = trimmed.slice(0, 12).toLowerCase()
  if (lower.startsWith("<!doctype") || trimmed.slice(0, 5).toLowerCase() === "<html") {
    throw new Error(
      "GraphQL returned HTML instead of JSON. Use same-origin /api/graphql (unset NEXT_PUBLIC_GRAPHQL_URL on Vercel unless you use an external API), " +
        "and disable Deployment Protection / password gate for this project if /api/graphql is blocked."
    )
  }
  return new Response(text, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })
}

export function createEcosystraGraphqlClient() {
  const uri = resolveGraphqlUri()

  const httpLink = createHttpLink({
    uri,
    credentials: "include",
    fetch: ecosystraGraphqlFetch,
  })

  const link = isEcosystraClientPerfEnabled()
    ? from([createEcosystraPerfApolloLink(), httpLink])
    : httpLink

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })

  if (typeof window !== "undefined" && isEcosystraClientPerfEnabled()) {
    installEcosystraPerfGlobal()
  }

  return client
}
