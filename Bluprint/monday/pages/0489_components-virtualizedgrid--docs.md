---
id: components-virtualizedgrid--docs
type: docs
title: "Components/VirtualizedGrid"
name: "Docs"
importPath: "./src/pages/components/VirtualizedGrid/VirtualizedGrid.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-virtualizedgrid--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:48:54.019Z
---

VirtualizedGrid

VirtualizedGrid is a component which only renders visible grid items, it is a logic component and doesn't change and look and feel

Under the hood we are using - react-window and react-virtualized-auto-sizer

Item 0
Item 1
Item 2
Item 3
Item 4
Item 5
Item 6
Item 7
Item 8
Item 9
Item 10
Item 11
Item 12
Item 13
Scroll to Item 99
Scrolled to Item null
Show code
Import
import { VirtualizedGrid } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
getColumnWidth	
Function that returns the column width.
() => number
	() => 100	-
getItemId	
Function that returns the unique ID of an item.
(item: VirtualizedGridItemType, index: number) => string
	(item: ItemType, _index: number) => item.id	-
getRowHeight	
Function that returns the row height.
() => number
	() => 50	-
id	
An HTML id attribute for the component.
string
	-	Set string
itemRenderer*	
Function that renders each item in the grid.
(item: VirtualizedGridItemType, index: number, style: CSSProperties) => ReactElement<any, string | JSXElementConstructor<any>>
	-	-
items	
The list of items to be rendered in the grid.
VirtualizedGridItemType[]
	[]	Set object
onItemsRendered	
Callback fired when items are rendered in the grid.
({ firstItemId, secondItemId, lastItemId, centerItemId, firstItemOffsetEnd, currentOffsetTop }: { firstItemId: string; secondItemId: string; lastItemId: string; centerItemId: string; firstItemOffsetEnd: number; currentOffsetTop: number; }) => void
	-	-
onItemsRenderedThrottleMs	
The delay (in ms) for throttling the onItemsRendered callback.
number
	
200
	Set number
onScroll	
Callback fired when the grid is scrolled.
(horizontalScrollDirection: ScrollDirection, scrollTop: number, scrollUpdateWasRequested: boolean) => void
	-	-
onScrollToFinished	
Callback fired when scrolling has finished.
() => void
	-	-
onSizeUpdate	
Callback fired when the grid size is updated.
(width: number, height: number) => void
	-	-
onVerticalScrollbarVisiblityChange	
Callback fired when the vertical scrollbar visibility changes.
(value: boolean) => void
	-	-
scrollableClassName	
Class name applied to the scrollable container.
string
	-	Set string
scrollToId	
The index of the item to scroll to.
number
	-	Set number
Usage
Use this component to implement a grid with many items or when each item render has heavy calculations.
Rendering only the visible grid items instead of all the grid's items will create better performance and a smoother experience for users while using the grid.
Related components
Sent
Subject
Status
Apr 22
Limited time offer: AP Process
In progress
Apr 22
Action required: Update your AP
Queued
Apr 22
Limited time offer: AP Process
Sent
Table
Tables are used to organize data, making it easier to understand.
Item 0
Item 1
Item 2
Item 3
Item 4
Item 5
Item 6
VirtualizedList
VirtualizedList is a component which only renders visible list items, it is a logic component and doesn't change and look and feel.
0
1
2
3
4
5
6
7
MenuGridItem
MenuGridItem can be used to place a grid-like, keyboard navigable container, inside a Menu.
