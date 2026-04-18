-- CRM tables live in schema `shadboard_content` (see Prisma `@@schema("shadboard_content")`).
-- Apply in Supabase SQL editor or `supabase db push` after exposing the schema in
-- Dashboard → Project Settings → API → Exposed schemas (add `shadboard_content`).
--
-- Until Supabase Auth is the only session, Route Handlers should keep using
-- NextAuth + optional service role for server-side access; these policies prepare
-- for `createSupabaseServerClient()` + `authenticated` role (modal.md §2.2 / §2.6).

ALTER TABLE IF EXISTS shadboard_content.crm_deal ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shadboard_content.crm_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shadboard_content.crm_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shadboard_content.crm_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shadboard_content.crm_sales_rep ENABLE ROW LEVEL SECURITY;

-- Replace with tenant-scoped policies (e.g. auth.uid() = owner_user_id) when you add columns.
-- Example permissive policy for authenticated PostgREST users (tighten before production):
-- CREATE POLICY "crm_deal_authenticated_all"
--   ON shadboard_content.crm_deal
--   FOR ALL
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);
