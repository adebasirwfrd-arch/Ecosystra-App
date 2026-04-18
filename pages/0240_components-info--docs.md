---
id: components-info--docs
type: docs
title: "Components/Info"
name: "Docs"
importPath: "./src/pages/components/Info/Info.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-info--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:39:08.570Z
---

Info

An info component is a contextual container that provides supplemental information to help users understand related content

Import path
import { Info } from "@vibe/core";
Copy
Overview
Show code
Props
Name	Description	Default	
Control

aria-label	
The ARIA label for the info button.
string
	-	

aria-labelledby	
The ID of the element that labels the info button.
string
	-	Set string
body*	
The main body text content displayed in the info dialog.
string
	-	

className	
A CSS class name to apply to the component.
string
	-	Set string
containerSelector	
The CSS selector of the container where the dialog is rendered.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dialogClassName	
Class name applied to the dialog content.
string
	-	Set string
disabled	
If true, the info dialog is disabled.
boolean
	
false
	Set boolean
hideButtonTooltip	
If true, the tooltip for the info button is hidden.
boolean
	-	Set boolean
id	
An HTML id attribute for the component.
string
	-	

link	
Link configuration for the info dialog.
LinkProps
	-	
RAW
link : {
text : "Learn more about content"
href : "#"
}

onDialogHide	
Callback fired when the info dialog is hidden.
() => void
	-	-
onDialogShow	
Callback fired when the info dialog is shown.
() => void
	-	-
position	
The placement of the dialog relative to the info button.
DialogPosition
	
bottom-start
	Set object
title	
The title text displayed at the top of the info dialog.
string
	-	
Usage
Use to provide supplemental or explanatory context that supports, but is not essential to, task completion.
Keep content informational, not instructional - avoid critical actions or blocking messages.
Prefer when tooltips are too limited or the explanation requires paragraph-like text.
Keep the message concise and scannable, linking out if more detail is needed.
Accessibility
Provide an id for the Info component to enable proper accessibility associations and unique identification.
You should provide an accessible name using the aria-label prop to describe the purpose of the info button (e.g., "More information about this feature").
Use aria-labelledby prop when an external element provides the accessible name for the info button. Pass the id of that external element (instead of using aria-label).
The component automatically manages aria-controls, aria-haspopup="dialog", and aria-expanded attributes to indicate the relationship with the dialog and its current state.
Focus management is handled automatically - when the dialog opens, focus moves to the content, and when closed with Escape, focus returns to the info button.
Variants
Directions

Info component dialog can appear from top, bottom, left or right.

Bottom
Left
Right
Top
Story Editor
<Flex
  justify="center"
  align="center"
  style={{
    minHeight: "400px",
    width: "100%",
  }}
>
  <Box
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridTemplateRows: "1fr 1fr",
      gap: "var(--space-48)",
      alignItems: "center",
      justifyItems: "center",
    }}
  >
    <Flex direction="column" gap="medium" align="center">
      <Text
        id="bottom-direction"
        align="center"
        type="text1"
        weight="medium"
        ellipsis={false}
      >
        Bottom
      </Text>
      <Info
        id="bottom-direction-info-button"
        aria-labelledby="bottom-direction"
        title="Placement: Bottom"
        body="This dialog's direction is from the bottom"
        link={{
          text: "Learn more about dialog direction",
          href: "#",
Copy
Format
Reset
Do's and Don'ts
Do
Place Info component in location with context
Don't
Place it in an location without context
Do
Use when the supporting text is longer than a few words and requires more context
Don't
Use when the supporting text is brief and can be explained in just a few words. Use a tooltip instead.
Use cases and examples
In board header

Used for header description

In board column

Used for column description

Related Components
Alert banner message
AlertBanner
Noticed high-signal messages, such as system alerts.
Tooltip
Displays information related to an element over it.
Tipseen
Displays information related to an element over it.
