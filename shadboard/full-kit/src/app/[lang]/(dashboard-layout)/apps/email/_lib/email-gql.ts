import type { EmailAttachmentItem, EmailType, EmailSidebarItemsType } from "../types"

const GQL_URL = "/api/graphql"

const EMAIL_SELECTION = `id sender { id name email avatar status } recipientId subject content read starred label isDraft isSent isStarred isSpam isDeleted muted cc bcc attachments createdAt`

async function gqlFetch<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string | null
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(GQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    credentials: "same-origin",
  })

  const raw = await res.text()
  const trimmed = raw.trim()
  if (!trimmed) {
    const hint = res.ok
      ? "Empty response from /api/graphql (server returned no body)."
      : `HTTP ${res.status} ${res.statusText || ""} — empty body from /api/graphql.`
    console.error("[email-gql]", hint)
    throw new Error(hint)
  }

  let json: { data?: T; errors?: unknown[] }
  try {
    json = JSON.parse(trimmed) as { data?: T; errors?: unknown[] }
  } catch {
    const preview = trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed
    const msg = `Invalid JSON from /api/graphql (HTTP ${res.status}): ${preview}`
    console.error("[email-gql]", msg)
    throw new Error(msg)
  }

  // GraphQL errors in body take precedence over HTTP status (some servers use 4xx/5xx + errors).
  if (json.errors?.length) {
    const first = json.errors[0] as { message?: string }
    const msg =
      typeof first?.message === "string" ? first.message : JSON.stringify(first)
    console.error("[email-gql]", msg, json.errors)
    throw new Error(msg)
  }

  if (!res.ok) {
    const msg = `GraphQL request failed: HTTP ${res.status} ${res.statusText || ""}`
    console.error("[email-gql]", msg, json)
    throw new Error(msg)
  }

  return json.data as T
}

export async function fetchEmails(
  filter: string,
  token: string | null
): Promise<EmailType[]> {
  const data = await gqlFetch<{ emails: EmailType[] }>(
    `query Emails($filter: String!) { emails(filter: $filter) { ${EMAIL_SELECTION} } }`,
    { filter },
    token
  )
  return data.emails
}

export async function fetchEmailById(
  id: string,
  token: string | null
): Promise<EmailType | null> {
  const data = await gqlFetch<{ emailById: EmailType | null }>(
    `query EmailById($id: ID!) { emailById(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.emailById
}

export async function fetchEmailCounts(
  token: string | null
): Promise<Record<string, number>> {
  const data = await gqlFetch<{ emailCounts: Record<string, number> }>(
    `query { emailCounts { inbox sent draft starred spam trash personal important work } }`,
    {},
    token
  )
  return data.emailCounts
}

export async function sendEmailMutation(
  to: string,
  subject: string,
  content: string,
  label: string | undefined,
  token: string | null,
  cc: string | undefined,
  bcc: string | undefined,
  attachments: EmailAttachmentItem[] | undefined
): Promise<EmailType> {
  const data = await gqlFetch<{ sendEmail: EmailType }>(
    `mutation SendEmail($to: String!, $subject: String!, $content: String!, $label: String, $cc: String, $bcc: String, $attachments: JSON) {
      sendEmail(to: $to, subject: $subject, content: $content, label: $label, cc: $cc, bcc: $bcc, attachments: $attachments) { ${EMAIL_SELECTION} }
    }`,
    {
      to,
      subject,
      content,
      label: label || null,
      cc: cc?.trim() ? cc.trim() : null,
      bcc: bcc?.trim() ? bcc.trim() : null,
      attachments: attachments?.length ? attachments : null,
    },
    token
  )
  return data.sendEmail
}

export async function toggleStarMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ toggleStarEmail: EmailType }>(
    `mutation ToggleStar($id: ID!) { toggleStarEmail(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.toggleStarEmail
}

export async function markReadMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ markEmailAsRead: EmailType }>(
    `mutation MarkRead($id: ID!) { markEmailAsRead(id: $id) { id read } }`,
    { id },
    token
  )
  return data.markEmailAsRead
}

export async function deleteEmailMutation(
  id: string,
  token: string | null
): Promise<boolean> {
  try {
    const data = await gqlFetch<{ deleteEmail: boolean }>(
      `mutation DeleteEmail($id: ID!) { deleteEmail(id: $id) }`,
      { id },
      token
    )
    return data.deleteEmail
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg === "NOT_FOUND" || msg.includes("NOT_FOUND")) {
      return true
    }
    throw e
  }
}

export async function archiveEmailMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ archiveEmail: EmailType }>(
    `mutation ArchiveEmail($id: ID!) { archiveEmail(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.archiveEmail
}

export async function markEmailAsSpamMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ markEmailAsSpam: EmailType }>(
    `mutation MarkSpam($id: ID!) { markEmailAsSpam(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.markEmailAsSpam
}

export async function markEmailAsUnreadMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ markEmailAsUnread: EmailType }>(
    `mutation MarkUnread($id: ID!) { markEmailAsUnread(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.markEmailAsUnread
}

/** `label` empty string clears the label (Personal / Work / Important). */
export async function setEmailLabelMutation(
  id: string,
  label: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ setEmailLabel: EmailType }>(
    `mutation SetEmailLabel($id: ID!, $label: String!) { setEmailLabel(id: $id, label: $label) { ${EMAIL_SELECTION} } }`,
    { id, label },
    token
  )
  return data.setEmailLabel
}

export async function toggleMuteEmailMutation(
  id: string,
  token: string | null
): Promise<EmailType> {
  const data = await gqlFetch<{ toggleMuteEmail: EmailType }>(
    `mutation ToggleMute($id: ID!) { toggleMuteEmail(id: $id) { ${EMAIL_SELECTION} } }`,
    { id },
    token
  )
  return data.toggleMuteEmail
}

export function buildSidebarItems(
  counts: Record<string, number>
): EmailSidebarItemsType {
  return {
    folders: [
      { iconName: "Inbox", name: "inbox", unreadCount: counts.inbox || 0 },
      { iconName: "Send", name: "sent", unreadCount: counts.sent || 0 },
      { iconName: "File", name: "draft", unreadCount: counts.draft || 0 },
      { iconName: "Star", name: "starred", unreadCount: counts.starred || 0 },
      { iconName: "AlertOctagon", name: "spam", unreadCount: counts.spam || 0 },
      { iconName: "Trash2", name: "trash", unreadCount: counts.trash || 0 },
    ],
    labels: [
      { iconName: "User", name: "personal", unreadCount: counts.personal || 0 },
      { iconName: "Briefcase", name: "work", unreadCount: counts.work || 0 },
      { iconName: "AlertTriangle", name: "important", unreadCount: counts.important || 0 },
    ],
  }
}
