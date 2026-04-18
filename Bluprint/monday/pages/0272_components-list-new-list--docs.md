---
id: components-list-new-list--docs
type: docs
title: "Components/List [New]/List"
name: "Docs"
importPath: "./src/pages/components/List/List.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-list-new-list--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:40:11.308Z
---

List

Lists is a group of actionable items containing primary and supplemental actions, which are represented by icons and text.

Board Power up
Team Power up
Essentials
Show code
Import

All the List-related components can be imported from @vibe/core/next.

import { List, ListItem, ListTitle } from "@vibe/core/next";
Copy
Props
ListListItemListTitle
Name	Description	Default	
Control

aria-describedby	
The ID of an element that describes the list.
string
	-	Set string
aria-label	
The ARIA label describing the list. Required for accessibility when aria-describedby is not provided.
string
	-	

as	
The HTML element to render as. Defaults to "ul".
BaseListElement
	
ul
	Set object
children	
The child elements inside the list (typically ListItem components).
ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultFocusIndex	
Index of the item that should be focused initially. Defaults to 0.
number
	-	Set number
focusOnMount	
If true, the list will automatically focus on mount.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
maxHeight	
The maximum height of the list container. Enables scrolling when content exceeds this height.
string
number
	-	Set object
onFocusChange	
Callback fired when the focused item changes.
(index: number, id?: string) => void
	-	-
role	
The ARIA role of the list. Defaults to "listbox".
AriaRole
	
listbox
	Set object
size	
The size of the list items.
BaseItemSizes
	
small
	Set object
Usage
Use list component for display a list of navigable items in a column.
List purpose is usually allowing navigation in context to the navigable content.
Your list items can be either in regular, selected or disabled state. You can control a list item's component state by its attributes.
Use the ariaLabel prop to provide an accessible name for the list.
🤓
Check yourself
For implementing a menu inside a dialog, please use our 
Menu
 component
Accessibility
Always provide an ariaLabel prop to give the list a meaningful accessible name that describes its purpose (e.g., "Navigation menu", "Settings options").
The List component provides comprehensive keyboard navigation: Arrow Up/Down to navigate between items (wraps around), Home/End to jump to first/last item, PageUp/PageDown to move by 10 items, and Enter/Space to activate the focused item.
Use defaultFocusIndex to set which item should receive focus when the list first becomes focused.
Use onFocusChange callback to track focus changes for custom focus management scenarios.
Ensure individual ListItem components have descriptive label text. For items with only icons, provide additional context through the label.
Variants
List with icons
List item 1
List item 2
List item 3
Story Editor
<List aria-label="List with icons">
  <ListItem
    label="List item 1"
    value="list-1"
    startElement={{
      type: "icon",
      value: Board,
    }}
  />
  <ListItem
    label="List item 2"
    value="list-2"
    startElement={{
      type: "icon",
      value: Team,
    }}
  />
  <ListItem
    label="List item 3"
    value="list-3"
    startElement={{
      type: "icon",
      value: ThumbsUp,
    }}
  />
</List>
Copy
Format
Reset
List with avatars
List item 1
List item 2
List item 3
Story Editor
<List aria-label="List with avatars">
  <ListItem
    label="List item 1"
    value="list-1"
    startElement={{
      type: "avatar",
      value: person1,
    }}
  />
  <ListItem
    label="List item 2"
    value="list-2"
    startElement={{
      type: "avatar",
      value: person2,
    }}
  />
  <ListItem
    label="List item 3"
    value="list-3"
    startElement={{
      type: "avatar",
      value: person3,
    }}
  />
</List>
Copy
Format
Reset
List with title

Use ListTitle to create section headers within your list. Titles are automatically skipped during keyboard navigation.

Category A
List item 1
List item 2
Category B
List item 3
List item 4
Story Editor
<List aria-label="List with title">
  <ListTitle>Category A</ListTitle>
  <ListItem
    label="List item 1"
    value="list-1"
    startElement={{
      type: "icon",
      value: Board,
    }}
  />
  <ListItem
    label="List item 2"
    value="list-2"
    startElement={{
      type: "icon",
      value: Team,
    }}
  />
  <ListTitle>Category B</ListTitle>
  <ListItem
    label="List item 3"
    value="list-3"
    startElement={{
      type: "icon",
      value: ThumbsUp,
    }}
  />
  <ListItem
    label="List item 4"
    value="list-4"
    startElement={{
      type: "icon",
      value: Favorite,
    }}
  />
</List>
Copy
Format
Reset
Sticky title

Use the sticky prop on ListTitle to keep section headers visible at the top while scrolling through a list.

Category A
List item 1
List item 2
List item 3
List item 4
Category B
List item 5
List item 6
List item 7
List item 8
Category C
List item 9
List item 10
List item 11
List item 12
Story Editor
<DialogContentContainer
  style={{
    width: "250px",
  }}
>
  <List aria-label="List with sticky titles" maxHeight={200}>
    <ListTitle sticky>Category A</ListTitle>
    <ListItem
      label="List item 1"
      value="1"
      startElement={{
        type: "icon",
        value: Board,
      }}
    />
    <ListItem
      label="List item 2"
      value="2"
      startElement={{
        type: "icon",
        value: Board,
      }}
    />
    <ListItem
      label="List item 3"
      value="3"
      startElement={{
        type: "icon",
        value: Board,
      }}
    />
    <ListItem
      label="List item 4"
      value="4"
      startElement={{
        type: "icon",
Copy
Format
Reset
Scrollable list

Use maxHeight to create a scrollable list with a fixed height.

List item 1
List item 2
List item 3
List item 4
List item 5
List item 6
List item 7
List item 8
List item 9
List item 10
List item 11
List item 12
Story Editor
<DialogContentContainer
  style={{
    width: "200px",
  }}
>
  <List aria-label="Scrollable list" maxHeight={162}>
    <ListItem label="List item 1" value="1" />
    <ListItem label="List item 2" value="2" />
    <ListItem label="List item 3" value="3" />
    <ListItem label="List item 4" value="4" />
    <ListItem label="List item 5" value="5" />
    <ListItem label="List item 6" value="6" />
    <ListItem label="List item 7" value="7" />
    <ListItem label="List item 8" value="8" />
    <ListItem label="List item 9" value="9" />
    <ListItem label="List item 10" value="10" />
    <ListItem label="List item 11" value="11" />
    <ListItem label="List item 12" value="12" />
  </List>
</DialogContentContainer>
Copy
Format
Reset
Sizes
Small
Small item 1
Small item 2
Small item 3
Medium
Medium item 1
Medium item 2
Medium item 3
Large
Large item 1
Large item 2
Large item 3
Story Editor
<Flex gap="large" align="start">
  <Flex direction="column" gap="small" align="start">
    <Text type="text1" weight="bold">
      Small
    </Text>
    <div
      style={{
        width: 200,
      }}
    >
      <List aria-label="Small list" size="small">
        <ListItem label="Small item 1" value="1" />
        <ListItem label="Small item 2" value="2" />
        <ListItem label="Small item 3" value="3" />
      </List>
    </div>
  </Flex>
  <Flex direction="column" gap="small" align="start">
    <Text type="text1" weight="bold">
      Medium
    </Text>
    <div
      style={{
        width: 200,
      }}
    >
      <List aria-label="Medium list" size="medium">
        <ListItem label="Medium item 1" value="1" />
        <ListItem label="Medium item 2" value="2" />
        <ListItem label="Medium item 3" value="3" />
      </List>
    </div>
  </Flex>
  <Flex direction="column" gap="small" align="start">
    <Text type="text1" weight="bold">
      Large
Copy
Format
Reset
States
Default state
Disabled state
Selected state
Story Editor
<Flex gap="large" align="start">
  <List aria-label="States example">
    <ListItem label="Default state" value="default" />
    <ListItem label="Disabled state" value="disabled" disabled />
    <ListItem label="Selected state" value="selected" selected />
  </List>
</Flex>
Copy
Format
Reset
In dialog container
View Profile
Settings
Favorites
Email Preferences
Team Settings
Story Editor
<DialogContentContainer
  style={{
    width: 250,
  }}
>
  <List aria-label="List in dialog" maxHeight={200}>
    <ListItem
      label="View Profile"
      value="profile"
      startElement={{
        type: "icon",
        value: Person,
      }}
    />
    <ListItem
      label="Settings"
      value="settings"
      startElement={{
        type: "icon",
        value: Settings,
      }}
    />
    <ListItem
      label="Favorites"
      value="favorites"
      startElement={{
        type: "icon",
        value: Favorite,
      }}
    />
    <ListItem
      label="Email Preferences"
      value="email"
      startElement={{
        type: "icon",
        value: Email,
Copy
Format
Reset
With end elements
Settings
⌘S
Favorites
⌘F
Search
⌘K
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <List aria-label="List with end elements">
    <ListItem
      label="Settings"
      value="1"
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
      value="2"
      startElement={{
        type: "icon",
        value: Favorite,
      }}
      endElement={{
        type: "suffix",
        value: "⌘F",
      }}
    />
    <ListItem
      label="Search"
      value="3"
      startElement={{
        type: "icon",
        value: Search,
Copy
Format
Reset
Virtualized list

For performance optimization with large datasets (thousands of items), you can implement virtualization by composing the List components with a virtualization library. This example demonstrates using react-window to render only the visible items.

Item 1
Item 2
Item 3
Item 4
Item 5
Item 6
Item 7
Item 8
Item 9
Item 10
Item 11
Item 12
Story Editor
() => {
  const items = Array.from(
    {
      length: 1000,
    },
    (_, i) => ({
      label: `Item ${i + 1}`,
      value: `${i + 1}`,
    })
  );
  return (
    <FixedSizeList
      height={300}
      width={300}
      itemCount={items.length}
      itemSize={32}
    >
      {({ index, style }) => (
        <div style={style}>
          <ListItem label={items[index].label} value={items[index].value} />
        </div>
      )}
    </FixedSizeList>
  );
}
Copy
Format
Reset
Do's and Don'ts
Add
Filter
Board name
Board name
Do
Use a list component to create a menu displayed on one of the various sections of your web page.
Add
Filter
Board name
Board name
Don't
Do not use the list to implement a menu displayed inside a dialog. See 
Menu
.
Related components
Send
Delete
More info
Menu
Displays information related to an element over it.
Tab
Tab
Tab
Tabs
Allow users to navigate between related views of content.
1
active
1st
2
pending
2nd
3
pending
3rd
MultiStepIndicator
Shows information related to a component when a user hovers over it.
