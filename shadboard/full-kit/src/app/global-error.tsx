"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    fetch("/api/error-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        source: "boundary",
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        extra: { digest: error.digest },
      }),
    })
      .then(async (res) => {
        if (process.env.NODE_ENV === "development" && !res.ok) {
          const text = await res.text().catch(() => "")
          console.warn(
            "[error-logs] boundary report failed:",
            res.status,
            text || res.statusText
          )
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[error-logs] boundary request failed:", err)
        }
      })
  }, [error])

  return (
    <html>
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            The error has been logged. Please try again.
          </p>
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
            onClick={() => reset()}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  )
}
