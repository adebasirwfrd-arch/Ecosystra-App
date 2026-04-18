import { CRM_POSTGREST_SCHEMA } from "@/lib/supabase/crm-client"
import { serializeCrmDeal } from "@/lib/data/crm/serializers"

import type { SupabaseClient } from "@supabase/supabase-js"

/** Prisma / DB field names — PostgREST returns the same keys once `shadboard_content` is exposed. */
const DEAL_SELECT =
  "id,title,companyName,amount,currency,stage,leadSource,countryCode,countryName,ownerName,ownerEmail,ownerAvatar,probability,expectedClose,notes,closedAt,createdAt,updatedAt"

function parseDealRow(row: Record<string, unknown>) {
  const expectedClose = row.expectedClose
  const closedAt = row.closedAt
  const createdAt = row.createdAt
  const updatedAt = row.updatedAt
  return serializeCrmDeal({
    id: String(row.id),
    title: String(row.title),
    companyName: String(row.companyName),
    amount: { toString: () => String(row.amount ?? "0") },
    currency: String(row.currency ?? "USD"),
    stage: String(row.stage),
    leadSource: String(row.leadSource),
    countryCode: String(row.countryCode),
    countryName: String(row.countryName),
    ownerName: String(row.ownerName),
    ownerEmail: String(row.ownerEmail),
    ownerAvatar: row.ownerAvatar != null ? String(row.ownerAvatar) : null,
    probability:
      row.probability == null || row.probability === ""
        ? null
        : Number(row.probability),
    notes: row.notes != null ? String(row.notes) : null,
    expectedClose: expectedClose ? new Date(String(expectedClose)) : null,
    closedAt: closedAt ? new Date(String(closedAt)) : null,
    createdAt: new Date(String(createdAt)),
    updatedAt: new Date(String(updatedAt)),
  })
}

export async function getCrmDealByIdFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_deal")
    .select(DEAL_SELECT)
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  if (!data) {
    return null
  }
  return parseDealRow(data as Record<string, unknown>)
}

export async function listCrmDealsFromSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_deal")
    .select(DEAL_SELECT)
    .order("updatedAt", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }
  const rows = (data ?? []) as Record<string, unknown>[]
  return rows.map(parseDealRow)
}

export async function insertCrmDealFromSupabase(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_deal")
    .insert(payload)
    .select(DEAL_SELECT)
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return parseDealRow(data as Record<string, unknown>)
}

export async function updateCrmDealFromSupabase(
  supabase: SupabaseClient,
  id: string,
  patch: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_deal")
    .update(patch)
    .eq("id", id)
    .select(DEAL_SELECT)
    .single()

  if (error) {
    throw new Error(error.message)
  }
  if (!data) {
    throw new Error("NOT_FOUND")
  }
  return parseDealRow(data as Record<string, unknown>)
}

export async function deleteCrmDealFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_deal")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) {
    throw new Error(error.message)
  }
  if (!data?.length) {
    throw new Error("NOT_FOUND")
  }
}
