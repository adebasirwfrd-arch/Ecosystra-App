import type { Metadata } from "next"
import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"

import { EmailWrapper } from "./_components/email-wrapper"

export const metadata: Metadata = {
  title: "Email",
}

export default async function EmailLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  return (
    <EmailWrapper apiAccessToken={session.apiAccessToken ?? null}>
      {children}
    </EmailWrapper>
  )
}
