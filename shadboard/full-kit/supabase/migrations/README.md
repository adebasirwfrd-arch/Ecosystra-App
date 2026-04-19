# Supabase SQL migrations

Versioned Postgres DDL for the Supabase project (RLS policies, extensions, views, RPCs).

## Relationship to Prisma

This app uses **Prisma** as the primary schema source (`prisma/schema.prisma`) and `DATABASE_URL` (often Supabase pooler). RLS or RPC the app calls via `supabase.rpc()` lives here as `YYYYMMDDHHMMSS_description.sql`.

Apply with Supabase CLI (`supabase db push`) or run SQL in the Supabase SQL editor.

## Types

Regenerate TypeScript types after schema changes (requires Supabase CLI, `supabase login`, and `supabase link` from `full-kit/`):

```bash
bash scripts/supabase-gen-types.sh
```
