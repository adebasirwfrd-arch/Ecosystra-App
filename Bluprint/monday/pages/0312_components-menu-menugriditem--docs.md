---
id: components-menu-menugriditem--docs
type: docs
title: "Components/Menu/MenuGridItem"
name: "Docs"
importPath: "./src/pages/components/Menu/MenuGridItem.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-menu-menugriditem--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:41:28.733Z
---

MenuGridItem

MenuGridItem can be used to place a grid-like, keyboard navigable container, inside a Menu. The user will be able to interact and navigate into and from the grid in a natural way.

This is a menu button
Try keyboard navigation :)
0
1
2
3
4
5
6
7
Show code
Props

Since MenuGridItem should be used only inside a Menu, almost all of the props below will be supplied automatically by the wrapping Menu.

Import
import { MenuGridItem } from "@vibe/core";
Copy
Name	Description	Default	
Control

activeItemIndex	
The currently active index of the wrapping menu.
number
	
-1
	Set number
children	
The content of the menu grid item.
ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
closeMenu	
A callback function to close the wrapping menu.
(option: CloseMenuOption) => void
	-	-
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, keyboard navigation will skip this item. This prop is also passed to the child.
boolean
	
false
	Set boolean
getNextSelectableIndex	
Function to get the next selectable index.
(activeItemIndex: number) => number
	-	-
getPreviousSelectableIndex	
Function to get the previous selectable index.
(activeItemIndex: number) => number
	-	-
id	
An HTML id attribute for the component.
string
	-	Set string
index	
The index of this menu grid item.
number
	-	Set number
isUnderSubMenu	
If true, this item is under a submenu instead of a top-level menu.
boolean
	
false
	Set boolean
setActiveItemIndex	
Callback function to set the active item index.
(index: number) => void
	-	-
setSubMenuIsOpenByIndex	
Callback function to open or close a submenu by its index.
(index: number, isOpen: boolean) => void
	-	-
useDocumentEventListeners	
If true, event listeners will be attached to the document.
boolean
	
false
	Set boolean
Usage
MenuGridItem should always be used inside a Menu component
A MenuGridItem can only have a single child
The child of MenuGridItem should use the useGridKeyboardNavigation hook
The child should use forwardRef, and have the same referenced element for useGridKeyboardNavigation.
Also, the referenced element should have a tabIndex value (probably -1).
MenuGridItem will pass the disabled prop to the child. The child should handle this prop and disable interactions.
To support a "disabled" mode, the child must have a prop named disabled (it will be automatically detected).
NOTE: Due to technical limitations, useDocumentEventListeners is not fully supported.
🤓
Looking for a single button in a menu?
Check the MenuItem or MenuItemButton components
Use cases and examples
With disabled states

Disabled items will be "skipped" when using keyboard navigation. Try it for yourself!

This grid has disabled items
0
1
2
3
I'm a regular item
The grid below is disabled entirely
0
1
2
3
Show code
Inside sub-menus

Keyboard navigation is also supported in sub-menus

Menu item
Top level grid item
Hover me to see the sub menu
Another item
Show code
Related components
Send
Delete
More info
Menu
Displays information related to an element over it.
MenuButton
A component to open content next to another component
