---
id: components-dialog--docs
type: docs
title: "Components/Dialog"
name: "Docs"
importPath: "./src/pages/components/Dialog/Dialog.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-dialog--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:36:29.626Z
---

Dialog

The dialog component's purpose is to position a popup component nearby another element, such as any kind of a button. Please be aware that the dialog component is not responsible for the appearance features of the popup, such as its background color or size.

Show code
🤓
Tip
For setting the dialog UI appearance, use 
DialogContentContainer
 component.
Import
import { Dialog } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

addKeyboardHideShowTriggersByDefault	
If true, keyboard focus/blur events behave like mouse enter/leave.
boolean
	
true
	Set boolean
animationType	
The animation type used for the dialog.
DialogAnimationType
	
expand
	Set object
children	
The reference element(s) that the dialog is positioned relative to.
string | ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
containerSelector	
CSS selector of the container where the dialog is portaled.
string
	-	Set string
content	
The content displayed inside the dialog. Can be a render function.
Element | (() => Element)
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disable	
If true, disables opening the dialog.
boolean
	
false
	Set boolean
disableContainerScroll	
If true or a selector string, disables scrolling in the container when open.
string
boolean
	-	Set object
enableNestedDialogLayer	

If true, provides a LayerProvider context for nested dialogs to render correctly. This is useful when you have components that use Dialog internally (like Dropdown) inside another Dialog, ensuring proper z-index stacking and click-outside behavior.

boolean
	
true
	Set boolean
getDynamicShowDelay	
Callback to dynamically adjust show delay and animation behavior.
() => { showDelay: number; preventAnimation: boolean; }
	-	-
hideDelay	
Delay in milliseconds before hiding the dialog.
number
	
100
	Set number
hideTrigger	
Events that trigger hiding the dialog.
click
clickoutside
esckey
tab
mouseenter
mouseleave
enter
mousedown
Show 4 more...
	
mouseleave
	
click
clickoutside
esckey
tab
mouseenter
mouseleave
enter
mousedown
focus
blur
onContentClick
contextmenu

hideTriggerIgnoreClass	
CSS class names that, when present on target, prevent hiding the dialog.
string | string[]
	-	Set object
hideWhenReferenceHidden	
If true, hides the dialog when the reference element scrolls out of view.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
instantShowAndHide	
If true, shows and hides the dialog without delay.
boolean
	
false
	Set boolean
isOpen	
Controlled open state for derived state pattern.
boolean
	-	Set boolean
middleware	

Custom Floating UI middleware for positioning logic. If you provide offset, flip, or shift middleware, the defaults will be skipped. Other middleware (like size, inline, autoPlacement) are added to the chain.

{ options?: any; name: string; fn: (state: { x: number; y: number; initialPlacement: Placement; placement: Placement; strategy: Strategy; middlewareData: MiddlewareData; rects: ElementRects; platform: { ...; } & Platform; elements: Elements; }) => Promisable<...>; }[]
	-	Set object
moveBy	

Offset values for positioning adjustments. main - distance from reference element secondary - cross-axis offset (skidding)

{ main?: number; secondary?: number; }
	{ main: 0, secondary: 0 }	Set object
observeContentResize	
If true, automatically updates position when content resizes.
boolean
	
false
	Set boolean
onBlur	
Event handler for blur events on the reference element.
(e: FocusEvent<Element, Element>) => void
	-	-
onClick	
Event handler for click events on the reference element.
(e: MouseEvent<Element, MouseEvent>) => void
	-	-
onClickOutside	
Callback fired when clicking outside the dialog.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onContentClick	
Callback fired when clicking inside the dialog content.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onContextMenu	
Event handler for contextmenu events on the reference element.
(e: MouseEvent<Element, MouseEvent>) => void
	-	-
onDialogDidHide	
Callback fired when the dialog is hidden.
(event: DialogEvent, eventName: string) => void
	-	-
onDialogDidShow	
Callback fired when the dialog is shown.
(event?: DialogEvent, eventName?: string) => void
	-	-
onFocus	
Event handler for focus events on the reference element.
(e: FocusEvent<Element, Element>) => void
	-	-
onKeyDown	
Event handler for keydown events on the reference element.
(e: KeyboardEvent<Element>) => void
	-	-
onMouseDown	
Event handler for mousedown events on the reference element.
(e: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseEnter	
Event handler for mouseenter events on the reference element.
(e: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseLeave	
Event handler for mouseleave events on the reference element.
(e: MouseEvent<Element, MouseEvent>) => void
	-	-
open	
Controls the open state of the dialog (controlled mode).
boolean
	
false
	Set boolean
position	
The placement of the dialog relative to the reference element.
DialogPosition
	
top
	Set object
preventAnimationOnMount	
If true, prevents animation when mounting.
boolean
	
false
	Set boolean
referenceWrapperClassName	
Class name applied to the reference wrapper element.
string
	-	Set string
referenceWrapperElement	
The wrapper element type to use for React components. Defaults to "span".
"div"
"span"
	-	
div
span

shouldCallbackOnMount	
If true, fires onDialogDidShow callback on mount.
boolean
	
false
	Set boolean
shouldShowOnMount	
If true, shows the dialog when the component mounts.
boolean
	
false
	Set boolean
showDelay	
Delay in milliseconds before showing the dialog.
number
	
100
	Set number
showOnDialogEnter	
If true, keeps the dialog open when mouse enters it.
boolean
	
false
	Set boolean
showTrigger	
Events that trigger showing the dialog.
click
clickoutside
esckey
tab
mouseenter
mouseleave
enter
mousedown
Show 4 more...
	
mouseenter
	
click
clickoutside
esckey
tab
mouseenter
mouseleave
enter
mousedown
focus
blur
onContentClick
contextmenu

showTriggerIgnoreClass	
CSS class names that, when present on target, prevent showing the dialog.
string | string[]
	-	Set object
startingEdge	
The starting edge of the dialog animation.
DialogStartingEdge
	-	Set object
tooltip	
If true, renders with tooltip arrow styling.
boolean
	
false
	Set boolean
tooltipClassName	
Class name applied to the tooltip arrow element.
string
	-	Set string
useDerivedStateFromProps	
If true, uses derived state from props pattern.
boolean
	
false
	Set boolean
wrapperClassName	
Class name applied to the dialog content wrapper.
string
	-	Set string
zIndex	
The z-index applied to the dialog.
number
	-	Set number
🤓
Dev tip
You can use 
Floating UI middleware
 for extended Dialog customization.
Usage
Dialog can appear from top, bottom, left and right to an element
Usually, the dialog will be positioned next to the triggered element.
The Dialog component is mainly used to create customized menus that cannot be developed using the 
Menu
 and 
MenuButton
 components.
Trying to implement your own customize menu?

Please be sure that what you try implement cannot be achieved by using already implemented simpler components - such as our Menu component, because creating an over-complicated UI can hurt user experience.

Menu component


🤓
Wishing to position your popover in the center of the page?
Exactly for this purpose, we created the 
Modal
 component! Check it out.
Variants
Positions
Top
Bottom
Right
Left
Story Editor
// for prevent dialog to move while scrolling
() => {
  // For maintain active state of each button according to the dialog open state (this hooks is available for your usage)
  const { isChecked: checkedTop, onChange: onChangeTop } = useSwitch({
    defaultChecked: false,
  });
  const { isChecked: checkedBottom, onChange: onChangeBottom } = useSwitch({
    defaultChecked: false,
  });
  const { isChecked: checkedRight, onChange: onChangeRight } = useSwitch({
    defaultChecked: false,
  });
  const { isChecked: checkedLeft, onChange: onChangeLeft } = useSwitch({
    defaultChecked: false,
  });
  return (
    <Flex
      style={{
        padding: "80px var(--sb-spacing-small)",
      }}
      gap="medium"
    >
      <Dialog
        id="positions-top-dialog"
        aria-label="Top positioned dialog"
        middleware={preventMainAxisShift}
        open={checkedTop}
        position="top"
        showTrigger={[]}
        hideTrigger={[]}
        content={
          <DialogContentContainer>
            <Flex
              direction="column"
              align="start"
              gap="small"
Copy
Format
Reset
Dialog show triggers

We can choose what will be the related element's trigger which will be responsible for the dialog appearance

On click
On mouse enter
On focus
On mount
Story Editor
() => {
  const { isChecked: clickButtonActive, onChange: onClickClickButton } =
    useSwitch({
      defaultChecked: false,
    });
  const { isChecked: hoverButtonActive, onChange: onHoverButton } = useSwitch({
    defaultChecked: false,
  });
  const { isChecked: focusButtonActive, onChange: onFocusButton } = useSwitch({
    defaultChecked: false,
  });
  return (
    <Flex
      style={{
        padding: "80px var(--sb-spacing-small)",
      }}
      gap="medium"
    >
      <Dialog
        middleware={preventMainAxisShift}
        showTrigger={["click"]}
        hideTrigger={["click"]}
        content={
          <DialogContentContainer>
            <Flex
              direction="column"
              align="start"
              gap="small"
              style={{
                width: "150px",
                padding: "var(--sb-spacing-small)",
              }}
            >
              <Skeleton type="text" size="h1" fullWidth />
              {Array.from(
                {
Copy
Format
Reset
Dialog hide triggers

We can set the triggers which will be responsible for hide the dialog

On click outside
On click
On blur
On content click
On mouse leave
On right click
Story Editor
() => {
  // For maintain active state of each button according to the dialog open state (this hooks is available for your usage)
  const { isChecked: clickButtonActive, onChange: switchClickButtonActive } =
    useSwitch({
      defaultChecked: true,
    });
  const {
    isChecked: clickOutsideButtonActive,
    onChange: switchClickOutsideActive,
  } = useSwitch({
    defaultChecked: true,
  });
  const {
    isChecked: mouseLeaveButtonActive,
    onChange: switchMouseLeaveActive,
  } = useSwitch({
    defaultChecked: true,
  });
  const { isChecked: blurButtonActive, onChange: switchBlurButtonActive } =
    useSwitch({
      defaultChecked: true,
    });
  const {
    isChecked: contentClickButtonActive,
    onChange: switchContentClickActive,
  } = useSwitch({
    defaultChecked: true,
  });
  const {
    isChecked: contextMenuButtonActive,
    onChange: switchContextMenuActive,
  } = useSwitch({
    defaultChecked: true,
  });
  return (
    <Flex
Copy
Format
Reset
Controlled Dialog

Manage the open and close state of the dialog. Note that isOpen is used and showTrigger is set to [] to disable the default triggers.

Click me to toggle the Dialog
Story Editor
() => {
  const { isChecked: isOpen, onChange: setIsOpen } = useSwitch({
    defaultChecked: false,
  });
  return (
    <Dialog
      //disable default triggers
      showTrigger={[]}
      // manage the opening state in the app level
      open={isOpen}
      content={
        <DialogContentContainer>
          <DialogContentContainer>
            <Button
              kind="secondary"
              // @ts-ignore
              onClick={() => setIsOpen(false)}
            >
              This will close as well
            </Button>
          </DialogContentContainer>
        </DialogContentContainer>
      }
    >
      <Button
        // @ts-ignore
        onClick={() => setIsOpen(!isOpen)}
      >
        Click me to toggle the Dialog
      </Button>
    </Dialog>
  );
}
Copy
Format
Reset
Dialog with tooltip

Dialog has a tooltip prop which adds an arrow pointing toward the center of the reference element.

Story Editor
() => {
  return (
    <div
      style={{
        padding: "80px var(--sb-spacing-small)",
      }}
    >
      <Dialog
        tooltip
        middleware={preventMainAxisShift}
        shouldShowOnMount
        showTrigger={["click"]}
        hideTrigger={["click"]}
        position="right"
        content={
          <DialogContentContainer>
            <Flex
              direction="column"
              align="start"
              gap="small"
              style={{
                width: "150px",
                padding: "var(--sb-spacing-small)",
              }}
            >
              <Skeleton type="text" size="h1" fullWidth />
              {Array.from(
                {
                  length: 3,
                },
                (_value, index: number) => (
                  <Flex
                    key={index}
                    gap="small"
                    style={{
                      width: "100%",
Copy
Format
Reset
Dialog prevent container scroll

Prevent containerSelector scroll when dialog open

Click
Story Editor
() => {
  // For maintain active state of each button according to the dialog open state (this hooks is available for your usage)
  const { isChecked: checkedTop, onChange: onChangeTop } = useSwitch({
    defaultChecked: false,
  });
  return (
    <Flex
      style={{
        padding: "80px var(--sb-spacing-small)",
      }}
      gap="medium"
    >
      <div
        className={"scrollable"}
        style={{
          height: "300px",
          width: "400px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: "800px",
          }}
        >
          <Dialog
            open={checkedTop}
            position="left"
            showTrigger={[]}
            hideTrigger={[]}
            containerSelector={".scrollable"}
            disableContainerScroll
            content={
              <DialogContentContainer>
                <Flex
                  direction="column"
Copy
Format
Reset
🤓
Dev tip
If you wish to implement a 
Dropdown
 inside a Dialog container and need help displaying the Dropdowns popovers correctly, read more about our Dropdown in popovers technical pattern 
here
.
Related components
Send
Delete
More info
Menu
Displays information related to an element over it.
Tooltip
Displays information related to an element over it.
A content section within an elevated dialog content container
DialogContentContainer
An Elevation container, use to elevate content section
