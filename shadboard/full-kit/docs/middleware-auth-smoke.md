# Smoke test A3 — middleware, locale, API privat

Memenuhi **checklist A3**: verifikasi manual singkat setelah deploy atau perubahan auth/middleware.

Prasyarat: `NEXTAUTH_URL` dan origin browser **sama** (port + host). Cookie sesi ada (sudah login).

## 1. Route terlindungi (redirect / 401)

1. Buka jendela **private/incognito** (tanpa cookie).
2. Kunjungi halaman dashboard yang membutuhkan login, mis.  
   `http://localhost:3002/en/dashboards/analytics`  
   (sesuaikan `/:lang` dengan locale aktif.)
3. **Harapan:** redirect ke alur sign-in, bukan konten dashboard mentah.

## 2. API privat tanpa sesi

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/crm/deals
```

**Harapan:** status `401`.

## 3. API privat dengan sesi

Dari browser yang sudah login, DevTools → tab yang sama → Console:

```js
fetch("/api/crm/deals", { credentials: "same-origin" }).then((r) =>
  console.log(r.status)
)
```

**Harapan:** `200` dan body JSON array (boleh kosong).

## 4. Email REST (bila `NEXT_PUBLIC_EMAIL_API=rest`)

```js
fetch("/api/email/counts", { credentials: "same-origin" }).then((r) =>
  console.log(r.status)
)
```

**Harapan:** `200` (atau `401` jika belum login).

## 5. Supabase cookie refresh (opsional)

Dengan cookie Supabase Auth aktif:

```bash
curl -s -b "cookies.txt" http://localhost:3002/api/session/supabase
```

(Isi `cookies.txt` dari browser jika perlu.)

**Harapan:** JSON dengan field `userId` / error Supabase yang terdokumentasi — bukan 500 stack.

---

**Catatan:** angka port mengikuti `pnpm dev:3002` atau variabel Anda; ganti `3002` jika berbeda.
