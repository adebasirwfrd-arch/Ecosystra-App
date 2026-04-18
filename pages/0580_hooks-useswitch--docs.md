---
id: hooks-useswitch--docs
type: docs
title: "Hooks/useSwitch"
name: "Docs"
importPath: "./src/pages/hooks/useSwitch/useSwitch.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useswitch--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:41.765Z
---

useSwitch

Hook for controlling boolean state on components, e.g. Toggle, by exposing state and a handler

Off
On
isChecked: false
Show code
Import
import { useSwitch } from "@vibe/core";
Copy
Variants
Disabled

Hook can have argument of isDisabled to not allow trigger onChange (or the custom passed onChange) and change returned isChecked value.

Off
On
isChecked: false
Show code
Default (initial) value

Hook can have argument of defaultChecked to control the initial value returned from it.

Off
On
isChecked true
defaultChecked: true
Show code
Arguments
optionsObject
isCheckedboolean - Value to override the hook state.
defaultCheckedboolean - Value to override the hook initial state (init hook with 'true' instead of 'false').
onChange(value: boolean) => void - Callback function to execute when hook 'change' triggered.
isDisabledboolean - Value that, if passed as 'true', prevents hook from trigger 'change' lifecycle.
Returns
resultObject
isCheckedboolean - Returned value of current state.
onChange() => void - Returned handler function to trigger the hook 'change' lifecycle.
