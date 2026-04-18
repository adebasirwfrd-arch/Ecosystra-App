"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import type { ReactNode } from "react"

import { EcosystraAlertBanner } from "./ecosystra-alert-banner"
import type { EcosystraAlertBannerProps } from "./ecosystra-alert-banner"

type AlertBannerContextValue = {
  banner: EcosystraAlertBannerProps | null
  showBanner: (props: EcosystraAlertBannerProps) => void
  hideBanner: () => void
}

const AlertBannerContext = createContext<AlertBannerContextValue | null>(null)

export function EcosystraAlertBannerProvider({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<EcosystraAlertBannerProps | null>(null)

  const showBanner = useCallback((props: EcosystraAlertBannerProps) => {
    setBanner(props)
  }, [])

  const hideBanner = useCallback(() => {
    setBanner(null)
  }, [])

  const value = useMemo(
    () => ({ banner, showBanner, hideBanner }),
    [banner, showBanner, hideBanner]
  )

  return (
    <AlertBannerContext.Provider value={value}>
      {children}
    </AlertBannerContext.Provider>
  )
}

/** Programmatic API — Vibe: one system-level banner at top of shell. */
export function useEcosystraAlertBanner() {
  const ctx = useContext(AlertBannerContext)
  if (!ctx) {
    throw new Error(
      "useEcosystraAlertBanner must be used within EcosystraAlertBannerProvider"
    )
  }
  return { showBanner: ctx.showBanner, hideBanner: ctx.hideBanner }
}

/**
 * Renders the active banner from context — place **below** skip-link, **above** nav (GRANDBOOK: top of screen).
 */
export function EcosystraAlertBannerHost() {
  const ctx = useContext(AlertBannerContext)
  if (!ctx) return null

  const { banner, hideBanner } = ctx
  if (!banner) return null

  if ("onDismiss" in banner && banner.onDismiss) {
    const { onDismiss: userDismiss, closeButtonAriaLabel, ...rest } = banner
    return (
      <EcosystraAlertBanner
        {...rest}
        closeButtonAriaLabel={closeButtonAriaLabel}
        onDismiss={() => {
          userDismiss()
          hideBanner()
        }}
      />
    )
  }

  return <EcosystraAlertBanner {...banner} />
}
