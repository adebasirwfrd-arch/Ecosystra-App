/** Pipeline stages — aligned with CRM dashboard funnel + closed lost. */
export const CRM_DEAL_STAGES = [
  "LEAD",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
] as const

export type CrmDealStage = (typeof CRM_DEAL_STAGES)[number]

/** Lead attribution keys — aligned with `LeadSourceType["leads"]`. */
export const CRM_LEAD_SOURCES = [
  "socialMedia",
  "emailCampaigns",
  "referrals",
  "website",
  "other",
] as const

export type CrmLeadSource = (typeof CRM_LEAD_SOURCES)[number]

export function isCrmDealStage(s: string): s is CrmDealStage {
  return (CRM_DEAL_STAGES as readonly string[]).includes(s)
}

export function isCrmLeadSource(s: string): s is CrmLeadSource {
  return (CRM_LEAD_SOURCES as readonly string[]).includes(s)
}
