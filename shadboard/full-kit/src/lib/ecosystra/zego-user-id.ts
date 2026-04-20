/** Zego UIKit token / userID: alphanumeric, underscore, hyphen; max 64. */
export function sanitizeZegoUserId(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9_-]/g, "_")
  return s.length > 0 ? s.slice(0, 64) : "user"
}
