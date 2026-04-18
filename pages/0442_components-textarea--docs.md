---
id: components-textarea--docs
type: docs
title: "Components/TextArea"
name: "Docs"
importPath: "./src/pages/components/TextArea/TextArea.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-textarea--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:47:24.333Z
---

TextArea

A field that allows users to write multiple lines of text. Text area includes a label and a field that users can type into. It can also come with helper text.

Text area label
Helper text
Show code
Import
import { TextArea } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

allowExceedingMaxLength	
If true, allows the user to exceed the character limit set by maxLength.
boolean
	-	Set boolean
aria-label	
The accessibility label for the textarea.
string
	-	

data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, disables the textarea.
boolean
	-	Set boolean
error	
If true, applies error styling to the textarea.
boolean
	-	Set boolean
helpText	
Help text displayed below the textarea.
string
	-	

id	
	-	

label	
The label associated with the textarea.
string
	-	

maxLength	
The maximum number of characters allowed.
number
	-	Set number
onChange	
Callback fired when the textarea value changes.
(event: ChangeEvent<HTMLTextAreaElement>) => void
	-	-
placeholder	
The placeholder text displayed when the textarea is empty.
string
	-	Set string
readOnly	
If true, makes the textarea read-only.
boolean
	-	Set boolean
resize	
If true, the textarea can be resized vertically.
boolean
	
true
	Set boolean
showCharCount	
If true, displays the character count below the textarea.
boolean
	
false
	Set boolean
size	
Determines the size of the textarea text as well as the default row count.
TextAreaSize
	
small
	Set object
success	
If true, applies success styling to the textarea.
boolean
	-	Set boolean
value	
The current value of the textarea.
string
	-	Set string
Usage
Use text area to allow users to write multiple lines of text, usually for comments or descriptions.
Placeholders should only be used when necessary.
Accessibility
Using an id is highly recommended for all instances to ensure the best accessibility.
Always provide a visible label to ensure the textarea's purpose is clear to all users.
When using label or helpText, you must also provide an id. This is crucial, as it allows screen readers to correctly associate the textarea with its label and description.
For required fields, use the required prop to ensure proper screen reader announcements and native browser validation.
Provide descriptive error messages using the error prop with helpText to help users understand and correct validation issues.
The component automatically sets aria-invalid when validation fails, including when character count exceeds maxLength.
Character counting with showCharCount automatically provides accessibility labels for screen readers.
Use the aria-label prop when a visible label is not desired but accessibility support is still needed.
The component automatically handles aria-describedby attributes for help text and character limit information when applicable.
Variants
Sizes

There are two sizes available: small and large.

Large text area
Small text area
Story Editor
<>
  <TextArea
    id="sizes-large"
    aria-label="Large text area"
    size="large"
    label="Large text area"
  />
  <TextArea
    id="sizes-small"
    aria-label="Small text area"
    size="small"
    label="Small text area"
  />
</>
Copy
Format
Reset
States

Text areas have all the same states as text fields.

Success state
Error state
Disabled state
Read only state
Story Editor
<>
  <TextArea
    id="states-success"
    aria-label="Success text area"
    size="small"
    label="Success state"
    success
  />
  <TextArea
    id="states-error"
    aria-label="Error text area"
    size="small"
    label="Error state"
    error
  />
  <TextArea
    id="states-disabled"
    aria-label="Disabled text area"
    size="small"
    label="Disabled state"
    disabled
  />
  <TextArea
    id="states-readonly"
    aria-label="Read only text area"
    size="small"
    label="Read only state"
    readOnly
  />
</>
Copy
Format
Reset
Validation

If a required text area is left empty, use validation text to give feedback to users. The validation error state should appear after users try to submit a form.

Text area label
Validation text
Story Editor
<TextArea
  id="validation-textarea"
  aria-label="Text area with validation"
  size="small"
  label="Text area label"
  error
  required
  helpText="Validation text"
/>
Copy
Format
Reset
Do's and Don'ts
Do
Use text area if you want to ask an open question. Make sure the question is short and clear.
Don't
Don't use a text area if you want short and specific info - use a text field instead.
Related components
TextField
Allows users take actions with a single click.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
Search
Displays content classification.
