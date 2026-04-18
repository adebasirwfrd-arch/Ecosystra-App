import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const index = JSON.parse(fs.readFileSync(path.join(ROOT, "index.json"), "utf8"));

function groupByTitlePrefix(items) {
  const groups = new Map();
  for (const row of items) {
    if (row.error && !row.file) continue;
    const t = row.title || "Other";
    const prefix = t.split("/")[0] || t;
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(row);
  }
  return groups;
}

const ok = manifest.filter((m) => m.file);
const errors = manifest.filter((m) => m.error && !m.file);
const zeroChars = ok.filter((m) => (m.chars ?? 0) === 0);

const lines = [];
lines.push("# Vibe Design System — Grandbook (arsif lokal)");
lines.push("");
lines.push(`Sumber resmi: [vibe.monday.com](https://vibe.monday.com/?path=/docs/welcome--docs) (Storybook produksi monday.com).`);
lines.push("");
lines.push("## Isi arsip");
lines.push("");
lines.push("| Berkas | Keterangan |");
lines.push("|--------|------------|");
lines.push("| `index.json` | Indeks Storybook v5 (652 entri: docs + story). |");
lines.push("| `manifest.json` | Daftar halaman yang di-scrape: URL iframe, berkas Markdown, jumlah karakter. |");
lines.push("| `pages/*.md` | Teks yang diekstrak per halaman (frontmatter + isi). |");
lines.push("| `mcp-tokens.json` | 912 token @vibe/style dengan contoh pemakaian CSS (dari MCP). |");
lines.push("| `mcp-icons.json` | Katalog ikon @vibe/icons (dari MCP). |");
lines.push("| `scrape-vibe.mjs` | Skrip Playwright untuk mengulang scraping. |");
lines.push("");
lines.push("## Statistik");
lines.push("");
lines.push(`- Entri di \`index.json\`: **${Object.keys(index.entries || {}).length}**`);
lines.push(`- Halaman terekstrak ke \`pages/\`: **${ok.length}**`);
lines.push(`- Halaman dengan teks kosong (\`chars === 0\`, biasanya pratinjau visual tanpa label teks di root): **${zeroChars.length}**`);
lines.push(`- Gagal otomatis (lalu diperbaiki manual bila ada): **${errors.length}**`);
lines.push("");
lines.push("## Metode scraping");
lines.push("");
lines.push("1. Mengunduh `/index.json` dari host Storybook.");
lines.push("2. Untuk setiap entri, membuka `iframe.html?id=…&viewMode=docs|story` dengan Playwright (Chrome sistem).");
lines.push("3. Mengekstrak teks dari `.sbdocs-wrapper` (dokumentasi) atau `#storybook-root` (story).");
lines.push("4. Satu halaman docs (`components-search--docs`) tidak merender konten di iframe; diganti dengan ringkasan dari MCP Vibe.");
lines.push("");
lines.push("## Daftar isi (grup menurut judul Storybook)");
lines.push("");

const groups = groupByTitlePrefix(manifest);
const sortedPrefixes = [...groups.keys()].sort((a, b) => a.localeCompare(b));

for (const prefix of sortedPrefixes) {
  lines.push(`### ${prefix}`);
  lines.push("");
  const rows = groups.get(prefix).sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  for (const row of rows) {
    const name = row.name || row.id;
    const file = row.file || "";
    const link = file ? `[${row.id}](${file})` : `\`${row.id}\``;
    lines.push(`- **${name}** — ${link}`);
  }
  lines.push("");
}

lines.push("---");
lines.push("");
lines.push("*Dibangun secara otomatis dari `manifest.json`.*");

fs.writeFileSync(path.join(ROOT, "GRANDBOOK.md"), lines.join("\n"), "utf8");
console.log("Wrote GRANDBOOK.md, groups:", sortedPrefixes.length, "rows:", ok.length);
