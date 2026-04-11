import { NextResponse } from "next/server"

import { headers } from "next/headers"

export const dynamic = "force-dynamic"

/**
 * Dev-only auth / DB smoke test. Open: GET /api/debug/auth-check
 * Does not expose secrets — only booleans, lengths, and public URLs.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? ""
  const proto = h.get("x-forwarded-proto") ?? "http"
  const requestOrigin =
    host && !host.includes("localhost") ? `${proto}://${host}` : `http://${host}`

  let nextAuthOrigin = "(unset)"
  try {
    nextAuthOrigin = new URL(
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    ).origin
  } catch {
    nextAuthOrigin = "invalid NEXTAUTH_URL"
  }

  const originMismatch =
    host &&
    nextAuthOrigin !== "(unset)" &&
    nextAuthOrigin !== "invalid NEXTAUTH_URL" &&
    (() => {
      try {
        return new URL(requestOrigin).origin !== nextAuthOrigin
      } catch {
        return true
      }
    })()

  const secret = process.env.NEXTAUTH_SECRET
  const hasSecret = !!secret?.length
  const nextAuthUrl = process.env.NEXTAUTH_URL ?? "(unset)"
  const baseUrl = process.env.BASE_URL ?? "(unset)"
  const apiUrl = process.env.API_URL ?? "(unset)"
  const hasGoogle = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  )
  const directSet = !!process.env.DIRECT_URL?.trim()
  const pooledSet = !!process.env.DATABASE_URL?.trim()

  let prismaReachable: true | string = true
  try {
    const { db } = await import("@/lib/prisma")
    await db.$queryRaw`SELECT 1 AS ok`
  } catch (e) {
    prismaReachable = e instanceof Error ? e.message : "unknown_error"
  }

  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV,
    /** Host you used to open this page — must match NEXTAUTH_URL origin or OAuth/cookies break. */
    requestHostHeader: host || "(unknown)",
    nextAuthOrigin,
    originMismatchWithNextAuth: originMismatch,
    nextAuthUrl,
    baseUrl,
    apiUrl,
    nextauthSecretConfigured: hasSecret,
    nextauthSecretLength: secret?.length ?? 0,
    googleOAuthConfigured: hasGoogle,
    databaseEnv: {
      hasDirectUrl: directSet,
      hasDatabaseUrl: pooledSet,
      runtimeUses: directSet ? "DIRECT_URL" : pooledSet ? "DATABASE_URL" : "schema default",
    },
    prismaReachable,
    hint:
      originMismatch
        ? "NEXTAUTH_URL origin does not match this request. Use one port only: stop the other dev server, open the app on the same port as NEXTAUTH_URL, OR set NEXTAUTH_URL/BASE_URL/API_URL (and Google Console) to this port."
        : !hasSecret
          ? "Set NEXTAUTH_SECRET in .env.local — middleware cannot read JWT without it."
          : prismaReachable !== true
            ? "Fix DB connection (see prismaReachable message); Google OAuth writes User/Account via Prisma."
            : "Core checks passed. If login still fails, watch terminal for [next-auth] during Google callback.",
  })
}
