---
id: hooks-useclickoutside--docs
type: docs
title: "Hooks/useClickOutside"
name: "Docs"
importPath: "./src/pages/hooks/useClickOutside/useClickOutside.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useclickoutside--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:49.975Z
---

useClickOutside

This hook is used when you want to capture click events outside your component.

Click outside 0
Show code
Import
import { useClickOutside } from "@vibe/core";
Copy
Arguments
optionsObject
refReact.MutableRefObject* - A React
ref
object.
callback(value: string) => void* - Callback function to execute on outside clicks.
ignoreClassesstring[] - A list of classes to ignore when checking if the click is outside the element.
eventNamekeyof HTMLElementEventMap | string - The event to listen to. See
a full list
for more info.
Usage
Use this hook when you want to listen on events outside of the element
Use this hook when you need to use events not from the react app
