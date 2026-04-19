"use client"

import { useMedia } from "react-use"

import { useSettings } from "@/hooks/use-settings"

export function useIsDarkMode() {
  const { settings } = useSettings()
  /** `false` default avoids SSR vs first client paint mismatch (react-use useMedia + window.matchMedia). */
  const isDarkModePreferred = useMedia("(prefers-color-scheme: dark)", false)

  let resolvedMode = settings.mode

  if (resolvedMode === "system") {
    resolvedMode = isDarkModePreferred ? "dark" : "light"
  }

  return resolvedMode === "dark"
}
