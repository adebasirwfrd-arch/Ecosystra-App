import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

/**
 * Maps persisted `Notification.link` (absolute URL or path) to a localized board
 * deep-link (`/apps/ecosystra/board?task=&group=`) for in-app navigation.
 */
export function boardHrefFromNotificationLink(
  link: string | null | undefined,
  locale: LocaleType
): string | null {
  const raw = link?.trim()
  if (!raw) return null
  let pathname = ""
  let search = ""
  try {
    if (/^https?:\/\//i.test(raw)) {
      const u = new URL(raw)
      pathname = u.pathname
      search = u.search
    } else if (raw.startsWith("/")) {
      const q = raw.indexOf("?")
      pathname = q >= 0 ? raw.slice(0, q) : raw
      search = q >= 0 ? raw.slice(q) : ""
    } else {
      return null
    }
  } catch {
    return null
  }
  if (!pathname.includes("/apps/ecosystra/board")) return null
  const sp = new URLSearchParams(search.startsWith("?") ? search.slice(1) : "")
  const task = sp.get("task")?.trim()
  if (!task) return null
  const group = sp.get("group")?.trim()
  const rel = group
    ? `/apps/ecosystra/board?task=${encodeURIComponent(task)}&group=${encodeURIComponent(group)}`
    : `/apps/ecosystra/board?task=${encodeURIComponent(task)}`
  return ensureLocalizedPathname(rel, locale)
}
