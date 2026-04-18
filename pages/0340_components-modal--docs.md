---
id: components-modal--docs
type: docs
title: "Components/Modal"
name: "Docs"
importPath: "./src/pages/components/Modal/Modal.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-modal--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:42:33.739Z
---

Modal

Modals help users focus on a single task or a piece of information by popping up and blocking the rest of the page's content. Modals disappear when user complete a required action or dismiss it. Use modals for quick, infrequent tasks. We have 3 different modal component, each one provide a different layout for a different use case:

Import

All the Modal-related components can be imported from @vibe/core.

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalMedia,
  ModalFooter,
  ModalFooterWizard,
  ModalBasicLayout,
  ModalSideBySideLayout,
  ModalMediaLayout
} from "@vibe/core";
Copy
Basic modal

The 
Basic Modal
 is intended for straightforward tasks, like selecting items or gathering basic information. Basic Modals help users focus on a single task without distractions. These modals do not support images or videos.

Open Modal
Modal title
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Confirm
Cancel
Side by side modal

The 
Side-by-Side Modal
 offers two distinct sections: the left for text or inputs, and the right for supporting visuals. It's ideal when users need to reference media alongside information.

Open Modal
Side by side modal
Modal subtitle, can come with icon 
and link.

Modal content will appear here, you can custom it however you want, according to the user needs. Please make sure that the content is clear for completing the relevant task.

Next
Back
Media modal

The 
Media Modal
 includes a highlighted media section followed by text, perfect for grabbing attention with visuals before users interact with the content. Ideal for introducing new features or onboarding.

Open Modal
Modal title

The media modal is ideal for introducing new features or onboarding, the user can also 
add a link
.

Confirm
Cancel
Usage
Use modals only when you need the user's full, immediate attention.
Modals are centered on the page. To put the modal in focus, the rest of the page is dimmed.
All modals must have a title, a call to action, and a close button. The title and call to action should be simple and clear.
By default, users can close modals by clicking the close button, clicking outside the modal, or pressing the ESC key.
🤓
Tip
Since the modal is used for short and non-frequent tasks, consider using the main flow for common tasks. For creating a popover positioned next to other components, like customized menus, check out our 
Dialog
 component.
Accessibility

The Modal component provides several built-in enhancements to simplify usage and improve accessibility:

Scroll lock: While the modal is open, it prevents background content from scrolling, ensuring user focus remains on the modal.",
Focus lock: Keeps focus within the modal elements, preventing users from tabbing outside of the modal while it is open. Focus also automatically returns to the last focused element upon closing.
Aria attributes: For better screen reader support, using ModalHeader - with simple string values for title and description props - automatically sets the necessary aria-labelledby and aria-describedby attributes on the modal.
Manual ARIA for complex content: If you pass a ReactNode (e.g., a custom component) as the title or description prop to ModalHeader, you must assign a unique id to your primary custom element within that ReactNode. Then, pass this id directly to the parent Modal component using the aria-labelledby (for title) or aria-describedby (for description) prop. This ensures assistive technologies can correctly identify the modal's label and description. For example, if your custom title is <CustomTitleComponent id="my-unique-title-id" />, you would pass aria-labelledby="my-unique-title-id" to the <Modal> component.
Overriding ARIA attributes: Additionally, you can directly provide the aria-labelledby and aria-describedby props to the Modal component itself, regardless of how you use the ModalHeader. If provided, these props will always override any automatically generated values from ModalHeader.
Do's and don'ts
Do
Modal must include backdrop element.
Don't
Don't remove the backdrop element of the modal or the modal's title.
Do
Use our 
Skeleton
 component if loading is needed. Try that at least the actions will appear immediately.
Don't
Don't use Loader component in case of necessary loading.
Do
Use one primary button as your main call to action, for extra buttons use the tertiary button.
Don't
Don't use more than one primary button, we don't want to distract the user from the main action.
Related components
Tooltip
Displays information related to an element over it.
Dialog
The dialog component's purpose is to position a popup component nearby another element, such as any kind of a button.
Tipseen
Displays information related to an element over it.
