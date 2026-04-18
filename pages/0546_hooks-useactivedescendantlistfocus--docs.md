---
id: hooks-useactivedescendantlistfocus--docs
type: docs
title: "Hooks/useActiveDescendantListFocus"
name: "Docs"
importPath: "./src/pages/hooks/useActiveDescendantListFocus/useActiveDescendantListFocus.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useactivedescendantlistfocus--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:38.766Z
---

useActiveDescendantListFocus

Using this hook for not its intended purpose will hurt your component accessibility.


Import
import { useActiveDescendantListFocus } from "@vibe/core";
Copy

Please use this hook only if your component role is one of the following: "composite" widget, "combobox", "textbox", "group", or "application".

This hook is part of a group of hooks we implement for you to ease the development of accessible components in the context of managing focus and keyboard navigation.

Use this hook only when you want the browser's natural focus to be on a specific element (usually text input or search) when at the same time, the user will see a visual focus on one of the items in the list depending on the use of the arrow keyboard buttons. Meanwhile, the user can navigate between items and select one of them by using the keyboard. but the focus on the list's item is always only visual (the real focus always be on a specific element, as explained before.)

Item 1
Item 2
Item 3
Show code
Arguments
optionsObject
focusedElementRefMutableRefObject<HTMLElement>* - The reference for the component that listens to keyboard
itemsIdsstring[]* - Array of elements ids
isItemSelectable(index: number) => boolean* - If user can select index item
onItemClick(event: React.KeyboardEvent | React.MouseEvent, index: number) => void* - Callback on item click
defaultVisualFocusFirstIndexboolean - Default value of index of the first element, which will get visual focus. Defaults to: false
focusedElementRoleRole - Possible values: useActiveDescendantListFocus.roles. Defaults to: useActiveDescendantListFocus.roles.GROUP
isHorizontalListboolean Defaults to: false
isIgnoreSpaceAsItemSelectionboolean Defaults to: false
useDocumentEventListenersboolean Defaults to: false
ignoreDocumentFallbackboolean Defaults to: false
Returns
resultObject
visualFocusItemIndexnumber - The index of the currently visually focused item element.
visualFocusItemIdnumber - The id of the currently visually focused item element.
createOnItemClickCallback(itemId) => onItemClickCallback(event, itemId) - Higher order function which creates and returns a onclick callback function for item element according to the item id which received as parameter.
If you prefer to create the item's on click callback by yourself, you can use the onItemClickCallback field in this hook return value.
onItemClickCallback(event, itemId) => {} - Most in time you will not need to use this return value field. This function is the general function which will be activate for all items when clicked. you can set it directly as the item's element on click callback only if you make sure you pass the item index parameter correctly to the function.
focusedElementProps{role, aria-activedescendant} - All the required props which should be defined inside the naturally focused element inside your component according to the accessibility standards
setVisualFocusItemId(visualFocusItemId, isTriggeredByKeyboard) => {} - A function for controlling the visual focused item from outside (needed for cases such as exiting sub menu or dialog, when we want to return the focus to the last focused item.
Usage

This hook contains the implementation of all the logic needed for managing the focus of a component that fits the following description:

The component displays a list of values shown in one dimension - horizontal or vertical.

The user can interact with the component items, and therefore, the component is focusable.

When the user focuses on the component, the browser's real focus will always be on an element that is not one of the component's items. Most of the time, the focus will be on the component's Search item or different Text input item.

Meanwhile, the user can navigate between items and select one of them by using the keyboard. but the focus on the list's item is always only visual (the real focus always be on a specific element, as explained before.)
