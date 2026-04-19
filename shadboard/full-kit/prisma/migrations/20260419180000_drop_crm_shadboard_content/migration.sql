-- Remove template CRM tables (no longer used by the app).
DROP TABLE IF EXISTS "shadboard_content"."crm_feedback" CASCADE;
DROP TABLE IF EXISTS "shadboard_content"."crm_activity" CASCADE;
DROP TABLE IF EXISTS "shadboard_content"."crm_project" CASCADE;
DROP TABLE IF EXISTS "shadboard_content"."crm_sales_rep" CASCADE;
DROP TABLE IF EXISTS "shadboard_content"."crm_deal" CASCADE;
