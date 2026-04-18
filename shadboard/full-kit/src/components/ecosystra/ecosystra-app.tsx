"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { useEcosystraViewPrefetch } from "./hooks/use-ecosystra-view-prefetch"
import { EcosystraAlertBannerProvider } from "./ecosystra-alert-banner-context"
import { EcosystraEmbeddedRoot } from "./ecosystra-embedded-root"
import { EcosystraPageChrome } from "./ecosystra-page-chrome"
import { localeSegmentFromPathname } from "./ecosystra-path-utils"
import { EcosystraProviders } from "./ecosystra-providers"
import { viewFromPathname } from "./ecosystra-routes"

export function EcosystraApp() {
  const pathname = usePathname()
  const locale = localeSegmentFromPathname(pathname)
  const { data: session } = useSession()

  useEcosystraViewPrefetch(locale)

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

  return (
    <EcosystraProviders>
      <EcosystraAlertBannerProvider>
        <EcosystraPageChrome>
          <EcosystraEmbeddedRoot
            initialView={initialView}
            locale={locale}
            shellUser={shellUser}
            onShellSignOut={() =>
              signOut({
                callbackUrl: ensureLocalizedPathname(
                  "/sign-in",
                  locale as LocaleType
                ),
              })
            }
          />
        </EcosystraPageChrome>
      </EcosystraAlertBannerProvider>
    </EcosystraProviders>
  )
}
