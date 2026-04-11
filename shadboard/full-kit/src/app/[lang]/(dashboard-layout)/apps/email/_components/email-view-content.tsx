"use client"

import { useParams, useRouter } from "next/navigation"

import type { EmailType } from "../types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { CardContent } from "@/components/ui/card"
import { EmailViewContentActions } from "./email-view-content-actions"
import { EmailViewAttachments } from "./email-view-attachments"
import { EmailViewContentBody } from "./email-view-content-body"
import { EmailViewContentFooter } from "./email-view-content-footer"
import { EmailViewContentHeader } from "./email-view-content-header"

export function EmailViewContent({
  email,
  onAfterDetailMutation,
}: {
  email: EmailType
  onAfterDetailMutation?: () => void | Promise<void>
}) {
  const router = useRouter()
  const params = useParams()
  const locale = String(params.lang ?? "en")
  const filter = String(params.filter ?? "inbox")

  const goBackToList = () => {
    router.push(ensureLocalizedPathname(`/apps/email/${filter}`, locale))
  }

  return (
    <CardContent className="p-3 space-y-3 overflow-hidden">
      <EmailViewContentActions
        email={email}
        onAfterDestructiveAction={goBackToList}
        onAfterDetailMutation={onAfterDetailMutation}
      />
      <EmailViewContentHeader email={email} />
      <EmailViewAttachments email={email} />
      <EmailViewContentBody email={email} />
      <EmailViewContentFooter email={email} locale={locale} />
    </CardContent>
  )
}
