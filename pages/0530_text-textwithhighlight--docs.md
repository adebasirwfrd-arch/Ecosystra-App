---
id: text-textwithhighlight--docs
type: docs
title: "Text/TextWithHighlight"
name: "Docs"
importPath: "./src/pages/components/TextWithHighlight/TextWithHighlight.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=text-textwithhighlight--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:09.370Z
---

TextWithHighlight

Component for displaying highlighted text

Hello world, hello world again
Show code
Import
import { TextWithHighlight } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

allowTermSplit	
If true, allows splitting the highlight term into separate words.
boolean
	
true
	Set boolean
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
highlightTerm	
The term to highlight within the text.
string
	-	

id	
An HTML id attribute for the component.
string
	-	Set string
ignoreCase	
If true, the highlight search is case-insensitive.
boolean
	
true
	Set boolean
limit	
The maximum number of highlighted terms allowed.
number
	-	Set number
linesToClamp	
The number of lines to display before truncating with an ellipsis.
number
	
3
	Set number
nonEllipsisTooltip	
Tooltip content displayed when there is no overflow.
string
	-	Set string
text	
The text content to display.
string
	
""
	

tooltipProps	
Additional props to customize the tooltip component.
Partial<TooltipProps>
	{ }	Set object
useEllipsis	
If true, truncates overflowing text with an ellipsis.
boolean
	
true
	Set boolean
wrappingElementClassName	
Class name applied to the wrapping element of highlighted text.
string
	-	Set string
wrappingTextTag	
The HTML tag used to wrap highlighted text.
keyof IntrinsicElements
	
em
	Set object
Usage
By using this component, you can display text with highlighted sub strings according to a given term and lines limit.
Related components
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
TextField
Allows users take actions with a single click.
Hello world
EditableHeading
An extension of Heading component, it allows built in editing capabilities.
