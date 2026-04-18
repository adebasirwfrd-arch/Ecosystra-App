---
id: hooks-usekeyevent--docs
type: docs
title: "Hooks/useKeyEvent"
name: "Docs"
importPath: "./src/pages/hooks/useKeyEvent/useKeyEvent.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usekeyevent--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:25.276Z
---

useKeyEvent

Attaches a listener to keyboard DOM events on a specific element, firing a provided callback when the event is triggered.

Last pressed digit: -
Show code
Import
import { useKeyEvent } from "@vibe/core";
Copy
Arguments
optionsObject
keysArray<string> - A list of keys to trigger the passed callback. See
a full list
for more info.
callback(event: Event) => void* - Callback function to execute when the event is fired.
refReact.MutableRefObject - A React
ref
object. Defaults to: document
ignoreDocumentFallbackboolean - If ref is not passed, ignore the default ref. Defaults to: false
captureboolean - Whether to capture the event before bubbling up or not. Defaults to: false
preventDefaultboolean - Runs 
preventDefault
 on the fired events. Defaults to: false
stopPropagationboolean - Runs 
stopPropagation
 on the fired events. Defaults to: false
eventNamestring - The event to listen to. See
a full list
for more info. Defaults to: keydown
Usage
Use this hook to add custom logic when typing inside an element.
Use this hook to add keyboard shortcuts.
