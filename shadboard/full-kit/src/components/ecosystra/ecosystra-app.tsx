"use client"

import { useCallback, useEffect, useMemo, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import App from "../../../../../ecosystra-clone/apps/web/src/App"
import { Providers as EcosystraProviders } from "../../../../../ecosystra-clone/apps/web/src/next/providers"

import { EcosystraPageChrome } from "./ecosystra-page-chrome"
import { viewFromPathname, VIEW_TO_RELATIVE } from "./ecosystra-routes"

export function EcosystraApp() {
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const locale = pathname.split("/")[1] || "en"
  const { data: session } = useSession()

  const shellUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        status: session.user.status,
        avatarUrl: session.user.avatar ?? null,
      }
    : null

  const initialView = useMemo(() => viewFromPathname(pathname), [pathname])

  useEffect(() => {
    let cancelled = false
    const base = `/${locale}`
    const paths = new Set<string>([`${base}/apps/ecosystra`])
    for (const rel of Object.values(VIEW_TO_RELATIVE)) {
      paths.add(`${base}${rel}`)
    }
    const run = () => {
      if (cancelled) return
      paths.forEach((p) => {
        try {
          router.prefetch(p)
        } catch {
          /* ignore prefetch failures in non-browser contexts */
        }
      })
    }
    // First navigation after refresh should not wait for idle; prefetch ASAP.
    run()
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(run, { timeout: 2000 })
    } else {
      timeoutId = setTimeout(run, 500)
    }
    return () => {
      cancelled = true
      if (idleId !== undefined && typeof window !== "undefined") {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [locale, router])

  const onRouteNavigate = useCallback(
    (view: string) => {
      const relativePath = VIEW_TO_RELATIVE[view] ?? "/apps/ecosystra/board"
      const localizedPath = `/${locale}${relativePath}`
      if (pathname !== localizedPath) {
        startTransition(() => {
          router.push(localizedPath, { scroll: false })
        })
      }
    },
    [locale, pathname, router, startTransition]
  )

  return (
    <EcosystraProviders>
      <EcosystraPageChrome>
        <App
          useExternalShell
          shellUser={shellUser}
          initialView={initialView}
          onShellSignOut={() =>
            signOut({
              callbackUrl: ensureLocalizedPathname(
                "/sign-in",
                locale as LocaleType
              ),
            })
          }
          onRouteNavigate={onRouteNavigate}
        />
      </EcosystraPageChrome>
    </EcosystraProviders>
  )
}
