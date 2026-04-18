---
id: text-text--docs
type: docs
title: "Text/Text"
name: "Docs"
importPath: "./src/pages/components/Text/Text.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=text-text--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:49:56.670Z
---

Text

The text component serves as a wrapper for applying typography styles to the text it contains.

Hi, I'm a text!
Show code
Import
import { Text } from "@vibe/core";
Copy
🤓
Tip
Check out our 
Heading
 component for text headlines.
Props
Name	Description	Default	
Control

align	
The text alignment.
TypographyAlign
	-	Set object
children*	
The content inside the text component.
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
	
"div"
	Set string
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
The text style variant.
TextType
	
text2
	Set object
weight	
The font weight of the text.
TextWeight
	
normal
	Set object
withoutTooltip	
If true, disables the tooltip that appears when text is truncated.
boolean
	-	Set boolean
Usage
Use it to display text formed from a single sentence, or multiple sentences.
Use Text3 for short caption text, label or as explanation text in menus. In any other case, use Text1 or Text 2.
Variants
Sizes and weights

Text component comes in three sizes: text1 (16px), text2 (14px), text3 (12px) , and in three weights: bold (700), medium (600) and normal (400)

This is text1 bold
This is text1 medium
This is text1 normal
This is text2 bold
This is text2 medium
This is text2 normal
This is text3 medium
This is text3 normal
Story Editor
<Flex gap="large" direction="column" justify="start" align="start">
  <Flex gap="small" direction="column" justify="start" align="start">
    <Text type="text1" weight="bold">
      This is text1 bold
    </Text>
    <Text type="text1" weight="medium">
      This is text1 medium
    </Text>
    <Text type="text1" weight="normal">
      This is text1 normal
    </Text>
  </Flex>


  <Flex gap="small" direction="column" justify="start" align="start">
    <Text type="text2" weight="bold">
      This is text2 bold
    </Text>
    <Text type="text2" weight="medium">
      This is text2 medium
    </Text>
    <Text type="text2" weight="normal">
      This is text2 normal
    </Text>
  </Flex>
  <Flex gap="small" direction="column" justify="start" align="start">
    <Text type="text3" weight="medium">
      This is text3 medium
    </Text>
    <Text type="text3" weight="normal">
      This is text3 normal
    </Text>
  </Flex>
</Flex>
Copy
Format
Reset
Colors

Text component comes in four colors: primary, secondary, on-primary and on-inverted

Primary text
Secondary text
On primary text
On inverted text
Fixed light
Fixed dark
Story Editor
<Flex direction="column" align="start" gap="small">
  <Text color="primary">Primary text</Text>
  <Text color="secondary">Secondary text</Text>
  <Box
    style={{
      backgroundColor: "var(--primary-color)",
      width: "150px",
    }}
    padding="small"
  >
    <Text align="center" color="onPrimary">
      On primary text
    </Text>
  </Box>
  <Box
    style={{
      width: "150px",
    }}
    backgroundColor="invertedColorBackground"
    padding="small"
  >
    <Text align="center" color="onInverted">
      On inverted text
    </Text>
  </Box>
  <Box
    style={{
      width: "150px",
      backgroundColor: "black",
    }}
    padding="small"
  >
    <Text align="center" color="fixedLight">
      Fixed light
    </Text>
  </Box>
Copy
Format
Reset
Overflow

Our Text component supports overflow state. When the text is longer than its container and the ellipsis flag is on, the end of the text will be truncated and will display "..."

We support two kinds of ellipsis: single-line ellipsis with a tooltip displayed in hover or ellipsis after multiple lines. You can see examples for both use cases below.

Text with 1 line
This is an example of text with overflow and a Tooltip to help or provide information about specific components when a user hovers over them.
Text with 2 lines
This is an example of text with ellipsis which displayed after two full lines of content this is an example of text with ellipsis which displayed after two full lines of content
Text with array of elements
This is an example of array of texts and 
Other elements
 that are overflowing and create a tooltip with the correct information
Story Editor
<Flex
  direction="column"
  id={OVERFLOW_TEXT_CONTAINER_ID}
  justify="start"
  align="initial"
  gap="small"
  style={{
    width: "480px",
  }}
>
  <Heading type="h3">Text with 1 line</Heading>
  <Text
    data-testid={ONE_LINE_ELLIPSIS_TEST_ID}
    /**for testing purposes**/ tooltipProps={{
      containerSelector: `#${OVERFLOW_TEXT_CONTAINER_ID}`,
    }}
  >
    This is an example of text with overflow and a Tooltip to help or provide
    information about specific components when a user hovers over them.
  </Text>
  <Heading type="h3">Text with 2 lines</Heading>
  <Text maxLines={2}>
    This is an example of text with ellipsis which displayed after two full
    lines of content this is an example of text with ellipsis which displayed
    after two full lines of content
  </Text>
  <Heading type="h3">Text with array of elements</Heading>
  <Text maxLines={1}>
    {[
      "This is an example of array of texts and ",
      <Link
        text="Other elements"
        href="https://www.monday.com"
        inheritFontSize
        inlineText
      />,
Copy
Format
Reset
🤓
Tip
Ellipsis prop is true by default. If you wish to turn off ellipsis you can change the prop to false.
Paragraph

To use the Text component for a paragraph, utilize the element prop with value of "p". This changes the text wrapper element to p, enabling the creation of paragraph-style text without ellipsis by default. The paragraph will receive default top and bottom margins based on browser settings for p elements. Customize ellipsis behavior using the "ellipsis" prop or override default margins with a custom class name.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Story Editor
<Flex direction="column">
  <Text element="p">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Text>
  <Text element="p" ellipsis maxLines={3}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Text>
</Flex>
Copy
Format
Reset
Links

A Text component with a link skin can be used to create a link within running text that redirects to an external webpage, as demonstrated in the following example.

This is the story of a 
link
 inside running text.
This is the story of a 
link
 inside running text on a primary color
This is the story of a 
link
 inside running text on an inverted color
This is the story of a 
link
 inside running text with fixed light color
This is the story of a 
link
 inside running text with fixed dark color
Story Editor
<Flex direction="column" align="start" gap="small">
  <Text align="center">
    This is the story of a{" "}
    <StorybookLink page="Foundations/Typography" size="small">
      link
    </StorybookLink>{" "}
    inside running text.
  </Text>
  <Box
    style={{
      backgroundColor: "var(--primary-color)",
      width: "420px",
    }}
    padding="small"
  >
    <Text align="center" color="onPrimary">
      This is the story of a{" "}
      <StorybookLink page="Foundations/Typography" size="small">
        link
      </StorybookLink>{" "}
      inside running text on a primary color
    </Text>
  </Box>
  <Box
    style={{
      width: "420px",
    }}
    backgroundColor="invertedColorBackground"
    padding="small"
  >
    <Text align="center" color="onInverted">
      This is the story of a{" "}
      <StorybookLink page="Foundations/Typography" size="small">
        link
      </StorybookLink>{" "}
      inside running text on an inverted color
Copy
Format
Reset
🤓
Tip
If you need to place a link outside of the textual flow, please use our 
Link
 component.
Do’s and Don’ts
The quick brown fox jumps over the lazy dog
Do
You can combine two font weights in one sentence to create an emphasis.
The quick brown fox jumps over the lazy dog
Don't
Don't use more then one font size in a sentence.
monday CRM lets you control your entire sales funnel and close more deals, faster. Automate manual work and streamline sales activities from start to finish. Explore monday sales CRM templates
Read more
Do
If ellipses are used in a paragraph, always use a CTA to reveal more information.
monday CRM lets you control your entire sales funnel and close more deals, faster. Automate manual work and streamline sales activities from start to finish. Explore monday sales CRM templates
Don't
Don't use ellipsis without providing a way for the user to read the full text.
Section title in text3
Short info explanation about the feature will come here.
Do
Use text3 for section titles, short captions, and labels.
monday CRM lets you control your entire sales funnel and close more deals, faster. Automate manual work and streamline sales activities from start to finish. Explore monday sales CRM templates
Don't
Don't use text3 as body text.
Section title in text3
Short info explanation about the feature will come here.
Do
Use only normal and medium weights for text3.
monday CRM lets you control your entire sales funnel and close more deals, faster. Automate manual work and streamline sales activities from start to finish. Explore monday sales CRM templates
Don't
Don't use bold weight for text3, to ensure optimal readability.
Related components
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
Hello world
EditableHeading
An extension of Heading component, it allows built in editing capabilities.
Read more
Link
Actionable text component with connection to another web pages.
