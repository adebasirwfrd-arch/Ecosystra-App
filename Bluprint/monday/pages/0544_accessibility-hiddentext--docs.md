---
id: accessibility-hiddentext--docs
type: docs
title: "Accessibility/HiddenText"
name: "Docs"
importPath: "./src/pages/components/HiddenText/HiddenText.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=accessibility-hiddentext--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:35.102Z
---

HiddenText

Hidden text helps us to create a text which is accessible to screen reader users but not to users who see the screen.

Hello hidden text
Show code
Import
import { HiddenText } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	
""
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	
"hiddenText"
	Set string
text*	
The text content that is hidden but available for assistive technologies.
string
	-	Set string
Usage
Use hidden text for writing a text which should be exposed to screen reader users only.
🤓
Tip

If your text should be hidden from everyone please hide it by using CSS with "display: none" or "visibility: hidden".

Related components
Button with custom appearance
Clickable
An accessibility helper component which simulates a button behaviour on non button elements.
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
TextField
Allows users take actions with a single click.
