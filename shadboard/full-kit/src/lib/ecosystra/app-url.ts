/**
 * Public URLs for Ecosystra (emails, cron, deep links).
 *
 * **Vercel / production:** set either `APP_BASE_URL` or `NEXT_PUBLIC_APP_URL` to:
 * - `https://ecosystra-app.vercel.app` → board links become `/{locale}/apps/ecosystra/board?…`
 * - `https://ecosystra-app.vercel.app/en/apps/ecosystra` → board links become `…/en/apps/ecosystra/board?…`
 *   (locale segment in env is respected; do not duplicate locale in the path.)
 */

const DEFAULT_PUBLIC_ORIGIN = "https://ecosystra-app.vercel.app"

function rawPublicBase(): string {
  const v = (
    process.env.APP_BASE_URL ||
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    DEFAULT_PUBLIC_ORIGIN
  ).trim()
  return v || DEFAULT_PUBLIC_ORIGIN
}

/** Site origin only, e.g. `https://ecosystra-app.vercel.app` */
export function getPublicSiteOrigin(): string {
  const raw = rawPublicBase()
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`)
    return u.origin.replace(/\/$/, "")
  } catch {
    return DEFAULT_PUBLIC_ORIGIN
  }
}

function ecosystraInviteLocale(): string {
  const v = process.env.NEXT_PUBLIC_ECOSYSTRA_INVITE_LOCALE?.trim()
  if (v) return v
  return "en"
}

/**
 * Absolute URL to the main Ecosystra board with query (e.g. `task`, `acceptAssignee`).
 */
export function buildEcosystraBoardAbsoluteUrl(
  query: Record<string, string>
): string {
  const raw = rawPublicBase().replace(/\/$/, "")
  const qs = new URLSearchParams(query).toString()
  const suffix = qs ? `?${qs}` : ""

  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`)
    const path = (u.pathname || "").replace(/\/$/, "")

    if (/\/apps\/ecosystra\/board$/i.test(path)) {
      return `${u.origin}${path}${suffix}`
    }
    if (/\/apps\/ecosystra$/i.test(path)) {
      return `${u.origin}${path}/board${suffix}`
    }

    const locale = ecosystraInviteLocale()
    return `${u.origin}/${locale}/apps/ecosystra/board${suffix}`
  } catch {
    const locale = ecosystraInviteLocale()
    return `${getPublicSiteOrigin()}/${locale}/apps/ecosystra/board${suffix}`
  }
}
