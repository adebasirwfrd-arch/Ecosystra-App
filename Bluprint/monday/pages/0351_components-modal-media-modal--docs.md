---
id: components-modal-media-modal--docs
type: docs
title: "Components/Modal/Media modal"
name: "Docs"
importPath: "./src/pages/components/Modal/ModalMediaLayout.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-modal-media-modal--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:42:56.687Z
---

Media Modal

The Media Modal includes a highlighted media section, followed by a textual content area. This modal is intended for cases when you need to catch the user’s attention using visual elements before they interact with the text. It’s ideal for introducing new features or short onboarding flows.

Open Modal
Modal title

The media modal is ideal for introducing new features or onboarding, the user can also 
add a link
.

Confirm
Cancel
Show code
Import

All the Media Modal layout components can be imported from @vibe/core.

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalMedia,
  ModalFooter,
  ModalFooterWizard,
  ModalMediaLayout
} from "@vibe/core";
Copy
Props
ModalModalMediaLayoutModalMediaModalHeaderModalContentModalFooterModalFooterWizardTransitionView
Name	Description	Default	
Control

alertModal	
When true, prevents closing the modal when clicking the overlay ("click-outside") or pressing ESC.
boolean
	-	Set boolean
allowFocusEscapeTo	

Specifies elements/containers that should be allowed to receive focus outside this modal. When focus moves to these elements, the focus lock will ignore them. This allows other UI components (tooltips, dropdowns, nested modals, etc.) to receive focus.

Accepts:

CSS selectors (string)
Refs to elements (React.RefObject)
Direct element references (HTMLElement)
FocusEscapeTarget[]
	-	Set object
anchorElementRef	
Reference to an element that triggered the modal, used for animations.
RefObject<HTMLElement>
	-	Set object
aria-describedby	
If provided, overrides the automatically generated aria-describedby, that is assigned when used with ModalHeader.
string
	-	Set string
aria-labelledby	
If provided, overrides the automatically generated aria-labelledby, that is assigned when used with ModalHeader.
string
	-	Set string
autoFocus	

This is intended for advanced use-cases. It allows you to control the default focus behavior when the modal mounts. Make sure to use this prop only when you understand the implications.

Determines if focus should automatically move to the first focusable element when the component mounts. When set to false - disables the automatic focus behavior.

Notice this might break keyboard and general accessibility and should be used with caution.
boolean
	
true
	Set boolean
children*	
Modal content.
ReactNode
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
closeButtonAriaLabel	
Accessibility label for the close button.
string
	-	Set string
closeButtonTheme	
Theme color for the close button.
ModalTopActionsTheme
	-	Set object
container	
The target element to render the modal into.
PortalTarget
	
document.body
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id*	
Unique identifier for the modal.
string
	-	Set string
onClose	
Callback fired when the modal should close.
(event: ModalCloseEvent) => void
	() => {}	-
onFocusAttempt	

This is intended for advanced use-cases. It allows you to control which elements the focus lock should manage. Make sure to use this prop only when you understand the implications.

Note: If you only need to allow focus to specific selectors, use allowFocusEscapeTo instead.

Called whenever focus is attempting to move to any element (inside or outside the modal). Return:

true to let focus-lock manage this element (keep it within the modal's focus trap).
false to let focus-lock ignore this element (allow focus to move outside the modal).
An HTMLElement to redirect focus to that element instead.
Any other value (e.g., null, undefined) would act as false.
(nextFocusedElement?: HTMLElement) => boolean | HTMLElement
	-	-
renderHeaderAction	
Additional action to render in the header area.
ReactElement<ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLElement>> | ForwardRefExoticComponent<MenuButtonProps & RefAttributes<...>>, string | JSXElementConstructor<...>> | ((color?: ModalTopActionsButtonColor) => ReactElement<...>)
	-	Set object
show*	
Controls the visibility of the modal.
boolean
	-	Set boolean
size	
Determines the width and max-height of the modal.
ModalSize
	
medium
	Set object
style	
Additional inline styles for the modal.
CSSProperties
	-	Set object
zIndex	
The z-index to be used for the modal and overlay.
number
	-	Set number
Usage
Use when you want to prioritize images, videos, or other media before users engage with the text below.
Use for product highlights, feature releases, or any guides that require visuals first, followed by explanatory text.
🤓
Tip
If your content is scrollable or wide (you need more space), consider using 
Basic modal
.
Use cases and examples
Wizard modal

For modals with multiple steps, use the ModalFooterWizard.

Open Modal
Modal with wizard

We have made some changes to our modal component. Keep reading to see what improvements we made.

Next
Back
Story Editor
(_, { show, setShow, container }) => {
  const steps = [
    <ModalMediaLayout>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="media placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          We have made some changes to our modal component. Keep reading to see
          what improvements we made.
        </Text>
      </ModalContent>
    </ModalMediaLayout>,
    <ModalMediaLayout>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="media placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Now the modal can also allow wizard process, when including stepper in
Copy
Format
Reset
Announcement modal

Announcement modals used to effectively introduce new features or updates to users in a focused and engaging way. It is the media modal with predefine properties. To use an announcement modal, simply copy the code provided below.

Open Modal
Meet our new feature

Introducing our latest feature designed to make your workflow faster and easier. For more details 
click here
.

Got it
Dismiss
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-media"
      show={show}
      size="medium"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalMediaLayout>
        <ModalMedia>
          <img
            src={mediaImage}
            alt="media placeholder"
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        </ModalMedia>
        <ModalHeader title="Meet our new feature" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            Introducing our latest feature designed to make your workflow faster
            and easier. For more details{" "}
            <Link inheritFontSize inlineText text="click here" />.
          </Text>
        </ModalContent>
      </ModalMediaLayout>
      <ModalFooter
        primaryButton={{
          text: "Got it",
          onClick: () => setShow(false),
        }}
        secondaryButton={{
          text: "Dismiss",
Copy
Format
Reset
Header with extra icon button

In case of a need of an icon button in the modal header, you can use our default header "Action slot". You can also use it as a 
menu button
 component.

Open Modal
Modal title

The media modal is ideal for introducing new features or onboarding, the user can also 
add a link
.

Confirm
Cancel
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-media"
      show={show}
      renderHeaderAction={
        <IconButton
          icon={Menu}
          size="small"
          kind="tertiary"
          aria-label="Open Menu"
        />
      }
      size="medium"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalMediaLayout>
        <ModalMedia>
          <img
            src={mediaImage}
            alt="media placeholder"
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        </ModalMedia>
        <ModalHeader title="Modal title" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            The media modal is ideal for introducing new features or onboarding,
            the user can also{" "}
            <Link inheritFontSize inlineText text="add a link" />.
          </Text>
        </ModalContent>
Copy
Format
Reset
Animation

Each modal includes an animation type based on its entrance point, with wizard modals also featuring transition animations. The default is the element trigger animation, which can be replaced with a center pop animation if there's no specific trigger. Transition animation is used exclusively for wizard modals and cannot be changed or removed.

Center pop
Transition
Story Editor
() => {
  const [showCenterPop, setShowCenterPop] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const transitionSteps = [
    <ModalMediaLayout>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="media placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          We have made some changes to our modal component. Keep reading to see
          what improvements we made.
        </Text>
      </ModalContent>
    </ModalMediaLayout>,
    <ModalMediaLayout>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="media placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
Copy
Format
Reset
Do's and don'ts
Do
Keep a balanced ratio between the media section, to the content and footer section.
Don't
Don't create a media that will be too small or too big for the modal width, as it create unbalanced look.
Related components
Side by side modal
Two-section modal layout, ideal for referencing visuals alongside text.
Basic modal
Modal for straightforward tasks, helps users focus on a single task without distractions.
Tipseen
Displays information related to an element over it.
