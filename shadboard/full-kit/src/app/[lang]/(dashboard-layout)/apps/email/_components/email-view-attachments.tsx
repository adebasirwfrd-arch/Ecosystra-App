"use client"

import type { EmailAttachmentItem, EmailType } from "../types"

function listAttachments(email: EmailType): EmailAttachmentItem[] {
  const raw = email.attachments
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (a): a is EmailAttachmentItem =>
      typeof a === "object" &&
      a !== null &&
      typeof (a as EmailAttachmentItem).fileName === "string" &&
      typeof (a as EmailAttachmentItem).contentBase64 === "string"
  )
}

export function EmailViewAttachments({ email }: { email: EmailType }) {
  const items = listAttachments(email)
  if (items.length === 0) return null

  return (
    <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground mb-2">Attachments</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((att, i) => {
          const mime = att.mimeType || "application/octet-stream"
          const href = `data:${mime};base64,${att.contentBase64}`
          return (
            <li key={`${att.fileName}-${i}`}>
              <a
                href={href}
                download={att.fileName}
                className="text-sm text-primary underline underline-offset-2 hover:text-primary/90 break-all"
              >
                {att.fileName}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
