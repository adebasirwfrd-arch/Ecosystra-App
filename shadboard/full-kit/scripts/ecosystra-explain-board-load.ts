/**
 * Runs EXPLAIN (ANALYZE, BUFFERS) on the same raw SQL used for "last updated by"
 * prefetch (`prefetchLastUpdatedByForBoardItems` in resolvers.ts).
 *
 * Usage (from shadboard/full-kit):
 *   pnpm perf:explain-board
 *   pnpm perf:explain-board -- <boardUuid>
 *
 * Requires .env.local with DATABASE_URL or DIRECT_URL (same as Prisma CLI).
 */
import { config } from "dotenv"
import { Prisma } from "../src/generated/prisma"
import { PrismaClient } from "../src/generated/prisma"

config({ path: ".env.local" })

const prisma = new PrismaClient()

async function main() {
  const candidates = process.argv.slice(2).filter(
    (a) =>
      !a.startsWith("-") &&
      !(a.includes("scripts/") && a.endsWith(".ts"))
  )
  const boardIdArg = candidates[0]
  const boardId =
    boardIdArg && !boardIdArg.startsWith("-")
      ? boardIdArg
      : (
          await prisma.ecoBoard.findFirst({
            orderBy: { createdAt: "asc" },
            select: { id: true },
          })
        )?.id

  if (!boardId) {
    console.error("[explain] No board id (pass one, or seed a board first).")
    process.exit(1)
  }

  const rows = await prisma.ecoItem.findMany({
    where: { boardId },
    select: { id: true },
  })
  const ids = rows.map((r) => r.id)

  console.info(
    `[explain] boardId=${boardId} itemRowCount=${ids.length} (top-level + subitems)`
  )

  if (ids.length === 0) {
    console.info("[explain] No items — skip TaskAuditLog EXPLAIN.")
    await prisma.$disconnect()
    return
  }

  console.info(
    "\n--- EXPLAIN (ANALYZE, BUFFERS) — TaskAuditLog DISTINCT ON (resolver prefetch) ---\n"
  )

  const planRows = await prisma.$queryRaw<
    Array<{ "QUERY PLAN": string } | Record<string, string>>
  >(Prisma.sql`
    EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
    SELECT DISTINCT ON ("itemId") "itemId", "actorUserId"
    FROM "TaskAuditLog"
    WHERE "itemId" IN (${Prisma.join(ids)})
    ORDER BY "itemId", "createdAt" DESC
  `)

  for (const row of planRows) {
    const line =
      "QUERY PLAN" in row
        ? row["QUERY PLAN"]
        : Object.values(row)[0] ?? JSON.stringify(row)
    console.info(line)
  }

  console.info(
    "\n[hint] Compare `prismaBoardGraphMs` vs `prefetchLastUpdatedMs` in server logs (ECOSYSTRA_SERVER_PERF=1)."
  )
  console.info(
    "[hint] If the board graph dominates, enable Prisma query logging or capture the generated SQL for that findUnique."
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
