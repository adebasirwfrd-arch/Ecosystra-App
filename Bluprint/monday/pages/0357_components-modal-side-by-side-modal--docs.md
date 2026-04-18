---
id: components-modal-side-by-side-modal--docs
type: docs
title: "Components/Modal/Side by side modal"
name: "Docs"
importPath: "./src/pages/components/Modal/ModalSideBySideLayout.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-modal-side-by-side-modal--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:43:08.994Z
---

Side-by-side modal

The Side-by-side Modal offers a layout with two distinct sections. The left side is reserved for providing information or inputs, like text fields or dropdown. The right side is reserved for visual media that supports the content on the left, like an image that adds context. This layout works best when users need to reference visual elements alongside textual information.

Open Modal
Side by side modal
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Next
Back
Show code
Import

All the Side-by-side Modal layout components can be imported from @vibe/core.

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalMedia,
  ModalFooter,
  ModalFooterWizard,
  ModalSideBySideLayout
} from "@vibe/core";
Copy
Props
ModalModalSideBySideLayoutModalMediaModalHeaderModalContentModalFooterModalFooterWizardTransitionView
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
This modal emphasis the balance between the textual inputs and visual media, so one doesn’t overpower the other.
Use when you need to support textual inputs with visual media, like a visual diagram or set of instructions.
Use when users need to compare textual information with visual media, like a preview or data visualization.
🤓
Tip
If your content is scrollable, consider using 
Basic modal
.
Use cases and examples
Wizard modal

For modals with multiple steps, use the ModalFooterWizard. You can use it to break down the tasks. Not every step must include an image.

Open Modal
Modal with wizard
Fill in the details
Full name
Email
Next
Back
Story Editor
(_, { show, setShow, container }) => {
  const dropdownOptions = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Hebrew",
      value: "he",
    },
  ];
  const steps = [
    <ModalSideBySideLayout>
      <ModalHeader
        title="Modal with wizard"
        description="Fill in the details"
      />
      <ModalContent>
        <Flex direction="column" gap="medium">
          <TextField title="Full name" placeholder="John Dow" />
          <TextField title="Email" placeholder="Email@monday.com" />
        </Flex>
      </ModalContent>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="side by side placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
    </ModalSideBySideLayout>,
    <ModalSideBySideLayout>
      <ModalHeader
Copy
Format
Reset
Header with icon button

In case of a need of an icon button in the modal header, you can use our default header "Action slot". You can also use it as a 
menu button
 component.

Open Modal
Modal title

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-sbs"
      show={show}
      renderHeaderAction={
        <IconButton
          icon={Menu}
          size="small"
          kind="tertiary"
          aria-label="Open Menu"
        />
      }
      size="large"
      onClose={() => setShow(false)}
      container={container}
      style={{
        height: 400,
      }}
    >
      <ModalSideBySideLayout>
        <ModalHeader title="Modal title" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            Modal content will appear here, you can custom it however you want,
            according to the user needs. Please make sure that the content is
            clear for completing the relevant task.
          </Text>
        </ModalContent>
        <ModalMedia>
          <img
            src={mediaImage}
            alt="side by side placeholder"
            style={{
              width: "100%",
              objectFit: "cover",
Copy
Format
Reset
Animation

Each modal includes an animation type based on its entrance point, with wizard modals also featuring transition animations. The default is the center pop animation, which can be replaced with an anchor animation if there is a specific trigger to open the modal. Transition animation is used exclusively for wizard modals and cannot be changed or removed.

Anchor
Center pop
Transition
Story Editor
() => {
  const [showAnchor, setShowAnchor] = useState(false);
  const [showCenterPop, setShowCenterPop] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const anchorButtonRef = useRef<HTMLButtonElement>(null);
  const transitionSteps = [
    <ModalSideBySideLayout>
      <ModalHeader title="Modal title" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
      <ModalMedia>
        <img
          src={mediaImage}
          alt="side by side placeholder"
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </ModalMedia>
    </ModalSideBySideLayout>,
    <ModalSideBySideLayout>
      <ModalHeader title="Modal title" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
      <ModalMedia>
Copy
Format
Reset
Do's and don'ts
Do
Split up processes with several tasks into distinct steps using our wizard modal footer.
Don't
Don't use scrolling for side-by-side modals in case of several tasks.
Do
The right side of the modal is for media content. You can remove it if you don't need it.
Don't
Don't turn this modal into a two-column grid. If you don't need an image, consider using the 
basic modal
.
Do
When using a wizard modal, allow the user to complete the process and close the modal by leaving the last CTA enabled.
Don't
Don’t finish the Tipseen wizard process with a disabled CTA. Also, when in first step, make sure the “Back” button is disabled.
Related components
Media modal
Modal with highlighted media section, for catching the user’s attention.
Basic modal
Modal for straightforward tasks, helps users focus on a single task without distractions.
Tipseen
Displays information related to an element over it.
