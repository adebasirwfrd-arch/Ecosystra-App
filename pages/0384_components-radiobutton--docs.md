---
id: components-radiobutton--docs
type: docs
title: "Components/RadioButton"
name: "Docs"
importPath: "./src/pages/components/RadioButton/RadioButton.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-radiobutton--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:44:02.735Z
---

RadioButton

A radio represents an item in a single selection list.

Selection
Show code
Import
import { RadioButton } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-describedby	
ID of element that describe this radio button.
string
	-	Set string
aria-label	
ARIA label for accessibility when no text is provided.
string
	-	Set string
autoFocus	
If true, the radio button automatically receives focus on mount.
boolean
	-	Set boolean
checked	
If provided, controls the checked state of the radio button.
boolean
	-	Set boolean
children	
The child elements inside the radio button.
ReactNode
	-	Set object
childrenTabIndex	
The tab index applied to the children.
number
	
0
	Set number
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultChecked	
If true, the radio button is checked by default.
boolean
	
false
	Set boolean
disabled	
If true, the radio button is disabled.
boolean
	
false
	Set boolean
disabledReason	
The reason why the radio button is disabled, displayed in a tooltip.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

labelClassName	
Class name applied to the label text.
string
	-	Set string
name	
The name of the radio button group.
string
	
""
	Set string
noLabelAnimation	
If true, disables the label animation.
boolean
	
false
	Set boolean
onSelect	
Callback fired when the radio button selection changes.
(event: ChangeEvent<HTMLInputElement>) => void
	-	-
radioButtonClassName	
Class name applied to the radio button element.
string
	-	Set string
retainChildClick	
If true, clicking on children will trigger selection.
boolean
	
true
	Set boolean
text	
The label text displayed next to the radio button.
string
	
""
	

value	
The value associated with the radio button.
string
	
""
	Set string
Usage
A radio lets a user make exactly one selection from a set, which is all visible at the same time.
Set one radio group option as default. Select the most likely or convenient option.
Ensure both label and input are clickable to select the option.
Place radio buttons can be placed vertically or horizontaly, using 16px spacing.
Accessibility
Using an id is recommended for all instances to ensure proper label association.
Always provide a text prop to ensure the radio button's purpose is clear to all users.
Use the same name prop for all radio buttons in a group to ensure proper keyboard navigation and screen reader grouping.
Use disabled prop appropriately to indicate when radio buttons are not available for interaction.
Use disabledReason prop to provide an explanation for disabled radio buttons, shown in a tooltip.
Use autoFocus prop when a radio button should receive initial focus for keyboard navigation.
Use childrenTabIndex prop to control the tab order when radio buttons have interactive children.
Use retainChildClick prop to control whether clicking on children triggers radio button selection.
🤓
Tip
When there’s limited space or no default selection, consider using a select 
Dropdown
 instead.
Variants
States

Radio buttons have 3 states: regular, selected, and disabled.

Regular
Selected
Disabled
Disabled
Story Editor
<Flex gap="medium">
  <RadioButton id="states-regular" text="Regular" />
  <RadioButton id="states-selected" text="Selected" checked />
  <RadioButton
    id="states-disabled"
    text="Disabled"
    disabled
    disabledReason="Disabled reason"
  />
  <RadioButton id="states-disabled-checked" text="Disabled" checked disabled />
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Item 1
Item 2
Do
Use radio buttons when only one item can be selected from a list.
Item 1
Item 2
Don't
Don't use radio buttons when allowing the user to select more than one item from a list. In this case, use 
checkboxes
 instead.
Item 1
Item 2
Item 3
Do
Mark the first item as selected, and make sure it’s the most common or popular action.
Item 1
Item 2
Item 3
Don't
Don’t leave all radio buttons unselcted. If you can’t offer a smart default, consider using the 
dropdown component.
Use cases and examples
Radio button in items list

The user needs to select only one option.

Inbox view options
Inbox updates
I was mentioned
All updates
Story Editor
<Flex direction="column" gap="medium" align="start">
  <div id="inbox-view-label">Inbox view options</div>
  <RadioButton
    id="inbox-updates"
    text="Inbox updates"
    name="radio-buttons-group-4"
    defaultChecked
  />
  <RadioButton
    id="was-mentioned"
    text="I was mentioned"
    name="radio-buttons-group-4"
  />
  <RadioButton
    id="all-updates"
    text="All updates"
    name="radio-buttons-group-4"
  />
</Flex>
Copy
Format
Reset

Controlled externally.

Controlled radio buttons
Select next radio button (Radio 2)
Radio 1
Radio 2
Radio 3
Story Editor
() => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClickCB = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % 3);
  }, [setSelectedIndex]);
  const onChange = useCallback(() => {}, []);
  return (
    <Flex direction="column" gap="medium" align="start">
      <div id="controlled-radio-label">Controlled radio buttons</div>
      <Button
        id="select-next-button"
        kind="secondary"
        onClick={onClickCB}
      >{`Select next radio button (Radio ${
        ((selectedIndex + 1) % 3) + 1
      }) `}</Button>
      <RadioButton
        id="radio-1"
        text="Radio 1"
        name="radio-buttons-group-5"
        checked={selectedIndex === 0}
        onSelect={onChange}
      />
      <RadioButton
        id="radio-2"
        text="Radio 2"
        name="radio-buttons-group-5"
        checked={selectedIndex === 1}
        onSelect={onChange}
      />
      <RadioButton
        id="radio-3"
        text="Radio 3"
        name="radio-buttons-group-5"
        checked={selectedIndex === 2}
        onSelect={onChange}
Copy
Format
Reset
Related components
Selected
Checkbox
Allow users to select one or more items from a set of options.
Off
On
Toggle
Allow users to turn an individual option on or off.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
