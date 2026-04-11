"use client"

import { useRouter } from "next/navigation"
import { Forward, Reply } from "lucide-react"

import type { EmailType } from "../types"

import {
  buildForwardPrefill,
  buildReplyPrefill,
  setComposePrefill,
} from "../_lib/email-compose-prefill"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"

export function EmailViewContentFooter({
  email,
  locale,
}: {
  email: EmailType
  locale: string
}) {
  const router = useRouter()

  function goComposeFromPrefill(mode: "reply" | "forward") {
    const payload =
      mode === "reply" ? buildReplyPrefill(email) : buildForwardPrefill(email)
    setComposePrefill(payload)
    const path = ensureLocalizedPathname("/apps/email/compose", locale)
    router.push(`${path}?prefill=1`)
  }

  return (
    <CardFooter className="p-3 pt-0 gap-1.5">
      <Button
        type="button"
        variant="outline"
        onClick={() => goComposeFromPrefill("reply")}
      >
        <Reply className="me-2 h-4 w-4" />
        <span>Reply</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => goComposeFromPrefill("forward")}
      >
        <Forward className="me-2 h-4 w-4" />
        <span>Forward</span>
      </Button>
    </CardFooter>
  )
}
