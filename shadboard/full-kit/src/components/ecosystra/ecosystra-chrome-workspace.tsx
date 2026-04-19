"use client"

import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

/** Fills main under horizontal nav without an extra separator or card frame. */
export function EcosystraChromeWorkspace({ children }: Props) {
  return (
    <div className="flex min-h-[min(100%,calc(100dvh-14rem))] min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {children}
    </div>
  )
}
