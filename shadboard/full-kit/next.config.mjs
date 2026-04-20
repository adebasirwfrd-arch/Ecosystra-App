import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// pnpm workspace root — shared node_modules live here so Next.js can trace them
const workspaceRoot = path.join(__dirname, "../..")

/**
 * `redirects()` entry for `source: "/:lang"` must keep a `:lang` segment in
 * `destination`. Avoid destinations without the locale segment (breaks routing).
 */
function looksLikeLegacyDashboardPath(p) {
  return p.startsWith("/dashboards") || p.includes("/dashboards/")
}

function localizedHomeDestination() {
  const raw = (process.env.HOME_PATHNAME || "").trim()
  const fallback = "/:lang/apps/ecosystra"
  if (!raw || raw === "/" || looksLikeLegacyDashboardPath(raw)) return fallback
  if (raw.includes(":lang")) return raw
  const path = raw.startsWith("/") ? raw : `/${raw}`
  return `/:lang${path}`
}

const homeRedirectDest = localizedHomeDestination()

function supabaseStorageImageRemotePatterns() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!raw) return []
  try {
    const { hostname, protocol } = new URL(raw)
    if (!hostname) return []
    return [
      {
        protocol: protocol === "http:" ? "http" : "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ]
  } catch {
    return []
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: supabaseStorageImageRemotePatterns(),
  },

  // Prisma client is generated to `src/generated/prisma` (see prisma/schema.prisma). Next must ship the
  // query-engine `.node` binary with serverless output; otherwise Vercel throws "could not locate … rhel-openssl-3.0.x".
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**/*"],
  },

  // Avoid bundling Prisma in a way that drops native engines (see https://pris.ly/d/engine-not-found-nextjs)
  serverExternalPackages: ["@prisma/client"],

  // pnpm workspace: node_modules are hoisted to workspace root, trace from there
  outputFileTracingRoot: workspaceRoot,

  pageExtensions: ["js", "jsx", "ts", "tsx"],

  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react", "@zegocloud/zego-uikit-prebuilt"],
  experimental: {
    // Board file uploads use Server Actions; default body limit is 1MB.
    serverActions: {
      bodySizeLimit: "50mb",
    },
    externalDir: true,
    // Reduces dev-only "SegmentViewNode" / React Client Manifest flakes with Next 15 devtools
    devtoolSegmentExplorer: false,
    // Tree-shake heavy barrel imports (smaller dev rebuilds / faster Fast Refresh)
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react-icons",
      "framer-motion",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Default is true (dev double-mount). Only uncomment to debug Zego if generation-guard logs still fail.
  // reactStrictMode: false,

  // See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      /**
       * Wrong relative URLs can produce `/favicon.ico/...` prefixed paths. Middleware may
       * never run for those paths (matcher excludes `favicon.ico*`). Fix at config level.
       */
      {
        source: "/favicon.ico/:path*",
        destination: "/:path*",
        permanent: false,
      },
      /** Legacy invite / task deep links used `/board?…` (404). Forward query to real Ecosystra route. */
      {
        source: "/board",
        destination: "/en/apps/ecosystra/board",
        permanent: false,
      },
      /** Legacy catalog URLs (removed template) → Ecosystra home. */
      {
        source: "/:lang/dashboards/:path*",
        destination: "/:lang/apps/ecosystra",
        permanent: false,
      },
      {
        source: "/dashboards/:path*",
        destination: "/en/apps/ecosystra",
        permanent: false,
      },
      // ⚠️ Important: list static `source` patterns before `/:lang` so "en" etc. are not mis-matched.
      {
        source: "/:lang",
        destination: homeRedirectDest,
        permanent: true,
        has: [
          {
            type: "cookie",
            key: "next-auth.session-token",
          },
        ],
      },
      {
        source: "/:lang",
        destination: homeRedirectDest,
        permanent: true,
        has: [
          {
            type: "cookie",
            key: "__Secure-next-auth.session-token",
          },
        ],
      },
      {
        source: "/:lang/apps/email",
        destination: "/:lang/apps/email/inbox",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
