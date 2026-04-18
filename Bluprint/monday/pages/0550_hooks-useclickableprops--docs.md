---
id: hooks-useclickableprops--docs
type: docs
title: "Hooks/useClickableProps"
name: "Docs"
importPath: "./src/pages/hooks/useClickableProps/useClickableProps.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useclickableprops--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:46.231Z
---

useClickableProps

Return props for making an element or component clickable by mouse and keyboard with screen reader support.

I act like a button
Show code
Import
import { useClickableProps } from "@vibe/core";
Copy
🤓
Check out our component solution for this use case
For more simple use cases, you also can use our 
Clickable
 component wrapper.
Usage
Use this hook instead of Clickable component wrapper when you want to customize clickable styles by yourself.
Arguments
onClick(event: React.MouseEvent | React.KeyboardEvent) => void - Click callback.
onMouseDown(event: React.MouseEvent) => void - Mouse down callback.
disabledboolean - Whether element is disabled or not.
idstring - Id of the element.
dataTestIdstring - Id of the element for test purposes.
rolestring - Provide semantic meaning to content.
More details.
tabIndexnumber - Specifies the tab order of the element. Default value is 0.
More details.
aria-labelstring - Defines a string value that labels an interactive element for assistive technologies.
More details.
aria-hiddenboolean - HTML attribute for hiding content from screen readers and other assistive technologies.
More details.
aria-haspopupboolean - Indicates the availability and type of interactive popup element that can be triggered by the element on which the attribute is set.
More details.
aria-expandedboolean - Indicate if a control is expanded or collapsed, and whether or not its child elements are displayed or hidden.
More details.
Returns
ref(node: HTMLElement) => void - A React
ref
object for the clickable element.
onClick(event: React.MouseEvent | React.KeyboardEvent) => void - Click callback.
onMouseDown(event: React.MouseEvent) => void - Mouse down callback.
onKeyDown(event: React.MouseEvent) => void - Key down callback.
idstring - Id of the element.
data-testidstring - Id of the element for test purposes.
rolestring - Provide semantic meaning to content.
More details.
tabIndexnumber - Specifies the tab order of an element.
More details.
aria-labelstring - Defines a string value that labels an interactive element.
More details.
aria-hiddenboolean - Used to hide non-interactive content from the accessibility API.
More details.
aria-hasPopupboolean - Indicates the availability and type of interactive popup element that can be triggered by the element on which the attribute is set.
More details.
aria-expandedboolean - Indicate if a control is expanded or collapsed, and whether or not its child elements are displayed or hidden.
More details.
