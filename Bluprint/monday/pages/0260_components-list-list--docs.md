---
id: components-list-list--docs
type: docs
title: "Components/List/List"
name: "Docs"
importPath: "./src/pages/components/List/legacy/List.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-list-list--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:39:47.150Z
---

List
🚀
New List Available

A new List component is available with improved keyboard navigation, accessibility features, and a cleaner API. Check out the 
new List component
.

Lists is a group of actionable items containing primary and supplemental actions, which are represented by icons and text.

Board Power up
Team Power up
Essentials
Show code
Import
import { List } from "@vibe/core";
Copy
Props
ListListItemListItemIconListItemAvatar
Name	Description	Default	
Control

aria-controls	
The ID of an element controlled by the list.
string
	-	Set string
aria-describedby	
The ID of an element that describes the list.
string
	-	Set string
aria-label	
The ARIA label describing the list.
string
	-	Set string
children	
The child elements inside the list.
ReactElement<ListItemProps | ListTitleProps, string | JSXElementConstructor<any>> | ReactElement<ListItemProps | ListTitleProps, string | JSXElementConstructor<...>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
component	
The wrapping component for the list.
ListElement
	
ul
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
renderOnlyVisibleItems	
If true, uses a virtualized list to render only visible items for performance optimization.
boolean
	
false
	Set boolean
role	
The ARIA role of the list.
AriaRole
	
listbox
	Set object
style	
Custom inline styles applied to the list.
CSSProperties
	-	Set object
Usage
Use list component for display a list of navigable items in a column.
List purpose is usually allowing navigation in context to the navigable content.
Your list items can be either in regular, selected or disabled state. You can control a list item's component state by its attributes.
🤓
Check yourself
For implementing a menu inside a dialog, please use our 
Menu
 component
Variants
List with categories
First category
List item 1
List item 2
Second category
List item 3
List item 4
Story Editor
<List>
  <ListTitle>First category</ListTitle>
  <ListItem>List item 1</ListItem>
  <ListItem>List item 2</ListItem>
  <ListTitle>Second category</ListTitle>
  <ListItem>List item 3</ListItem>
  <ListItem>List item 4</ListItem>
</List>
Copy
Format
Reset
List with icons
List item 1
List item 2
List item 3
Story Editor
<List>
  <ListItem id="list-1">
    <ListItemIcon icon={Board} />
    List item 1
  </ListItem>
  <ListItem id="list-2">
    <ListItemIcon icon={Team} />
    List item 2
  </ListItem>
  <ListItem id="list-3">
    <ListItemIcon icon={ThumbsUp} />
    List item 3
  </ListItem>
</List>
Copy
Format
Reset
List with avatars
List item 1
List item 2
List item 3
Story Editor
<List>
  <ListItem id="list-1">
    <ListItemAvatar src={person1} />
    List item 1
  </ListItem>
  <ListItem id="list-2">
    <ListItemAvatar src={person2} />
    List item 2
  </ListItem>
  <ListItem id="list-3">
    <ListItemAvatar src={person3} />
    List item 3
  </ListItem>
</List>
Copy
Format
Reset
List with virtualization optimization

When you display a large number of items, you may want to render only the options shown at a given moment to allow better performance and a better user experience.

Regular
List item 1
List item 2
List item 3
List item 4
List item 5
List item 6
With categories
First category
List item 1
List item 2
Second category
List item 3
Story Editor
<Flex
  align="start"
  gap="large"
  style={{
    width: "100%",
  }}
  direction="column"
>
  <StoryDescription description="Regular">
    <DialogContentContainer
      style={{
        height: "162px",
        width: "200px",
      }}
    >
      <List
        renderOnlyVisibleItems
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ListItem>List item 1</ListItem>
        <ListItem>List item 2</ListItem>
        <ListItem>List item 3</ListItem>
        <ListItem>List item 4</ListItem>
        <ListItem>List item 5</ListItem>
        <ListItem>List item 6</ListItem>
        <ListItem>List item 7</ListItem>
        <ListItem>List item 8</ListItem>
        <ListItem>List item 9</ListItem>
        <ListItem>List item 10</ListItem>
        <ListItem>List item 11</ListItem>
        <ListItem>List item 12</ListItem>
      </List>
    </DialogContentContainer>
Copy
Format
Reset
🤓
Tip

While using virtualization optimization on your list component, please be aware your list needs to contain a constant height and width for function properly

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
