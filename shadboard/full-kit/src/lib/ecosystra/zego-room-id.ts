/**
 * ZEGO Live / UIKit room IDs must be stable, URL-safe strings.
 * UUID-style ids with hyphens (and mixed punctuation) can trigger login failures
 * (e.g. SDK errors 20014 / server 50120). Keep [a-zA-Z0-9_] only, max length.
 */
export const ZEGO_ROOM_ID_MAX = 128

export function sanitizeZegoRoomId(raw: string): string {
  let s = raw.trim()
  if (!s) return "ecosystra_room"
  s = s.replace(/[^a-zA-Z0-9_]/g, "_")
  s = s.replace(/_+/g, "_").replace(/^_|_$/g, "")
  if (!s.length) s = "ecosystra_room"
  if (s.length > ZEGO_ROOM_ID_MAX) s = s.slice(0, ZEGO_ROOM_ID_MAX)
  return s
}
