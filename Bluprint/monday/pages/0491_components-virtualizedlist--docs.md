---
id: components-virtualizedlist--docs
type: docs
title: "Components/VirtualizedList"
name: "Docs"
importPath: "./src/pages/components/VirtualizedList/VirtualizedList.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-virtualizedlist--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:48:57.659Z
---

VirtualizedList

VirtualizedList is a component which only renders visible list items, it is a logic component and doesn't change and look and feel

The VirtualizedList can be Vertical or Horizontal

Under the hood we are using - react-window and react-virtualized-auto-sizer

Vertical List
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
Horizontal List
Item 0
Item 1
Item 2
Item 3
Item 4
Item 5
Item 6
Item 7
Item 8
Show code
Import
import { VirtualizedList } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The ARIA label for the list.
string
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
getItemId	
Function to get the unique ID of an item.
(item: VirtualizedListItem, index: number) => string
	(item: VirtualizedListItem, _index: number) => item.id	-
getItemSize	
Function to get the size (height/width) of each item, based on layout.
(item: VirtualizedListItem, index: number) => number
	(item: VirtualizedListItem, _index: number) => item.height	-
id	
An HTML id attribute for the component.
string
	-	Set string
itemRenderer	
Function to render each item in the list.
(item: VirtualizedListItem, index: number, style: CSSProperties) => Element | ReactElement<any, string | JSXElementConstructor<any>>
	(item: VirtualizedListItem, _index: number, _style: CSSProperties) => item as ReactElement	-
items	
The list of items to be rendered.
VirtualizedListItem[]
	[]	Set object
layout	
The orientation of the list.
Layout
	
vertical
	Set object
onItemsRendered	
Callback fired when items are rendered.
({ firstItemId, secondItemId, lastItemId, centerItemId, firstItemOffsetEnd, currentOffsetTop }: { firstItemId: string; secondItemId: string; lastItemId: string; centerItemId: string; firstItemOffsetEnd: number; currentOffsetTop: number; }) => void
	-	-
onItemsRenderedThrottleMs	
The delay (in ms) for throttling the onItemsRendered callback.
number
	
200
	Set number
onLayoutDirectionScrollbarVisibilityChange	
Callback fired when the vertical or horizontal scrollbar visibility changes.
(value: boolean) => void
	-	-
onScroll	
Callback fired when the list is scrolled.
(horizontalScrollDirection: ScrollDirection, scrollTop: number, scrollUpdateWasRequested: boolean) => void
	-	-
onScrollToFinished	
Callback fired when the scroll animation is finished.
() => void
	-	-
onSizeUpdate	
Callback fired when the list size changes.
(width: number, height: number) => void
	-	-
overscanCount	
Number of items to render above and below the visible portion.
number
	
0
	Set number
role	
The ARIA role attribute applied to the list.
string
	-	Set string
scrollableClassName	
Class name applied to the scrollable container.
string
	-	Set string
scrollDuration	
The duration of the scroll animation in milliseconds.
number
	
200
	Set number
scrollToId	
The ID of the item to scroll to.
string
	-	Set string
style	
Custom inline styles applied to the list.
CSSProperties
	-	Set object
virtualListRef	
Reference to the virtualized list component.
ForwardedRef<HTMLElement>
	-	Set object
Usage
Use this when you expect to have many items in your list
🤓
Are your list items not rendered correctly?
Please make sure you inject the style parameter of the itemRenderer function to the item element'swrapper style.
Related components
List item 1
List item 2
List item 3
List
Lists is a group of actionable items containing primary and supplemental actions, which are represented by icons and text.
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
VirtualizedGrid
VirtualizedGrid is a component which only renders visible grid items, it is a logic component and doesn't change and look and feel.
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
