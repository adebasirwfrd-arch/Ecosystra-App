---
id: components-expandcollapse--docs
type: docs
title: "Components/ExpandCollapse"
name: "Docs"
importPath: "./src/pages/components/ExpandCollapse/ExpandCollapse.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-expandcollapse--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:38:26.709Z
---

ExpandCollapse

ExpandCollapse is a component that allows you to hide and show content.

Expand collapse
Show code
Import
import { ExpandCollapse } from "@vibe/core";
Copy
🤓
Want to combine multiple ExpandCollapse?
Use our 
Accordion
 component
Props
Name	Description	Default	
Control

captureOnClick	
If true, captures the click event on the button.
boolean
	
true
	Set boolean
children	
The content inside the expandable section.
ElementContent
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
componentClassName	
Class name applied to the root component.
string
	-	Set string
contentClassName	
Class name applied to the content.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultOpenState	
If true, the section is open by default when rendered.
boolean
	
false
	Set boolean
headerClassName	
Class name applied to the header.
string
	-	Set string
headerComponentRenderer	
Custom renderer for the header component.
() => ReactElement<any, string | JSXElementConstructor<any>>
	-	-
hideBorder	
If true, hides the border around the component.
boolean
	
false
	Set boolean
iconPosition	
The position of the icon.
ExpandCollapseIconPosition
	
right
	Set object
iconSize	
The size of the expand/collapse icon.
string
number
	
24
	Set object
id	
An HTML id attribute for the component.
string
	
""
	Set string
onClick	
Callback fired when the header is clicked.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
open	
Controls the open state of the section.
boolean
	-	Set boolean
title	
The title displayed in the header.
ElementContent
	
""
	Set string
Variants
Open by default
Open by default
Insert here any component that you want
Story Editor
<div
  style={{
    width: "300px",
  }}
>
  <ExpandCollapse title="Open by default" defaultOpenState>
    <Text type="text2" maxLines={2}>
      Insert here any component that you want
    </Text>
  </ExpandCollapse>
</div>
Copy
Format
Reset
Controlled open state

You can control the open state of the ExpandCollapse component by passing the open prop.

Controlled open state
Story Editor
() => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        width: "300px",
      }}
    >
      <ExpandCollapse
        title="Controlled open state"
        open={open}
        onClick={() => setOpen(prevState => !prevState)}
      >
        <Text type="text2" maxLines={2}>
          Insert here any component that you want
        </Text>
      </ExpandCollapse>
    </div>
  );
}
Copy
Format
Reset
Custom header renderer
Any component you want
Story Editor
() => {
  const ExpandCollapseCustomHeadingComponent = () => {
    return <Heading type="h3">Any component you want</Heading>;
  };
  return (
    <div
      style={{
        width: "300px",
      }}
    >
      <ExpandCollapse
        headerComponentRenderer={ExpandCollapseCustomHeadingComponent}
      >
        <Text type="text2" maxLines={2}>
          Insert here any component that you want
        </Text>
      </ExpandCollapse>
    </div>
  );
}
Copy
Format
Reset
Without borders
Without borders
Story Editor
<div
  style={{
    width: "300px",
  }}
>
  <ExpandCollapse hideBorder title="Without borders">
    <Text type="text2" maxLines={2}>
      Insert here any component that you want
    </Text>
  </ExpandCollapse>
</div>
Copy
Format
Reset
Related components
Notifications
Settings
Accordion
Accordion is a vertically stacked list of items. Each item can be expanded or collapsed to reveal the content within with that item.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
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
