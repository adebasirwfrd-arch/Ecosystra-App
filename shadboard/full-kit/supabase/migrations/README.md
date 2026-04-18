# Supabase SQL migrations (modal.md §2.6)

This directory holds **versioned Postgres DDL** for the Supabase project (RLS policies, extensions, views, RPCs).

## Relationship to Prisma today

`shadboard/full-kit` still uses **Prisma** as the primary schema source (`prisma/schema.prisma`) and `DATABASE_URL` against Postgres (often Supabase pooler). Until a full cutover:

1. Prefer **one source of truth** long-term: either generate migrations from Prisma `db pull` + hand-edit RLS here, or move schema ownership to Supabase CLI and retire Prisma for DDL.
2. Any **RLS** or **RPC** that the app must call through `supabase.rpc()` belongs here as `YYYYMMDDHHMMSS_description.sql`.
3. After adding files, apply with Supabase CLI (`supabase db push`) against your linked project, or run SQL in the Supabase SQL editor.

## Types

Regenerate TypeScript types after schema changes:

```bash
pnpm supabase:types
```

(requires Supabase CLI, `supabase login`, and `supabase link` in this directory.)

See `modal/modal.md` in the repo root for the full backend checklist.
