-- Ecosystra advanced indexing (PostgreSQL / Supabase)
-- Covering indexes (INCLUDE) for index-friendly scans, partial indexes for hot filtered access paths,
-- and a materialized rollup for cheap board-level counts (refresh after bulk changes).

-- ---------------------------------------------------------------------------
-- 1) Covering + partial: root-level tasks per group (board table loads
--    `WHERE parentItemId IS NULL` under each `Group`, ordered by `createdAt`).
--    INCLUDE carries payload columns so heap fetches are reduced when the planner
--    chooses an Index Only Scan (visibility map permitting).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_Item_group_root_cover_idx"
ON "public"."Item" ("groupId", "createdAt" ASC)
INCLUDE ("id", "name", "boardId", "createdByUserId", "updatedAt", "dynamicData")
WHERE "parentItemId" IS NULL;

-- ---------------------------------------------------------------------------
-- 2) Covering + partial: subitems under a parent row (`parentItemId` NOT NULL).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_Item_parent_subitem_cover_idx"
ON "public"."Item" ("parentItemId", "createdAt" ASC)
INCLUDE ("id", "name", "boardId", "groupId", "createdByUserId", "updatedAt", "dynamicData")
WHERE "parentItemId" IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3) Partial: root tasks by board (e.g. `getItems(boardId)`, roster-style reads).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_Item_board_root_partial_idx"
ON "public"."Item" ("boardId", "createdAt" ASC)
INCLUDE ("id", "name", "groupId", "createdByUserId", "updatedAt", "dynamicData")
WHERE "parentItemId" IS NULL;

-- ---------------------------------------------------------------------------
-- 4) Covering: groups for a board (`ORDER BY id` in Prisma board tree select).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_Group_board_cover_idx"
ON "public"."Group" ("boardId", "id" ASC)
INCLUDE ("name", "color");

-- ---------------------------------------------------------------------------
-- 5) Covering: latest audit row per item — matches resolver prefetch
--    `DISTINCT ON ("itemId") ... ORDER BY "itemId", "createdAt" DESC`.
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_TaskAuditLog_item_created_cover_idx"
ON "public"."TaskAuditLog" ("itemId", "createdAt" DESC)
INCLUDE ("actorUserId");

-- ---------------------------------------------------------------------------
-- 6) Partial: pending assignee invites (resolver filters `status = 'PENDING'`).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_TaskAssigneeInvite_pending_partial_idx"
ON "public"."TaskAssigneeInvite" ("itemId", "email")
WHERE "status" = 'PENDING';

-- ---------------------------------------------------------------------------
-- 7) Partial: unread notifications list (`isRead = false` hot path).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "ecosystra_Notification_user_unread_partial_idx"
ON "public"."Notification" ("userId", "createdAt" DESC)
WHERE "isRead" = false;

-- ---------------------------------------------------------------------------
-- 8) Materialized view: board-level task/item rollups for dashboards / badges
--    without scanning the full `Item` tree. Refresh after bulk imports or on a schedule:
--      REFRESH MATERIALIZED VIEW CONCURRENTLY "public"."BoardTaskRollup";
--    (requires the unique index below — already created here.)
-- ---------------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS "public"."BoardTaskRollup";

CREATE MATERIALIZED VIEW "public"."BoardTaskRollup" AS
SELECT
  i."boardId" AS "boardId",
  COUNT(*)::bigint AS "totalItems",
  COUNT(*) FILTER (WHERE i."parentItemId" IS NULL)::bigint AS "rootTasks",
  COUNT(*) FILTER (WHERE i."parentItemId" IS NOT NULL)::bigint AS "subitems",
  MAX(i."updatedAt") AS "lastItemUpdatedAt"
FROM "public"."Item" AS i
GROUP BY i."boardId";

CREATE UNIQUE INDEX "BoardTaskRollup_boardId_key"
ON "public"."BoardTaskRollup" ("boardId");

COMMENT ON MATERIALIZED VIEW "public"."BoardTaskRollup" IS
  'Ecosystra: pre-aggregated counts per board. After large writes run REFRESH MATERIALIZED VIEW CONCURRENTLY public."BoardTaskRollup"; (Supabase: pg_cron or SQL editor).';
