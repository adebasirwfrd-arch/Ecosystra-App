---
id: hooks-usemediaquery--docs
type: docs
title: "Hooks/useMediaQuery"
name: "Docs"
importPath: "./src/pages/hooks/useMediaQuery/useMediaQuery.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usemediaquery--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:28.834Z
---

useMediaQuery

This hook helps maps if a media query is matched or not

Import
import { useMediaQuery } from "@vibe/core";
Copy
media query - "screen and (max-width: 1023px) and (min-width: 768px)" is matching: false
Show code
media query - "screen and (max-width: 1280px) and (min-width: 768px)" is matching: false
media query - prefers-color-scheme: dark is matching: false
Show code
Arguments
querystring | Array<string> - A string (or an array of strings) which represent a valid media query
Returns
resultArray<boolean> - An array with the matching media query set to true for example:
[true, false] - the first media query applies and the second is not
