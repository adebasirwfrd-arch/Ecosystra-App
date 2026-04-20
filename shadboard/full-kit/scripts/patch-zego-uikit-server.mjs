/**
 * Patches @zegocloud/zego-uikit-prebuilt (bundled) so Web Live Room + access hub
 * can follow ZEGOCLOUD Console (e.g. *.coolzcloud.com vs default *.zegocloud.com).
 * Idempotent: skips if already patched.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const target = path.join(
  root,
  "node_modules/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js"
)

const LIVEROOM_HOOK = "__ecosystraZegoLiveroomServerUrl"
const ENGINE_OPTS_HOOK = "__ecosystraZegoEngineOptions"

function main() {
  if (!fs.existsSync(target)) {
    console.warn(
      "[patch-zego-uikit-server] skip: zego-uikit-prebuilt.js not found"
    )
    return
  }
  let s = fs.readFileSync(target, "utf8")
  if (s.includes(`window.${LIVEROOM_HOOK}`) && s.includes(ENGINE_OPTS_HOOK)) return

  const needle =
    'new k.ZegoExpressEngine(OA._instance._expressConfig.appID,"wss://webliveroom"+OA._instance._expressConfig.appID+"-api.zegocloud.com/ws")'
  if (!s.includes(needle)) {
    console.warn(
      "[patch-zego-uikit-server] anchor not found; UIKit version may have changed. Skip patch."
    )
    return
  }

  const setOpts =
    `void("undefined"!=typeof window&&window.${ENGINE_OPTS_HOOK}&&Object.keys(window.${ENGINE_OPTS_HOOK}).length&&k.ZegoExpressEngine.setEngineOptions(window.${ENGINE_OPTS_HOOK}))`
  const liveroomExpr = `"undefined"!=typeof window&&window.${LIVEROOM_HOOK}?window.${LIVEROOM_HOOK}:"wss://webliveroom"+OA._instance._expressConfig.appID+"-api.zegocloud.com/ws"`

  const replacement = `(${setOpts},new k.ZegoExpressEngine(OA._instance._expressConfig.appID,${liveroomExpr}))`

  s = s.replace(needle, replacement)
  fs.writeFileSync(target, s)
  console.info("[patch-zego-uikit-server] applied Ecosystra Zego server hooks")
}

main()
