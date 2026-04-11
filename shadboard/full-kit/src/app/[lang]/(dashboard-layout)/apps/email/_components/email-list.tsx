"use client"

import { useEffect, useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"

import { useEmailContext } from "../_hooks/use-email-context"
import {
  filterEmailsBySearchTerm,
  slicePage,
  totalPagesFor,
} from "../_lib/email-list-helpers"
import { Card } from "@/components/ui/card"
import { EmailListContent } from "./email-list-content"
import { EmailListFooter } from "./email-list-footer"
import { EmailListHeader } from "./email-list-header"

export function EmailList() {
  const { handleGetFilteredEmails, emailState } = useEmailContext()
  const params = useParams()
  const searchParams = useSearchParams()
  const filter = params.filter as string
  const pageRaw = searchParams.get("page")
  const page = Math.max(1, pageRaw ? parseInt(pageRaw, 10) || 1 : 1)

  useEffect(() => {
    handleGetFilteredEmails(filter, 1)
  }, [filter, handleGetFilteredEmails])

  const filtered = useMemo(
    () => filterEmailsBySearchTerm(emailState.emails, emailState.listSearchTerm),
    [emailState.emails, emailState.listSearchTerm]
  )

  const totalPages = totalPagesFor(filtered.length)
  const safePage = Math.min(page, totalPages)

  const displayed = useMemo(
    () => slicePage(filtered, safePage),
    [filtered, safePage]
  )

  return (
    <Card className="flex-1 w-full flex flex-col md:w-auto">
      <EmailListHeader totalPages={totalPages} currentPage={safePage} />
      <EmailListContent displayedEmails={displayed} filteredEmails={filtered} />
      <EmailListFooter
        filteredCount={filtered.length}
        page={safePage}
        totalPages={totalPages}
      />
    </Card>
  )
}
