import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type {
  EmailSidebarItemType,
  EmailSidebarItemsType,
} from "../types"

import { EmailList } from "../_components/email-list"
import { EmailNotFound } from "../_components/email-not-found"

export default async function EmailPage(props: {
  params: Promise<{ filter: string }>
}) {
  const params = await props.params
  const filter = params.filter

  const b = await getShadboardPageContent("email")
  const sidebarItemsData = b.sidebarItemsData as EmailSidebarItemsType

  const isSidebarItem = Object.entries(sidebarItemsData).some(([_, items]) => {
    return items.some((item: EmailSidebarItemType) => item.name === filter)
  })

  if (isSidebarItem) {
    return <EmailList />
  }

  return <EmailNotFound />
}
