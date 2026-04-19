-- Refresh board item rollups (non-blocking vs reads if CONCURRENTLY).
-- Run after bulk imports / migrations that touch "Item", or on a schedule.
REFRESH MATERIALIZED VIEW CONCURRENTLY "public"."BoardTaskRollup";
