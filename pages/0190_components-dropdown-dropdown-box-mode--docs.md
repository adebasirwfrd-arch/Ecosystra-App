---
id: components-dropdown-dropdown-box-mode--docs
type: docs
title: "Components/Dropdown/Dropdown box mode"
name: "Docs"
importPath: "./src/pages/components/Dropdown/DropdownBoxMode.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-dropdown-dropdown-box-mode--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:37:25.541Z
---

Dropdown box mode

The dropdown box mode is intended for cases where users need to view and compare options at all times, without opening or closing a dropdown. It allows the user to make a selection from a predefined list of options and is typically used when there are a large amount of options to choose from.

🚀
Migration Guide Available

Migrating from the Combobox? Check out our comprehensive 
Combobox Migration Guide
 for step-by-step instructions, breaking changes, and new features.

Label
Label
Label
Label
Label
Label
Helper text
Show code
Import
import { Dropdown } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The ARIA label for the dropdown.
string
	-	

autoFocus	
If true, the dropdown menu will be auto focused.
boolean
	-	Set boolean
borderless	
If true, the dropdown has no visible border by default, but shows border on hover, focus, and active states.
boolean
	-	Set boolean
boxMode	
If true, the dropdown menu is displayed inline without a popup/dialog.
boolean
	-	Set boolean
className	
A CSS class name to apply to the component.
string
	-	Set string
clearable	
If true, the dropdown will have a clear button.
boolean
	-	Set boolean
clearAriaLabel	
The ARIA label for the clear button.
string
	-	

closeMenuOnSelect	
If true, closes the menu when an option is selected.
boolean
	-	Set boolean
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultValue	

The default selected values for multi-select. The default selected value for single-select.

BaseItemData<Record<string, unknown>> | Item[]
	-	Set object
dir	
The direction of the dropdown.
DropdownDirection
	-	Set object
disabled	
If true, the dropdown is disabled.
boolean
	-	Set boolean
error	
If true, the dropdown is in an error state.
boolean
	-	Set boolean
filterOption	

A function to customize the filtering of options. It receives an option and the current input value, and should return true if the option should be included, false otherwise.

(option: Item, inputValue: string) => boolean
	-	-
helperText	
The helper text to display below the dropdown.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

inputAriaLabel	
The ARIA label for the dropdown input.
string
	-	Set string
inputValue	
The current value of the input field.
string
	-	Set string
isMenuOpen	
If true, controls the menu open state.
boolean
	-	Set boolean
label	
The label to display above the dropdown.
string
	-	Set string
loading	
If true, displays a loading indicator in the dropdown controls.
boolean
	-	Set boolean
maxMenuHeight	
The maximum height of the dropdown menu.
number
	-	Set number
menuAriaLabel	
The ARIA label for the menu container.
string
	-	Set string
menuRenderer	
The function to call to render the menu.
(props: { children: ReactNode; filteredOptions: DropdownListGroup<Item>[]; selectedItems: Item[]; getItemProps: (options: any) => Record<string, unknown>; }) => ReactNode
	-	-
menuWrapperClassName	
The class name to be applied to the menu wrapper.
string
	-	Set string
minVisibleCount	

Minimum number of selected chips to always show before overflowing to the counter. Minimum number of selected chips to always show before overflowing to the counter. (Not available for single select)

number
	-	Set number
multi	

If true, the dropdown allows multiple selections. If true, the dropdown allows multiple selections. Defaults to false.

boolean
	-	Set boolean
multiline	
If true, the dropdown allows multiple lines of selected items. (Not available for single select)
boolean
	-	Set boolean
noOptionsMessage	
The message to display when there are no options.
ReactNode
	-	Set object
onBlur	
Callback fired when the dropdown loses focus.
(event: FocusEvent<HTMLDivElement, Element>) => void
	-	-
onChange	

Callback fired when the selected values change in multi-select mode. Callback fired when the selected value changes in single-select mode.

((options: Item[]) => void) | ((option: Item) => void)
	-	-
onClear	
Callback fired when the clear button is clicked.
() => void
	-	-
onFocus	
Callback fired when the dropdown gains focus.
(event: FocusEvent<HTMLDivElement, Element>) => void
	-	-
onInputChange	
Callback fired when the dropdown input value changes.
(input: string) => void
	-	-
onKeyDown	
Callback fired when a key is pressed inside the dropdown.
(event: KeyboardEvent<HTMLDivElement>) => void
	-	-
onMenuClose	
Callback fired when the dropdown menu closes.
() => void
	-	-
onMenuOpen	
Callback fired when the dropdown menu opens.
() => void
	-	-
onOptionRemove	

Callback fired when an option is removed in multi-select mode. Only available when multi is true. Callback fired when an option is removed in multi-select mode. (Not available for single select)

(option: Item) => void
	-	-
onOptionSelect	
Callback fired when an option is selected.
(option: Item) => void
	-	-
onScroll	
Callback fired when scrolling inside the dropdown.
(event: UIEvent<HTMLUListElement, UIEvent>) => void
	-	-
openMenuOnFocus	
-
	-	-
optionRenderer	
The function to call to render an option.
(option: Item) => ReactNode
	-	-
options*	
The list of options available in the list.
DropdownGroupOption<Item>
	-	Set object
placeholder	
The placeholder to display when the dropdown is empty.
string
	-	

readOnly	
If true, the dropdown is read only.
boolean
	-	Set boolean
ref	
ForwardedRef<HTMLDivElement>
	-	Set object
required	
If true, the dropdown is required.
boolean
	-	Set boolean
searchable	
If true, the dropdown is searchable.
boolean
	-	Set boolean
showSelectedOptions	
If false, selected options will be hidden from the list. Defaults to true.
boolean
	-	Set boolean
size	
The size of the dropdown.
DropdownSizes
	-	Set object
stickyGroupTitle	
If true, makes the group title sticky.
boolean
	-	Set boolean
tooltipProps	
Props to be passed to the Tooltip component that wraps the dropdown.
Partial<TooltipProps>
	-	Set object
value	

The controlled selected values for multi-select. The controlled selected value for single-select.

BaseItemData<Record<string, unknown>> | Item[]
	-	Set object
valueRenderer	
The function to call to render the selected value on single select mode.
(option: Item) => ReactNode
	-	-
withGroupDivider	
If true, displays dividers between grouped options.
boolean
	-	Set boolean
Usage
Allows the user to make a selection from a predefined list of options and is typically used when there are a large amount of options to choose from.
Could be used inside a dialog or as part of a layout.
When users need to scan, compare, or evaluate multiple options at once.
The options list is considered primary content, not secondary UI.
Variants
Default state

Dropdown box mode can be used without dialog or as part of the layout by default.

Label
Label
Label
Label
Label
Label
Label
Helper text
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: 1,
        label: "Label",
      },
      {
        value: 2,
        label: "Label",
      },
      {
        value: 3,
        label: "Label",
      },
      {
        value: 4,
        label: "Label",
      },
      {
        value: 5,
        label: "Label",
      },
      {
        value: 6,
        label: "Label",
      },
    ],
    []
  );
  return (
    <div
      style={{
        width: "300px",
      }}
    >
Copy
Format
Reset
Inside a dialog

Use this for Dropdown box mode that triggered by button.

Label
Label
Label
Label
Label
Label
Edit
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: 1,
        label: "Label",
      },
      {
        value: 2,
        label: "Label",
      },
      {
        value: 3,
        label: "Label",
      },
      {
        value: 4,
        label: "Label",
      },
      {
        value: 5,
        label: "Label",
      },
      {
        value: 6,
        label: "Label",
      },
    ],
    []
  );
  return (
    <div
      style={{
        width: "300px",
      }}
    >
Copy
Format
Reset
Multi select

The box mode supports multi select option that display as chips. The selected items can be shown in either a single line (with additional option for hidden list), or multiple line. This mode also supports all standard dropdown states.

Single line with hidden options
Label
Label
Label
Label
Label
Multiple lines
Label
Label
Label
Label
Label
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: 1,
        label: "Label",
      },
      {
        value: 2,
        label: "Label",
      },
      {
        value: 3,
        label: "Label",
      },
      {
        value: 4,
        label: "Label",
      },
      {
        value: 5,
        label: "Label",
      },
    ],
    []
  );
  return (
    <Flex gap="large" align="start" wrap>
      <Flex direction="column" gap="medium">
        <Text type="text1" weight="bold">
          Single line with hidden options
        </Text>
        <div
          style={{
            width: "300px",
          }}
Copy
Format
Reset
With icons
Notify via
Email
Send
Mobile
Send notification
Story Editor
() => {
  const optionsWithIcons: any = useMemo(
    () => [
      {
        value: "email",
        label: "Email",
        startElement: {
          type: "icon",
          value: Email,
        },
      },
      {
        value: "send",
        label: "Send",
        startElement: {
          type: "icon",
          value: Send,
        },
      },
      {
        value: "mobile",
        label: "Mobile",
        startElement: {
          type: "icon",
          value: Mobile,
        },
      },
      {
        value: "notification",
        label: "Send notification",
      },
    ],
    []
  );
  return (
    <div
Copy
Format
Reset
Do's and don'ts
Do
Use when there’s a need for a select that displays the list in a persistent, always-open panel.
Don't
Use when there's need for a searchable menu, for navigation. Use a 
menu
 instead
Use cases and examples
People picker

Can be used when there is a need for selecting people to assign a column

Person
Suggested people
Matt Gaman
Jennifer Lawrence
Emma Stone
Johnny Depp
Story Editor
() => {
  const peopleOptions: any = useMemo(
    () => [
      {
        label: "Suggested people",
        options: [
          {
            value: "Matt",
            label: "Matt Gaman",
            startElement: {
              type: "avatar",
              value: person1,
            },
          },
          {
            value: "Jennifer",
            label: "Jennifer Lawrence",
            startElement: {
              type: "avatar",
              value: person2,
            },
          },
          {
            value: "Emma",
            label: "Emma Stone",
            startElement: {
              type: "avatar",
              value: person3,
            },
          },
          {
            value: "Johnny",
            label: "Johnny Depp",
            startElement: {
              type: "avatar",
              value: person4,
Copy
Format
Reset
Related components
Option 1
Option 2
Option 3
Combobox
Combobox allowing users to filter longer lists to only the selections matching a query.
Send
Delete
More info
Menu
Displays information related to an element over it.
