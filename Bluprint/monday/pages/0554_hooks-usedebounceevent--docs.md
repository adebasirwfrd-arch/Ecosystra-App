---
id: hooks-usedebounceevent--docs
type: docs
title: "Hooks/useDebounceEvent"
name: "Docs"
importPath: "./src/pages/hooks/useDebounceEvent/useDebounceEvent.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usedebounceevent--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:53.699Z
---

useDebounceEvent

This hook generates an easy to use debounced value updater.

Show code
Import
import { useDebounceEvent } from "@vibe/core";
Copy
Arguments
optionsObject
trimboolean - Whether to trim the value or not. Defaults to: false
onChange(value: string) => void - Callback function to execute on changes. Defaults to: () => null
delaynumber - The amount of time (in ms) to delay the value's update. Defaults to: 0
initialStateValueany - The initial value.
Returns
resultObject
inputValueany - The hook's value.
onEventChanged(event: Event) => void - A wrapper around the passed onChange function.
clearValue() => void - Clears the current value.
updateValue(value: any) => void - Updates the current value.
Usage
Use this hook when you need to debounce value updates (for example, text inputs).
Use cases and examples
Passing an initial value
Show code
Passing an onChange handler
Input has 0 characters
Show code
Trimming the value
Show code
