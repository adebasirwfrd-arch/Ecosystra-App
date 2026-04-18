---
id: hooks-usevibemediaquery--docs
type: docs
title: "Hooks/useVibeMediaQuery"
name: "Docs"
importPath: "./src/pages/hooks/useVibeMediaQuery/useVibeMediaQuery.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usevibemediaquery--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:52.881Z
---

useVibeMediaQuery

This hook will return the value of the current vibe break point

Value	Media query
1	screen and (max-width: 767px)
2	screen and (max-width: 1023px) and (min-width: 768px)
3	screen and (max-width: 1279px) and (min-width: 1024px)
4	screen and (max-width: 1439px) and (min-width: 1280px)
5	screen and (max-width: 1919px) and (min-width: 1440px)
6	screen and (min-width: 1920px)
4
Show code
Import
import { useVibeMediaQuery } from "@vibe/core";
Copy
Arguments

This hook doesn't receive any parameters

Returns
resultnumber - The current number which reference the current applied breakpoint
