# Inventaris auth Route Handlers (`/api/*`)

Memenuhi **checklist A2**: setiap `app/api/**/route.ts` tercatat dengan **pola verifikasi** yang dipakai. Terakhir diselaraskan dengan kode di repo (audit cepat).

Legenda pola:

| Pola | Arti |
|------|------|
| **`requireApiSession`** | `getServerSession` → 401 jika tidak login (`src/lib/api/route-session.ts`). |
| **`getSession`** | `getServerSession` langsung (`src/lib/auth.ts`) — legacy; prefer `requireApiSession`. |
| **`requireSessionWithEmail`** | `requireApiSession` + wajib ada `session.user.email` (`route-session.ts`). |
| **`requireChatEcoUser`** | `requireSessionWithEmail` + `ensureEcoUserFromSession` (`chat-route-session.ts`). |
| **`getServerSession` (inline)** | GraphQL route. |
| **`supabase.auth.getUser`** | Probe / sesi Supabase. |
| **Publik / khusus** | Tanpa sesi pengguna, atau khusus dev. |

## Tabel

| Path | Metode | Pola auth | Catatan |
|------|--------|-------------|---------|
| `api/auth/[...nextauth]` | * | NextAuth | Framework callback. |
| `api/auth/sign-in` | POST | Publik | Validasi `SignInSchema`; demo + DB. |
| `api/register` | POST | Publik | `RegisterSchema`. |
| `api/graphql` | POST/GET | `resolveAuth` + fallback `getServerSession` | Lihat `session-and-auth.md`. |
| `api/session/supabase` | GET | Cookie Supabase + `getUser()` | Debug / migrasi. |
| `api/debug/auth-check` | GET | Dev-only (404 prod) | Tanpa secret. |
| `api/error-logs` | POST | Publik | Rate-limit disarankan di produksi. |
| `api/crm/**` | * | `requireApiSession` | CRM REST. |
| `api/email/**` | * | `requireApiSession` | Email REST. |
| `api/chat` | GET | **`requireChatEcoUser`** | `jsonOk` |
| `api/chat/threads` | POST | **`requireChatEcoUser`** | POST: `memberUserIds` = id EcoUser lain; creator dari sesi. |
| `api/chat/compose-options` | GET | **`requireChatEcoUser`** | |
| `api/chat/blocked` | GET | **`requireChatEcoUser`** | |
| `api/chat/[threadId]/*` | * | **`requireChatEcoUser`** | read, messages, attachments, preferences, forward, dll. |

## Rekomendasi penyelarasan (langkah berikutnya)

1. **`/api/error-logs`**: pertimbangkan secret ringan atau rate limit agar tidak disalahgunakan.
2. Uji manual middleware + API: `docs/middleware-auth-smoke.md` (**A3**).

**Pembaruan:** setelah mengubah route, sunting baris tabel ini dalam PR yang sama.
