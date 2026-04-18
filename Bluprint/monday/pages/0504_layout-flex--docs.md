---
id: layout-flex--docs
type: docs
title: "Layout/Flex"
name: "Docs"
importPath: "./src/pages/components/Flex/Flex.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=layout-flex--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:49:22.103Z
---

Flex

Use Flex component to position group of sub-elements in one dimension, horizontal or vertical, without being dependent on a custom CSS file for positioning the sub-elements.

Show code
Import
import { Flex } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

align	
Defines how flex items are aligned along the cross axis.
FlexAlign
	
center
	Set object
aria-label	
The label of the flex container for accessibility.
string
	-	Set string
aria-labelledby	
ID of the element describing the flex container.
string
	-	Set string
children	
The content inside the flex container.
ElementContent | ElementContent[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
direction	
The direction of the flex container.
FlexDirection
	
row
	Set object
elementType	
The HTML element or component used as the root.
ElementType<any, keyof IntrinsicElements>
	
div
	Set object
flex	
The flex shorthand of the flex container.
FlexShorthand
	-	Set object
gap	
The gap between flex items.
number
FlexGap
	-	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
justify	
Defines how flex items are aligned along the main axis.
FlexJustify
	
start
	Set object
onClick	
Callback fired when the flex container is clicked.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseDown	
Callback fired when the mouse button is pressed on the flex container.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
style	
Inline styles applied to the flex container.
object
	-	Set object
tabIndex	
The tab order of the element.
number
	-	Set number
wrap	
If true, allows wrapping of flex items.
boolean
	
false
	Set boolean
Usage
Use flex component whenever you want to define a layout with one dimension.
Flex layout can be either horizontal or vertical.
You can defined the spacing between the layout children by using our fixed sizes - xs (4px), small (8px), medium (16px) or large( 24px).
Variants
Directions
Horizontal
Vertical
Story Editor
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: "var(--space-32)",
  }}
>
  <Text type="text1" weight="medium">
    Horizontal
  </Text>
  <Flex>
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium">
    Vertical
  </Text>
  <Flex direction="column">
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
</div>
Copy
Format
Reset
Horizontal spacing between items
No spacing between items
Extra small spacing between items
Small spacing between items
Medium spacing between items
Large spacing between items
Custom spacing between items
Story Editor
<div
  style={{
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    alignItems: "center",
    gap: "var(--space-16) var(--space-24)",
  }}
>
  <Text type="text1" weight="medium" ellipsis={false}>
    No spacing between items
  </Text>
  <Flex>
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium" ellipsis={false}>
    Extra small spacing between items
  </Text>
  <Flex gap="xs">
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium" ellipsis={false}>
    Small spacing between items
  </Text>
  <Flex gap="small">
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium" ellipsis={false}>
    Medium spacing between items
  </Text>
  <Flex gap="medium">
Copy
Format
Reset
Vertical spacing between items
No spacing between items
Extra small spacing between items
Small spacing between items
Medium spacing between items
Large spacing between items
Custom spacing between items
Story Editor
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)",
      width: "120px",
    }}
  >
    <Text align="center" type="text1" weight="medium" ellipsis={false}>
      No spacing between items
    </Text>
    <Flex direction="column">
      <Box padding="large" border />
      <Box padding="large" border />
      <Box padding="large" border />
    </Flex>
  </div>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)",
      width: "120px",
    }}
  >
    <Text align="center" type="text1" weight="medium" ellipsis={false}>
      Extra small spacing between items
    </Text>
Copy
Format
Reset
Horizontal positions
Start position
Center position
End position
Space between position
Space around position
Story Editor
<div
  style={{
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    alignItems: "center",
    gap: "var(--space-24) var(--space-16)",
    flex: 1,
  }}
>
  <Text type="text1" weight="medium" ellipsis={false}>
    Start position
  </Text>
  <Flex
    justify="start"
    style={{
      width: "100%",
    }}
  >
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium" ellipsis={false}>
    Center position
  </Text>
  <Flex
    justify="center"
    style={{
      width: "100%",
    }}
  >
    <Box padding="large" border />
    <Box padding="large" border />
    <Box padding="large" border />
  </Flex>
  <Text type="text1" weight="medium" ellipsis={false}>
Copy
Format
Reset
Horizontal layout using flex
Equal size
First
Second
Third
First item grows
First
Second
Third
Third item grows
First
Second
Third
Story Editor
<div
  style={{
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    alignItems: "center",
    gap: "var(--space-24) var(--space-16)",
  }}
>
  <Text type="text1" weight="medium" ellipsis={false}>
    Equal size
  </Text>
  <Flex
    style={{
      width: 300,
    }}
  >
    <Flex
      flex={{
        grow: 1,
        shrink: 1,
        basis: "auto",
      }}
    >
      <Box
        padding="medium"
        style={{
          width: "100%",
        }}
        border
      >
        First
      </Box>
    </Flex>
    <Flex
      flex={{
        grow: 1,
Copy
Format
Reset
Vertical positions
Start position
Center position
End position
Space between position
Space around position
Story Editor
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)",
      width: "120px",
    }}
  >
    <Text align="center" type="text1" weight="medium" ellipsis={false}>
      Start position
    </Text>
    <Flex
      justify="start"
      style={{
        height: "300px",
      }}
      direction="column"
    >
      <Box padding="large" border />
      <Box padding="large" border />
      <Box padding="large" border />
    </Flex>
  </div>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)",
Copy
Format
Reset
Vertical layout using flex
Equal size
First
Second
Third
First item grows
First
Second
Third
Third item grows
First
Second
Third
Story Editor
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-16)",
      width: "120px",
    }}
  >
    <Text align="center" type="text1" weight="medium" ellipsis={false}>
      Equal size
    </Text>
    <Flex
      direction="column"
      style={{
        height: 300,
      }}
    >
      <Flex
        flex={{
          grow: 1,
          shrink: 1,
          basis: "auto",
        }}
      >
        <Box
          style={{
            height: "100%",
            width: "100%",
Copy
Format
Reset
Support multi lines layout

You can display a layout that includes multiple lines using the flex component wrap mode. This mode allows the layout to break into multiple lines if all the component children cannot fit into one only.

Chip 1
Chip 2
Chip 3
Chip 4
Chip 5
Chip 6
Chip 7
Story Editor
<Flex
  wrap
  style={{
    width: "300px",
  }}
  gap="small"
>
  <Chips noMargin label="Chip 1" />
  <Chips noMargin label="Chip 2" />
  <Chips noMargin label="Chip 3" />
  <Chips noMargin label="Chip 4" />
  <Chips noMargin label="Chip 5" />
  <Chips noMargin label="Chip 6" />
  <Chips noMargin label="Chip 7" />
</Flex>
Copy
Format
Reset
Use cases and examples
Flex as toolbar container

You can use flex component for create responsive toolbars

Add
Search
Person
Filter
Sort
Story Editor
<Flex gap="small">
  <Button leftIcon={Add}>Add</Button>
  <Button kind="tertiary" leftIcon={Search}>
    Search
  </Button>
  <Button kind="tertiary" leftIcon={Person}>
    Person
  </Button>
  <Button kind="tertiary" leftIcon={Filter}>
    Filter
  </Button>
  <Button kind="tertiary" leftIcon={Sort}>
    Sort
  </Button>
</Flex>
Copy
Format
Reset
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
List item 1
List item 2
List item 3
List
Lists is a group of actionable items containing primary and supplemental actions, which are represented by icons and text.
