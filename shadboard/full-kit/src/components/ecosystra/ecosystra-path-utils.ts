/** First segment after `/` — Shadboard `[lang]` convention. */
export function localeSegmentFromPathname(pathname: string): string {
  return pathname.split("/")[1] || "en"
}
