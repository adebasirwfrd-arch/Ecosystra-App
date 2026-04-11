/** Avoids build/runtime crash when `BASE_URL` is missing scheme or invalid. */
export function safeMetadataBase(): URL {
  const raw = process.env.BASE_URL || "http://localhost:3000"
  try {
    return new URL(raw)
  } catch {
    return new URL("http://localhost:3000")
  }
}
