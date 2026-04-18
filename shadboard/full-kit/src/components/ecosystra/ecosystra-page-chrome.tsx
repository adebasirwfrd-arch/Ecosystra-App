"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"

import vibe from "./ecosystra-vibe-tokens.module.css"

import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { EcosystraAlertBannerHost } from "./ecosystra-alert-banner-context"
import { EcosystraChromeHorizontalNav } from "./ecosystra-chrome-horizontal-nav"

const ECOSYSTRA_MAIN_CONTENT_ID = "ecosystra-main-content"
import { EcosystraChromeWorkspace } from "./ecosystra-chrome-workspace"
import { useEcosystraDictionary } from "./ecosystra-dictionary-context"
import { localeSegmentFromPathname } from "./ecosystra-path-utils"
import { viewFromPathname } from "./ecosystra-routes"

/**
 * Embedded Ecosystra shell chrome: Vibe-aligned spacing (Grandbook foundations),
 * semantic regions, horizontal nav with keyboard support.
 */
export function EcosystraPageChrome({ children }: { children: ReactNode }) {
  const dictionary = useEcosystraDictionary()
  const pathname = usePathname()
  const locale = localeSegmentFromPathname(pathname)
  const currentView = useMemo(() => viewFromPathname(pathname), [pathname])

  const skipLabel = dictionary.ecosystraApp.boardTable.skipToContent

  return (
    <section
      data-ecosystra-chrome="true"
      aria-label={dictionary.navigation.ecosystra}
      className={cn(
        vibe.chromeRoot,
        "relative flex min-h-0 w-full min-w-0 flex-1 flex-col",
        "gap-[var(--vibe-space-12)] md:gap-[var(--vibe-space-16)]"
      )}
    >
      <a
        href={`#${ECOSYSTRA_MAIN_CONTENT_ID}`}
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-3 focus:rounded-md",
          "focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        )}
      >
        {skipLabel}
      </a>

      <EcosystraAlertBannerHost />

      <header
        className={cn(
          "flex flex-col",
          "gap-[var(--vibe-space-8)] md:gap-[var(--vibe-space-12)]"
        )}
      >
        <EcosystraChromeHorizontalNav
          dictionary={dictionary}
          locale={locale as LocaleType}
          currentView={currentView}
        />
      </header>

      <main
        id={ECOSYSTRA_MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex min-h-0 min-w-0 flex-1 flex-col outline-none"
      >
        <EcosystraChromeWorkspace>{children}</EcosystraChromeWorkspace>
      </main>
    </section>
  )
}
