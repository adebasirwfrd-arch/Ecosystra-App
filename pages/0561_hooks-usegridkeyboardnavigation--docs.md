---
id: hooks-usegridkeyboardnavigation--docs
type: docs
title: "Hooks/useGridKeyboardNavigation"
name: "Docs"
importPath: "./src/pages/hooks/useGridKeyboardNavigation/useGridKeyboardNavigation.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usegridkeyboardnavigation--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:06.567Z
---

useGridKeyboardNavigation

Used for accessible keyboard navigation. Useful for components rendering items that can be navigated and selected with a keyboard.

0.
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
13.
14.
Items count: 
Number of items in line: 
Show code
Import
import { useGridKeyboardNavigation } from "@vibe/core";
Copy
Usage
Use this hook when you want to add keyboard navigation to a grid-like component.
Arguments
optionsObject
refReact.MutableRefObject<HTMLElement>* - A React
ref
object. The reference for the component that listens to keyboard.
Important: the referred element must have a tabIndex=-1 for the focus to work properly.
itemsCountNumber* - The number of items.
numberOfItemsInLineNumber* - The number of items on each line of the grid.
onItemClicked(item, index) => void* - The callback for selecting an item. It will be called when an active item is selected, for example with 'Enter'.
getItemByIndex(index) => item - A function which gets an index as a param, and returns the item on that index.
focusOnMountboolean - If true, the referenced element will be focused when mounted.
focusItemIndexOnMountnumber - Optional item index to focus when mounted. Only works with options.focusOnMount.
disabledIndexesnumber[] - Optional array of disabled indices, which will be skipped while navigating.
Returns
resultObject
activeIndexnumber - The index of the currently active item.
onSelectionAction(itemIndex) => void - A wrapper around the passed onItemClicked function. Use it as the handler for selecting items (e.g. onClick)
isInitialActiveStateboolean - If true, the currently active element was due to an initial mounting index option. See options.focusItemIndexOnMount.
