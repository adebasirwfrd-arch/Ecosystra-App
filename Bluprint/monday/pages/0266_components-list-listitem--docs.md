---
id: components-list-listitem--docs
type: docs
title: "Components/List/ListItem"
name: "Docs"
importPath: "./src/pages/components/List/legacy/ListItem.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-list-listitem--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:39:58.449Z
---

ListItem
🚀
New ListItem Available

This component is deprecated. A new ListItem component is available with a cleaner, data-driven API. Check out the 
new ListItem component
.

An item of a List component

List item
Show code
Import
import { ListItem, ListItemIcon, ListItemAvatar } from "@vibe/core";
Copy
Props
ListItemListItemIconListItemAvatar
Name	Description	Default	
Control

aria-current	
Indicates the current state of the item in a set of items.
boolean
"true"
"false"
"page"
"time"
"step"
"location"
"date"
	-	Set object
children	
The textual content inside the list item.
ElementContent
	-	

className	
A CSS class name to apply to the component.
string
	-	Set string
component	
The HTML element used for the list item.
ListItemElement
	
div
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, disables the item and prevents interactions.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
onClick	
Callback fired when the item is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>, id: string) => void
	-	-
onHover	
Callback fired when the item is hovered.
(event: MouseEvent<Element, MouseEvent> | FocusEvent<Element, Element>, id: string) => void
	-	-
role	
The ARIA role of the list item.
AriaRole
	
option
	Set object
selected	
If true, marks the item as selected.
boolean
	-	Set boolean
size	
The size of the list item.
ListItemSize
	
small
	Set object
tabIndex	
The tab index of the list item for keyboard navigation.
number
	
0
	Set number
tooltipProps	
Props passed to the tooltip displayed when hovering over the text.
Partial<TooltipProps>
	-	Set object
Usage
List item can include an ListItemIcon or text.
List item icon should always be displayed before the item's text (left or right depending on the item's text language)
Variants
States
Default state
Disabled state
Selected state
Show code
Sizes
Small item
Medium item
Large item
Show code
List item with an icon
Productivity
Show code
List item with an avatar
Sophia Johnson
Show code
