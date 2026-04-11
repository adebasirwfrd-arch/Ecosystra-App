"use client"

import DOMPurify from "isomorphic-dompurify"

import type { EmailType } from "../types"

import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** TipTap menyimpan isi sebagai HTML (<p>…</p>); tampilkan sebagai HTML yang sudah disanitasi, bukan teks mentah. */
function sanitizeEmailHtml(html: string): string {
  const trimmed = html?.trim() ?? ""
  if (!trimmed) return ""
  return DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "span",
      "div",
      "img",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt"],
  })
}

export function EmailViewContentBody({ email }: { email: EmailType }) {
  const safe = sanitizeEmailHtml(email.content)
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(email.content)

  if (!safe) {
    return <CardContent className="text-muted-foreground">(No content)</CardContent>
  }

  if (!looksLikeHtml) {
    return (
      <CardContent className="whitespace-pre-wrap px-6 py-4">{safe}</CardContent>
    )
  }

  return (
    <CardContent
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none px-6 py-4",
        "[&_p]:my-2 [&_p:first-child]:mt-0 [&_ul]:my-2 [&_ol]:my-2"
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}
