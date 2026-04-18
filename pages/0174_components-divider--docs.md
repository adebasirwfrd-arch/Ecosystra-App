---
id: components-divider--docs
type: docs
title: "Components/Divider"
name: "Docs"
importPath: "./src/pages/components/Divider/Divider.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-divider--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:36:52.926Z
---

Divider

Divider create separation between two UI elements

Show code
Import
import { Divider } from "@vibe/core";
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
direction	
The direction of the divider.
DividerDirection
	
horizontal
	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
withoutMargin	
If true, removes margin from the divider.
boolean
	
false
	Set boolean
Variants
Directions
Horizontal
Vertical
Story Editor
<div
  style={{
    display: "flex",
    flexDirection: "column",
    width: "400px",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 40,
    }}
  >
    <span
      style={{
        marginRight: "var(--sb-spacing-large)",
        alignSelf: "center",
      }}
    >
      Horizontal
    </span>
    <Divider direction="horizontal" />
  </div>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 200,
    }}
  >
    <span
      style={{
        marginRight: "var(--sb-spacing-large)",
        alignSelf: "center",
      }}
Copy
Format
Reset
Related components
New
Label
Offers content classification.
Icons
Catalog of publicly avaliable icons.
This is a chip
Chip
Compact elements that represent an input, attribute, or action.
