"use client"

import { EcosystraApp } from "./ecosystra-app"

/**
 * Shell wrapper for the embedded Ecosystra app.
 * We avoid `next/dynamic` here: dynamic-splitting the module that imports
 * `ecosystra-clone/.../App` can break Webpack chunk wiring (runtime
 * "Cannot read properties of undefined (reading 'call')") with `externalDir`.
 */
export function EcosystraShell() {
  return <EcosystraApp />
}
