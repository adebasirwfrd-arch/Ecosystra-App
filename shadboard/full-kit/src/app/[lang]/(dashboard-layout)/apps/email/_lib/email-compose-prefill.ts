import type { EmailType } from "../types"

import { formatDate } from "@/lib/utils"

const STORAGE_KEY = "ecosystra-email-compose-prefill"

export type ComposePrefillPayload = {
  to: string
  subject: string
  content: string
  cc?: string
  bcc?: string
}

export function setComposePrefill(payload: ComposePrefillPayload): void {
  if (typeof sessionStorage === "undefined") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function consumeComposePrefill(): ComposePrefillPayload | null {
  if (typeof sessionStorage === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    const o = JSON.parse(raw) as ComposePrefillPayload
    if (typeof o.to !== "string" || typeof o.subject !== "string" || typeof o.content !== "string") {
      return null
    }
    return o
  } catch {
    return null
  }
}

function reSubject(prefix: string, subject: string): string {
  const s = subject.trim()
  const lower = s.toLowerCase()
  if (lower.startsWith(prefix.toLowerCase())) return s
  return `${prefix} ${s}`
}

export function buildReplyPrefill(email: EmailType): ComposePrefillPayload {
  const when = formatDate(email.createdAt)
  return {
    to: email.sender.email,
    subject: reSubject("Re:", email.subject),
    content: `<p><br></p><p>—</p><p>On ${when}, ${email.sender.name} &lt;${email.sender.email}&gt; wrote:</p>${email.content ? email.content : "<p></p>"}`,
  }
}

export function buildForwardPrefill(email: EmailType): ComposePrefillPayload {
  return {
    to: "",
    subject: reSubject("Fwd:", email.subject),
    content: `<p><br></p><p>— Forwarded message —</p><p><strong>From:</strong> ${email.sender.name} &lt;${email.sender.email}&gt;</p><p><strong>Subject:</strong> ${email.subject}</p>${email.content ? email.content : "<p></p>"}`,
  }
}
