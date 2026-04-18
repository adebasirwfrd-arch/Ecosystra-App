#!/usr/bin/env bash
# Generate src/lib/supabase/database.types.ts (modal.md §2.6).
set -uo pipefail
cd "$(dirname "$0")/.."

if ! command -v supabase >/dev/null 2>&1; then
  echo "[supabase:types] Supabase CLI not found. Install: https://supabase.com/docs/guides/cli"
  exit 0
fi

if supabase gen types typescript --linked > src/lib/supabase/database.types.ts 2>/dev/null; then
  echo "[supabase:types] Wrote src/lib/supabase/database.types.ts"
  exit 0
fi

echo "[supabase:types] Skipped. Link a project from this directory: supabase link --project-ref <YOUR_REF>"
exit 0
