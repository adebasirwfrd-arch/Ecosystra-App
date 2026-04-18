---
id: hooks-useisoverflowing--docs
type: docs
title: "Hooks/useIsOverflowing"
name: "Docs"
importPath: "./src/pages/hooks/useIsOverflowing/useIsOverflowing.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useisoverflowing--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:21.599Z
---

useIsOverflowing

Use this hook, when there is a chance that content won't fit into the container, to track if overflow occurs.

Is overflowing: false
Show code
Import
import { useIsOverflowing } from "@vibe/core";
Copy
Usage
Use this when content might not fit into it's container.
🤓
What to do when overflow is detected?
You might want to use 
Tooltip
 to display all the content.
Arguments
refReact.MutableRefObject - A React
ref
object for the container of likely to overflow content.
Returns
isOverflowingbool - Is content overflow the container.
