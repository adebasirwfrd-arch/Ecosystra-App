-- Level 5: summary table + incremental counters (no full-table recount on each read).
-- Counters maintain O(1) deltas on Item INSERT/UPDATE/DELETE. Use ecosystra_rebuild_board_task_summary()
-- after bulk loads / if drift is suspected (replaces MV full-refresh pattern for this metric).

CREATE TABLE IF NOT EXISTS "public"."BoardTaskSummary" (
  "boardId" TEXT NOT NULL PRIMARY KEY,
  "totalItems" BIGINT NOT NULL DEFAULT 0,
  "rootTasks" BIGINT NOT NULL DEFAULT 0,
  "subitems" BIGINT NOT NULL DEFAULT 0,
  "lastItemUpdatedAt" TIMESTAMP(3),
  CONSTRAINT "BoardTaskSummary_boardId_fkey"
    FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE "public"."BoardTaskSummary" IS
  'Incremental rollups per board (accounting-style). Maintained by trigger on public."Item".';

-- One-time alignment with current rows (idempotent if re-run after truncate).
INSERT INTO "public"."BoardTaskSummary" ("boardId", "totalItems", "rootTasks", "subitems", "lastItemUpdatedAt")
SELECT
  i."boardId",
  COUNT(*)::bigint,
  COUNT(*) FILTER (WHERE i."parentItemId" IS NULL)::bigint,
  COUNT(*) FILTER (WHERE i."parentItemId" IS NOT NULL)::bigint,
  MAX(i."updatedAt")
FROM "public"."Item" AS i
GROUP BY i."boardId"
ON CONFLICT ("boardId") DO UPDATE SET
  "totalItems" = EXCLUDED."totalItems",
  "rootTasks" = EXCLUDED."rootTasks",
  "subitems" = EXCLUDED."subitems",
  "lastItemUpdatedAt" = EXCLUDED."lastItemUpdatedAt";

CREATE OR REPLACE FUNCTION "public"."ecosystra_item_touch_board_task_summary"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  d_root smallint;
  d_sub smallint;
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE "public"."BoardTaskSummary" AS s SET
      "totalItems" = GREATEST(0, s."totalItems" - 1),
      "rootTasks" = GREATEST(0, s."rootTasks" - CASE WHEN OLD."parentItemId" IS NULL THEN 1 ELSE 0 END),
      "subitems" = GREATEST(0, s."subitems" - CASE WHEN OLD."parentItemId" IS NULL THEN 0 ELSE 1 END)
    WHERE s."boardId" = OLD."boardId";
    RETURN OLD;
  END IF;

  IF TG_OP = 'INSERT' THEN
    d_root := CASE WHEN NEW."parentItemId" IS NULL THEN 1 ELSE 0 END;
    d_sub := CASE WHEN NEW."parentItemId" IS NULL THEN 0 ELSE 1 END;
    INSERT INTO "public"."BoardTaskSummary" ("boardId", "totalItems", "rootTasks", "subitems", "lastItemUpdatedAt")
    VALUES (NEW."boardId", 1, d_root, d_sub, NEW."updatedAt")
    ON CONFLICT ("boardId") DO UPDATE SET
      "totalItems" = "BoardTaskSummary"."totalItems" + 1,
      "rootTasks" = "BoardTaskSummary"."rootTasks" + EXCLUDED."rootTasks",
      "subitems" = "BoardTaskSummary"."subitems" + EXCLUDED."subitems",
      "lastItemUpdatedAt" = GREATEST("BoardTaskSummary"."lastItemUpdatedAt", EXCLUDED."lastItemUpdatedAt");
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD."boardId" IS DISTINCT FROM NEW."boardId" THEN
      UPDATE "public"."BoardTaskSummary" AS s SET
        "totalItems" = GREATEST(0, s."totalItems" - 1),
        "rootTasks" = GREATEST(0, s."rootTasks" - CASE WHEN OLD."parentItemId" IS NULL THEN 1 ELSE 0 END),
        "subitems" = GREATEST(0, s."subitems" - CASE WHEN OLD."parentItemId" IS NULL THEN 0 ELSE 1 END)
      WHERE s."boardId" = OLD."boardId";

      d_root := CASE WHEN NEW."parentItemId" IS NULL THEN 1 ELSE 0 END;
      d_sub := CASE WHEN NEW."parentItemId" IS NULL THEN 0 ELSE 1 END;
      INSERT INTO "public"."BoardTaskSummary" ("boardId", "totalItems", "rootTasks", "subitems", "lastItemUpdatedAt")
      VALUES (NEW."boardId", 1, d_root, d_sub, NEW."updatedAt")
      ON CONFLICT ("boardId") DO UPDATE SET
        "totalItems" = "BoardTaskSummary"."totalItems" + 1,
        "rootTasks" = "BoardTaskSummary"."rootTasks" + EXCLUDED."rootTasks",
        "subitems" = "BoardTaskSummary"."subitems" + EXCLUDED."subitems",
        "lastItemUpdatedAt" = GREATEST("BoardTaskSummary"."lastItemUpdatedAt", EXCLUDED."lastItemUpdatedAt");
      RETURN NEW;
    END IF;

    IF OLD."parentItemId" IS DISTINCT FROM NEW."parentItemId" THEN
      UPDATE "public"."BoardTaskSummary" AS s SET
        "rootTasks" = s."rootTasks"
          - (CASE WHEN OLD."parentItemId" IS NULL THEN 1 ELSE 0 END)
          + (CASE WHEN NEW."parentItemId" IS NULL THEN 1 ELSE 0 END),
        "subitems" = s."subitems"
          - (CASE WHEN OLD."parentItemId" IS NULL THEN 0 ELSE 1 END)
          + (CASE WHEN NEW."parentItemId" IS NULL THEN 0 ELSE 1 END),
        "lastItemUpdatedAt" = GREATEST(s."lastItemUpdatedAt", NEW."updatedAt")
      WHERE s."boardId" = NEW."boardId";
      RETURN NEW;
    END IF;

    UPDATE "public"."BoardTaskSummary" AS s SET
      "lastItemUpdatedAt" = GREATEST(s."lastItemUpdatedAt", NEW."updatedAt")
    WHERE s."boardId" = NEW."boardId";
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS "ecosystra_item_board_task_summary_trg" ON "public"."Item";
CREATE TRIGGER "ecosystra_item_board_task_summary_trg"
AFTER INSERT OR UPDATE OR DELETE ON "public"."Item"
FOR EACH ROW
EXECUTE PROCEDURE "public"."ecosystra_item_touch_board_task_summary"();

COMMENT ON FUNCTION "public"."ecosystra_item_touch_board_task_summary"() IS
  'Incremental maintenance of public."BoardTaskSummary" (delta counters, no full recount).';

-- Full rebuild (bulk import / repair). Disables trigger to avoid double-counting.
CREATE OR REPLACE FUNCTION "public"."ecosystra_rebuild_board_task_summary"()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  ALTER TABLE "public"."Item" DISABLE TRIGGER "ecosystra_item_board_task_summary_trg";
  TRUNCATE TABLE "public"."BoardTaskSummary";
  INSERT INTO "public"."BoardTaskSummary" ("boardId", "totalItems", "rootTasks", "subitems", "lastItemUpdatedAt")
  SELECT
    i."boardId",
    COUNT(*)::bigint,
    COUNT(*) FILTER (WHERE i."parentItemId" IS NULL)::bigint,
    COUNT(*) FILTER (WHERE i."parentItemId" IS NOT NULL)::bigint,
    MAX(i."updatedAt")
  FROM "public"."Item" AS i
  GROUP BY i."boardId";
  ALTER TABLE "public"."Item" ENABLE TRIGGER "ecosystra_item_board_task_summary_trg";
END;
$$;

COMMENT ON FUNCTION "public"."ecosystra_rebuild_board_task_summary"() IS
  'Truncates BoardTaskSummary and recomputes from Item (use after bulk SQL / suspected drift).';
