---
id: components-breadcrumbsbar-breadcrumbsbar--docs
type: docs
title: "Components/BreadcrumbsBar/BreadcrumbsBar"
name: "Docs"
importPath: "./src/pages/components/BreadcrumbsBar/BreadcrumbsBar.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-breadcrumbsbar-breadcrumbsbar--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:33:34.351Z
---

BreadcrumbsBar

Breadcrumbs allow users to keep track and maintain awareness of their location as they navigate through pages, folders, files, etc.

Workspace
Folder
Board
Group
Show code
Import
import { BreadcrumbsBar } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

children*	
Breadcrumb item, each containing text and an optional icon, or a BreadcrumbMenu
(BreadcrumbItemProps | BreadcrumbMenuProps)[]
	[ { text: "Workspace", icon: <IconName /> } ]	
RAW
children : [
0 : {...} 2 keys
1 : {...} 2 keys
2 : {...} 2 keys
3 : {...} 2 keys
]

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
type	
The type of the breadcrumb bar, determining if it is navigational or for indication only.
BreadcrumbsBarType
	
indication
	Set object
Usage
Breadcrumbs show users their current location relative to the information architecture and enable them to quickly move up to a parent level or previous step
Effective in a hierarchy of more than two levels.
Start with the highest level parent page and move deeper into the information architecture as the breadcrumb trail progresses.
Use breadcrumbs when the user is most likely to have landed on the page from an external source.
Place breadcrumbs at the top left corner of the screen, above the page title.
Accessibility
Use the type="navigation" prop when breadcrumbs are clickable for navigation. This automatically enables keyboard navigation and proper button/link semantics.
For clickable breadcrumbs, ensure all items have descriptive text props that clearly indicate what section or page they represent.
When using icons in breadcrumbs, ensure they are purely decorative and don't replace the descriptive text, as screen readers will announce the text content.
Use the isCurrent prop on BreadcrumbItem to mark the current page. This ensures screen readers understand the user's current location in the navigation hierarchy.
🤓
Check yourself
If you are taking users through a multistep process, use the 
MultiStepIndicator
 component instead.
Variants
Text only
Workspace
Folder
Board
Group
Story Editor
<BreadcrumbsBar type="indication">
  <BreadcrumbItem text="Workspace" isCurrent />
  <BreadcrumbItem text="Folder" />
  <BreadcrumbItem text="Board" />
  <BreadcrumbItem text="Group" />
</BreadcrumbsBar>
Copy
Format
Reset
With icons
Workspace
Folder
Board
Group
Story Editor
<BreadcrumbsBar type="navigation">
  <BreadcrumbItem text="Workspace" icon={Workspace} isCurrent />
  <BreadcrumbItem text="Folder" icon={Folder} />
  <BreadcrumbItem text="Board" icon={Board} />
  <BreadcrumbItem text="Group" icon={Group} />
</BreadcrumbsBar>
Copy
Format
Reset
With Breadcrumb Menu
Board
Group
My Item
Story Editor
<BreadcrumbsBar type="navigation">
  <BreadcrumbItem text="Board" icon={Board} />
  <BreadcrumbItem text="Group" icon={Group} />
  <BreadcrumbMenu>
    <BreadcrumbMenuItem
      title="Item 1"
      onClick={() => alert("Item 1 clicked")}
    />
    <BreadcrumbMenuItem title="Item 2" link="https://www.monday.com" />
    <BreadcrumbMenuItem title="Item 3" link="https://www.monday.com" />
  </BreadcrumbMenu>
  <BreadcrumbItem text="My Item" icon={Item} isCurrent />
</BreadcrumbsBar>
Copy
Format
Reset
Do’s and Don’ts
Do
Show the current step as the last item when using overflow behavior, and use only if content is overflowing and not as an aesthetic action.
Don't
overflow on the last item causes disorientation. Moreover using overflow on individual items prevent the user of essential information unnecessarily..
Workspace
Folder
Board
Group
Do
If there’s a need to insert an icon, use for all items.
Workspace
Folder
Board
Group
Don't
Don’t use icons if not applied to all steps.
Rotem Dekel
User research
Video sessions
Do
Use breadcrumbs when there is more than two levels of hierarchy.
Rotem Dekel
User research
Don't
Don’t use breadcrumbs when there is only one level of navigation or hierachy.
Use cases and examples
Navigatable breadcrumbs

Use when breadcrumbs are clickable and are used for information and navigation

Rotem Dekel
User research
Video sessions
Story Editor
<Flex gap="small">
  <Avatar size="medium" src={person3} type="img" />
  <div className={styles.list}>
    <Text type="text1" weight="medium">
      Rotem Dekel
    </Text>
    <BreadcrumbsBar type="navigation">
      <BreadcrumbItem text="User research" icon={Board} />
      <BreadcrumbItem text="Video sessions" icon={Group} />
    </BreadcrumbsBar>
  </div>
</Flex>
Copy
Format
Reset
Related components
Alpha
Beta
Delta
ButtonGroup
Used to group related options.
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
Tab
Tab
Tab
Tabs
Allow users to navigate between related views of content.
