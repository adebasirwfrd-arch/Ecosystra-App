---
id: components-menu-menu--docs
type: docs
title: "Components/Menu/Menu"
name: "Docs"
importPath: "./src/pages/components/Menu/Menu.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-menu-menu--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:41:07.532Z
---

Menu

A menu is a navigable contextual list of items that can be selected.

Menu item 1
Menu item 2
Menu item 3
Show code
Import
import { Menu } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-describedby	
ARIA description ID.
string
	-	Set string
aria-label	
ARIA label for accessibility.
string
	-	Set string
children	
The menu items.
ElementContent
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
focusItemIndex	
Index of the focused menu item.
number
	
-1
	Set number
focusItemIndexOnMount	
Index of the item that should be focused when the menu mounts.
number
	
-1
	Set number
focusOnMount	
If true, the menu will automatically focus on mount.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
isSubMenu	
If true, this menu is a submenu.
boolean
	
false
	Set boolean
isVisible	
Controls the visibility of the menu.
boolean
	
true
	Set boolean
onClose	
Callback triggered when the menu closes.
(option: CloseMenuOption) => void
	-	-
onItemFocus	
Callback when a menu item gains focus.
(index: number) => void
	-	-
shouldScrollMenu	
If true, enables scrolling within the menu.
boolean
	
false
	Set boolean
size	
Size of the menu.
"small"
"medium"
"large"
"xs"
"xxs"
	
medium
	
small
medium
large
xs
xxs

tabIndex	
The tab index of the menu.
number
	
0
	Set number
useDocumentEventListeners	
If true, event listeners will be attached to the document.
boolean
	
false
	Set boolean
Usage
A menu offers a list of actions or functions that a user can access.
Menu height is dynamic according to the content it contains and its location on the screen.
Closing menus can be done by selecting a value or clicking any where outside the menu.
Menu items can include icons, radio buttons, and checkboxes.
If a menu dropdown contains a mix of links and buttons, separate them with a content divider with links at the top and buttons at the bottom.
Menu should contains at least two menu items.
🤓
Tip
Need to place a search field to filter results? Use the 
Combobox
 component instead
Accessibility
Provide an id for the Menu to enable proper accessibility associations and unique identification.
Use the ariaLabel prop to provide a meaningful accessible name for the menu that describes its purpose (e.g., "Navigation menu", "Actions menu", "Options menu").
Use the ariaDescribedBy prop to link the menu to additional descriptive text by providing the id of the descriptive element.
It is recommended to use focusItemIndexOnMount=0 to focus the first menu item when the menu opens.
Ensure menu items have clear, descriptive text or use appropriate ariaLabel props on individual menu items for icon-only items.
Variants
Sizes
Small menu
Menu item 1
Menu item 2
Menu item 3
Medium menu
Menu item 1
Menu item 2
Menu item 3
Large menu
Menu item 1
Menu item 2
Menu item 3
Story Editor
[
  <Flex gap="medium">
    <DialogContentContainer key="small">
      <Menu size="small">
        <MenuTitle caption="Small menu" />
        <MenuDivider />
        <MenuItem title="Menu item 1" />
        <MenuItem title="Menu item 2" disabled />
        <MenuItem title="Menu item 3" />
      </Menu>
    </DialogContentContainer>
    <DialogContentContainer key="md">
      <Menu size="medium">
        <MenuTitle caption="Medium menu" />
        <MenuDivider />
        <MenuItem title="Menu item 1" />
        <MenuItem title="Menu item 2" disabled />
        <MenuItem title="Menu item 3" />
      </Menu>
    </DialogContentContainer>
    <DialogContentContainer key="lg">
      <Menu size="large">
        <MenuTitle caption="Large menu" />
        <MenuDivider />
        <MenuItem title="Menu item 1" />
        <MenuItem title="Menu item 2" disabled />
        <MenuItem title="Menu item 3" />
      </Menu>
    </DialogContentContainer>
  </Flex>,
]
Copy
Format
Reset
Menu with icons
Send
Delete
More info
Story Editor
<Flex>
  <DialogContentContainer>
    <Menu>
      <MenuItem icon={Email} title="Send" />
      <MenuItem icon={Delete} title="Delete" disabled />
      <MenuItem icon={Info} title="More info" />
    </Menu>
  </DialogContentContainer>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Item 1
Item 2
Item 3
Do
Use menus for simple actions.
Item 1
Item 2
Item 3
Don't
Don’t place a search component near to menu for implement a filter capability. See 
Combobox.
Item 1
Item 2
Do
Keep to the default menu width.
Item 1
Item 2
Don't
Don’t change the width of the menu, only change the height.
Use cases and examples
Menu with sub menu
Menu item without sub menu
With Sub menu
Another item
Story Editor
<Flex>
  <DialogContentContainer>
    <Menu>
      <MenuItem title="Menu item without sub menu" icon={Activity} />
      <MenuItem title="With Sub menu" icon={Activity}>
        <Menu>
          <MenuItem icon={Email} title="Send" />
          <MenuItem icon={Delete} title="Delete" disabled />
          <MenuItem icon={Info} title="More info" />
        </Menu>
      </MenuItem>
      <MenuItem title="Another item" icon={Settings} />
    </Menu>
  </DialogContentContainer>
</Flex>
Copy
Format
Reset
Menu with 2-depth sub menu
Menu item
With Sub menu
Another item
Story Editor
<Flex>
  <DialogContentContainer>
    <Menu>
      <MenuItem title="Menu item" icon={Favorite} />
      <MenuItem title="With Sub menu" icon={Activity}>
        <Menu>
          <MenuItem icon={Emoji} title="Send" />
          <MenuItem icon={Code} title="Sub Sub menu">
            <Menu>
              <MenuItem icon={Email} title="Sub sub item" />
              <MenuItem icon={Invite} title="Another sub sub item" />
              <MenuItem icon={Settings} title="More sub sub items" />
            </Menu>
          </MenuItem>
          <MenuItem icon={Feedback} title="More info" />
        </Menu>
      </MenuItem>
      <MenuItem title="Another item" icon={Settings} />
    </Menu>
  </DialogContentContainer>
</Flex>
Copy
Format
Reset
Menu with grid items and sub menu

Grid menu items are navigable with a keyboard as well

Menu item
Top level grid item
With Sub menu
Another item
Story Editor
<Flex
  align="start"
  style={{
    height: "500px",
  }}
>
  <DialogContentContainer>
    <Menu>
      <MenuItem title="Menu item" icon={Favorite} />
      <MenuTitle caption="Top level grid item" />
      <MenuItem title="With Sub menu" icon={Activity}>
        <Menu>
          <MenuItem icon={Feedback} title="More info" />
          <MenuTitle caption="1st level grid item" />
          <MenuGridItem>
            <DummyNavigableGrid
              itemsCount={6}
              numberOfItemsInLine={3}
              withoutBorder
            />
          </MenuGridItem>
          <MenuItem icon={Code} title="With Sub menu">
            <Menu>
              <MenuTitle caption="2nd level grid item" />
              <MenuGridItem>
                <DummyNavigableGrid
                  itemsCount={6}
                  numberOfItemsInLine={3}
                  withoutBorder
                />
              </MenuGridItem>
              <MenuItem icon={Invite} title="Another sub sub item" />
              <MenuItem icon={Settings} title="More sub sub items" />
            </Menu>
          </MenuItem>
        </Menu>
Copy
Format
Reset
Related components
Option 1
Option 2
Option 3
Combobox
Combobox allowing users to filter longer lists to only the selections matching a query.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
Button
SplitButton
Dual-function menu button offers a default action and a secondary action
