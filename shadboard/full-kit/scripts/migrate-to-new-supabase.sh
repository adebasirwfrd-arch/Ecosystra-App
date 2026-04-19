#!/usr/bin/env bash
# Migrate Ecosystra Postgres data from an old Supabase project to a new one.
#
# Prerequisite: PostgreSQL 17+ client tools (pg_dump / pg_restore / psql), same major as server.
#   brew install postgresql@17
#
# Supabase Postgres rejects pg_restore --disable-triggers (not superuser). This script truncates
# app tables on NEW, then restores via psql with SET session_replication_role = replica so
# circular FKs (Item, ChatMessage) load without temporarily dropping constraints.
#
# 1) In the NEW Supabase project: Dashboard → Project Settings → Database → copy the
#    **Session pooler** URI (Connect → Session mode), or **Transaction** URI if you use :6543.
#    Use the exact host/region shown there — "Tenant or user not found" means wrong host or password.
# 2) Export URLs (never commit these):
#    export OLD_DATABASE_URL='postgresql://postgres.OLDREF:OLDPASS@aws-....pooler.supabase.com:5432/postgres?sslmode=require'
#    export NEW_DATABASE_URL='postgresql://postgres.NEWREF:NEWPASS@aws-....pooler.supabase.com:5432/postgres?sslmode=require'
# 3) From repo root `Ecosystra` or from `shadboard/full-kit`:
#    bash scripts/migrate-to-new-supabase.sh
#
# After success: update `.env.local` with NEW_DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, anon + service_role keys,
# then `pnpm prisma generate` and restart `pnpm dev:3002`.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OLD_DATABASE_URL="${OLD_DATABASE_URL:?export OLD_DATABASE_URL (session pooler to OLD project)}"
NEW_DATABASE_URL="${NEW_DATABASE_URL:?export NEW_DATABASE_URL (session pooler to NEW project — copy from Connect)}"

PG_DUMP_BIN="${PG_DUMP_BIN:-/opt/homebrew/opt/postgresql@17/bin/pg_dump}"
PG_RESTORE_BIN="${PG_RESTORE_BIN:-/opt/homebrew/opt/postgresql@17/bin/pg_restore}"
PSQL_BIN="${PSQL_BIN:-/opt/homebrew/opt/postgresql@17/bin/psql}"

if [[ ! -x "$PG_DUMP_BIN" ]]; then
  echo "Missing pg_dump at $PG_DUMP_BIN — install PostgreSQL 17 (brew install postgresql@17) or set PG_DUMP_BIN." >&2
  exit 1
fi
if [[ ! -x "$PG_RESTORE_BIN" ]]; then
  echo "Missing pg_restore at $PG_RESTORE_BIN — install PostgreSQL 17 or set PG_RESTORE_BIN." >&2
  exit 1
fi
if [[ ! -x "$PSQL_BIN" ]]; then
  echo "Missing psql at $PSQL_BIN — install PostgreSQL 17 or set PSQL_BIN." >&2
  exit 1
fi

DUMP_DIR="$ROOT/scripts/migration-dumps"
mkdir -p "$DUMP_DIR"
DUMP="$DUMP_DIR/ecosystra-data-only-$(date +%Y%m%d-%H%M%S).dump"

echo "== 1/3 pg_dump data-only from OLD (schemas: nextauth, shadboard_content, public) =="
"$PG_DUMP_BIN" "$OLD_DATABASE_URL" \
  --data-only \
  --schema=nextauth \
  --schema=shadboard_content \
  --schema=public \
  --no-owner \
  --no-acl \
  --exclude-table-data=public._prisma_migrations \
  -Fc \
  -f "$DUMP"

echo "Dump written to: $DUMP"

echo "== 2/4 prisma db push on NEW (creates schemas/tables from schema.prisma) =="
echo "    Note: repo migrate history targets sqlite; use db push for a fresh Postgres project."
DATABASE_URL="$NEW_DATABASE_URL" pnpm exec prisma db push

echo "== 3/4 Truncate app tables on NEW (public, nextauth, shadboard_content; skips _prisma_migrations) =="
TRUNC_SQL="$("$PSQL_BIN" "$NEW_DATABASE_URL" -t -A -c "SELECT 'TRUNCATE TABLE ' || string_agg(format('%I.%I', schemaname, tablename), ', ' ORDER BY schemaname, tablename) || ' RESTART IDENTITY CASCADE;' FROM pg_tables WHERE schemaname IN ('public','nextauth','shadboard_content') AND tablename <> '_prisma_migrations';")"
if [[ -z "${TRUNC_SQL:-}" ]]; then
  echo "No tables to truncate (unexpected after db push)." >&2
  exit 1
fi
"$PSQL_BIN" "$NEW_DATABASE_URL" -v ON_ERROR_STOP=1 -c "$TRUNC_SQL"

echo "== 4/4 pg_restore data-only into NEW via psql (session_replication_role=replica for circular FKs) =="
{ echo "SET session_replication_role = replica;"; "$PG_RESTORE_BIN" -f - --data-only --no-owner --no-acl "$DUMP"; echo "RESET session_replication_role;"; } | "$PSQL_BIN" "$NEW_DATABASE_URL" -v ON_ERROR_STOP=1

echo "Done. Next: copy NEW_DATABASE_URL + Supabase URL/keys into .env.local, then pnpm prisma generate && pnpm dev:3002"
