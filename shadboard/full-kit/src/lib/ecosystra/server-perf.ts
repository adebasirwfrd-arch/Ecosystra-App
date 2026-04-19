/**
 * Server-side timing for Ecosystra GraphQL resolvers (DB + CPU on the Node process).
 * Enable with ECOSYSTRA_SERVER_PERF=1 (e.g. in .env.local), restart `pnpm dev`, then watch
 * the terminal where Next runs — compare with browser `__ecosystraPerf` (network + JSON).
 */

export function isEcosystraServerPerfEnabled(): boolean {
  const v = process.env.ECOSYSTRA_SERVER_PERF?.trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes"
}

export function logEcosystraServerPerf(
  payload: Record<string, unknown>
): void {
  if (!isEcosystraServerPerfEnabled()) return
  // eslint-disable-next-line no-console -- intentional perf harness
  console.info("[ecosystra-server-perf]", {
    at: new Date().toISOString(),
    ...payload,
  })
}
