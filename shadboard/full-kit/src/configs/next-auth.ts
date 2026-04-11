import { PrismaAdapter } from "@auth/prisma-adapter"

import type { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"

import { db } from "@/lib/prisma"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

// Extend NextAuth's Session and User interfaces to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string
      avatar: string | null
      status: string
    }
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
  }
}

// Configuration for NextAuth with custom adapters and providers
// NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database interaction
  // More info: https://next-auth.js.org/getting-started/adapter
  debug: process.env.NODE_ENV === "development",
  logger:
    process.env.NODE_ENV === "development"
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
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name ?? profile.email?.split("@")[0] ?? "User",
                email: profile.email,
                image: profile.picture,
                emailVerified: profile.email_verified
                  ? new Date()
                  : null,
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
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        const next = new URL(url)
        const base = new URL(baseUrl)
        if (next.origin === base.origin) return url
        if (next.hostname === base.hostname) {
          return `${base.origin}${next.pathname}${next.search}${next.hash}`
        }
      } catch {
        /* ignore invalid url */
      }
      return baseUrl
    },
    // Callback to add custom user properties to JWT
    // Learn more: https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, user }) {
      if (user) {
        const image = (user as { image?: string | null }).image
        token.id = user.id
        token.name = user.name
        token.avatar = user.avatar || image || null
        token.email = user.email
        token.status = user.status || "ONLINE"
      }

      return token
    },
    // Callback to include JWT properties in the session object
    // Learn more: https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.avatar = token.avatar
        session.user.email = token.email
        session.user.status = token.status
      }

      return session
    },
  },
}
