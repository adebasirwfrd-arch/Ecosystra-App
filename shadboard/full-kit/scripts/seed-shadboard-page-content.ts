/**
 * Upserts page content JSON from scripts/seed/page-content.json into Supabase (schema shadboard_content).
 * Run: pnpm db:seed-page-content
 */
import { readFileSync } from "fs"
import { join } from "path"

import { config } from "dotenv"
import type { Prisma } from "../src/generated/prisma"
import { PrismaClient } from "../src/generated/prisma"

import { SHADBOARD_PAGE_MODULES } from "../src/lib/shadboard-page-modules"

config({ path: ".env.local" })

const prisma = new PrismaClient()

type SeedFile = {
  modules: Record<string, unknown>
}

async function main() {
  const raw = readFileSync(
    join(process.cwd(), "scripts/seed/page-content.json"),
    "utf8"
  )
  const { modules } = JSON.parse(raw) as SeedFile

  for (const module of SHADBOARD_PAGE_MODULES) {
    const payload = modules[module]
    if (payload === undefined) {
      throw new Error(`page-content.json missing module: ${module}`)
    }
    const json = JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue
    await prisma.shadboardPageContent.upsert({
      where: { module },
      create: { module, payload: json },
      update: { payload: json },
    })
    console.log("[seed] shadboard_page_content:", module)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
