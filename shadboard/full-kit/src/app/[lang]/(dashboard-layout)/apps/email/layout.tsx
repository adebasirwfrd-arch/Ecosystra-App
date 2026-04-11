import type { Metadata } from "next"
import type { ReactNode } from "react"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type { EmailSidebarItemsType, EmailType } from "./types"

import { EmailWrapper } from "./_components/email-wrapper"

export const metadata: Metadata = {
  title: "Email",
}

export default async function EmailLayout({
  children,
}: {
  children: ReactNode
}) {
  const b = await getShadboardPageContent("email")

  return (
    <EmailWrapper
      emailsData={b.emailsData as EmailType[]}
      sidebarItemsData={b.sidebarItemsData as EmailSidebarItemsType}
    >
      {children}
    </EmailWrapper>
  )
}
