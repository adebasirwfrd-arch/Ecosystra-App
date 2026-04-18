import { PrismaClient } from "@/generated/prisma"

/**
 * Runtime URL for PrismaClient (GraphQL / API routes):
 * - Set `PRISMA_USE_POOLER=true` to force `DATABASE_URL` (PgBouncer :6543) when `db.*.supabase.co:5432` is unreachable.
 * - Otherwise prefer `DIRECT_URL` when set, else `DATABASE_URL`.
 *
 * `directUrl` in prisma/schema is still used by Prisma CLI migrations — keep both env vars.
 *
 * Common mistake: putting the **pooler** hostname on port **5432** in `DIRECT_URL`.
 */
function parseDbUrl(url: string): URL | null {
  try {
    return new URL(url.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:"))
  } catch {
    return null
  }
}

function isSupabasePoolerOnWrongPort(url: string): boolean {
  const u = parseDbUrl(url)
  if (!u) return false
  const host = u.hostname.toLowerCase()
  const port = u.port || "5432"
  return host.includes("pooler.supabase.com") && port === "5432"
}

function isSupabasePoolerUrl(url: string): boolean {
  const u = parseDbUrl(url)
  return !!u && u.hostname.includes("pooler.supabase.com")
}

/** When true, PrismaClient uses `DATABASE_URL` (pooler :6543) even if `DIRECT_URL` is set. Use if `db.*.supabase.co:5432` is unreachable (IPv6 / firewall / ISP) but the pooler works. */
function prismaWantsPoolerRuntime(): boolean {
  const v = process.env.PRISMA_USE_POOLER?.trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes"
}

function prismaDatasourceUrl() {
  const direct = process.env.DIRECT_URL?.trim()
  const pooled = process.env.DATABASE_URL?.trim()

  if (prismaWantsPoolerRuntime() && pooled) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[prisma] PRISMA_USE_POOLER is set — using DATABASE_URL (Supabase pooler) for the app Prisma client."
      )
    }
    return pooled
  }

  if (direct && isSupabasePoolerOnWrongPort(direct)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[prisma] DIRECT_URL points at Supabase pooler on :5432 (invalid). " +
          "Use Dashboard → Connect → Direct connection (`db.*.supabase.co:5432`) for DIRECT_URL, " +
          "or unset DIRECT_URL and use DATABASE_URL (pooler :6543). Falling back to DATABASE_URL."
      )
    }
    return pooled || direct
  }
  // Prefer direct Postgres (db.*.supabase.co:5432) — pooler :6543 is often blocked or flaky on some networks.
  if (direct) return direct
  if (pooled && isSupabasePoolerUrl(pooled) && process.env.NODE_ENV === "development") {
    console.warn(
      "[prisma] Only DATABASE_URL (Supabase pooler :6543) is set. If you see \"Can't reach database server\", " +
        "add DIRECT_URL from Supabase → Database → Connection string → Direct (host db.<project>.supabase.co, port 5432)."
    )
  }
  return pooled
}

const prismaClientSingleton = () => {
  const url = prismaDatasourceUrl()
  return new PrismaClient(
    url
      ? {
          datasources: { db: { url } },
        }
      : undefined
  )
}

declare global {
  /**
   * Bumped when Prisma schema/client shape changes so dev HMR cannot reuse a stale engine
   * (e.g. new columns — old singleton would throw "Unknown argument …" on new fields).
   * Last bump: EcoTaskAssigneeInvite — stale singleton had no `ecoTaskAssigneeInvite` delegate
   * ("Cannot read properties of undefined (reading 'findUnique')").
   */
  // eslint-disable-next-line no-var
  var prismaShadboardV12: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prismaShadboardV12 ?? prismaClientSingleton()

// If not in production, reuse the Prisma instance across hot reloads
if (process.env.NODE_ENV !== "production") globalThis.prismaShadboardV12 = db

function isTransientConnectionError(e: unknown): boolean {
  if (typeof e === "object" && e !== null && "code" in e) {
    const code = (e as { code?: string }).code
    // P1001 = Can't reach database server (often transient)
    if (code && ["P1017", "P1001", "P1008"].includes(code)) return true
  }
  const msg = e instanceof Error ? e.message : String(e)
  return /Server has closed the connection|Can't reach database server|Connection terminated|ECONNRESET|ETIMEDOUT|Connection timed out/i.test(
    msg
  )
}

/**
 * Supabase / PgBouncer can drop idle connections; the singleton Prisma client then throws
 * until the pool reconnects. Retry a few times with `$connect()` and a short backoff.
 */
export async function withPrismaRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let last: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      last = e
      if (!isTransientConnectionError(e) || i === attempts - 1) {
        throw e
      }
      await db.$connect().catch(() => undefined)
      await new Promise((r) => setTimeout(r, 120 * (i + 1)))
    }
  }
  throw last
}

export { db }
