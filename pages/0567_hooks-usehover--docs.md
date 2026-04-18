---
id: hooks-usehover--docs
type: docs
title: "Hooks/useHover"
name: "Docs"
importPath: "./src/pages/hooks/useHover/useHover.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usehover--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:17.919Z
---

useHover

Detect whether the mouse is hovering an element by returning its isHovered state.

Hover me
Show code
Import
import { useHover } from "@vibe/core";
Copy
Usage
Use this hook to get element hovered state
Please assign the returned ref as the reference of the element
Returns
refReact.MutableRefObject - A React
ref
object to assign to the element which hover state needs to be tracked.
isHoveredboolean - Whether the element is hovered or not.
