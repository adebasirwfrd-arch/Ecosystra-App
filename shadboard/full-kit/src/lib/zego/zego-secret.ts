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
  if (t.length === 32) {
    return t
  }
  throw new Error(
    "ZEGO_SERVER_SECRET must be 32 ASCII characters or 64 hex characters"
  )
}
