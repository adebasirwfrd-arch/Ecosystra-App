---
id: hooks-usetimeout--docs
type: docs
title: "Hooks/useTimeout"
name: "Docs"
importPath: "./src/pages/hooks/useTimeout/useTimeout.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usetimeout--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:49.208Z
---

useTimeout

Use this hook when you need to perform an action with timeout, this hook will cancel the timeout when the component unmounts.

Alert is coming!
Show code
Import
import { useTimeout } from "@vibe/core";
Copy
Arguments
optionsObject
timenumber - The time (in ms) to wait before execution. Defaults to: 0
callback(value: string) => void* - Callback function to execute when provided time has passed.
ignoreZeroTimeboolean - If time provided is 0 (defer) ignore the callback. Defaults to: false
Returns
resultArray
() => void - Cancels the timeout.
