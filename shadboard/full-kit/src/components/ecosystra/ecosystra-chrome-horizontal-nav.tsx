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

/**
 * Primary nav: inline icon + label (reference layout), underline active state.
 * Icons come from `ecosystra-nav-model` only — do not swap without product sign-off.
 * RBAC for data/actions remains server-side (GraphQL).
 */
export function EcosystraChromeHorizontalNav({
  dictionary,
  locale,
  currentView,
}: Props) {
  const { onNavKeyDown } = useHorizontalNavRovingKeys<HTMLElement>()
  return (
    <ScrollArea className="w-full">
      <nav
        aria-label={dictionary.ecosystraApp.chrome.mainNavLabel}
        className={cn(
          "flex w-max min-w-full items-stretch justify-start gap-1 border-b border-border/80 bg-background/95 pl-2 pr-1 outline-none sm:gap-2 sm:pl-4",
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
                "group touch-manipulation shrink-0 outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "border-b-2 border-transparent px-2.5 py-2.5 sm:px-4 sm:py-3",
                active
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium sm:text-[0.9375rem]">
                <Icon
                  className={cn(
                    "size-[1.05rem] shrink-0 sm:size-[1.125rem]",
                    active ? "text-foreground" : "opacity-90"
                  )}
                  aria-hidden
                />
                <span className={cn(active && "font-semibold")}>
                  {ecosystraNavLabel(dictionary, id)}
                </span>
              </span>
            </Link>
          )
        })}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
