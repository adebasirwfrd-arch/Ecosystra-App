import type { ReactNode } from "react"

import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import { EcosystraDictionaryProvider } from "@/components/ecosystra/ecosystra-dictionary-context"
import { EcosystraShell } from "@/components/ecosystra/ecosystra-shell"

/**
 * Keeps a single Ecosystra client tree mounted across /apps/ecosystra/* so
 * in-app navigation does not remount Apollo + the full App bundle on every view change.
 * Loads the Shadboard dictionary for i18n in embedded UI (chrome + profile, etc.).
 */
export default async function EcosystraLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as LocaleType)

  return (
    <>
      <EcosystraDictionaryProvider dictionary={dictionary}>
        <EcosystraShell />
      </EcosystraDictionaryProvider>
      {children}
    </>
  )
}
