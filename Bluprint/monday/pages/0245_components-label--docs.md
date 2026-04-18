---
id: components-label--docs
type: docs
title: "Components/Label"
name: "Docs"
importPath: "./src/pages/components/Label/Label.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-label--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:39:18.487Z
---

Label

A label indicates the status of an item.

New
Show code
Import
import { Label } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

celebrationAnimation	
If true, triggers a celebration animation.
boolean
	-	Set boolean
className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The background color of the label.
LabelColor
	
primary
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

isLegIncluded	
If true, includes a leg (decorative extension).
boolean
	
false
	Set boolean
kind	
The visual style of the label.
LabelKind
	
fill
	Set object
labelClassName	
Class name applied to the inner text wrapper.
string
	-	Set string
onClick	
Callback fired when the label is clicked.
(event: MouseEvent<HTMLSpanElement, MouseEvent>) => void
	-	-
size	
The size of the label.
LabelSizes
	
medium
	Set object
text	
The text content of the label.
string
	
""
	
Usage
Label will always appear in context next to the item it classifies.
Displays a short message like new, beta, coming soon.,etc.
Use only UI colors, not content colors (like status colors).
🤓
Check yourself
Need to count or indicate numbers? Use the 
Counter
 component instead.
Variants
Kinds
New
Fill
New
Outline
Story Editor
<Flex
  style={{
    marginLeft: "30px",
    marginTop: "10px",
    gap: "184px",
  }}
>
  <Flex direction="column" align="start" gap="large">
    <Label id="kinds-fill" text="New" />
    <Text>Fill</Text>
  </Flex>
  <Flex direction="column" align="start" gap="large">
    <Label id="kinds-outline" text="New" kind="line" />
    <Text>Outline</Text>
  </Flex>
</Flex>
Copy
Format
Reset
Size

Label can appear in 2 sizes: small and medium.

New
New
Story Editor
<>
  <Label id="sizes-medium" text="New" />
  <Label id="sizes-small" text="New" size="small" />
</>
Copy
Format
Reset
Colors
New
New
New
New
New
New
New
New
Story Editor
<>
  <Label id="colors-default-fill" text="New" />
  <Label id="colors-negative-fill" text="New" color="negative" />
  <Label id="colors-positive-fill" text="New" color="positive" />
  <Label id="colors-dark-fill" text="New" color="dark" />
  <Label id="colors-default-line" text="New" kind="line" />
  <Label id="colors-negative-line" text="New" color="negative" kind="line" />
  <Label id="colors-positive-line" text="New" color="positive" kind="line" />
  <Label id="colors-dark-line" text="New" color="dark" kind="line" />
</>
Copy
Format
Reset
Clickable
New
New
Story Editor
<>
  <Label
    id="clickable-fill"
    aria-label="Clickable new feature label"
    text="New"
    onClick={() => {}}
  />
  <Label
    id="clickable-line"
    aria-label="Clickable new feature label"
    text="New"
    kind="line"
    onClick={() => {}}
  />
</>
Copy
Format
Reset
Do’s and Don’ts
New
Do
Use label to indicate the status of an item, for example: “New”.
123
Don't
Don’t use the label component in order to indicate numbers, instead use the 
Counter.
Categories
new
Do
Use label only once per item.
Categories
Featured
CRM
Export
Don't
Don’t use multiple labels for one item. Instead, use 
Chips.
New
Beta
Do
Use only the UI colors above.
Beta
Beta
Don't
Don’t use any content colors for labels. If the page is full of CTAs, use the outline state.
Use cases and examples
Secondary label

In case of visual overload, use the secondary label in order to create hirarchy.

Gannt
New

Plan, track and present your projects visually using the Gannt chart

Apps
New

Enhance your dashboard with widgets built on the monday apps framework

Story Editor
<Flex direction="column" gap="large">
  <Box
    style={{
      width: "300px",
    }}
  >
    <Flex align="center" gap="small">
      <Heading id="gantt-heading" type="h3">
        Gannt
      </Heading>
      <Label id="gantt-label" text="New" kind="line" />
    </Flex>
    <Text element="p" type="text1">
      Plan, track and present your projects visually using the Gannt chart
    </Text>
  </Box>
  <Box
    style={{
      width: "300px",
      marginTop: "8px",
    }}
  >
    <Flex align="center" gap="small">
      <Heading
        id="apps-heading"
        type="h3"
        style={{
          display: "inline",
        }}
      >
        Apps
      </Heading>
      <Label id="apps-label" text="New" kind="line" />
    </Flex>
    <Text
      element="p"
Copy
Format
Reset
Celebration

To celebrate new feature, outline label can be highlighted by adding celebrate animation.

New
Click to celebrate
Story Editor
() => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimate(false);
    }, 500);
  }, [animate]);
  return (
    <>
      <Label
        id="celebration-label"
        text="New"
        kind="line"
        celebrationAnimation={animate}
      />
      <Button
        id="celebration-button"
        aria-label="Trigger celebration animation"
        size="small"
        kind="tertiary"
        onClick={() => setAnimate(true)}
      >
        Click to celebrate
      </Button>
    </>
  );
}
Copy
Format
Reset
Related components
Tooltip
Displays information related to an element over it.
5
Counter
Show the count of some adjacent data.
This is a chip
Chip
Compact elements that represent an input, attribute, or action.
