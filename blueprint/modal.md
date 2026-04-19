# Modal acuan: backend & desain frontend (template untuk aplikasi baru)

Dokumen ini mengekstrak **model** yang membuat aplikasi referensi (HSE Plan v2) terasa **halus, responsif, dan konsisten** di web maupun Android (WebView / PWA), agar bisa dijadikan **acuan** saat Anda membangun aplikasi lain. Untuk detail implementasi spesifik HSE, lihat juga `april.md`.

---

## 1. Prinsip inti (yang layak ditiru)

| Prinsip | Arti praktis |
|--------|----------------|
| **Satu sumber kebenaran untuk sesi** | Auth Supabase mengalir lewat cookie; middleware + server client + browser client selaras (`@supabase/ssr`). |
| **API tipis dan konsisten** | Route Handlers mengembalikan JSON predictable; logika berat agregasi di server, bukan di banyak tempat di client. |
| **Cache terkontrol** | TanStack Query dengan `staleTime` dan invalidasi eksplisit — tidak spam request, tapi data bisa segar setelah mutasi/realtime. |
| **Realtime selektif** | Hanya subscribe ke tabel yang memang perlu “hidup”; sisanya pakai fetch + invalidasi. |
| **UI adaptif satu codebase** | Layout shell memisahkan breakpoint (mobile header + drawer + bottom nav vs desktop sidebar); konten `max-width` terpusat. |
| **Animasi bermartabat** | Entrance on-mount (Framer/GSAP), micro-interaction pada card/modal, bukan animasi mengganggu di setiap klik. |

---

## 2. Modal backend (arsitektur referensi)

### 2.1 Stack target

- **Framework:** Next.js App Router (`app/`), Route Handlers `app/api/**/route.ts`.
- **Database & auth:** Supabase (Postgres + Auth + Realtime opsional).
- **ORM/query:** Supabase client + SQL migrasi versioned (`supabase/migrations/`).
- **Validasi input:** Zod (atau setara) di boundary API / server actions.

### 2.2 Dua klien Supabase (wajib dipahami)

1. **Browser client** — singleton `createBrowserClient`, dipakai di Client Components untuk query langsung, **Realtime**, dan `auth.onAuthStateChange`.
2. **Server client** — `createServerClient` dengan adapter **cookie** Next.js, dipakai di Route Handlers, Server Components, Server Actions.

**Aturan:** segala operasi yang harus menghormati **RLS** dan **user yang sama** dengan browser → gunakan server client di API atau pastikan client browser memakai anon key + policy yang benar. Jangan mencampur pola tanpa alasan.

### 2.3 Middleware sebagai gerbang

- Set header keamanan (CSP/CORS sesuai kebutuhan, `poweredByHeader` off, dll.).
- **Refresh sesi** Supabase pada response (polar `@supabase/ssr` resmi).
- **Daftar route publik vs protected** — eksplisit di satu tempat; hindari logika tersebar di setiap halaman.
- Opsional: maintenance mode, allowlist admin, IP block (Edge Config / env).

### 2.4 Konvensi Route Handler

- **Satu resource, satu folder:** `app/api/items/route.ts` (GET koleksi, POST buat), `app/api/items/[id]/route.ts` (GET/PATCH/DELETE satu item).
- **Sub-resource:** `app/api/items/[id]/comments/route.ts` — mencerminkan domain, bukan RPC acak.
- **Response:** `NextResponse.json(data)` dengan status HTTP benar; error `{ error: string }` atau struktur error terstandarisasi.
- **Auth di handler:** `const supabase = await createClient()` lalu `getUser()` jika endpoint privat; jangan percaya body untuk `userId` tanpa verifikasi.

### 2.5 Pola data yang “terasa cepat”

| Pola | Kapan dipakai |
|------|----------------|
| **GET agregat** (dashboard) | Satu endpoint menggabungkan beberapa query / view SQL — mengurangi waterfall di client. |
| **Nested select** Supabase | `select('*, child_table(*)')` untuk mengurangi round-trip. |
| **RPC Postgres** | Nomor urut, perhitungan kompleks, transaksi — di `supabase.rpc()` dari Route Handler. |
| **TanStack Query** | Semua fetch yang sering dipakai ulang; **query key factory** (`['items', id]`) untuk invalidasi bersih. |
| **Supabase Realtime** | `postgres_changes` pada tabel yang memicu update UI bersamaan; di callback: `invalidateQueries` atau `setState` minimal. |

### 2.6 Migrasi & tipe

- Setiap perubahan skema: file SQL berurutan di `supabase/migrations/`.
- Generate atau tulis **tipe TypeScript** (`Database`) dan jaga supaya tidak banyak `any` di jalur kritis — ini investasi untuk menjaga “smoothness” jangka panjang.

### 2.7 Integrasi eksternal (pola)

- **Secret hanya di server** — token Stream, OpenAI, AWS, Google: hanya di Route Handler atau server-only module.
- **Webhook / cron** — route terpisah dengan verifikasi secret header atau Vercel Cron.

---

## 3. Modal desain frontend (UX & UI)

### 3.1 Struktur layout aplikasi

- **Root layout:** provider global saja (React Query, theme/settings, toast) — **ringan**, tanpa sidebar berat di root jika tidak semua route membutuhkannya.
- **App shell terpisah:** komponen client yang membungkus halaman “utama” berisi:
  - **Desktop:** sidebar tetap + area konten dengan margin konsisten.
  - **Mobile:** header tetap + **drawer** untuk menu lengkap + **bottom navigation** untuk 3–5 aksi utama.
- **Safe area:** `env(safe-area-inset-*)` pada padding header/nav — penting untuk Android/iOS notch dan WebView fullscreen.

### 3.2 Responsif: aturan praktis

- **Breakpoint:** Tailwind `md` / `lg` sebagai pemisah utama (sidebar penuh vs ikon-only vs mobile).
- **Konten:** `max-w-* mx-auto px-4` agar tidak melebar tidak terkendali di tablet/desktop.
- **Sentuhan:** area tap minimal ~44px; hindari kontrol yang hanya bekerja di hover untuk fitur kritis.
- **PWA (opsional):** `next-pwa` + `manifest` — meningkatkan perilaku “seperti app” di Android.

### 3.3 Sistem visual (design tokens)

Gunakan **CSS variables** untuk tema, bukan hardcode warna di ratusan file:

- `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-muted`
- `--accent-*`, `--border-light`, `--danger-color`, `--success-color`

Ini memudahkan dark mode, white-label, atau menyelaraskan app baru dengan identitas lain tanpa mengganti setiap komponen.

### 3.4 Loading & empty state

- **Skeleton** (`animate-pulse`) untuk layout yang sama dengan konten akhir — mengurangi “jump” dan terasa lebih profesional daripada spinner besar sendirian.
- **Error** terpusat: toast + pesan ringkas; untuk query, `retry` dari React Query.

### 3.5 Lapisan animasi (urutan prioritas)

1. **Framer Motion** — layout halaman: `PageTransition` + stagger anak; modal/daftar: `AnimatePresence` + `motion.div`.
2. **GSAP** — stagger entrance untuk grid/kartu (hook dengan `dependencies` agar re-run saat data siap).
3. **CSS** — `transition-colors`, `transition-transform`, hover ringan pada card (`hover:-translate-y-1`, shadow).

**Pedoman:** durasi singkat (0.2–0.5s), easing `easeOut` / `power3.out`; hindari autoplay animasi besar di background yang mengganggu fokus.

### 3.6 Navigasi halus

- Pakai **`next/link`** untuk route internal — prefetch bawaan Next membantu transisi terasa instan.
- Hindari **full reload** kecuali perlu (logout redirect boleh).
- Untuk “shared element” antar route tingkat tinggi, pertimbangkan **View Transitions API** (eksperimental) di Next versi yang mendukung — opsional, bukan syarat.

---

## 4. Checklist: memulai aplikasi baru dari modal ini

### Backend

- [ ] Proyek Supabase + migrasi awal + RLS policy minimal.
- [ ] `lib/supabase/client.ts` + `server.ts` mengikuti pola resmi SSR.
- [ ] `middleware.ts` — matcher benar, refresh auth, route publik/protected.
- [ ] Route Handlers mengikuti REST-ish resource naming.
- [ ] React Query + query keys konsisten; mutasi memanggil `invalidateQueries`.
- [ ] Realtime hanya untuk tabel yang perlu; uji dengan beberapa tab terbuka.

### Frontend

- [ ] App shell dengan pola mobile/desktop seperti di atas.
- [ ] Design tokens di `globals.css` atau layer theme.
- [ ] Halaman kompleks dibungkus komponen transisi reusable (Framer).
- [ ] Uji di lebar 375px, 768px, 1280px + WebView Android jika relevan.

### Kualitas

- [ ] Sentry (atau observabilitas) untuk production.
- [ ] Env vars terdokumentasi (`.env.example` tanpa secret).

---

## 5. Yang sengaja tidak diikat ke domain HSE

Modal ini **domain-agnostic**: mengganti “programs / PTW / KPI” dengan entitas Anda tidak mengubah pola inti — hanya nama tabel, route, dan komponen bisnis.

---

## 6. Hubungan dengan dokumen lain

- **`april.md`** — analisis konkret pada codebase HSE Plan v2 (endpoint, tabel, file).
- **`modal.md` (dokumen ini)** — **template perilaku** untuk menyalin ke proyek baru tanpa menyalin seluruh kode bisnis.

---

*Gunakan modal ini sebagai checklist arsitektur; sesuaikan stack (misalnya tukar Tremor dengan komponen lain) tanpa mengorbankan prinsip di bagian 1.*
