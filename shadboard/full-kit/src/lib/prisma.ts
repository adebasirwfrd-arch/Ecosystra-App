import { PrismaClient } from "@prisma/client"

/**
 * Prefer `DIRECT_URL` (Supabase Postgres :5432) at runtime when set.
 * The Transaction pooler (`DATABASE_URL` :6543 + pgbouncer) often breaks
 * NextAuth's PrismaAdapter during Google OAuth (multi-step user/account writes).
 * Migrations still use `directUrl` from schema; this only affects the client pool.
 */
function prismaDatasourceUrl() {
  const direct = process.env.DIRECT_URL?.trim()
  const pooled = process.env.DATABASE_URL?.trim()
  return direct || pooled
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
  // Prevent TypeScript from complaining about the global prisma variable
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prisma ?? prismaClientSingleton()

// If not in production, reuse the Prisma instance across hot reloads
if (process.env.NODE_ENV !== "production") globalThis.prisma = db

export { db }
