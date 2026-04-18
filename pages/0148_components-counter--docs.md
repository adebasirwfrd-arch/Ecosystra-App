---
id: components-counter--docs
type: docs
title: "Components/Counter"
name: "Docs"
importPath: "./src/pages/components/Counter/Counter.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-counter--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:36:01.638Z
---

Counter

Counters show the count of some adjacent data.

5
Show code
Import
import { Counter } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-label	
The label of the counter for accessibility.
string
	-	Set string
aria-labelledby	
The ID of the element describing the counter.
string
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The color of the counter.
CounterColor
	
primary
	Set object
count	
The numeric value displayed in the counter.
number
	
0
	Set number
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
	
""
	Set string
kind	
The visual style of the counter.
CounterType
	
fill
	Set object
maxDigits	
The maximum number of digits displayed before truncation.
number
	
3
	Set number
noAnimation	
If true, disables counter animations.
boolean
	
false
	Set boolean
onMouseDown	
Callback fired when the counter is clicked.
(event: MouseEvent<HTMLSpanElement, MouseEvent>) => void
	-	-
prefix	
Text prepended to the counter value.
string
	
""
	Set string
size	
The size of the counter.
CounterSize
	
large
	Set object
Usage
Counters are usually placed after the label of the item they're quantifying, such as the number of notifications. They should only be used to represent a number.
The element the counter refers to should include 
Tooltip
 , where necessary, to enhance user understanding. For example, a badge is used in conjunction with an icon.
🤓
Check yourself
Need to indicate information that is not numeric? Use the 
Label
 component instead.
Variants
Sizes

There are 3 sizes of counters

5
XS
5
Small
5
Large
Story Editor
<Flex gap={160}>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="sizes-xs"
      aria-label="Extra small counter showing 5"
      count={5}
      size="xs"
    />
    <Text>XS</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="sizes-small"
      aria-label="Small counter showing 5"
      count={5}
      size="small"
    />
    <Text>Small</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
Copy
Format
Reset
Colors
5
Primary
5
Negative or notification
5
Dark
5
Light
Story Editor
<Flex gap={160}>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="colors-primary"
      aria-label="Primary counter showing 5"
      count={5}
    />
    <Text>Primary</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="colors-negative"
      aria-label="Negative counter showing 5 notifications"
      count={5}
      color="negative"
    />
    <Text>Negative or notification</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
    style={{
Copy
Format
Reset
Outline
5
Primary
5
Negative or notification
5
Dark
5
Light
Story Editor
<Flex gap={160}>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="outline-primary"
      aria-label="Primary outline counter showing 5"
      count={5}
      kind="line"
    />
    <Text>Primary</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="outline-negative"
      aria-label="Negative outline counter showing 5 notifications"
      count={5}
      color="negative"
      kind="line"
    />
    <Text>Negative or notification</Text>
  </Flex>
  <Flex
    direction="column"
Copy
Format
Reset
Limits
9+
One digit limit
99+
Two digits limit
999+
Three digits limit
Story Editor
<Flex gap={160}>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="limits-one-digit"
      aria-label="Counter showing 9+ items (10 with 1 digit limit)"
      count={10}
      maxDigits={1}
    />
    <Text>One digit limit</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
    style={{
      width: "100px",
    }}
    align="start"
  >
    <Counter
      id="limits-two-digit"
      aria-label="Counter showing 99+ items (100 with 2 digit limit)"
      count={100}
      maxDigits={2}
    />
    <Text>Two digits limit</Text>
  </Flex>
  <Flex
    direction="column"
    gap="large"
Copy
Format
Reset
Do’s and Don’ts
15
Do
Use counter to notify the number of items, such as notifications, updates, or inbox alerts.
New
Don't
Don’t include any text. If you need a text label, use a 
Label.
999+
Do
Only use a maximum of 3 digits in a counter.
1050
Don't
Don’t use more than 3 digits in a counter.
Use cases and examples
Notification counter

Used on the notification icon to indicate the number of new notifications.

5
Story Editor
() => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Avatar
        id="notification-avatar"
        type="icon"
        icon={Notifications}
        backgroundColor="royal"
        aria-label="Notifications"
      />
      <div
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
        }}
      >
        <Counter
          id="notification-counter"
          aria-label="5 unread notifications"
          count={5}
          maxDigits={1}
          color="negative"
        />
      </div>
    </div>
  );
}
Copy
Format
Reset
Counter on inbox filters

The counter represents the number of items on each topic.

UX Writing & microcopy Re...
Mobile Data- Iteration Plan...
Q Plans.
195
141
99
Story Editor
<Flex gap={28}>
  <Flex direction="column" gap="large" align="start">
    <Text>UX Writing & microcopy Re...</Text>
    <Text>Mobile Data- Iteration Plan...</Text>
    <Text>Q Plans.</Text>
  </Flex>
  <Flex direction="column" gap="large" align="start">
    <Counter
      id="inbox-counter-1"
      aria-label="195 items in UX Writing & microcopy"
      count={195}
      color="dark"
    />
    <Counter
      id="inbox-counter-2"
      aria-label="141 items in Mobile Data Iteration Plan"
      count={141}
      color="dark"
    />
    <Counter
      id="inbox-counter-3"
      aria-label="99 items in Q Plans"
      count={99}
      color="dark"
    />
  </Flex>
</Flex>
Copy
Format
Reset
Count the number of updates

The counter represents the number of items on each topic.

5
5
Story Editor
<Flex gap={12} direction="column" align="start">
  <Icon icon={AddUpdate} size="36" />
  <Divider />
  <div
    style={{
      position: "relative",
    }}
  >
    <Icon icon={Update} size="36" />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: -3,
      }}
    >
      <Counter
        count={5}
        size="small"
        id="count-the-number-of-updates-1"
        aria-label="5 updates"
      />
    </div>
  </div>
  <Divider />
  <div
    style={{
      position: "relative",
    }}
  >
    <Icon icon={Update} size="36" />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: -3,
Copy
Format
Reset
Related components
New
Label
Offers content classification.
Tooltip
Displays information related to an element over it.
This is a chip
Chip
Compact elements that represent an input, attribute, or action.
