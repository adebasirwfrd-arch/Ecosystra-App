---
id: layout-box--docs
type: docs
title: "Layout/Box"
name: "Docs"
importPath: "./src/pages/components/Box/Box.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=layout-box--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:49:01.623Z
---

Box

Box component is used as a wrapper component.

Its purpose is to help scaffold compositions while using Vibe's prop keys without writing new CSS.
It can be used as a container for atom based compositions, it can accept all Vibe style related props and have a semantic html tag.

Box composite component
Show code
Import
import { Box } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

backgroundColor	
The background color of the box.
BackgroundColor
	-	Set object
border	
If true, applies a border to the box.
boolean
	-	Set boolean
borderColor	
The color of the border.
BorderColor
	-	Set object
children	
The content inside the box.
ElementContent
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the box is disabled.
boolean
	-	Set boolean
elementType	
The HTML element or custom component used as the root.
string
	
"div"
	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
margin	
The margin applied to all sides.
BoxSize
	-	Set object
marginBottom	
The bottom margin.
BaseBoxSize
	-	Set object
marginEnd	
The end (right in LTR, left in RTL) margin.
BoxSize
	-	Set object
marginStart	
The start (left in LTR, right in RTL) margin.
BaseBoxSize
	-	Set object
marginTop	
The top margin.
BoxSize
	-	Set object
marginX	
The horizontal margin.
BoxSize
	-	Set object
marginY	
The vertical margin.
BoxSize
	-	Set object
padding	
The padding applied to all sides.
BaseBoxSize
	-	Set object
paddingBottom	
The bottom padding.
BaseBoxSize
	-	Set object
paddingEnd	
The end (right in LTR, left in RTL) padding.
BaseBoxSize
	-	Set object
paddingStart	
The start (left in LTR, right in RTL) padding.
BaseBoxSize
	-	Set object
paddingTop	
The top padding.
BaseBoxSize
	-	Set object
paddingX	
The horizontal padding.
BaseBoxSize
	-	Set object
paddingY	
The vertical padding.
BaseBoxSize
	-	Set object
rounded	
The border radius of the box.
RoundedSize
	-	Set object
scrollable	
If true, the box content is scrollable.
boolean
	-	Set boolean
shadow	
The shadow style applied to the box.
Shadow
	-	Set object
style	
Inline styles applied to the box.
CSSProperties
	-	Set object
textColor	
The text color inside the box.
BoxTextColor
	-	Set object
Usage
Use as a styled container
Use to add spacing, borders, and rounded corners to areas of content
Use as an inner component for spacing or styles
🤓
Benefits of the Box component
Easily add Vibe styles without adding css
Utility props
BACKGROUNDS COLORS
primaryBackgroundColor
secondaryBackgroundColor
greyBackgroundColor
allgreyBackgroundColor
invertedColorBackground
Story Editor
<>
  <Box
    backgroundColor="primaryBackgroundColor"
    padding="large"
    marginBottom="medium"
  >
    primaryBackgroundColor
  </Box>
  <Box
    backgroundColor="secondaryBackgroundColor"
    padding="large"
    marginBottom="medium"
  >
    secondaryBackgroundColor
  </Box>
  <Box
    backgroundColor="greyBackgroundColor"
    padding="large"
    marginBottom="medium"
  >
    greyBackgroundColor
  </Box>
  <Box
    backgroundColor="allgreyBackgroundColor"
    padding="large"
    marginBottom="medium"
  >
    allgreyBackgroundColor
  </Box>
  <Box
    textColor="textColorOnInverted"
    backgroundColor="invertedColorBackground"
    padding="large"
    marginBottom="medium"
  >
    invertedColorBackground
Copy
Format
Reset
TEXT COLORS
textPrimaryTextColor
textColorOnInverted
secondaryTextColor
Story Editor
<>
  <Box textColor="primaryTextColor" padding="large" marginBottom="medium">
    textPrimaryTextColor
  </Box>
  <Box
    backgroundColor="invertedColorBackground"
    textColor="textColorOnInverted"
    padding="large"
    marginBottom="medium"
  >
    textColorOnInverted
  </Box>
  <Box textColor="secondaryTextColor" padding="large" marginBottom="medium">
    secondaryTextColor
  </Box>
</>
Copy
Format
Reset
BORDER
default
Story Editor
<>
  <Box border padding="large" marginBottom="medium">
    default
  </Box>
</>
Copy
Format
Reset
BORDER COLOR
uiBorderColor
layoutBorderColor
Story Editor
<>
  <Box border borderColor="uiBorderColor" padding="large" marginBottom="medium">
    uiBorderColor
  </Box>
  <Box
    border
    borderColor="layoutBorderColor"
    padding="large"
    marginBottom="medium"
  >
    layoutBorderColor
  </Box>
</>
Copy
Format
Reset
ROUNDED CORNERS
Size props
small
medium
big
Story Editor
<>
  <Box border rounded="small" padding="large" marginBottom="medium">
    small
  </Box>
  <Box border rounded="medium" padding="large" marginBottom="medium">
    medium
  </Box>
  <Box border rounded="big" padding="large" marginBottom="medium">
    big
  </Box>
</>
Copy
Format
Reset
SHADOW
xs
small
medium
large
Story Editor
<>
  <Box shadow="xs" padding="large" marginBottom="medium">
    xs
  </Box>
  <Box shadow="small" padding="large" marginBottom="medium">
    small
  </Box>
  <Box shadow="medium" padding="large" marginBottom="medium">
    medium
  </Box>
  <Box shadow="large" padding="large" marginBottom="medium">
    large
  </Box>
</>
Copy
Format
Reset
MARGIN
Size props
xs
small
medium
large
xl
xxl
xxxl
Story Editor
<>
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="xs">
      xs
    </Box>
  </Box>
  <Divider withoutMargin />
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="small">
      small
    </Box>
  </Box>
  <Divider withoutMargin />
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="medium">
      medium
    </Box>
  </Box>
  <Divider withoutMargin />
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="large">
      large
    </Box>
  </Box>
  <Divider withoutMargin />
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="xl">
      xl
    </Box>
  </Box>
  <Divider withoutMargin />
  <Box backgroundColor="allgreyBackgroundColor">
    <Box backgroundColor="primaryBackgroundColor" border margin="xxl">
      xxl
    </Box>
  </Box>
Copy
Format
Reset
Property variations per each size:
margin
marginX (x axis: left, right)
marginY (y axis: top, bottom)
marginTop
marginEnd
marginBottom
marginStart
Copy
Aligning Auto and none

each property variation can hold additional values for:

AUTO
NONE
Copy
PADDING
Size props
xs
small
medium
large
xl
xxl
xxxl
Story Editor
<>
  <Box
    style={{
      backgroundColor: "var(--color-sky-selected)",
    }}
    marginBottom="medium"
    border
    padding="xs"
  >
    <Box backgroundColor="primaryBackgroundColor">xs</Box>
  </Box>
  <Box
    style={{
      backgroundColor: "var(--color-sky-selected)",
    }}
    marginBottom="medium"
    border
    padding="small"
  >
    <Box backgroundColor="primaryBackgroundColor">small</Box>
  </Box>
  <Box
    style={{
      backgroundColor: "var(--color-sky-selected)",
    }}
    marginBottom="medium"
    border
    padding="medium"
  >
    <Box backgroundColor="primaryBackgroundColor">medium</Box>
  </Box>
  <Box
    style={{
      backgroundColor: "var(--color-sky-selected)",
    }}
    marginBottom="medium"
Copy
Format
Reset
Property variations per each size:
padding
paddingX (x axis: left, right)
paddingY (y axis: top, bottom)
paddingTop
paddingEnd
paddingBottom
paddingStart
Copy
Component Disabled
disabled
Story Editor
<Box
  backgroundColor="allgreyBackgroundColor"
  border
  disabled
  padding="large"
  marginBottom="medium"
>
  disabled
</Box>
Copy
Format
Reset
Related components
Flex
Position group of sub-elements in one dimension, horizontal or vertical
My Item
My Item
Divider
Divider create separation between two UI elements
A content section within an elevated dialog content container
DialogContentContainer
An Elevation container, use to elevate content section
