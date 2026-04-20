/**
 * ZEGO `generateToken04` expects `secret` as a 32-character key string.
 * The console often shows a 64-character hex AppSign — decode it to 32 bytes
 * and pass as a Latin-1 string (32 chars).
 */
export function normalizeZegoServerSecret(raw: string): string {
  const t = raw.trim()
  if (t.length === 64 && /^[0-9a-fA-F]+$/.test(t)) {
    const buf = Buffer.from(t, "hex")
    if (buf.length !== 32) {
      throw new Error("ZEGO_SERVER_SECRET hex must decode to 32 bytes")
    }
    return buf.toString("latin1")
  }
  // 32 hex chars = 16 bytes — never valid for Token04; people often paste half of AppSign.
  if (t.length === 32 && /^[0-9a-fA-F]{32}$/.test(t)) {
    throw new Error(
      "Zego secret looks like 32 hex digits (half an AppSign). Set ZEGO_APP_SIGN to the full 64-character AppSign from ZEGOCLOUD Console (Project → Basic setup), or remove a bad ZEGO_SERVER_SECRET so ZEGO_APP_SIGN is used. You can also use a 32-character server key if your project provides one."
    )
  }
  if (t.length === 32) {
    return t
  }
  throw new Error(
    "ZEGO_APP_SIGN / ZEGO_SERVER_SECRET must be 64 hex characters (AppSign) or exactly 32 ASCII characters (server key)"
  )
}
