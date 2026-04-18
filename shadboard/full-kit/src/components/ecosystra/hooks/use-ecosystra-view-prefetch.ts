"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { VIEW_TO_RELATIVE } from "../ecosystra-routes"

/**
 * Prefetch Ecosystra shell routes so first in-app navigation stays snappy
 * (layout-level concern; mirrors prior inline effect in `EcosystraApp`).
 */
export function useEcosystraViewPrefetch(locale: string): void {
  const router = useRouter()

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
}
