-- Drop CRM template tables if they exist (replaces prior CRM RLS baseline migration).
DROP TABLE IF EXISTS shadboard_content.crm_feedback CASCADE;
DROP TABLE IF EXISTS shadboard_content.crm_activity CASCADE;
DROP TABLE IF EXISTS shadboard_content.crm_project CASCADE;
DROP TABLE IF EXISTS shadboard_content.crm_sales_rep CASCADE;
DROP TABLE IF EXISTS shadboard_content.crm_deal CASCADE;
