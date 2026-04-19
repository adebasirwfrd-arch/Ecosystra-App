import { PrismaAdapter } from "@auth/prisma-adapter"
import * as jose from "jose"

import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { rewriteLegacyDashboardPathname } from "@/lib/app-default-home"
import { db } from "@/lib/prisma"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
    }
    apiAccessToken?: string
    /** Short-lived Google OAuth access token (Drive Picker / copy). Google sign-in only. */
    googleAccessToken?: string | null
  }

  interface User {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    avatar: string | null
    status: string
    apiAccessToken?: string
    googleAccessToken?: string
    googleRefreshToken?: string
    googleAccessTokenExpires?: number
  }
}

// Configuration for NextAuth with custom adapters and providers
// NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  // Verbose `[next-auth][warn][DEBUG_ENABLED]` and extra logs only when explicitly enabled.
  debug: process.env.NEXTAUTH_DEBUG === "true",
  logger:
    process.env.NEXTAUTH_DEBUG === "true"
      ? {
          error(code, ...rest: unknown[]) {
            console.error("[next-auth]", code, ...rest)
          },
        }
      : undefined,
  secret: process.env.NEXTAUTH_SECRET || "dev-nextauth-secret-change-me",
  /** http://localhost must not use Secure cookies or the browser will drop the session cookie. */
  useSecureCookies: nextAuthUrl.startsWith("https://"),
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            /** Link Google to existing user with same email (avoids OAuthAccountNotLinked). */
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                access_type: "offline",
                scope:
                  "openid profile email https://www.googleapis.com/auth/drive.file",
              },
            },
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name ?? profile.email?.split("@")[0] ?? "User",
                email: profile.email,
                image: profile.picture,
                emailVerified: profile.email_verified ? new Date() : null,
              }
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      // Custom authorize function to validate user credentials
      async authorize(credentials) {
        if (!credentials) return null

        try {
          // Authenticate the user by sending credentials to an external API
          // Refer to the NextAuth.js documentation for handling custom sign-in flows:
          // https://next-auth.js.org/providers/credentials
          const endpoint = process.env.API_URL
            ? `${process.env.API_URL}/auth/sign-in`
            : `${nextAuthUrl}/api/auth/sign-in`

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const payload = await res.json()

          // Throw error if the response status indicates a failure
          if (res.status >= 400) {
            throw new Error(payload?.message ?? "An unknown error occurred.")
          }

          return payload // Return user data on successful authentication
        } catch (e: unknown) {
          // Handle errors and provide appropriate error message
          throw new Error(
            e instanceof Error ? e.message : "An unknown error occurred."
          )
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days — persistent "remember this device"
    // More info on session strategies: https://next-auth.js.org/getting-started/options#session
    updateAge: 24 * 60 * 60, // refresh session at most once per day when active
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // align JWT lifetime with session cookie (Google + credentials)
  },
  callbacks: {
    /**
     * Normalize post-OAuth redirects. NextAuth may preserve an absolute `callbackUrl`
     * with the wrong port (e.g. :3002) while `NEXTAUTH_URL` is :3000 — same hostname
     * but different origin, which breaks session + looks like "back to login".
     */
    async redirect({ url, baseUrl }) {
      const withRewrittenPath = (pathAndQuery: string) => {
        const q = pathAndQuery.indexOf("?")
        const path = q >= 0 ? pathAndQuery.slice(0, q) : pathAndQuery
        const tail = q >= 0 ? pathAndQuery.slice(q) : ""
        return `${rewriteLegacyDashboardPathname(path)}${tail}`
      }
      if (url.startsWith("/")) return `${baseUrl}${withRewrittenPath(url)}`
      try {
        const next = new URL(url)
        const base = new URL(baseUrl)
        if (next.origin === base.origin) {
          next.pathname = rewriteLegacyDashboardPathname(next.pathname)
          return next.toString()
        }
        if (next.hostname === base.hostname) {
          const path = rewriteLegacyDashboardPathname(next.pathname)
          return `${base.origin}${path}${next.search}${next.hash}`
        }
      } catch {
        /* ignore invalid url */
      }
      return baseUrl
    },
    async jwt({ token, user, account }) {
      if (user) {
        const image = (user as { image?: string | null }).image
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar || image || null
        token.email = user.email
        token.status = user.status || "ONLINE"
      }

      if (account?.provider === "google") {
        if (typeof account.access_token === "string") {
          token.googleAccessToken = account.access_token
        }
        if (typeof account.refresh_token === "string") {
          token.googleRefreshToken = account.refresh_token
        }
        if (typeof account.expires_at === "number") {
          token.googleAccessTokenExpires = account.expires_at
        }
      }

      if (
        token.googleRefreshToken &&
        typeof token.googleAccessTokenExpires === "number" &&
        Date.now() >= token.googleAccessTokenExpires * 1000 - 60_000
      ) {
        const cid = process.env.GOOGLE_CLIENT_ID
        const csec = process.env.GOOGLE_CLIENT_SECRET
        if (cid && csec) {
          try {
            const res = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: cid,
                client_secret: csec,
                grant_type: "refresh_token",
                refresh_token: String(token.googleRefreshToken),
              }),
            })
            const data = (await res.json()) as {
              access_token?: string
              expires_in?: number
              error?: string
            }
            if (res.ok && data.access_token) {
              token.googleAccessToken = data.access_token
              token.googleAccessTokenExpires = Math.floor(
                Date.now() / 1000 + (data.expires_in ?? 3600)
              )
            }
          } catch {
            /* keep previous token */
          }
        }
      }

      const secret =
        process.env.NEXTAUTH_SECRET || "dev-nextauth-secret-change-me"
      const key = new TextEncoder().encode(secret)
      token.apiAccessToken = await new jose.SignJWT({
        sub: token.id,
        email: token.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key)

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
      }

      session.apiAccessToken = token.apiAccessToken
      session.googleAccessToken =
        typeof token.googleAccessToken === "string"
          ? token.googleAccessToken
          : null

      return session
    },
  },
}
