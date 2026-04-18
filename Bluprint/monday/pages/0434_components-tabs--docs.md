---
id: components-tabs--docs
type: docs
title: "Components/Tabs"
name: "Docs"
importPath: "./src/pages/components/Tabs/Tabs.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-tabs--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:47:09.260Z
---

Tabs

Tabs allow users to navigate between related views of content while remaining in the context of the page.

First
Second
Third
First slide
Show code
Import
import { Tabs, TabPanel, TabPanels, TabList, Tab, TabsContext } from "@vibe/core";
Copy
Props
TabTabPanelTabPanelsTabListTabsContext
Name	Description	Default	
Control

active	
If true, marks the tab as active.
boolean
	
false
	Set boolean
aria-controls	
The id of the associated TabPanel for aria-controls attribute.
string
	-	Set string
children	
The content displayed inside the tab.
string | ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
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
If true, disables the tab.
boolean
	
false
	Set boolean
focus	
If true, applies focus styles to the tab.
boolean
	
false
	Set boolean
icon	
The icon displayed in the tab.
SubIcon
	-	Set object
iconSide	
The position of the icon relative to the text.
string
	
"left"
	Set string
iconType	
The type of icon.
IconType
	-	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
onClick	
Callback fired when the tab is clicked.
(value: number) => void
	-	-
stretchedUnderline	
If true, hides the individual tab border when using stretched underline.
boolean
	
false
	Set boolean
tabIndex	
Tab index for focus management.
number
	-	Set number
tabInnerClassName	
Class name applied to the inner tab content.
string
	-	Set string
tooltipProps	
Props passed to the tab's tooltip.
Partial<TooltipProps>
	{} as TooltipProps	Set object
value	
The index value of the tab.
number
	
0
	Set number
Usage
Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy.
Align navigation tabs and content tabs left (in left-to-right languages) and never center within a page or content area.
The first tab is selected by default. The default tab is most important use case of the page.
Stick to only one row of tabs.
🤓
Tip
Use tabs to navigate between different contents, if switching between states within the same content use 
Button group
 instead
Accessibility
Provide an id for the TabList and individual Tab components to enable proper accessibility associations and unique identification.
Ensure each Tab has clear, descriptive text content or appropriate icon with accessible name to indicate what content will be displayed when selected.
Use the tabPanelIds prop in TabList to establish proper relationships between tabs and their corresponding tab panels. Pass an array of TabPanel IDs in the same order as the tabs.
Provide unique id props for each TabPanel to enable the aria-controlsrelationships established by the tabs.
Variants
Default - compact tabs
First
Second
Third
Disabled
First slide
Story Editor
<TabsContext id="default-tabs">
  <TabList id="default-tab-list">
    <Tab id="default-tab-first">First</Tab>
    <Tab id="default-tab-second">Second</Tab>
    <Tab id="default-tab-third">Third</Tab>
    <Tab id="default-tab-disabled" disabled>
      Disabled
    </Tab>
  </TabList>
  <TabPanels id="default-tab-panels">
    <TabPanel id="default-panel-first">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        First slide
      </Box>
    </TabPanel>
    <TabPanel id="default-panel-second">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        Second slide
      </Box>
    </TabPanel>
    <TabPanel id="default-panel-third">
      <Box
Copy
Format
Reset
Stretched

The width of the list is responsive to the screen's width.

First
Second
Third
Disabled
Story Editor
<div
  style={{
    width: "100%",
  }}
>
  <TabList tabType="stretched">
    <Tab>First</Tab>
    <Tab>Second</Tab>
    <Tab>Third</Tab>
    <Tab disabled>Disabled</Tab>
  </TabList>
</div>
Copy
Format
Reset
Stretched Underline
First
Second
Third
Disabled
Story Editor
<div
  style={{
    width: "100%",
  }}
>
  <TabList stretchedUnderline>
    <Tab>First</Tab>
    <Tab>Second</Tab>
    <Tab>Third</Tab>
    <Tab disabled>Disabled</Tab>
  </TabList>
</div>
Copy
Format
Reset
Motion

Tabs animation direction

First
Second
Third
Disabled
First slide
First
Second
Third
Disabled
First slide
Story Editor
<Flex direction="column" gap="medium">
  <TabsContext>
    <TabList>
      <Tab>First</Tab>
      <Tab>Second</Tab>
      <Tab>Third</Tab>
      <Tab disabled>Disabled</Tab>
    </TabList>
    <TabPanels animationDirection="ltr">
      <TabPanel>
        <Box
          backgroundColor="greyBackgroundColor"
          padding="medium"
          style={{
            width: "480px",
            height: "111px",
          }}
        >
          First slide
        </Box>
      </TabPanel>
      <TabPanel>
        <Box
          backgroundColor="greyBackgroundColor"
          padding="medium"
          style={{
            width: "480px",
            height: "111px",
          }}
        >
          Second slide
        </Box>
      </TabPanel>
      <TabPanel>
        <Box
          backgroundColor="greyBackgroundColor"
Copy
Format
Reset
Do’s and Don’ts
Main Table
Chart
Calendar
Do
Use either all text labels, all icon labels, or both, across all labels.
Main Table
Don't
Don’t mix tabs that contain only text, with tabs that contain only icons.
Main Table
Table
More
Do
When there are too many tabs to fit horizontally across the viewport, use a “More” dropdown.
Main...
Table
Time...
Fir...
Don't
Do not cut the tabs name just to make them fit horizontally.
Use cases and examples
Board views tabs

The tabs are presenting the same content, in a different view.

Main Table
Chart
Calendar
Story Editor
<TabList>
  <Tab icon={Table}>Main Table</Tab>
  <Tab icon={Chart}>Chart</Tab>
  <Tab icon={Calendar}>Calendar</Tab>
</TabList>
Copy
Format
Reset
Admin section tabs

In the admin section tabs used to navigate between the different preferences

Profile
Account
Login Details
Profile Name
Story Editor
<TabsContext>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Account</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <h2>Login Details</h2>
      <TextField
        title="Profile Name"
        size="medium"
        placeholder="Profile Name"
      />
    </TabPanel>
    <TabPanel>
      <h2>Account Details</h2>
      <TextField
        title="Account Name"
        size="medium"
        placeholder="Account Name"
      />
    </TabPanel>
  </TabPanels>
</TabsContext>
Copy
Format
Reset
Related components
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
Alpha
Beta
Delta
ButtonGroup
Used to group related options.
Back
Next
Steps
Steps display progress through a sequence of logical and numbered steps. They may also be used for navigation.
