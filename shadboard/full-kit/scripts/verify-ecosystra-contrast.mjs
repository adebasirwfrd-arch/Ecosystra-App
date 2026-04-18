#!/usr/bin/env node
/**
 * Verifies Ecosystra scoped colors against WCAG 2.1 contrast targets.
 * Values are read from source CSS — no duplicated hex/HSL literals here.
 *
 * Run: node scripts/verify-ecosystra-contrast.mjs
 *   or: pnpm run verify:ecosystra-contrast
 *
 * - Text on backgrounds: 4.5:1 (AA normal text)
 * - UI non-text (border, focus ring vs adjacent background): 3:1
 */

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

const PATH_BOARD = join(
  ROOT,
  "src/components/ecosystra/ecosystra-board-surface.module.css"
)
const PATH_CHROME = join(
  ROOT,
  "src/components/ecosystra/ecosystra-vibe-tokens.module.css"
)
const PATH_THEMES = join(ROOT, "src/app/themes.css")

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) throw new Error(`Invalid hex: ${hex}`)
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rp = 0
  let gp = 0
  let bp = 0
  if (h < 60) [rp, gp, bp] = [c, x, 0]
  else if (h < 120) [rp, gp, bp] = [x, c, 0]
  else if (h < 180) [rp, gp, bp] = [0, c, x]
  else if (h < 240) [rp, gp, bp] = [0, x, c]
  else if (h < 300) [rp, gp, bp] = [x, 0, c]
  else [rp, gp, bp] = [c, 0, x]
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  }
}

function rgbToHex({ r, g, b }) {
  const h = (n) => n.toString(16).padStart(2, "0")
  return `#${h(r)}${h(g)}${h(b)}`
}

function hslTripletToHex(triplet) {
  const m = triplet
    .trim()
    .match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)
  if (!m) throw new Error(`Invalid HSL triplet: ${triplet}`)
  return rgbToHex(hslToRgb(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])))
}

function relativeLuminance({ r, g, b }) {
  const lin = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrastRatio(fgHex, bgHex) {
  const L1 = relativeLuminance(hexToRgb(fgHex))
  const L2 = relativeLuminance(hexToRgb(bgHex))
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Extract first `{ ... }` body after `selector` (brace-balanced). */
function extractBlockAfter(css, selector) {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`Selector not found: ${selector}`)
  const open = css.indexOf("{", start)
  if (open === -1) throw new Error(`No brace after: ${selector}`)
  let depth = 0
  let i = open
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++
    else if (css[i] === "}") {
      depth--
      if (depth === 0) return css.slice(open + 1, i)
    }
  }
  throw new Error(`Unbalanced braces after: ${selector}`)
}

function parseCssCustomProperties(block) {
  const map = new Map()
  const re = /--([\w-]+):\s*([^;]+);/g
  let m
  while ((m = re.exec(block)) !== null) {
    map.set(m[1], m[2].trim())
  }
  return map
}

function parseThemeZincBackgrounds(themesCss) {
  const zincBlock = extractBlockAfter(themesCss, ".theme-zinc")
  const lightEnd = zincBlock.indexOf("@variant dark")
  const lightPart =
    lightEnd === -1 ? zincBlock : zincBlock.slice(0, lightEnd)
  const bgLight = lightPart.match(/--background:\s*([^;]+);/)
  if (!bgLight) throw new Error("theme-zinc: no light --background")
  const darkBlock = extractBlockAfter(zincBlock, "@variant dark")
  const bgDark = darkBlock.match(/--background:\s*([^;]+);/)
  if (!bgDark) throw new Error("theme-zinc: no dark --background")
  return {
    lightBgHex: hslTripletToHex(bgLight[1].trim()),
    darkBgHex: hslTripletToHex(bgDark[1].trim()),
  }
}

const TEXT_THRESHOLD = 4.5
const UI_THRESHOLD = 3
let failed = 0

function check(label, fg, bg, minRatio, kind) {
  const ratio = contrastRatio(fg, bg)
  const ok = ratio + 1e-6 >= minRatio
  const status = ok ? "OK" : "FAIL"
  console.log(
    `[${status}] ${kind} ${label}: ${ratio.toFixed(2)}:1 (min ${minRatio}:1) ${fg} on ${bg}`
  )
  if (!ok) failed++
}

// --- Load files ---
const boardCss = readFileSync(PATH_BOARD, "utf8")
const chromeCss = readFileSync(PATH_CHROME, "utf8")
const themesCss = readFileSync(PATH_THEMES, "utf8")

const boardBlock = extractBlockAfter(boardCss, ".boardRoot")
const boardVars = parseCssCustomProperties(boardBlock)

const chromeLightBlock = extractBlockAfter(chromeCss, ".chromeRoot {")
const chromeLightVars = parseCssCustomProperties(chromeLightBlock)

const darkBlock = extractBlockAfter(
  chromeCss,
  ":global(html.dark) .chromeRoot"
)
const chromeDarkVars = parseCssCustomProperties(darkBlock)

const { lightBgHex, darkBgHex } = parseThemeZincBackgrounds(themesCss)

console.log("Ecosystra contrast verification (from source CSS)\n")
console.log(`  board:  ${PATH_BOARD}`)
console.log(`  chrome: ${PATH_CHROME}`)
console.log(`  theme:  ${PATH_THEMES} (.theme-zinc backgrounds)\n`)

// --- Board: *-fg on *-bg ---
for (const [name, val] of boardVars) {
  if (!name.endsWith("-fg")) continue
  const bgName = name.replace(/-fg$/, "-bg")
  const bgVal = boardVars.get(bgName)
  if (!bgVal || !val.startsWith("#") || !bgVal.startsWith("#")) continue
  check(name, val, bgVal, TEXT_THRESHOLD, "text")
}

// --- Brand: primary-foreground on eco-brand (white on blue button) ---
const brand = boardVars.get("eco-brand")
if (brand?.startsWith("#")) {
  check(
    "eco-brand button (white on --eco-brand)",
    "#ffffff",
    brand,
    TEXT_THRESHOLD,
    "text"
  )
}

// --- Chrome light: muted, border, ring ---
const mfL = chromeLightVars.get("muted-foreground")
const borderL = chromeLightVars.get("border")
const ringL = chromeLightVars.get("ring")
if (!mfL || !borderL || !ringL) {
  throw new Error("chrome .chromeRoot: missing muted-foreground, border, or ring")
}
check(
  "muted-foreground (light) vs page bg",
  hslTripletToHex(mfL),
  lightBgHex,
  TEXT_THRESHOLD,
  "text"
)
check(
  "border (light) vs page bg (UI)",
  hslTripletToHex(borderL),
  lightBgHex,
  UI_THRESHOLD,
  "UI"
)
check(
  "ring (light) vs page bg (UI)",
  hslTripletToHex(ringL),
  lightBgHex,
  UI_THRESHOLD,
  "UI"
)
// input matches border in our file — verify once
const inputL = chromeLightVars.get("input")
if (inputL && inputL !== borderL) {
  check(
    "input (light) vs page bg (UI)",
    hslTripletToHex(inputL),
    lightBgHex,
    UI_THRESHOLD,
    "UI"
  )
}

// --- Chrome dark ---
const mfD = chromeDarkVars.get("muted-foreground")
const borderD = chromeDarkVars.get("border")
const ringD = chromeDarkVars.get("ring")
if (!mfD || !borderD || !ringD) {
  throw new Error("chrome dark: missing muted-foreground, border, or ring")
}
check(
  "muted-foreground (dark) vs page bg",
  hslTripletToHex(mfD),
  darkBgHex,
  TEXT_THRESHOLD,
  "text"
)
check(
  "border (dark) vs page bg (UI)",
  hslTripletToHex(borderD),
  darkBgHex,
  UI_THRESHOLD,
  "UI"
)
check(
  "ring (dark) vs page bg (UI)",
  hslTripletToHex(ringD),
  darkBgHex,
  UI_THRESHOLD,
  "UI"
)

console.log("")
if (failed > 0) {
  console.error(`Failed: ${failed} check(s) below WCAG thresholds.`)
  process.exit(1)
}
console.log("All Ecosystra contrast checks passed.")
process.exit(0)
