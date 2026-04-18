---
id: components-dropdown-basic-dropdown--docs
type: docs
title: "Components/Dropdown/Basic dropdown"
name: "Docs"
importPath: "./src/pages/components/Dropdown/DropdownBasicDropdown.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-dropdown-basic-dropdown--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:37:02.138Z
---

Basic Dropdown

The basic dropdown is intended for quick value selection when space is limited and the list of options doesn't need to remain visible. It typically is used when you have 5-8 items to choose from where an action is initiated based on the selection.

Label
Placeholder text here
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
Dropdown is typically used when you have 5-8 items to choose from. They are used for navigation or command menus, where an action is initiated based on the selection.
Use a consistent size of form components on the same page. For example, if you are using a medium size dropdown also use the same size text inputs, buttons, and so on.
Avoid having multiple lines of text in a dropdown. If the text is too long for one line, add an ellipsis (…).
When the menu is open, each option in the menu should be the same height as the field.
When organizing dropdown menu items, sort the list in a logical order by putting the most selected option at the top.
Accessibility
Using an id is highly recommended for all instances to ensure proper label association.
Always provide a label prop to ensure the dropdown's purpose is clear to all users.
Use ariaLabel prop when you need to provide a custom accessible name for the dropdown.
Use clearAriaLabel prop when dropdown is clearable.
Use inputAriaLabel prop when you need to provide a specific accessible name for the input field in searchable dropdowns.
Use menuAriaLabel prop when you need to provide a custom accessible name for the dropdown menu.
Use autoFocus prop when the dropdown should receive initial focus for keyboard navigation.
Variants
Sizes

There are three sizes available: Small, Medium, and Large

Label
Placeholder text here
Label
Placeholder text here
Label
Placeholder text here
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: 1,
        label: "Option 1",
      },
      {
        value: 2,
        label: "Option 2",
      },
      {
        value: 3,
        label: "Option 3",
      },
    ],
    []
  );
  return (
    <Flex gap="medium">
      <div
        style={{
          width: "300px",
        }}
      >
        <Dropdown
          id="sizes-large"
          aria-label="Large dropdown"
          options={options}
          placeholder="Placeholder text here"
          label="Label"
          size="large"
          clearAriaLabel="Clear"
        />
      </div>
      <div
Copy
Format
Reset
States
Default
Disabled
Error
Readonly
Story Editor
<Flex direction="row" gap="medium">
  <Flex direction="column" gap="medium">
    <div
      style={{
        width: "300px",
      }}
    >
      <Dropdown
        id="states-default"
        aria-label="Default dropdown"
        options={[]}
        placeholder="Default"
        clearAriaLabel="Clear"
      />
    </div>
    <div
      style={{
        width: "300px",
      }}
    >
      <Dropdown
        id="states-disabled"
        aria-label="Disabled dropdown"
        options={[]}
        placeholder="Disabled"
        disabled
        clearAriaLabel="Clear"
      />
    </div>
  </Flex>
  <Flex direction="column" gap="medium">
    <div
      style={{
        width: "300px",
      }}
    >
Copy
Format
Reset
Multi select

The Dropdown component supports multi select option that display as chips. The selected items can be shown in either a single line (with additional option for hidden list), or multiple line. This mode also supports all standard dropdown states.

Single line with hidden options
Chip one
Chip two
+ 1
Multiple lines
Chip one
Chip two
Chip three
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: "1",
        label: "Chip one",
      },
      {
        value: "2",
        label: "Chip two",
      },
      {
        value: "3",
        label: "Chip three",
      },
      {
        value: "4",
        label: "Chip four",
      },
    ],
    []
  );
  return (
    <Flex gap="large" align="start" justify="start">
      <Flex direction="column" gap="medium">
        <Text>Single line with hidden options</Text>
        <div
          style={{
            width: "350px",
            marginBottom: "50px",
          }}
        >
          <Dropdown
            placeholder="Single line multi state"
            defaultValue={[options[0], options[1], options[2]]}
            options={options}
Copy
Format
Reset
Dropdown with icon or avatar
Single value
Email
Julia Martinez
Multiple values
Email
Julia Martinez
Story Editor
() => {
  const optionsIcons: any = useMemo(
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
        value: "attach",
        label: "Attach",
        startElement: {
          type: "icon",
          value: Attach,
        },
      },
    ],
    []
  );
  const optionsAvatar: any = useMemo(
    () => [
      {
        value: "Julia",
        label: "Julia Martinez",
        startElement: {
          type: "avatar",
          value: person1,
        },
      },
      {
        value: "Sophia",
        label: "Sophia Johnson",
        startElement: {
Copy
Format
Reset
Do's and Don'ts
Do
Use the searchable option when having a long list of options.
Don't
Use a searchable select when the list is short. Use the select as is.
Do
Use the select as a closed component. Users should normally be allowed only to click on the items; search is not recommended, though possible.
Don't
Keep the select component in open mode as permanent state. If this is a design requirement consider use the box mode instead 
box mode
 instead.
Use cases and examples
Searchable dropdown

The dropdown can also function as a search for a specific item within the list.

Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: "Item 1",
        label: "Item 1",
      },
      {
        value: "Item 2",
        label: "Item 2",
      },
      {
        value: "Item 3",
        label: "Item 3",
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
      <Dropdown
        placeholder={"Search an item"}
        options={options}
        searchable
        maxMenuHeight={170}
        clearAriaLabel="Clear"
      />
    </div>
  );
}
Copy
Format
Reset
Dropdown with groups

Dropdown can be organized into groups, either with titled sections or dividers. Group titles can be configured to remain sticky or non-sticky.

Group by divider
Group by divider
Group by category
Group by category
Group by category title sticky
Group by category title sticky
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        label: "Category 1",
        options: [
          {
            value: "1",
            label: "Item 1",
          },
          {
            value: "2",
            label: "Item 2",
          },
          {
            value: "3",
            label: "Item 3",
          },
        ],
      },
      {
        label: "Category 2",
        options: [
          {
            value: "4",
            label: "Item 1",
          },
          {
            value: "5",
            label: "Item 2",
          },
          {
            value: "6",
            label: "Item 3",
          },
        ],
Copy
Format
Reset
Dropdown with elements

The dropdown item can contain start element or end element. This are the options:

Start element *
Start element
End element *
End element
Story Editor
() => {
  const startOptions: DropdownOption<Record<string, unknown>>[] = useMemo(
    () => [
      {
        value: "icon",
        label: "Item with icon",
        startElement: {
          type: "icon",
          value: Email,
        },
      },
      {
        value: "avatar",
        label: "Item with avatar",
        startElement: {
          type: "avatar",
          value: person1,
        },
      },
      {
        value: "indent",
        label: "Item with insert",
        startElement: {
          type: "indent",
        },
      },
    ],
    []
  );
  const endOptions: DropdownOption<Record<string, unknown>>[] = useMemo(
    () => [
      {
        value: "endIcon",
        label: "Item with icon",
        endElement: {
          type: "icon",
Copy
Format
Reset
Hide selected items

You can choose to hide selected items within the dropdown list, so users can see only the available options.

Label *
Label
Label
+ 1
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        value: "Option 1",
        label: "Label",
      },
      {
        value: "Option 2",
        label: "Label",
      },
      {
        value: "Option 3",
        label: "Label",
      },
      {
        value: "Option 4",
        label: "Label",
      },
      {
        value: "Option 5",
        label: "Label",
      },
      {
        value: "Option 6",
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
Dropdown with tooltips
Placeholder text here
Story Editor
() => {
  const optionsWithTooltips = useMemo(
    () => [
      {
        value: "Option 1",
        label: "Tooltip",
        tooltipProps: {
          content:
            "This is a title message for further information will appear here.",
        },
      },
      {
        value: "Option 2",
        label: "Chip",
        tooltipProps: {
          content:
            "This is a title message for further information will appear here.",
        },
      },
      {
        value: "Option 3",
        label: "Button",
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
      <Dropdown
        placeholder={"Placeholder text here"}
        options={optionsWithTooltips}
        clearAriaLabel="Clear"
Copy
Format
Reset
Dropdown with virtualization

For performance optimization with large datasets, the Dropdown supports virtualization through the menuRenderer prop. You can integrate any virtualization library of your choice - this example demonstrates implementation using react-window.

Virtualized
Grouped Virtualized
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        options: Array.from(
          {
            length: 1000,
          },
          (_, index) => ({
            value: `option-${index + 1}`,
            label: `Option ${index + 1}`,
          })
        ),
      },
    ],
    []
  );
  const groupedOptions = useMemo(
    () =>
      Array.from(
        {
          length: 10,
        },
        (_, groupIndex) => ({
          label: `Group ${groupIndex + 1}`,
          options: Array.from(
            {
              length: 100,
            },
            (_, optionIndex) => ({
              value: `group-${groupIndex + 1}-option-${optionIndex + 1}`,
              label: `Group ${groupIndex + 1} - Option ${optionIndex + 1}`,
            })
          ),
        })
      ),
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
