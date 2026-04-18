/**
 * Scrape Vibe Storybook: loads iframe preview (where MDX/docs actually render).
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const BASE = "https://vibe.monday.com";
const OUT_DIR = path.join(process.cwd(), "pages");
const INDEX_PATH = path.join(process.cwd(), "index.json");

function iframeUrl(id, type) {
  const vm = type === "docs" ? "docs" : "story";
  return `${BASE}/iframe.html?id=${encodeURIComponent(id)}&viewMode=${vm}`;
}

async function extractFromIframe(page, type) {
  if (type === "docs") {
    await page.waitForSelector(".sbdocs-content, .sbdocs-wrapper, #storybook-docs", {
      timeout: 90000,
    });
    const sel = ".sbdocs-wrapper";
    const loc = page.locator(sel).first();
    if ((await loc.count()) > 0) {
      const text = (await loc.innerText().catch(() => "")) || "";
      if (text.trim().length > 20) return { selector: sel, text: text.trim() };
    }
    const fallback = page.locator(".sbdocs-content").first();
    const t2 = (await fallback.innerText().catch(() => "")) || "";
    return { selector: ".sbdocs-content", text: t2.trim() };
  }

  await page.waitForSelector("#storybook-root, .sb-show-main", { timeout: 90000 });
  const root = page.locator("#storybook-root").first();
  if ((await root.count()) > 0) {
    const text = (await root.innerText().catch(() => "")) || "";
    if (text.trim().length > 10) return { selector: "#storybook-root", text: text.trim() };
  }
  const body = (await page.locator("body").innerText().catch(() => "")) || "";
  return { selector: "body", text: body.trim() };
}

async function main() {
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  const index = JSON.parse(raw);
  let entries = Object.values(index.entries || {});
  const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 0;
  if (limit > 0) entries = entries.slice(0, limit);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  const manifest = [];
  let i = 0;
  for (const e of entries) {
    if (!e.id || !e.type) continue;
    i++;
    const url = iframeUrl(e.id, e.type);
    const safeName = e.id.replace(/[^a-zA-Z0-9-_]/g, "_");
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
      await page.waitForTimeout(1500);
      const { selector, text } = await extractFromIframe(page, e.type);
      const fileBase = `${String(i).padStart(4, "0")}_${safeName}`;
      const mdPath = path.join(OUT_DIR, `${fileBase}.md`);
      const header = `---\nid: ${e.id}\ntype: ${e.type}\ntitle: ${JSON.stringify(e.title || "")}\nname: ${JSON.stringify(e.name || "")}\nimportPath: ${JSON.stringify(e.importPath || "")}\niframeUrl: ${url}\nextractedWith: ${selector}\nscrapedAt: ${new Date().toISOString()}\n---\n\n`;
      fs.writeFileSync(mdPath, header + text + "\n", "utf8");
      manifest.push({
        id: e.id,
        type: e.type,
        title: e.title,
        name: e.name,
        importPath: e.importPath,
        iframeUrl: url,
        file: `pages/${fileBase}.md`,
        chars: text.length,
        selector,
      });
    } catch (err) {
      manifest.push({
        id: e.id,
        type: e.type,
        title: e.title,
        error: String(err?.message || err),
        iframeUrl: url,
      });
    }
    if (i % 30 === 0) {
      fs.writeFileSync(
        path.join(process.cwd(), "manifest.partial.json"),
        JSON.stringify(manifest, null, 2)
      );
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(
    "Done. OK:",
    manifest.filter((m) => !m.error).length,
    "errors:",
    manifest.filter((m) => m.error).length
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
