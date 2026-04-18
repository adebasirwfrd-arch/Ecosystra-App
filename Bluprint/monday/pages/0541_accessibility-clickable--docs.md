---
id: accessibility-clickable--docs
type: docs
title: "Accessibility/Clickable"
name: "Docs"
importPath: "./src/pages/components/Clickable/Clickable.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=accessibility-clickable--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:29.638Z
---

Clickable

An accessibility helper component, this component simulates a button on non button elements

I act like a button
Show code
Import
import { Clickable } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-expanded	
If true, indicates that the associated popup is open.
boolean
	-	Set boolean
aria-haspopup	
Indicates the presence of a popup associated with the element.
boolean
	-	Set boolean
aria-hidden	
If true, hides the element from assistive technologies.
boolean
	-	Set boolean
aria-label	
The label of the element for accessibility.
string
	-	Set string
children	
The content inside the clickable element.
ReactNode
	-	Set object
className	
A CSS class name to apply to the component.
string
	
""
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the element is disabled.
boolean
	
false
	Set boolean
elementType	
The HTML element or custom component used as the root.
string
	
"div"
	Set string
enableTextSelection	
If true, allows text selection inside the element.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
onClick	
Callback fired when the element is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>) => void
	-	-
onMouseDown	
Callback fired when the mouse button is pressed down on the element.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseEnter	
Callback fired when the mouse enters the element.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseLeave	
Callback fired when the mouse leaves the element.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
role	
The ARIA role of the element.
AriaRole
	
button
	Set object
style	
Inline styles applied to the element.
CSSProperties
	-	Set object
tabIndex	
The tab order of the element.
number
	
0
	Set number
Variants
States

Clickable component supports two different states: regular state and disabled state. The state only affects the component functionality (a user cannot interact with a disabled clickable component) and not the component appearance. You can use the component className and style props to change the component appearance.

Regular clickable element
Disabled clickable element
Story Editor
<Flex gap="medium">
  <Clickable onClick={() => alert("clicked")} aria-label="clickable button">
    <Box border padding="small" rounded="small">
      Regular clickable element
    </Box>
  </Clickable>
  <Clickable
    onClick={() => alert("clicked")}
    disabled
    aria-label="disabled clickable button"
  >
    <Box
      border
      backgroundColor="greyBackgroundColor"
      padding="small"
      rounded="small"
    >
      Disabled clickable element
    </Box>
  </Clickable>
</Flex>
Copy
Format
Reset
🤓
Check out our hook solution for this use case
If you'd like to set clickable functionality on a specific element inside your React component instead of using a wrapper, please, take a look on our 
useClickableProps
 hook.
Usage
When you can't use button, but need to provide keyboard intractability
This component behaves like a button, treat it like one
Related components
Get started
Button
Allow users take actions with a single click.
IconButton
When you want to have a button with just an Icon
