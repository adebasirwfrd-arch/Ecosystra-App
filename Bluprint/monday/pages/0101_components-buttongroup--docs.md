---
id: components-buttongroup--docs
type: docs
title: "Components/ButtonGroup"
name: "Docs"
importPath: "./src/pages/components/ButtonGroup/ButtonGroup.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-buttongroup--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:34:19.439Z
---

ButtonGroup

ButtonGroup can be used to group related options. To emphasize groups of related toggle buttons, a group should share a common container.

Alpha
Beta
Gamma
Delta
Show code
Import
import { ButtonGroup } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

blurOnMouseUp	
If true, removes focus from the button after clicking.
boolean
	
true
	Set boolean
children	
The content inside the button group.
ReactNode
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, disables all buttons in the group.
boolean
	
false
	Set boolean
fullWidth	
If true, makes the button group take the full width of its container.
boolean
	
false
	Set boolean
groupAriaLabel	
The label of the button group for accessibility.
string
	
""
	

id	
An HTML id attribute for the component.
string
	-	

kind	
The style variant of the buttons.
"secondary"
"tertiary"
	
secondary
	
secondary
tertiary

name	
The name of the button group.
string
	
""
	Set string
onSelect	
Callback fired when a button is selected.
(value: ButtonValue, name: string) => void
	-	-
options*	
The list of button options.
ButtonGroupOption[]
	-	
RAW
options : [
0 : {...} 2 keys
1 : {...} 2 keys
2 : {...} 2 keys
3 : {...} 2 keys
]

size	
The size of the buttons.
ButtonSize
	
small
	Set object
tooltipContainerSelector	
CSS selector for the tooltip container.
string
	-	Set string
tooltipHideDelay	
The delay in milliseconds before the tooltip hides.
number
	-	Set number
tooltipMoveBy	
Adjusts the tooltip position.
MoveBy
	-	Set object
tooltipPosition	
The position of the tooltip relative to the button.
TooltipPositions
	-	Set object
tooltipShowDelay	
The delay in milliseconds before the tooltip shows.
number
	-	Set number
value	
The currently selected button value.
ButtonValue
	
""
	
Usage
Group together calls to action that are related to each other.
Use when all the actions in the group take place immediately in one click. If one or more actions does not immediately happen in one click, either use a different component, or remove those actions from the group.
Only should be used in groups of up to six buttons if the buttons contain an icon with no text.
The main action of a button group will be in selected mode.
Keep the content short and actionable. For longer actions, use the 
Dropdown
 component.
Button group is used to display the same content in different view, if you need to present different content, use 
Tabs.
🤓
Check yourself
Button group will always have one button selected. If you need to display adjacent buttons without selected mode, use the 
Button
 component with "Flat" props.
Accessibility
Always provide a groupAriaLabel prop to describe the purpose of the button group. This provides context for screen readers about what the group represents (e.g., "View options", "Sort options", "Display settings").
For individual buttons, ensure each option has clear, descriptive text content, or provideariaLabel in the options array for icon-only buttons.
Use ariaLabel in the options array when you need a different accessible name than the visible button text, or for icon-only buttons (e.g., ariaLabel: "Grid view").
Variants
Default
Alpha
Beta
Gamma
Delta
Story Editor
<ButtonGroup
  id="default-button-group"
  groupAriaLabel="Default button group"
  value={1}
  options={[
    {
      value: 1,
      text: "Alpha",
    },
    {
      value: 2,
      text: "Beta",
    },
    {
      value: 3,
      text: "Gamma",
    },
    {
      value: 4,
      text: "Delta",
    },
  ]}
/>
Copy
Format
Reset
Tertiary
Alpha
Beta
Gamma
Delta
Story Editor
<ButtonGroup
  id="tertiary-button-group"
  groupAriaLabel="Tertiary button group"
  value={1}
  kind="tertiary"
  options={[
    {
      value: 1,
      text: "Alpha",
    },
    {
      value: 2,
      text: "Beta",
    },
    {
      value: 3,
      text: "Gamma",
    },
    {
      value: 4,
      text: "Delta",
    },
  ]}
/>
Copy
Format
Reset
Disabled - all buttons
Alpha
Beta
Gamma
Delta
Story Editor
<ButtonGroup
  id="disabled-button-group"
  disabled
  groupAriaLabel="Disabled button group"
  options={[
    {
      value: 1,
      text: "Alpha",
    },
    {
      value: 2,
      text: "Beta",
    },
    {
      value: 3,
      text: "Gamma",
    },
    {
      value: 4,
      text: "Delta",
    },
  ]}
/>
Copy
Format
Reset
Disabled - single button
Alpha
Beta
Gamma
Delta
Story Editor
<ButtonGroup
  id="disabled-single-button-group"
  groupAriaLabel="Button group with disabled option"
  options={[
    {
      value: 1,
      text: "Alpha",
    },
    {
      value: 2,
      text: "Beta",
    },
    {
      value: 3,
      text: "Gamma",
    },
    {
      value: 4,
      text: "Delta",
      disabled: true,
      tooltipContent: "I'm the worst variant ever",
    },
  ]}
/>
Copy
Format
Reset
Size
Medium
Alpha
Beta
Gamma
Delta
Small
Alpha
Beta
Gamma
Delta
Story Editor
<Flex gap={60}>
  <Flex direction="column" gap={16} align="start">
    <Text type="text1">Medium</Text>
    <ButtonGroup
      id="size-medium-button-group"
      groupAriaLabel="Medium size button group"
      size="medium"
      value={1}
      options={[
        {
          value: 1,
          text: "Alpha",
        },
        {
          value: 2,
          text: "Beta",
        },
        {
          value: 3,
          text: "Gamma",
        },
        {
          value: 4,
          text: "Delta",
        },
      ]}
    />
  </Flex>
  <Flex direction="column" gap={16} align="start">
    <Text type="text1">Small</Text>
    <ButtonGroup
      id="size-small-button-group"
      groupAriaLabel="Small size button group"
      size="small"
      value={1}
      options={[
Copy
Format
Reset
Do’s and Don’ts
Month
Week
Year
Do
Use when all the actions in the group take place immediately in one click.
Main table
Hadas view
Chart view
Don't
Don’t use a button group when switching between content or object pages. Use 
Tabs
 instead.
Desktop
Mobile
Desktop
Mobile
Do
Always use buttons with a consistent style: Icons, text or icon with text.
Desktop
Don't
Avoid combining text buttons with icon buttons within the same button group.
Yearly plan
Monthly plan
Annual Plan
Do
Keep button copy width as simillar as possible.
Yearly
Monthly
Annual-half year plan
Don't
Avoid mixing long button copy and short copy.
Use cases and examples
Button group in settings

For example: on the views settings you can choose only one option.

Function
Sum
Average
Median
Min
Story Editor
<Flex direction="column" gap={16} align="start">
  <Text type="text1">Function</Text>
  <ButtonGroup
    id="settings-button-group"
    groupAriaLabel="Function selection button group"
    size="small"
    value={1}
    options={[
      {
        value: 1,
        text: "Sum",
      },
      {
        value: 2,
        text: "Average",
      },
      {
        value: 3,
        text: "Median",
      },
      {
        value: 4,
        text: "Min",
      },
    ]}
  />
</Flex>
Copy
Format
Reset
Button group as toggle

Use button group as toggle for change the view between two states. For on and off actions, use the 
Toggle
 component.

Grid
List
Story Editor
<ButtonGroup
  id="toggle-button-group"
  groupAriaLabel="View toggle button group"
  value={1}
  options={[
    {
      value: 1,
      text: "Grid",
    },
    {
      value: 2,
      text: "List",
    },
  ]}
/>
Copy
Format
Reset
Full width button group

Use this option in order for the ButtonGroup to fill the entire width of its container

This feature is intended to be used within small containers like a side panel, menu or similar small floating elements

Grid
List
Table
Masonry
Story Editor
<div
  style={{
    width: "100%",
  }}
>
  <ButtonGroup
    id="full-width-button-group"
    groupAriaLabel="Full width button group"
    fullWidth
    value={1}
    options={[
      {
        value: 1,
        text: "Grid",
      },
      {
        value: 2,
        text: "List",
      },
      {
        value: 3,
        text: "Table",
      },
      {
        value: 4,
        text: "Masonry",
      },
    ]}
  />
</div>
Copy
Format
Reset
Related components
Tab
Tab
Tab
Tabs
Allow users to navigate between related views of content.
Get started
Button
Allow users take actions with a single click.
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
