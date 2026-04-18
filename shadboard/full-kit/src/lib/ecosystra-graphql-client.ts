import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

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
    if (explicit) return explicit
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/graphql`
    return "http://localhost:4000/graphql"
  }

  const host = window.location.hostname
  const isLocal = host === "localhost" || host === "127.0.0.1"

  if (explicit) {
    if (!isLocal && /localhost|127\.0\.0\.1/.test(explicit)) {
      return `${window.location.origin}/api/graphql`
    }
    return explicit
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
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
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

  return new ApolloClient({
    link: createHttpLink({
      uri,
      credentials: "include",
      fetch: ecosystraGraphqlFetch,
    }),
    cache: new InMemoryCache(),
  })
}
