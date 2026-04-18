---
id: components-dialogcontentcontainer--docs
type: docs
title: "Components/DialogContentContainer"
name: "Docs"
importPath: "./src/pages/components/Dialog/DialogContentContainer.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-dialogcontentcontainer--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:36:45.275Z
---

DialogContentContainer

This component is a style component, it provide the look and feel of elevation.

Show code
Import
import { DialogContentContainer } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-describedby	
The ID of the element that describes this dialog.
string
	-	Set string
aria-labelledby	
The ID of the element that labels this dialog.
string
	-	Set string
children	
The content inside the dialog container.
ReactNode
	-	-
className	
A CSS class name to apply to the component.
string
	
""
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
role	

The ARIA role applied to the dialog container. Defaults to "dialog" when not provided. Pass null to remove the role attribute entirely.

string
	-	Set string
size	
The size of the dialog.
DialogSize
	
small
	Set object
style	
Custom styles applied to the dialog container.
CSSProperties
	-	Set object
type	
The type of dialog.
DialogType
	
popover
	Set object
Usage
Use this component in order to wrap components within Dialog or Modal
Variants
Popover
Story Editor
<DialogContentContainer type="popover">
  <Box margin="medium" padding="medium" />
</DialogContentContainer>
Copy
Format
Reset
Modal
Story Editor
<DialogContentContainer type="modal">
  <Box margin="medium" padding="medium" />
</DialogContentContainer>
Copy
Format
Reset
