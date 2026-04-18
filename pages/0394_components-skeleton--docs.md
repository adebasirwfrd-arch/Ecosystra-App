---
id: components-skeleton--docs
type: docs
title: "Components/Skeleton"
name: "Docs"
importPath: "./src/pages/components/Skeleton/Skeleton.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-skeleton--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:45:51.301Z
---

Skeleton

Skeleton loading component used to indicate content and ui loading that will appear after its loaded. It helps to decrease perceived duration time

Show code
Import
import { Skeleton } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
fullWidth	
If true, the skeleton will take up the full width of its container.
boolean
	
false
	Set boolean
height	
The height of the skeleton in pixels.
number
	-	Set number
id	
An HTML id attribute for the component.
string
	-	Set string
size	
The predefined size of the skeleton.
SkeletonSizeType
	
custom
	

type	
The type of skeleton.
SkeletonType
	
rectangle
	

width	
The width of the skeleton in pixels.
number
	-	Set number
wrapperClassName	
Class name applied to the wrapper element.
string
	-	Set string
Usage
Mimic the user interface that is going to be loaded as much as possible
Animation on the skeleton is a repeating color pulse should move from left to right to indicate the lading state
🤓
Tip
Using loader after the pages are fully loaded consider using the 
loader component.
Variants
Shapes

Use shapes to mimic Avatars, images, buttons etc...

Circle
Square
Rectangle
Story Editor
<Flex align="end" gap="large">
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton id="shapes-circle" type="circle" />
    <Text type="text1">Circle</Text>
  </Flex>
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton id="shapes-square" />
    <Text type="text1">Square</Text>
  </Flex>
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton id="shapes-rectangle" width={112} height={46} />
    <Text type="text1">Rectangle</Text>
  </Flex>
</Flex>
Copy
Format
Reset
Text

Presents a classic menu or equivalent picker

H1
H2
Paragraph
Story Editor
<Flex align="end" gap="large">
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton type="text" size="h1" />
    <Text type="text1">H1</Text>
  </Flex>
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton type="text" size="h2" />
    <Text type="text1">H2</Text>
  </Flex>
  <Flex direction="column" align="stretch" gap="large">
    <Skeleton type="text" size="small" />
    <Text type="text1">Paragraph</Text>
  </Flex>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Do
Show only representation of ui.
Small text
Small text
Small text
Don't
Show all the user interface exactly.
Use cases and examples
Complex Example
Story Editor
() => {
  return (
    <Flex align="stretch" direction="column" gap="small">
      <Flex gap="small">
        <Skeleton type="circle" />
        <Skeleton type="text" width={110} size="small" />
      </Flex>
      <Flex align="stretch" gap="medium">
        <Skeleton />
        <Flex align="stretch" direction="column" gap="small">
          <Skeleton type="text" size="h1" />
          <Skeleton type="text" size="h4" />
          <Skeleton type="text" size="h4" />
          <Skeleton type="text" size="h4" />
          <Skeleton type="text" size="h4" width={82} />
        </Flex>
      </Flex>
    </Flex>
  );
}
Copy
Format
Reset
Update in the system

Use this menu to allow a user to either select one or more items from the list.

Load update
Story Editor
() => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showReload, setShowReload] = useState(true);
  const onClickCallback = useCallback(() => {
    setShowReload(false);
    setShowBlock(false);
    setShowSkeleton(true);
    setTimeout(() => {
      setShowSkeleton(false);
    }, 4000);
    setTimeout(() => {
      setShowBlock(true);
    }, 4000);
  }, []);
  return (
    <Flex direction="column" gap="large" flex="1">
      {showBlock && (
        <Box border>
          <Flex
            direction="column"
            align="start"
            gap="medium"
            style={{
              width: "730px",
              padding: "16px",
            }}
          >
            <Flex gap="small">
              <Avatar src={person} type="img" />
              <Text weight="bold">Julia Martinez</Text>
            </Flex>
            <Text type="text1" element="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
Copy
Format
Reset
Related components
ProgressBar
Progress bars show continuous progress through a process, such as a percentage value.
5
Counter
Show the count of some adjacent data.
Spinner
Displays information related to an element over it.
