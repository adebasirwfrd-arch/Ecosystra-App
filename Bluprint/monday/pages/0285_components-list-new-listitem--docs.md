---
id: components-list-new-listitem--docs
type: docs
title: "Components/List [New]/ListItem"
name: "Docs"
importPath: "./src/pages/components/List/ListItem.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-list-new-listitem--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:40:37.098Z
---

ListItem

An item of a List component.

List item
Show code
Import
import { List, ListItem } from "@vibe/core/next";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dir	
Determines the position of the tooltip according to the direction.
BaseItemDirection
	-	Set object
disabled	
If true, the list item is disabled.
boolean
	
false
	Set boolean
endElement	
The end element of the list item.
EndElement
	-	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
label*	
The primary text content of the list item.
string
	-	

onClick	
Callback fired when the list item is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>) => void
	-	-
onHover	
Callback fired when the list item is hovered (mouseenter or focus).
(event: MouseEvent<Element, MouseEvent> | FocusEvent<Element, Element>) => void
	-	-
readOnly	
If true, the list item is read-only and cannot be edited.
boolean
	
false
	Set boolean
role	
The ARIA role of the list item.
AriaRole
	-	Set object
selected	
If true, the list item is selected.
boolean
	
false
	Set boolean
startElement	
The start element of the list item.
StartElement
	-	Set object
tooltipProps	
Props for displaying a tooltip on the list item.
Partial<TooltipProps>
	-	Set object
value	
The value of the list item (used for identification). Defaults to label if not provided.
string
number
	-	
Usage
ListItem uses a data-driven API with label, startElement, and endElement props.
Use startElement with type 'icon' or 'avatar' to add visual elements before the label.
Use endElement with type 'suffix' or 'icon' to add visual elements after the label.
ListItem must be used within a List component.
Variants
States
Default state
Disabled state
Selected state
Story Editor
<List aria-label="States example">
  <ListItem label="Default state" value="default" />
  <ListItem label="Disabled state" value="disabled" disabled />
  <ListItem label="Selected state" value="selected" selected />
</List>
Copy
Format
Reset
List item with an icon

Use startElement with type: "icon" to add an icon before the label.

Productivity
Story Editor
<List aria-label="List with icon">
  <ListItem
    label="Productivity"
    value="productivity"
    startElement={{
      type: "icon",
      value: Send,
    }}
  />
</List>
Copy
Format
Reset
List item with an avatar

Use startElement with type: "avatar" to add an avatar before the label.

Sophia Johnson
Story Editor
<List aria-label="List with avatar">
  <ListItem
    label="Sophia Johnson"
    value="sophia"
    startElement={{
      type: "avatar",
      value: person1,
    }}
  />
</List>
Copy
Format
Reset
List item with end element

Use endElement to add content after the label, such as keyboard shortcuts.

Settings
⌘S
Favorites
⌘F
Story Editor
<div
  style={{
    width: 250,
  }}
>
  <List aria-label="List with end elements">
    <ListItem
      label="Settings"
      value="settings"
      startElement={{
        type: "icon",
        value: Settings,
      }}
      endElement={{
        type: "suffix",
        value: "⌘S",
      }}
    />
    <ListItem
      label="Favorites"
      value="favorites"
      startElement={{
        type: "icon",
        value: Favorite,
      }}
      endElement={{
        type: "suffix",
        value: "⌘F",
      }}
    />
  </List>
</div>
Copy
Format
Reset
With click handler

Use onClick to handle click events on the list item.

Click count: 0

Click me!
Story Editor
(function WithClickHandlerExample() {
  const [clickCount, setClickCount] = useState(0);
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);
  return (
    <div>
      <p
        style={{
          marginBottom: 16,
        }}
      >
        Click count: {clickCount}
      </p>
      <List aria-label="Clickable list">
        <ListItem label="Click me!" value="clickable" onClick={handleClick} />
      </List>
    </div>
  );
})
Copy
Format
Reset
Read-only

Use readOnly to make an item non-interactive.

Editable item
Read-only item
Story Editor
<List aria-label="Read-only list">
  <ListItem label="Editable item" value="editable" />
  <ListItem label="Read-only item" value="readonly" readOnly />
</List>
Copy
Format
Reset
