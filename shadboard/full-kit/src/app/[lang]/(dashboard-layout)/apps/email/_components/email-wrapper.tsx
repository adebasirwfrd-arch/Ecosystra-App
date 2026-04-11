"use client"

import type { ReactNode } from "react"

import { EmailProvider } from "../_contexts/email-context"
import { EmailSidebar } from "./email-sidebar"

export function EmailWrapper({
  apiAccessToken,
  children,
}: {
  apiAccessToken: string | null
  children: ReactNode
}) {
  return (
    <EmailProvider apiAccessToken={apiAccessToken}>
      <section className="container h-full w-full flex gap-4 p-4">
        <EmailSidebar />
        {children}
      </section>
    </EmailProvider>
  )
}
