import { CRM_POSTGREST_SCHEMA } from "@/lib/supabase/crm-client"
import {
  serializeCrmActivity,
  serializeCrmFeedback,
  serializeCrmProject,
  serializeCrmRep,
} from "@/lib/data/crm/serializers"

import type { SupabaseClient } from "@supabase/supabase-js"

const PROJECT_SELECT =
  "id,name,progress,startDate,dueDate,status,createdAt,updatedAt"

function parseProjectRow(row: Record<string, unknown>) {
  return serializeCrmProject({
    id: String(row.id),
    name: String(row.name),
    progress: Number(row.progress),
    startDate: new Date(String(row.startDate)),
    dueDate: new Date(String(row.dueDate)),
    status: String(row.status),
    createdAt: new Date(String(row.createdAt)),
    updatedAt: new Date(String(row.updatedAt)),
  })
}

const ACTIVITY_SELECT =
  "id,type,iconName,fill,title,description,status,occurredAt,assignedMembers,createdAt"

function parseActivityRow(row: Record<string, unknown>) {
  return serializeCrmActivity({
    id: String(row.id),
    type: String(row.type),
    iconName: String(row.iconName),
    fill: String(row.fill),
    title: String(row.title),
    description: String(row.description),
    status: row.status != null ? String(row.status) : null,
    occurredAt: new Date(String(row.occurredAt)),
    assignedMembers: row.assignedMembers ?? [],
    createdAt: new Date(String(row.createdAt)),
  })
}

const FEEDBACK_SELECT =
  "id,name,email,avatar,rating,feedbackMessage,createdAt"

function parseFeedbackRow(row: Record<string, unknown>) {
  return serializeCrmFeedback({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    avatar: String(row.avatar),
    rating: { toString: () => String(row.rating ?? "0") },
    feedbackMessage: String(row.feedbackMessage),
    createdAt: new Date(String(row.createdAt)),
  })
}

const REP_SELECT = "id,name,email,avatar,createdAt,updatedAt"

function parseRepRow(row: Record<string, unknown>) {
  return serializeCrmRep({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    avatar: String(row.avatar),
    createdAt: new Date(String(row.createdAt)),
    updatedAt: new Date(String(row.updatedAt)),
  })
}

// --- Projects ---

export async function listCrmProjectsFromSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_project")
    .select(PROJECT_SELECT)
    .order("dueDate", { ascending: true })

  if (error) throw new Error(error.message)
  return ((data ?? []) as Record<string, unknown>[]).map(parseProjectRow)
}

export async function insertCrmProjectFromSupabase(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_project")
    .insert(payload)
    .select(PROJECT_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return parseProjectRow(data as Record<string, unknown>)
}

export async function getCrmProjectByIdFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_project")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return parseProjectRow(data as Record<string, unknown>)
}

export async function updateCrmProjectFromSupabase(
  supabase: SupabaseClient,
  id: string,
  patch: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_project")
    .update(patch)
    .eq("id", id)
    .select(PROJECT_SELECT)
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("NOT_FOUND")
  return parseProjectRow(data as Record<string, unknown>)
}

export async function deleteCrmProjectFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_project")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) throw new Error(error.message)
  if (!data?.length) throw new Error("NOT_FOUND")
}

// --- Activities ---

export async function listCrmActivitiesFromSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_activity")
    .select(ACTIVITY_SELECT)
    .order("occurredAt", { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)
  return ((data ?? []) as Record<string, unknown>[]).map(parseActivityRow)
}

export async function insertCrmActivityFromSupabase(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_activity")
    .insert(payload)
    .select(ACTIVITY_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return parseActivityRow(data as Record<string, unknown>)
}

export async function updateCrmActivityFromSupabase(
  supabase: SupabaseClient,
  id: string,
  patch: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_activity")
    .update(patch)
    .eq("id", id)
    .select(ACTIVITY_SELECT)
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("NOT_FOUND")
  return parseActivityRow(data as Record<string, unknown>)
}

export async function deleteCrmActivityFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_activity")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) throw new Error(error.message)
  if (!data?.length) throw new Error("NOT_FOUND")
}

// --- Feedback ---

export async function listCrmFeedbackFromSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_feedback")
    .select(FEEDBACK_SELECT)
    .order("createdAt", { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)
  return ((data ?? []) as Record<string, unknown>[]).map(parseFeedbackRow)
}

export async function insertCrmFeedbackFromSupabase(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_feedback")
    .insert(payload)
    .select(FEEDBACK_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return parseFeedbackRow(data as Record<string, unknown>)
}

export async function updateCrmFeedbackFromSupabase(
  supabase: SupabaseClient,
  id: string,
  patch: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_feedback")
    .update(patch)
    .eq("id", id)
    .select(FEEDBACK_SELECT)
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("NOT_FOUND")
  return parseFeedbackRow(data as Record<string, unknown>)
}

export async function deleteCrmFeedbackFromSupabase(
  supabase: SupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_feedback")
    .delete()
    .eq("id", id)
    .select("id")

  if (error) throw new Error(error.message)
  if (!data?.length) throw new Error("NOT_FOUND")
}

// --- Sales reps ---

export async function listCrmRepsFromSupabase(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_sales_rep")
    .select(REP_SELECT)
    .order("name", { ascending: true })

  if (error) throw new Error(error.message)
  return ((data ?? []) as Record<string, unknown>[]).map(parseRepRow)
}

export async function insertCrmRepFromSupabase(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .schema(CRM_POSTGREST_SCHEMA)
    .from("crm_sales_rep")
    .insert(payload)
    .select(REP_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return parseRepRow(data as Record<string, unknown>)
}
