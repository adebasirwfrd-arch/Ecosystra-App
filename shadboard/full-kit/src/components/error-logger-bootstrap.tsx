"use client"

import { useEffect } from "react"

function postClientError(payload: {
  source: "client"
  message: string
  stack?: string
  extra?: Record<string, unknown>
}) {
  const body = JSON.stringify({
    ...payload,
    url: window.location.href,
    userAgent: navigator.userAgent,
  })

  fetch("/api/error-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "same-origin",
  })
    .then(async (res) => {
      if (process.env.NODE_ENV === "development" && !res.ok) {
        const text = await res.text().catch(() => "")
        console.warn(
          "[error-logs] failed to persist:",
          res.status,
          text || res.statusText
        )
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[error-logs] request failed:", err)
      }
    })
}

export function ErrorLoggerBootstrap() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      postClientError({
        source: "client",
        message: event.message || "Unhandled window error",
        stack: event.error?.stack,
        extra: {
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
        },
      })
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as unknown
      postClientError({
        source: "client",
        message:
          reason instanceof Error
            ? reason.message
            : "Unhandled promise rejection",
        stack: reason instanceof Error ? reason.stack : undefined,
        extra:
          reason instanceof Error
            ? undefined
            : {
                reason,
              },
      })
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onUnhandledRejection)

    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onUnhandledRejection)
    }
  }, [])

  return null
}
