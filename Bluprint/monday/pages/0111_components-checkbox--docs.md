---
id: components-checkbox--docs
type: docs
title: "Components/Checkbox"
name: "Docs"
importPath: "./src/pages/components/Checkbox/Checkbox.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-checkbox--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:34:47.718Z
---

Checkbox

Checkboxes allow users to select one or more items from a set of options.

Option
Show code
Import
import { Checkbox } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The label of the checkbox for accessibility.
string
	-	

aria-labelledby	
The ID of an element describing the checkbox.
string
	-	Set string
autoFocus	
If true, the checkbox automatically receives focus.
boolean
	-	Set boolean
checkboxClassName	
Class name applied to the checkbox element.
string
	-	Set string
checked	
If true, controls the checked state of the checkbox.
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
defaultChecked	
The initial checked state of the checkbox.
boolean
	-	
FalseTrue
disabled	
If true, the checkbox is disabled.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	

indeterminate	
If true, displays an indeterminate state.
boolean
	
false
	Set boolean
label	
The content displayed next to the checkbox.
ReactNode | ReactNode[]
	-	

labelClassName	
Class name applied to the label element.
string
	-	Set string
name	
The name of the checkbox, used for form submission.
string
	
""
	Set string
onChange	
Callback fired when the checkbox value changes.
(event: ChangeEvent<HTMLInputElement>) => void
	-	-
separateLabel	

If true, uses separate labels with htmlFor/id association instead of wrapping the input. If using this the id prop is required for it to function correctly.

boolean
	
false
	Set boolean
tabIndex	
The tab order of the checkbox.
number
	-	Set number
value	
The value submitted with the form when checked.
string
	
""
	Set string
Usage
Use checkboxes to:
1. Select one or more options from a list
2. Turn an item on or off in a desktop environment
Use checkboxes independently from each other: selecting one checkbox shouldn’t change the selection status of another checkbox in the list. The exception is when a checkbox is used to make a bulk selection.
Ensure both label and input are clickable to select the checkbox field.
Keep a positive tone of voice. For example: “Turn on notifications” instead of “Turn off notifications”.
Checkboxes should be listed according to a logical order.
Place checkboxes vertically, using 16px spacing.
Checkbox will always appear with a label.
Accessibility
Using an id is highly recommended for all instances to ensure proper label association.
Always provide a visible label prop to ensure the checkbox's purpose is clear to all users.
It is recommended to use separateLabel mode for better screen reader support as it provides clearer, more explicit label-input associations. When using this mode, the id prop is required for proper label association.
Use ariaLabel prop when you need to provide a custom accessible name.
Use ariaLabelledBy prop when the checkbox is described by external elements.
Use indeterminate prop for mixed selection states (e.g., when some but not all sub-items are selected).
Use tabIndex prop for custom keyboard navigation order.
Use autoFocus prop when the checkbox should receive initial focus for keyboard navigation.
🤓
Am I using the right component?
For settings that are immediately applied, consider using a 
toggle switch
 instead.
Variants
States

Has 4 states: regular, hover, selected, and disabled.

Regular
Selected
Indeterminate
Disabled
Disabled checked
Disabled indeterminate
Story Editor
<>
  <Checkbox label="Regular" id="checkbox-2" aria-label="Regular checkbox" />
  <Checkbox
    label="Selected"
    checked
    id="checkbox-3"
    aria-label="Selected checkbox"
  />
  <Checkbox
    label="Indeterminate"
    indeterminate
    id="checkbox-4"
    aria-label="Indeterminate checkbox"
  />
  <Checkbox
    label="Disabled"
    disabled
    id="checkbox-5"
    aria-label="Disabled checkbox"
  />
  <Checkbox
    label="Disabled checked"
    disabled
    checked
    id="checkbox-6"
    aria-label="Disabled checked checkbox"
  />
  <Checkbox
    label="Disabled indeterminate"
    disabled
    indeterminate
    id="checkbox-7"
    aria-label="Disabled indeterminate checkbox"
  />
</>
Copy
Format
Reset
Do’s and Don’ts
Item 1
Item 2
Item 3
Do
Use checkboxes when one or more items can be selected.
Item 1
Item 2
Item 3
Don't
Don't use checkboxes when only one item can be selected from a list. Use 
radio buttons
 instead.
Option
Do
Use the checkbox label’s prop to describe the option purpse.
Option
Don't
Don’t use a separte div which is not related to the Checkbox component.
Item 1
Item 2
Item 3
Do
Place the checkbox on the left side of the label.
Item 1
Item 2
Item 3
Don't
Don’t change the position of the checkbox. Keep it to the left side of the label.
Only show incomplete items
Do
Always keep a positive tone of voice.
Hide done items
Don't
Avoid negative language that makes the user check the box in order for something not to happen.
Use cases and examples
Single checkbox

Allows the user to choose a single option. For example: accept terms of use.

I agree to the 
Terms of Service
 and 
Privacy Policy
.
Story Editor
<Checkbox
  id="single-checkbox"
  aria-label="Agree to terms and privacy policy"
  checked
  label={
    <>
      I agree to the <Link href={"#"} text="Terms of Service" inlineText></Link>{" "}
      and <Link href={"#"} text="Privacy Policy" inlineText></Link>.
    </>
  }
/>
Copy
Format
Reset
Related components
Selection
RadioButton
Allow for a single option to be selected from a visible list.
Off
On
Toggle
Allow users to turn an individual option on or off.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
