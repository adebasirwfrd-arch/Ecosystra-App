-- JSONB indexing: INCLUDE pada "dynamicData" mempercepat Index Only Scan untuk baca baris utuh,
-- tetapi filter seperti (dynamicData->>'priority') = 'high' butuh GIN / expression index — tambahan di sini.
-- Trade-off: INSERT/UPDATE item sedikit lebih berat; sesuaikan jika write-heavy.

-- GIN (jsonb_ops): cocok untuk operator ? ?| ?& @> (jsonb) / path — penjadwal reminder & query JSON ke depan.
CREATE INDEX IF NOT EXISTS "ecosystra_Item_dynamicData_gin_idx"
ON "public"."Item"
USING GIN ("dynamicData" jsonb_ops);

-- Expression btree: filter equality pada key umum (board UI + filter engine).
CREATE INDEX IF NOT EXISTS "ecosystra_Item_dyn_status_root_expr_idx"
ON "public"."Item" ((("dynamicData"->>'status')))
WHERE "parentItemId" IS NULL;

CREATE INDEX IF NOT EXISTS "ecosystra_Item_dyn_taskStatus_sub_expr_idx"
ON "public"."Item" ((("dynamicData"->>'taskStatus')))
WHERE "parentItemId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "ecosystra_Item_dyn_priority_expr_idx"
ON "public"."Item" ((("dynamicData"->>'priority')));

-- Due-date reminder scanner membaca dueDateIso / subDueDateIso (lihat due-date-reminders.ts).
CREATE INDEX IF NOT EXISTS "ecosystra_Item_dyn_dueDateIso_root_expr_idx"
ON "public"."Item" ((("dynamicData"->>'dueDateIso')))
WHERE "parentItemId" IS NULL;

CREATE INDEX IF NOT EXISTS "ecosystra_Item_dyn_subDueDateIso_sub_expr_idx"
ON "public"."Item" ((("dynamicData"->>'subDueDateIso')))
WHERE "parentItemId" IS NOT NULL;
