---
id: components-editableheading--docs
type: docs
title: "Components/EditableHeading"
name: "Docs"
importPath: "./src/pages/components/EditableHeading/EditableHeading.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-editableheading--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:37:40.738Z
---

EditableHeading

Editable Heading allows users to seamlessly and dynamically edit in-line content. Its default state is a read-view, based on the 
Heading
 component, and it becomes editable after clicking on it.

This heading is an editable heading
Show code
Import
import { EditableHeading } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The label of the component for accessibility.
string
	-	Set string
autoSelectTextOnEditMode	
If true, automatically selects all text when entering edit mode.
boolean
	-	Set boolean
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
isEditMode	
Controls whether the component is in edit mode.
boolean
	-	Set boolean
onChange	
Callback fired when the value changes.
(value: string) => void
	-	-
onClick	
Callback fired when the component is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>) => void
	-	-
onEditModeChange	
Callback fired when the edit mode changes.
(isEditMode: boolean) => void
	-	-
onKeyDown	
Callback fired when a key is pressed inside the input/textarea element.
(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	-	-
placeholder	
Placeholder text displayed when the value is empty.
string
	-	Set string
readOnly	
If true, the text is read-only and cannot be edited.
boolean
	-	Set boolean
tooltipProps	
Props to customize the tooltip.
Partial<TooltipProps>
	-	Set object
type	
The type of the heading element.
HeadingType
	
h1
	Set object
value*	
The current value of the text.
string
	-	

weight	
The font weight of the heading.
HeadingWeight
	
normal
	Set object
Usage
Use when you want to allow the user to edit an existing heading text
This component grows relative to its content, and its maximum width is 100% of its container
🤓
Am I using the right component?
This component is used for editing text size 18px and up. For editing smaller text sizes, consider using 
EditableText
Variants
Heading types

Editable heading can be used with any of the 
Heading
 component sizes and weights.

H1 Light
H1 Normal
H1 Medium
H1 Bold
H2 Light
H2 Normal
H2 Medium
H2 Bold
H3 Light
H3 Normal
H3 Medium
H3 Bold
Story Editor
<Flex direction="column" gap="large" align="start">
  <Flex gap="large">
    <EditableHeading
      id="h1-light"
      aria-label="H1 light heading"
      type="h1"
      weight="light"
      value="H1 Light"
    />
    <EditableHeading
      id="h1-normal"
      aria-label="H1 normal heading"
      type="h1"
      weight="normal"
      value="H1 Normal"
    />
    <EditableHeading
      id="h1-medium"
      aria-label="H1 medium heading"
      type="h1"
      weight="medium"
      value="H1 Medium"
    />
    <EditableHeading
      id="h1-bold"
      aria-label="H1 bold heading"
      type="h1"
      weight="bold"
      value="H1 Bold"
    />
  </Flex>
  <Flex gap="large">
    <EditableHeading
      id="h2-light"
      aria-label="H2 light heading"
      type="h2"
Copy
Format
Reset
With placeholder
Clear heading to see placeholder
Story Editor
<EditableHeading
  id="with-placeholder"
  aria-label="Editable heading with placeholder"
  value="Clear heading to see placeholder"
  placeholder="Enter your heading here..."
/>
Copy
Format
Reset
Related components
Hello world
EditableText
An extension of the Text component with built in editing capabilities.
lorem ipsum dolor sit amet
Text
The text component serves as a wrapper for applying typography styles to the text it contains.
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
