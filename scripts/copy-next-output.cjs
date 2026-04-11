#!/usr/bin/env node
/**
 * Vercel builds the app from shadboard/full-kit but expects ".next" at the repo root
 * when Root Directory is unset. Copy the real output after next build.
 */
const fs = require("fs")
const path = require("path")

const src = path.join(__dirname, "..", "shadboard", "full-kit", ".next")
const dest = path.join(__dirname, "..", ".next")

if (!fs.existsSync(src)) {
  console.error(`copy-next-output: missing ${src} — did next build run?`)
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.cpSync(src, dest, { recursive: true })
console.log(`copy-next-output: ${src} -> ${dest}`)
