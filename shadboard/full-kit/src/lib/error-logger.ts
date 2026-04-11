import { appendFile, mkdir } from "node:fs/promises"
import path from "node:path"

type ErrorLogPayload = {
  source: "client" | "server" | "boundary"
  message: string
  stack?: string
  url?: string
  userAgent?: string
  extra?: Record<string, unknown>
}

export async function writeErrorLog(payload: ErrorLogPayload) {
  const logsDir = path.join(process.cwd(), "logs")
  const logsFile = path.join(logsDir, "app-errors.log")

  await mkdir(logsDir, { recursive: true })

  const entry = {
    timestamp: new Date().toISOString(),
    ...payload,
  }

  if (process.env.NODE_ENV === "development") {
    console.error(
      "[app-errors]",
      entry.source,
      entry.message,
      entry.url ? `\n  url: ${entry.url}` : "",
      entry.stack ? `\n${entry.stack}` : ""
    )
  }

  await appendFile(logsFile, `${JSON.stringify(entry)}\n`, "utf8")
}
