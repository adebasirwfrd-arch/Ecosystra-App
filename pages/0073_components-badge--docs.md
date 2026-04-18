---
id: components-badge--docs
type: docs
title: "Components/Badge"
name: "Docs"
importPath: "./src/pages/components/Badge/Badge.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-badge--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:33:15.236Z
---

Badge

Badge component is responsible for layout an indicator/counter on a child component

What's new
Show code
Import
import { Badge } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

alignment	
The alignment style of the badge.
BadgeAlignments
	
rectangular
	Set object
anchor	
The position of the badge relative to its parent.
BadgeAnchor
	
top-end
	Set object
aria-label	
The label of the counter for accessibility.
string
	-	Set string
aria-labelledby	
The ID of the element describing the counter.
string
	-	Set string
children*	
The content the badge is attached to.
ReactNode
	-	-
className	
A CSS class name to apply to the component.
string
	-	Set string
color	

The color of the counter. The color of the indicator.

"primary"
"dark"
"negative"
"light"
"notification"
	-	
primary
dark
negative
light
notification

count	
The numeric value displayed in the counter.
number
	-	Set number
counterClassName	
Class name applied to the counter element.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

kind	
The visual style of the counter.
CounterType
	-	Set object
maxDigits	
The maximum number of digits displayed before truncation.
number
	-	Set number
noAnimation	
If true, disables counter animations.
boolean
	-	Set boolean
onMouseDown	
Callback fired when the counter is clicked.
(event: MouseEvent<HTMLSpanElement, MouseEvent>) => void
	-	-
prefix	
Text prepended to the counter value.
string
	-	Set string
size	
The size of the counter.
CounterSize
	-	Set object
type	

The type of badge, set to "counter" for numeric values. The type of badge, set to "indicator" for a simple dot.

"indicator"
"counter"
	
indicator
	
indicator
counter
Variants
States

Badge can be of type Indicator or type Counter

Indicator
What's new
Counter
What's new
99+
Story Editor
<Flex gap="large" justify="start" align="start">
  <Flex direction="column" gap="medium" align="start">
    Indicator
    <Badge id="indicator-badge">
      <Button
        id="indicator-button"
        aria-label="What's new button with indicator"
        leftIcon={WhatsNew}
      >
        {"What's new"}
      </Button>
    </Badge>
  </Flex>
  <Flex direction="column" gap="medium" align="start">
    Counter
    <Badge
      id="counter-badge"
      type="counter"
      count={100}
      maxDigits={2}
      aria-label="100 notifications"
    >
      <Button
        id="counter-button"
        aria-label="What's new button with counter"
        leftIcon={WhatsNew}
      >
        {"What's new"}
      </Button>
    </Badge>
  </Flex>
</Flex>
Copy
Format
Reset
Button

When using Badge on a Button element, use alignment of RECTANGULAR in order to attach it to the element

Button
Story Editor
<Badge id="button-badge" alignment="rectangular">
  <Button
    id="button-story-button"
    aria-label="Button with external page icon and badge"
    leftIcon={ExternalPage}
  >
    Button
  </Button>
</Badge>
Copy
Format
Reset
Avatar

When using Badge on an Avatar element, use alignment of CIRCULAR in order to attach it to the element

Story Editor
<Badge id="avatar-badge" alignment="circular">
  <Avatar id="badge-avatar" size="large" src={person} type="img" />
</Badge>
Copy
Format
Reset
Inline elements

When using Badge on an inline element, use alignment of OUTSIDE in order to attach it to the element

Read more
What's new
Learn more
Story Editor
<Flex direction="column" gap="medium" align="start">
  <Badge id="inline-badge-1" alignment="outside">
    <Link id="inline-link-1" text="Read more" />
  </Badge>
  <Badge id="inline-badge-2" alignment="outside">
    <Link
      id="inline-link-2"
      text="What's new"
      iconPosition="start"
      icon={WhatsNew}
    />
  </Badge>
  <Badge id="inline-badge-3" alignment="outside">
    <Link
      id="inline-link-3"
      text="Learn more"
      iconPosition="end"
      icon={ExternalPage}
    />
  </Badge>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Read more
Do
When using the badge on an inline component, apply OUTSIDE alignment to it
Read more
Don't
Do not leave the indicator inside the element boundaries
What's new
Do
Choose a color that does not blend with the one of the child component
What's new
Don't
Do not use a color that blends with the child component
Do
When using Indicator badge, anchor it at the top-right edge
Don't
Do not place it on any other edge
Related components
Read more
Link
Actionable text component with connection to another web pages.
Get started
Button
Allow users take actions with a single click.
5
Counter
Show the count of some adjacent data.
