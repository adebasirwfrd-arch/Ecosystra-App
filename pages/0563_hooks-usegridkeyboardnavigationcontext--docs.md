---
id: hooks-usegridkeyboardnavigationcontext--docs
type: docs
title: "Hooks/useGridKeyboardNavigationContext"
name: "Docs"
importPath: "./src/pages/components/GridKeyboardNavigationContext/useGridKeyboardNavigationContext.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usegridkeyboardnavigationcontext--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:10.329Z
---

useGridKeyboardNavigationContext

A hook used to specify a connection between multiple navigable components, which are navigable between each other.

L 0
L 1
L 2
L 3
L 4
L 5
L 6
L 7
L 8
L 9
L 10
L 11
L 12
L 13
L 14
R 0
R 1
R 2
R 3
R 4
R 5
R 6
Show code
Import
import { useGridKeyboardNavigationContext } from "@vibe/core";
Copy
Usage
Use this hook when you want to add keyboard navigation between multiple grid-like components.
Each of the components should use `useGridKeyboardNavigation`.
The components should be wrapped with a single `GridKeyboardNavigationContext`.
Arguments
positionsArray[ { topElement: React.MutableRefObject, bottomElement: React.MutableRefObject } | { leftElement: React.MutableRefObject, rightElement: React.MutableRefObject } ]* - An array of relations between pairs of elements
wrapperRefReact.MutableRefObject* - A React ref for an element which contains all the elements which are listed on the positions argument.
Returns
resultObject - A GridKeyboardNavigationContext which should be provided to wrap all the elements from positions
Variants
Disabled Elements

Disabled components can be skipped by adding a disabled (or data-disabled) to the referenced element.

T 0
T 1
T 2
M 0
M 1
M 2
B 0
B 1
B 2
Show code
Multiple Depths

The hook can be used inside multiple depths, in more complex layout requirements.

TL 0
TL 1
TL 2
TL 3
TL 4
TL 5
TR 0
TR 1
TR 2
TR 3
TR 4
TR 5
TB 0
TB 1
TB 2
TB 3
TB 4
TB 5
BL 0
BL 1
BL 2
BL 3
BL 4
BL 5
BR 0
BR 1
BR 2
BR 3
BR 4
BR 5
BB 0
BB 1
BB 2
BB 3
BB 4
BB 5
Show code
