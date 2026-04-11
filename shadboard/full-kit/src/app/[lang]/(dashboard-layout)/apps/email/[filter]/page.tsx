import { EmailList } from "../_components/email-list"
import { EmailNotFound } from "../_components/email-not-found"

const VALID_FILTERS = new Set([
  "inbox",
  "sent",
  "draft",
  "starred",
  "spam",
  "trash",
  "personal",
  "important",
  "work",
])

export default async function EmailPage(props: {
  params: Promise<{ filter: string }>
}) {
  const params = await props.params

  if (VALID_FILTERS.has(params.filter)) {
    return <EmailList />
  }

  return <EmailNotFound />
}
