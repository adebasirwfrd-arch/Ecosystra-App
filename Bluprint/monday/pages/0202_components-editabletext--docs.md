---
id: components-editabletext--docs
type: docs
title: "Components/EditableText"
name: "Docs"
importPath: "./src/pages/components/EditableText/EditableText.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-editabletext--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:37:48.496Z
---

EditableText

Editable text allows users to seamlessly and dynamically edit in-line content. Its default state is a read-view, based on the 
Text
 component, and it becomes editable after clicking on it.

This text is an editable text
Show code
Import
import { EditableText } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The label of the component for accessibility.
string
	-	

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
multiline	
If true, enables editing multiple lines of text.
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
The text style variant.
TextType
	
text2
	Set object
value*	
The current value of the text.
string
	-	

weight	
The font weight of the text.
TextWeight
	
normal
	Set object
Usage
Use when you want to allow the user to edit an existing text
This component grows relative to its content, and its maximum width is 100% of its container
🤓
Am I using the right component?
This component is used for editing existing text. To allow users to fill empty text fields, for example in a form, consider using 
TextField
Variants
Text types

Editable text can be used with any of the 
Text
 component sizes and weights.

Text1 Normal
Text1 Medium
Text1 Bold
Text2 Normal
Text2 Medium
Text2 Bold
Text3 Normal
Text3 Medium
Story Editor
<Flex direction="column" gap="large" align="start">
  <Flex gap="large">
    <EditableText
      aria-label="Text1 normal editable text"
      type="text1"
      weight="normal"
      value="Text1 Normal"
    />
    <EditableText
      aria-label="Text1 medium editable text"
      type="text1"
      weight="medium"
      value="Text1 Medium"
    />
    <EditableText
      aria-label="Text1 bold editable text"
      type="text1"
      weight="bold"
      value="Text1 Bold"
    />
  </Flex>
  <Flex gap="large">
    <EditableText
      aria-label="Text2 normal editable text"
      type="text2"
      weight="normal"
      value="Text2 Normal"
    />
    <EditableText
      aria-label="Text2 medium editable text"
      type="text2"
      weight="medium"
      value="Text2 Medium"
    />
    <EditableText
      aria-label="Text2 bold editable text"
Copy
Format
Reset
Multiline

Editable text can be used to allow multiline input.

This is a multiline
here's the second line
Story Editor
<EditableText
  aria-label="Multiline editable text"
  type="text1"
  weight="normal"
  multiline
  value={`This is a multiline
here's the second line`}
/>
Copy
Format
Reset
With placeholder
Clear text to see placeholder
Story Editor
<EditableText
  aria-label="Editable text with placeholder"
  value="Clear text to see placeholder"
  placeholder="Enter your text here..."
/>
Copy
Format
Reset
Related components
lorem ipsum dolor sit amet
Text
The text component serves as a wrapper for applying typography styles to the text it contains.
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
Hello world
EditableHeading
An extension of Heading component, it allows built in editing capabilities.
