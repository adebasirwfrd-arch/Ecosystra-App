---
id: text-heading--docs
type: docs
title: "Text/Heading"
name: "Docs"
importPath: "./src/pages/components/Heading/Heading.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=text-heading--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:49:45.815Z
---

Heading

Heading components are used for titles at the top of pages and sub-sections.

Title
Show code
Import
import { Heading } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

align	
The text alignment.
TypographyAlign
	-	Set object
children*	
The content inside the heading.
ReactNode
	-	

className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The text color.
TypographyColor
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
element	
The HTML element tag used for the text component.
string
	-	Set string
ellipsis	
If true, truncates overflowing text with an ellipsis.
boolean
	-	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
maxLines	
The maximum number of lines before truncating with an ellipsis.
number
	-	Set number
tooltipProps	
Props passed to the tooltip displayed when hovering over the text.
Partial<TooltipProps>
	-	Set object
type	
The heading type.
HeadingType
	
h1
	Set object
weight	
The font weight of the heading.
HeadingWeight
	
normal
	Set object
withoutTooltip	
If true, disables the tooltip that appears when text is truncated.
boolean
	-	Set boolean
Usage
Don't include more than one H1 title per web page.
🤓
Heading components are not editable
Check out our 
EditableHeading
 component if you would like to allow users to edit the title text.
Variants
Types and weights

Heading component comes in three types: H1 (32px), H2 (24px), H3 (18px) and four weights: bold (700), medium (600), normal (500), light (300)

Bold H1 title
Medium H1 title
Normal H1 title
Light H1 title
Bold H2 title
Medium H2 title
Normal H2 title
Light H2 title
Bold H3 title
Medium H3 title
Normal H3 title
Light H3 title
Story Editor
<Flex gap="large" direction="column" justify="start" align="start">
  <Flex gap="small" direction="column" justify="start" align="start">
    <Heading type="h1" weight="bold">
      Bold H1 title
    </Heading>
    <Heading type="h1" weight="medium">
      Medium H1 title
    </Heading>
    <Heading type="h1" weight="normal">
      Normal H1 title
    </Heading>
    <Heading type="h1" weight="light">
      Light H1 title
    </Heading>
  </Flex>
  <Flex gap="small" direction="column" justify="start" align="start">
    <Heading type="h2" weight="bold">
      Bold H2 title
    </Heading>
    <Heading type="h2" weight="medium">
      Medium H2 title
    </Heading>
    <Heading type="h2" weight="normal">
      Normal H2 title
    </Heading>
    <Heading type="h2" weight="light">
      Light H2 title
    </Heading>
  </Flex>
  <Flex gap="small" direction="column" justify="start" align="start">
    <Heading type="h3" weight="bold">
      Bold H3 title
    </Heading>
    <Heading type="h3" weight="medium">
      Medium H3 title
    </Heading>
Copy
Format
Reset
Colors

Heading component comes in four colors: primary, secondary, on primary, on inverted

Primary title
Secondary title
On primary title
On inverted title
Story Editor
<Flex direction="column" align="start" gap="small">
  <Heading type="h2" color="primary">
    Primary title
  </Heading>
  <Heading type="h2" color="secondary">
    Secondary title
  </Heading>
  <Box
    style={{
      backgroundColor: "var(--primary-color)",
    }}
    padding="small"
  >
    <Heading element="div" type="h2" align="center" color="onPrimary">
      On primary title
    </Heading>
  </Box>
  <Box backgroundColor="invertedColorBackground" padding="small">
    <Heading element="div" type="h2" align="center" color="onInverted">
      On inverted title
    </Heading>
  </Box>
</Flex>
Copy
Format
Reset
Overflow

Our Heading component supports overflow state. When the text is longer than its container and the ellipsis flag is on, the end of the text will be truncated and will display "..."

We support two kinds of ellipsis: single-line ellipsis with a tooltip displayed in hover or ellipsis after multiple lines. You can see examples for both use cases below.

Heading without overflow
Heading with ellipsis and tooltip when hovering
Heading with two lines overflow and a tooltip. Heading with two lines overflow and a tooltip. Heading with two lines overflow and a tooltip.
Story Editor
<Flex
  id={OVERFLOW_TITLE_CONTAINER_ID}
  direction="column"
  gap="medium"
  align="stretch"
  style={{
    width: "480px",
  }}
>
  <Heading type="h2">Heading without overflow</Heading>
  <Heading
    type="h2"
    /**for testing purposes**/ data-testid={ONE_LINE_ELLIPSIS_TEST_ID}
    tooltipProps={{
      containerSelector: `#${OVERFLOW_TITLE_CONTAINER_ID}`,
    }}
  >
    Heading with ellipsis and tooltip when hovering
  </Heading>
  <div>
    <Heading type="h2" maxLines={2}>
      Heading with two lines overflow and a tooltip. Heading with two lines
      overflow and a tooltip. Heading with two lines overflow and a tooltip.
    </Heading>
  </div>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Hello world
Do
Always capitalize the first letter of the first word in the heading.
Hello World
Don't
Please avoid capitalizing the first letter of each word in the heading.
Use cases and examples
Built-in page header (not editable)
My work
Hide done items
Customize
Story Editor
<div
  style={{
    width: "100%",
  }}
>
  <Heading type="h1" id="my-work-id">
    My work
  </Heading>
  <Divider />
  <Flex
    align="center"
    gap="small"
    aria-labelledby="my-work-id"
    style={{
      marginTop: "var(--space-16)",
    }}
  >
    <Box
      style={{
        width: "146px",
      }}
    >
      <Search placeholder="Search" />
    </Box>
    <Checkbox label="Hide done items" checked />
    <Button leftIcon={Custom} kind="tertiary">
      Customize
    </Button>
  </Flex>
</div>
Copy
Format
Reset
Related components
Hello world
EditableHeading
An extension of Heading component, it allows built in editing capabilities.
lorem ipsum dolor sit amet
Text
The text component serves as a wrapper for applying typography styles to the text it contains.
