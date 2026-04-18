"use client"

import { EcosystraApp } from "./ecosystra-app"

/**
 * Shell wrapper for the embedded Ecosystra app (`EcosystraApp` under
 * `src/components/ecosystra`). Avoid `next/dynamic` here so the client tree
 * stays stable across `/apps/ecosystra/*` navigations.
 */
export function EcosystraShell() {
  return <EcosystraApp />
}
