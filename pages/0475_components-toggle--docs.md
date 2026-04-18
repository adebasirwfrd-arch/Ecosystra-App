---
id: components-toggle--docs
type: docs
title: "Components/Toggle"
name: "Docs"
importPath: "./src/pages/components/Toggle/Toggle.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-toggle--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:48:27.964Z
---

Toggle

Allow users to turn an single option on or off. They are usually used to activate or deactivate a specific setting.

Off
On
Show code
Import
import { Toggle } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

areLabelsHidden	
If true, hides the on/off labels.
boolean
	
false
	Set boolean
aria-controls	
The ID of the element controlled by the toggle.
string
	-	Set string
aria-label	
The ARIA label for accessibility.
string
	-	

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, disables the toggle.
boolean
	-	Set boolean
id	
An HTML id attribute for the component.
string
	-	

isDefaultSelected	
If true, the toggle is selected by default.
boolean
	
true
	Set boolean
isSelected	
Controls the selected state of the toggle.
boolean
	-	Set boolean
name	
The name attribute of the toggle input.
string
	-	Set string
offOverrideText	
The text displayed when the toggle is in the "off" position.
string
	
"Off"
	Set string
onChange	
Callback fired when the toggle state changes.
(value: boolean, event: ChangeEvent<HTMLInputElement>) => void
	-	-
onOverrideText	
The text displayed when the toggle is in the "on" position.
string
	
"On"
	Set string
size	
The size of the toggle.
ToggleSize
	
medium
	Set object
toggleSelectedClassName	
Class name applied when the toggle is selected.
string
	-	Set string
value	
The value associated with the toggle.
string
	-	Set string
Usage
Use toggles when your intent is to turn something on or off instantly.
Let users know what happens when the toggle is switched by using a tooltip.
Toggle can either be selected or not selected. They cannot be in an indeterminate state (unlike 
checkboxes
).
Use labels such as “on” and “off” or “enable” and “disable” to communicate the state of the toggle.
🤓
Tip
If the user needs to choose an item from a set of options, use 
Radio button
 or 
Checkboxes
 instead.
Accessibility
Using an id is highly recommended for all instances to ensure proper label association.
Use ariaLabel prop when you need to provide additional context for screen readers.
Use ariaLabelledBy prop when an external element provides the accessible name for the toggle.
Use ariaControls prop when the toggle controls other elements on the page.
Use disabled prop appropriately to indicate when toggles are not available for interaction.
Variants
States
Off
On
Off
On
Story Editor
<Flex direction="column" gap="medium">
  <Toggle
    id="states-off"
    aria-label="Toggle off state"
    isDefaultSelected={false}
  />
  <Toggle id="states-on" aria-label="Toggle on state" />
</Flex>
Copy
Format
Reset
Size

Toggle appear in 2 sizes: small and medium.

Off
On
Off
On
Story Editor
<Flex gap="large">
  <Toggle id="size-medium" aria-label="Medium toggle" size="medium" />
  <Toggle id="size-small" aria-label="Small toggle" size="small" />
</Flex>
Copy
Format
Reset
Disabled
Off
On
Off
On
Story Editor
<Flex direction="column" gap="large">
  <Toggle
    id="disabled-off"
    aria-label="Disabled toggle off"
    isDefaultSelected={false}
    disabled
  />
  <Toggle id="disabled-on" aria-label="Disabled toggle on" disabled />
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Dark mode
Off
On
Do
Use toggle only for on and off actions. We recommend not to change these lables values.
Theme
Light mode
Dark mode
Don't
Don’t use toggle for configurations. Instead, use 
Checkboxes
 or 
Radio buttons.
Off
On
Do
Toggle will always appear with labels
On
Don't
Don’t remove toggle labels, since users would not know what state it represents.
Use cases and examples
Turn on/ off an automation

In the automations center, a user can turn the automation on or off.

Board automations
Off
On
Story Editor
<Flex gap="medium">
  <Text id="automation-label">Board automations</Text>
  <Toggle id="automation-toggle" aria-label="Toggle board automations" />
</Flex>
Copy
Format
Reset
Related components
Selected
Checkbox
Allow users to select one or more items from a set of options.
Selection
RadioButton
Allow for a single option to be selected from a visible list.
Alpha
Beta
Delta
ButtonGroup
Used to group related options.
