/** Post-login / “home” route for this app (locale added by middleware / i18n helpers). */
export const DEFAULT_APP_HOME_PATHNAME = "/apps/ecosystra"

function looksLikeLegacyDashboardPath(p: string): boolean {
  return p.startsWith("/dashboards") || p.includes("/dashboards/")
}

/**
 * Normalizes `HOME_PATHNAME` / `NEXT_PUBLIC_HOME_PATHNAME` / `redirectTo` values.
 * Legacy removed-template paths under the old dashboards catalog are rewritten to Ecosystra.
 */
export function sanitizeAppHomePathname(
  raw: string | undefined | null
): string {
  const t = (raw ?? "").trim()
  if (!t || t === "/" || looksLikeLegacyDashboardPath(t)) {
    return DEFAULT_APP_HOME_PATHNAME
  }
  return t.startsWith("/") ? t : `/${t}`
}

/** Legacy `/:lang` + dashboards catalog → `/:lang/apps/ecosystra` (stale bookmarks / callbackUrl). */
export function rewriteLegacyDashboardPathname(pathname: string): string {
  if (!pathname.includes("dashboards")) return pathname
  const m = pathname.match(/^\/([a-z]{2})\/dashboards(?:\/.*)?$/i)
  if (m) return `/${m[1]}/apps/ecosystra`
  if (pathname === "/dashboards" || pathname.startsWith("/dashboards/")) {
    return "/en/apps/ecosystra"
  }
  return DEFAULT_APP_HOME_PATHNAME
}
