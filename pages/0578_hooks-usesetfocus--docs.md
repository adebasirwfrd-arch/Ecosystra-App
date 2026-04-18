---
id: hooks-usesetfocus--docs
type: docs
title: "Hooks/useSetFocus"
name: "Docs"
importPath: "./src/pages/hooks/useSetFocus/useSetFocus.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usesetfocus--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:38.060Z
---

useSetFocus

Hook for controlling focus on specific component e.g. Input.

Focus
Blur
Is focused: false
Show code
Import
import { useSetFocus } from "@vibe/core";
Copy
Arguments
optionsObject
refReact.MutableRefObject* - A React
ref
object.
focusCallback() => void - Callback function to execute on the ref's element focus event.
blurCallback() => void - Callback function to execute on the ref's element blur event.
Returns
resultObject
isFocusedbool - Is the element focused or not.
focus() => void - Function for focusing the element.
blur() => void - Function for blurring the element.
