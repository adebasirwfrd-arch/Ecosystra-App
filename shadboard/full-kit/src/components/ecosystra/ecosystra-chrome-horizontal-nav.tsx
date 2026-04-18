"use client"

import Link from "next/link"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { useHorizontalNavRovingKeys } from "./hooks/use-horizontal-nav-roving-keys"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ECOSYSTRA_NAV_VIEWS, ecosystraNavLabel } from "./ecosystra-nav-model"
import { VIEW_TO_RELATIVE } from "./ecosystra-routes"

type Props = {
  dictionary: DictionaryType
  locale: LocaleType
  currentView: string
}

export function EcosystraChromeHorizontalNav({
  dictionary,
  locale,
  currentView,
}: Props) {
  const { onNavKeyDown } = useHorizontalNavRovingKeys<HTMLElement>()
  return (
    <ScrollArea className="w-full pb-[var(--vibe-space-2)]">
      <nav
        aria-label={dictionary.ecosystraApp.chrome.mainNavLabel}
        className={cn(
          /* Flex spacing — related toolbar items: small→medium (space-8) */
          "flex w-max min-w-full flex-wrap items-center gap-[var(--vibe-space-8)] border-0 bg-transparent p-0 shadow-none",
          "outline-none",
          "focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
        )}
        onKeyDown={onNavKeyDown}
      >
        {ECOSYSTRA_NAV_VIEWS.map(({ id, icon: Icon }) => {
          const rel = VIEW_TO_RELATIVE[id] ?? "/apps/ecosystra/board"
          const href = ensureLocalizedPathname(rel, locale)
          const active = currentView === id
          return (
            <Link
              key={id}
              href={href}
              scroll={false}
              prefetch
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-[var(--vibe-space-8)] rounded-md px-[var(--vibe-space-12)] py-[var(--vibe-space-8)] text-sm font-medium transition-colors",
                "border-b-2 border-transparent",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4 opacity-80" aria-hidden />
              {ecosystraNavLabel(dictionary, id)}
            </Link>
          )
        })}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
