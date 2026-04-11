"use client"

import { useMedia } from "react-use"

import type { EmailType } from "../types"

import { CardContent } from "@/components/ui/card"
import { EmailListContentDesktop } from "./email-list-content-desktop"
import { EmailListContentHeader } from "./email-list-content-header"
import { EmailListContentMobile } from "./email-list-content-mobile"

export function EmailListContent({
  displayedEmails,
  filteredEmails,
}: {
  displayedEmails: EmailType[]
  filteredEmails: EmailType[]
}) {
  const isMediumOrSmaller = useMedia("(max-width: 767px)")

  return (
    <CardContent className="flex-1 h-full flex flex-col p-0">
      <EmailListContentHeader filteredEmails={filteredEmails} />
      {isMediumOrSmaller ? (
        <EmailListContentMobile displayedEmails={displayedEmails} />
      ) : (
        <EmailListContentDesktop displayedEmails={displayedEmails} />
      )}
    </CardContent>
  )
}
