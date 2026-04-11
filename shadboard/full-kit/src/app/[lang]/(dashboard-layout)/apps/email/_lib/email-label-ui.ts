/** Sidebar / badge text for known EcoEmail.label values. */
export function formatStandardEmailLabel(
  label: string | undefined | null
): string | null {
  if (!label?.trim()) return null
  const l = label.trim().toLowerCase()
  if (l === "personal" || l === "work" || l === "important") {
    return l.charAt(0).toUpperCase() + l.slice(1)
  }
  return label.trim()
}
