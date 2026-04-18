---
id: components-modal-basic-modal--docs
type: docs
title: "Components/Modal/Basic modal"
name: "Docs"
importPath: "./src/pages/components/Modal/ModalBasicLayout.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-modal-basic-modal--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:42:35.789Z
---

Basic modal

The Basic Modal is intended for straightforward tasks, like selecting items or gathering basic information. Basic Modals help users focus on a single task without distractions. These modals do not support images or videos.

Open Modal
Modal title
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Show code
Import

All the Basic Modal layout components can be imported from @vibe/core.

import { Modal, ModalHeader, ModalContent, ModalFooter, ModalFooterWizard, ModalBasicLayout } from "@vibe/core";
Copy
Props
ModalModalBasicLayoutModalHeaderModalContentModalFooterModalFooterWizardTransitionView
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
Use for straightforward tasks like confirming routine actions, gathering simple info, or displaying brief instructions.
Use when users need to choose from a long list of items or options, or when they need to fill out a long form.
Use when there is no need for media (images or videos).
Use when the content is scrollable.
🤓
Tip
If your content is not scrollable and you need to add media as supporting element, consider using 
Side-by-side modal
 or 
Media modal
 depends on your use case.
Variants
Sizes

The modal component has three sizes - small, medium, and large. The modal width is responsive and adjust in width based on screen size. Each size also has a maximum height to keep harmonic window ratio, while the content area adapting to fit.

Small
Medium
Large
Story Editor
() => {
  const [showSmall, setShowSmall] = useState(false);
  const [showMedium, setShowMedium] = useState(false);
  const [showLarge, setShowLarge] = useState(false);
  return (
    <>
      <Flex
        gap="large"
        style={{
          paddingBlock: 40,
        }}
      >
        <Button onClick={() => setShowSmall(true)}>Small</Button>
        <Button onClick={() => setShowMedium(true)}>Medium</Button>
        <Button onClick={() => setShowLarge(true)}>Large</Button>
      </Flex>


      <Modal
        id="modal-basic-small"
        show={showSmall}
        size="small"
        onClose={() => setShowSmall(false)}
      >
        <ModalBasicLayout>
          <ModalHeader
            title="Modal title"
            description={
              <Text type="text1">
                Modal subtitle, can come with icon{" "}
                <Link inheritFontSize inlineText text="and link." />
              </Text>
            }
          />
          <ModalContent>
            <Text type="text1" align="inherit" element="p">
              Modal content will appear here, you can custom it however you
Copy
Format
Reset
Alert Modal

Use the "alertModal" boolean prop in order to allow closing the modal only by the close buttons and not by ESC or by clicking outside. Use this variant in case of sensitive or important messages, and in modals that requires data from the user, such as forms.

Open Modal
Alert modal

This will allow closing the modal only by the close buttons and not by ESC or by clicking outside.

Confirm
Cancel
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-basic"
      show={show}
      alertModal
      size="medium"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalBasicLayout>
        <ModalHeader title="Alert modal" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            This will allow closing the modal only by the close buttons and not
            by ESC or by clicking outside.
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
        primaryButton={{
          text: "Confirm",
          onClick: () => setShow(false),
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShow(false),
        }}
      />
    </Modal>
  );
}
Copy
Format
Reset
Scroll

When the content of the modal is too large to fit within the viewport, the modal content should become scrollable while the header and footer stay sticky. If the scroll is too long, consider switching to a different modal size or a different layout.

Open Modal
Scrollable modal

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task. The Basic Modal is intended for straightforward tasks, like selecting items or gathering basic information. Basic Modals help users focus on a single task without distractions. These modals do not support images or videos. When the content of the modal is too large to fit within the viewport, the modal content should become scrollable while the header and footer stay sticky. If the scroll is too long, consider switching to a different modal size or a different layout. Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-basic"
      show={show}
      size="medium"
      onClose={() => setShow(false)}
      container={container}
      style={{
        height: 400,
      }}
    >
      <ModalBasicLayout>
        <ModalHeader title="Scrollable modal" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            Modal content will appear here, you can custom it however you want,
            according to the user needs. Please make sure that the content is
            clear for completing the relevant task. The Basic Modal is intended
            for straightforward tasks, like selecting items or gathering basic
            information. Basic Modals help users focus on a single task without
            distractions. These modals do not support images or videos. When the
            content of the modal is too large to fit within the viewport, the
            modal content should become scrollable while the header and footer
            stay sticky. If the scroll is too long, consider switching to a
            different modal size or a different layout. Modal content will
            appear here, you can custom it however you want, according to the
            user needs. Please make sure that the content is clear for
            completing the relevant task.
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
        primaryButton={{
          text: "Confirm",
          onClick: () => setShow(false),
Copy
Format
Reset
Use cases and examples
Wizard modal

For modals with multiple steps, use the ModalFooterWizard.

Open Modal
Modal with wizard

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Next
Back
Story Editor
(_, { show, setShow, container }) => {
  const steps = [
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
  ];
  const {
    activeStep,
    direction,
Copy
Format
Reset
Confirmation modal

Confirmation modal ensure that users acknowledge the outcomes of their actions. It is based on the small size modal and comes with predefine properties. To use a confirmation modal, simply copy the code provided below.

Open Modal
Want to delete?

There are other tasks connected to this task. Deleting this task will remove any existing connections. It will be kept in trash for 30 days.

Confirm
Cancel
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-basic"
      show={show}
      size="small"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalBasicLayout>
        <ModalHeader title="Want to delete?" />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            There are other tasks connected to this task. Deleting this task
            will remove any existing connections. It will be kept in trash for
            30 days.
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
        primaryButton={{
          text: "Confirm",
          onClick: () => setShow(false),
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShow(false),
        }}
      />
    </Modal>
  );
}
Copy
Format
Reset
Footer with extra content

The footer has an option to include additional content on the left side when needed. This extra content can consist of a button, checkbox, or simple text for notes. Note that this option is only available with the default footer.

Open Modal
Modal title
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Don't show again
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-basic"
      show={show}
      size="medium"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalBasicLayout>
        <ModalHeader
          title="Modal title"
          description={
            <Text type="text1">
              Modal subtitle, can come with icon{" "}
              <Link inheritFontSize inlineText text="and link." />
            </Text>
          }
        />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            Modal content will appear here, you can custom it however you want,
            according to the user needs. Please make sure that the content is
            clear for completing the relevant task.
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
        primaryButton={{
          text: "Confirm",
          onClick: () => setShow(false),
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShow(false),
        }}
Copy
Format
Reset
Header with icon button

In case of a need of an icon button in the modal header, you can use our default header "Action slot". You can also use it as a 
menu button
 component.

Open Modal
Modal title
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Don't show again
Story Editor
(_, { show, setShow, container }) => {
  return (
    <Modal
      id="modal-basic"
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
      <ModalBasicLayout>
        <ModalHeader
          title="Modal title"
          description={
            <Text type="text1">
              Modal subtitle, can come with icon{" "}
              <Link inheritFontSize inlineText text="and link." />
            </Text>
          }
        />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            Modal content will appear here, you can custom it however you want,
            according to the user needs. Please make sure that the content is
            clear for completing the relevant task.
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
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
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
    <ModalBasicLayout>
      <ModalHeader title="Modal with wizard" />
      <ModalContent>
        <Text type="text1" align="inherit" element="p">
          Modal content will appear here, you can custom it however you want,
          according to the user needs. Please make sure that the content is
          clear for completing the relevant task.
        </Text>
      </ModalContent>
    </ModalBasicLayout>,
Copy
Format
Reset
Do's and don'ts
Do
Use button, checkbox, or simple text for notes as an extra content to the footer.
Don't
Don't use images, inputs or any kind of content that can overload the user.
Related components
Side by side modal
Two-section modal layout, ideal for referencing visuals alongside text.
Media modal
Modal with highlighted media section, for catching the user’s attention.
Tipseen
Displays information related to an element over it.
