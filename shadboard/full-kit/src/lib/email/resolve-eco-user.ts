import { db as prisma, withPrismaRetry } from "@/lib/prisma"

/** Same Eco user resolution as GraphQL `getViewer` (NextAuth email → `EcoUser`). */
export async function upsertEcoUserIdFromEmail(email: string) {
  const user = await withPrismaRetry(() =>
    prisma.ecoUser.upsert({
      where: { email },
      create: {
        email,
        name: email.split("@")[0],
      },
      update: {},
    })
  )
  return user.id
}
