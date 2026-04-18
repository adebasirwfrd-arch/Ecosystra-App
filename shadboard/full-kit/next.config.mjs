import path from "node:path"
import { fileURLToPath } from "node:url"

import createMDX from "@next/mdx"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// pnpm workspace root — shared node_modules live here so Next.js can trace them
const workspaceRoot = path.join(__dirname, "../..")

/**
 * `redirects()` entry for `source: "/:lang"` must keep a `:lang` segment in
 * `destination`. A bare `/dashboards/...` breaks the route tree and can
 * surface as 500s in dev.
 */
function localizedHomeDestination() {
  const raw = process.env.HOME_PATHNAME
  const fallback = "/:lang/dashboards/analytics"
  if (!raw) return fallback
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

  // pnpm workspace: node_modules are hoisted to workspace root, trace from there
  outputFileTracingRoot: workspaceRoot,

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react"],
  experimental: {
    externalDir: true,
    // Reduces dev-only "SegmentViewNode" / React Client Manifest flakes with Next 15 devtools
    devtoolSegmentExplorer: false,
    // Tree-shake heavy barrel imports (smaller dev rebuilds / faster Fast Refresh)
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
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

  // See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      /**
       * Wrong relative URLs can produce `/favicon.ico/dashboards/...`. Middleware may
       * never run for those paths (matcher excludes `favicon.ico*`). Fix at config
       * level so we never hit a bogus route (500 + broken webpack-runtime chunks).
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
      // ⚠️ Important:
      // Always list more specific static paths before dynamic ones like "/:lang"
      // to prevent Next.js from incorrectly matching static routes as dynamic parameters.
      // For example, if "/:lang" comes before "/docs", Next.js may treat "docs" as a language.
      {
        source: "/docs",
        destination: "/docs/overview/introduction",
        permanent: true,
      },
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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
