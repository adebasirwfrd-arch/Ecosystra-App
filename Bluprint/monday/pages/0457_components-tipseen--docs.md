---
id: components-tipseen--docs
type: docs
title: "Components/Tipseen"
name: "Docs"
importPath: "./src/pages/components/Tipseen/Tipseen.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-tipseen--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:47:53.854Z
---

Tipseen

Tipseen is a virtual unboxing experience that helps users get started with the system and discover new features.

Show code
Import
import { Tipseen, TipseenMedia, TipseenContent, TipseenWizard } from "@vibe/core";
Copy
Props
TipseenTipseenMediaTipseenContentTipseenWizard
Name	Description	Default	
Control

animationType	
The animation type used for showing/hiding the Tipseen.
DialogAnimationType
	
expand
	Set object
children	
The child element that triggers the Tipseen.
ReactElement<any, string | JSXElementConstructor<any>>
	-	
RAW
children : {
$$typeof : Symbol(react.element)
type : "div"
key : null
ref : null
props : {...} 1 key
_owner : null
}

className	
A CSS class name to apply to the component.
string
	-	Set string
closeAriaLabel	
The aria-label for the close button.
string
	-	Set string
closeButtonTheme	
The theme of the Tipseen close button.
TipseenCloseButtonTheme
	
light
	Set object
color	
The color theme of the Tipseen.
TipseenColor
	-	Set object
containerSelector	
The CSS selector of the container where the Tipseen should be rendered.
string
	-	Set string
content*	
The content displayed inside the Tipseen.
ElementContent
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
floating	
If true, renders the Tipseen as a floating element without a reference.
boolean
	
false
	Set boolean
hideCloseButton	
If true, hides the close button.
boolean
	-	Set boolean
hideDelay	
The delay in milliseconds before hiding the Tipseen.
number
	
0
	Set number
hideTrigger	
Events that trigger hiding the Tipseen.
DialogTriggerEvent | DialogTriggerEvent[]
	[]	Set object
hideWhenReferenceHidden	
If true, hides the Tipseen when the reference element is hidden.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	

middleware	
Custom Floating UI middleware for positioning logic.
{ options?: any; name: string; fn: (state: { x: number; y: number; initialPlacement: Placement; placement: Placement; strategy: Strategy; middlewareData: MiddlewareData; rects: ElementRects; platform: { ...; } & Platform; elements: Elements; }) => Promisable<...>; }[]
	-	Set object
moveBy	
Offset values for positioning adjustments.
MoveBy
	-	Set object
onClose	
Callback fired when the Tipseen is closed.
(event?: MouseEvent<HTMLButtonElement, MouseEvent>) => void
	-	-
position	
The position of the Tipseen relative to the target element.
TooltipPositions
	
bottom
	

referenceWrapperClassName	
Class name applied to the reference wrapper element.
string
	-	Set string
showDelay	
The delay in milliseconds before showing the Tipseen.
number
	
100
	Set number
showTrigger	
Events that trigger showing the Tipseen.
DialogTriggerEvent | DialogTriggerEvent[]
	[]	Set object
tip	
If false, hides the arrow of the Tipseen.
boolean
	
true
	Set boolean
title	
The title text of the Tipseen.
string
	-	

titleClassName	
Class name applied to the Tipseen title.
string
	-	Set string
tooltipArrowClassName	
Class name applied to the Tipseen arrow.
string
	-	Set string
width	
The width of the Tipseen.
number
	-	Set number
Usage
Use for onboarding screens, new features discovery, or any guidance a user needs.
Use when the user is not yet familiar with the system’s UI or ready to learn about it.
The tip will appear until closed by an X button or call to action button.
🤓
Check yourself
If you need to provide additional information about a component, use the 
Tooltip
 or 
Attention box.
Variants
Colors

Tipseens come in 2 colors: inverted and primary.
The inverted type is the default.
Use the inverted color for feature discovery, or to give the user general guidance.
Use the primary color to bring attention to updates about your product offering.

Story Editor
() => {
  return (
    <Flex direction="column">
      <Tipseen
        id="colors-tipseen-1"
        middleware={storyMiddleware}
        position="right"
        content={
          <TipseenContent id="colors-content-1" title="This is a title">
            Message for the user will appear here, to give more information
            about the feature.
          </TipseenContent>
        }
      >
        <div
          style={{
            height: "180px",
          }}
        />
      </Tipseen>
      <Tipseen
        id="colors-tipseen-2"
        middleware={storyMiddleware}
        position="right"
        color="primary"
        content={
          <TipseenContent id="colors-content-2" title="This is a title">
            Message for the user will appear here, to give more information
            about the feature.
          </TipseenContent>
        }
      >
        <div
          style={{
            height: "180px",
          }}
Copy
Format
Reset
Tipseen with a wizard

Use Tipseen with a wizard when you want to teach something in steps.

Story Editor
() => {
  const content = [
    <div>Popover message №1 will appear here</div>,
    <div>Popover message №2 will appear here</div>,
    <div>Popover message №3 will appear here</div>,
    <div>Popover message №4 will appear here</div>,
    <div>Popover message №5 will appear here</div>,
  ];
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const onChangeActiveStep = useCallback(
    (_e: any, stepIndex: React.SetStateAction<number>) => {
      setActiveStepIndex(stepIndex);
    },
    []
  );
  return (
    <Tipseen
      middleware={storyMiddleware}
      position="right"
      content={
        <TipseenWizard
          title="This is a title"
          steps={content}
          activeStepIndex={activeStepIndex}
          onChangeActiveStep={onChangeActiveStep}
          onFinish={() => {}}
        />
      }
    >
      <div
        style={{
          height: "150px",
        }}
      />
    </Tipseen>
  );
Copy
Format
Reset
Tipseen with image
Story Editor
() => {
  const content = [
    <div>
      Message for the user will appear here, to give more information about the
      feature.
    </div>,
    <div>
      Message for the user will appear here, to give more information about the
      feature.
    </div>,
    <div>
      Message for the user will appear here, to give more information about the
      feature.
    </div>,
    <div>
      Message for the user will appear here, to give more information about the
      feature.
    </div>,
    <div>
      Message for the user will appear here, to give more information about the
      feature.
    </div>,
  ];
  return (
    <Tipseen
      middleware={storyMiddleware}
      position="right"
      closeButtonTheme="light"
      content={
        <>
          <TipseenMedia>
            <img
              src={picture}
              alt=""
              style={{
                objectFit: "cover",
Copy
Format
Reset
Tipseen with custom media

Wrap your custom media with TipseenMedia component. This use case is good for when using Lottie animations or other media that is not necessarily an image.

Story Editor
() => {
  return (
    <Tipseen
      middleware={storyMiddleware}
      position="right"
      closeButtonTheme="dark"
      content={
        <>
          <TipseenMedia>
            <video
              autoPlay
              muted
              loop
              src={video}
              style={{
                width: "100%",
              }}
            />
          </TipseenMedia>
          <TipseenContent title="This is a title">
            Message for the user will appear here, to give more information
            about the feature.
          </TipseenContent>
        </>
      }
    >
      <div
        style={{
          height: "280px",
        }}
      />
    </Tipseen>
  );
}
Copy
Format
Reset
Floating Tipseen

Use Floating Tipseen in case where the guidance is not relevant to a specific UI element, but general. In this case, the Tipseen position will be the right corner of the screen and without an arrow tip.

This is a Floating Tipseen
Message for the user will appear here, to give more information about the feature.
Submit
Story Editor
() => {
  return (
    <Tipseen
      closeButtonTheme="dark"
      floating
      content={
        <>
          <TipseenMedia>
            <img
              src={picture}
              alt=""
              style={{
                objectFit: "cover",
                width: "100%",
              }}
            />
          </TipseenMedia>
          <TipseenContent title="This is a Floating Tipseen">
            Message for the user will appear here, to give more information
            about the feature.
          </TipseenContent>
        </>
      }
      // You do not have to use containerSelector, in current use this is for story only
      containerSelector="#tipseen-floating-container"
    />
  );
}
Copy
Format
Reset
Do’s and Don’ts
Do
When using a Tipseen wizard, allow the user to complete the process and close the Tipseen by leaving the last CTA enabled.
Don't
Don’t finish the Tipseen wizard process with a disabled CTA.
Do
Use tipseen in order to guide the user through a new feature or a place they’re not familiar with in the system.
Don't
Don’t use tipseen to provide additional information on a familiar UI.
Do
Add a pointer to indicate the specific component that the tipseen comes from.
Don't
Don’t use a tipseen without a pointer, unless it’s a general tipseen for an entire screen.
Related components
Tooltip
Displays information related to an element over it.
Attention box title

Studies show that 100% of people who celebrate birthdays, will die.

AttentionBox
Displays content classification.
This is a chip
Chip
Compact elements that represent an input, attribute, or action.
