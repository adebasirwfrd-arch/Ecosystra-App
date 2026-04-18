---
id: components-accordion--docs
type: docs
title: "Components/Accordion"
name: "Docs"
importPath: "./src/pages/components/Accordion/Accordion.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-accordion--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:37.744Z
---

Accordion

Accordion is a vertically stacked list of items. Each item can be "expanded" or "collapsed" to reveal the content within with that item.

Notifications
Setting
Info
Profile
Permissions
Security
Connectivity
Integration
Assets
Show code
Import
import { Accordion, AccordionItem } from "@vibe/core";
Copy
Props
AccordionAccordionItem
Name	Description	Default	
Control

allowMultiple	
If true, multiple accordion items can be expanded at the same time.
boolean
	
false
	Set boolean
children	
The content of the accordion (AccordionItem components).
ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	-
className	
A CSS class name to apply to the component.
string
	
""
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultIndex	
An array of initially expanded item indexes.
number[]
	[]	-
id	
An HTML id attribute for the component.
string
	-	Set string
Usage
Use accordion reduce clutter and chunk the information one by one
Accordion Label must be short, clear, and understandable to indicate what's inside
Default state of accordion is closed unless used for navigation
Accordion content can include icons, radio buttons, and checkboxes
Accessibility
Provide an id for the Accordion to enable proper accessibility associations and unique identification.
Provide unique id props for each AccordionItem to ensure proper ARIA relationships between buttons and their controlled content regions.
Use descriptive title props for AccordionItem headers that clearly indicate what content will be revealed when expanded.
Use the defaultIndex prop to set initial expanded states appropriately. Avoid auto-expanding too many items to prevent overwhelming screen reader users.
Variants
Multi active

Each section can be expanded without closing the others

Notifications
Setting
Connectivity
Integration
Assets
Story Editor
<Accordion id="multi-active-accordion" allowMultiple defaultIndex={[1, 3]}>
  <AccordionItem id="multi-notifications" title="Notifications">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="multi-setting" title="Setting">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="multi-connectivity" title="Connectivity">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="multi-integration" title="Integration">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="multi-assets" title="Assets">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
Copy
Format
Reset
Single active

Only one section can be open at the time

Notifications
Setting
Connectivity
Integration
Assets
Story Editor
<Accordion id="single-active-accordion" defaultIndex={[1]}>
  <AccordionItem id="single-notifications" title="Notifications">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="single-setting" title="Setting">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="single-connectivity" title="Connectivity">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="single-integration" title="Integration">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
  <AccordionItem id="single-assets" title="Assets">
    <div
      style={{
        height: 150,
      }}
    />
  </AccordionItem>
Copy
Format
Reset
Do’s and Don’ts
Notifications
Security
InfoAssets
Do
Use informative short labels.
Closed
Closed
Closed
Don't
Indicate the accordion state with labels.
Use cases and examples
Preferences Accordion
In monday
Likes my update
Replies to my update
Replies or likes a conversation I'm a part of
Subscribes me to a Board/Item/Team
Writes an update on an items I'm subscribed to
Story Editor
<Accordion id="preferences-accordion" defaultIndex={[0]}>
  <AccordionItem id="preferences-monday" title="In monday">
    <Flex direction="column" gap={20} align="start">
      <Checkbox id="pref-likes" label="Likes my update" checked />
      <Checkbox id="pref-replies" label="Replies to my update" />
      <Checkbox
        id="pref-conversation"
        label="Replies or likes a conversation I'm a part of"
        checked
      />
      <Checkbox
        id="pref-subscribes"
        label="Subscribes me to a Board/Item/Team"
        checked
      />
      <Checkbox
        id="pref-updates"
        label="Writes an update on an items I'm subscribed to"
        checked
      />
    </Flex>
  </AccordionItem>
</Accordion>
Copy
Format
Reset
Related components
ExpandCollapse
ExpandCollapse
ExpandCollapse is a component that allows you to hide and show content.
Sent
Subject
Status
Apr 22
Limited time offer: AP Process
In progress
Apr 22
Action required: Update your AP
Queued
Apr 22
Limited time offer: AP Process
Sent
Table
Tables are used to organize data, making it easier to understand.
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
