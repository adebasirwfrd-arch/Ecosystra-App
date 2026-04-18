"use client"

import { createContext, useContext } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

const EcosystraDictionaryContext = createContext<DictionaryType | null>(null)

export function EcosystraDictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: DictionaryType
  children: ReactNode
}) {
  return (
    <EcosystraDictionaryContext.Provider value={dictionary}>
      {children}
    </EcosystraDictionaryContext.Provider>
  )
}

/** Use under `EcosystraDictionaryProvider` (embedded Shadboard routes). */
export function useEcosystraDictionary(): DictionaryType {
  const value = useContext(EcosystraDictionaryContext)
  if (!value) {
    throw new Error(
      "useEcosystraDictionary must be used within EcosystraDictionaryProvider"
    )
  }
  return value
}

/** Safe for standalone Ecosystra build where the provider is absent. */
export function useOptionalEcosystraDictionary(): DictionaryType | null {
  return useContext(EcosystraDictionaryContext)
}
