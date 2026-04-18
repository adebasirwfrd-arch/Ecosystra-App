---
id: hooks-useeventlistener--docs
type: docs
title: "Hooks/useEventListener"
name: "Docs"
importPath: "./src/pages/hooks/useEventListener/useEventListener.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useeventlistener--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:02.958Z
---

useEventListener

Attaches a listener to any DOM event on a specific element, firing a provided callback when the event is triggered.

Hover me
Show code
Import
import { useEventListener } from "@vibe/core";
Copy
Arguments
optionsObject
refReact.MutableRefObject - A React
ref
object.
callback(event: Event) => void* - Callback function to execute when the event is fired.
eventNamestring* - The event to listen to. See
a full list
for more info.
captureboolean - Whether to capture the event before bubbling up or not. Defaults to: false
