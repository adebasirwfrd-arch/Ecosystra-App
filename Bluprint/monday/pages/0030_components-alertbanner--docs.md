---
id: components-alertbanner--docs
type: docs
title: "Components/AlertBanner"
name: "Docs"
importPath: "./src/pages/components/AlertBanner/AlertBanner.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-alertbanner--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:47.721Z
---

Alert Banner

Alert banners show pressing and high-signal messages, such as system alerts. They are meant to be noticed and prompt users to take action.

Alert banner message
this is a CTA
Show code
Import
import { AlertBanner } from "@vibe/core";
Copy
Props
AlertBannerAlertBannerTextAlertBannerLinkAlertBannerButton
Name	Description	Default	
Control

aria-label	
The ARIA label of the alert banner for accessibility.
string
	-	

backgroundColor	
The background color of the alert banner.
AlertBannerBackgroundColor
	
primary
	Set object
children	
The content of the alert banner.
ChildrenType | ChildrenType[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
closeButtonAriaLabel	
The ARIA label of the close button for accessibility.
string
	
"Close"
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

isCloseHidden	
If true, the close button is hidden.
boolean
	
false
	Set boolean
onClose	
Callback fired when the close button is clicked.
(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
	-	-
Usage
Alert banners should have call for action and an option to dismiss.
Don't include more than one call to action in an alert banner.
Place the banner on the top of the screen, and push all other content below it.
🤓
When to use?
Alert banners should be reserved only for high-signal, system-level alert messages. For in-app notifications use a 
Toast.
Accessibility
Use the ariaLabel prop to provide a descriptive accessible name for the banner that clearly indicates the type and purpose of the alert.
For dismissible AlertBanners, use the closeButtonAriaLabel prop to provide a descriptive accessible name for the close button.
When the banner text should be announced by screen readers (e.g., for dynamic updates), set the ariaLive prop on AlertBannerText to control the live region behavior ("polite", "assertive", or "off"). By default, AlertBannerText does not set a live region.
Variants
Types

There are five types of alert banners: primary, positive, negative, warning and inverted.

Alert banner message
this is a CTA
Alert banner message
this is a CTA
Alert banner message
this is a CTA
Alert banner message
this is a CTA
Alert banner message
this is a CTA
Show code
Alert Banner with button
Lorem ipsum dolor sit amet
Lorem Ipsum
Show code
Alert Banner with link
Alert banner message
this is a CTA
Show code
Do’s and Don’ts
Join us at Elevate!
RSVP now
Do
Use banners for system messages, background processes, and general updates.
We successfully archived 1 item
Don't
Don’t use banners for notifying a user of an action they have taken. Instead, provide visual feedback with a 
Toast.
No connection
Learn more
Try again
Do
If two actions are needed, use two different call to acitons.
No connection
Learn more
Try again
No connection
Learn more
Try again
Don't
Don't include more than one action in an alert banner with the same type.
Join us at Elevate!
RSVP now
Do
Use only the 4 color types: primary, negative, positive, and inverted.
Join us at Elevate!
RSVP now
Don't
Don’t choose other colors for alert banners. Keep it consistent.
Use cases and examples
Alert banner as an announcement

Use when you'd like to notify about an event or cross-company announcment.

Join us at Elevate 2022
RSVP now
Show code
Alert banner as an opportunity to upgrade

Use to show a trial user the number of remaining free days to use the platform.

7 days left on your monday CRM trial
Upgrade now
Show code
Overflow text

In case that there's not enough space for the content, use an ellipses (...).

This is a really long alert...
Call to action
Show code
Related components
Message
Button
Toast
A message object that presents timely information or feedback for the user.
Attention box title

Studies show that 100% of people who celebrate birthdays, will die.

AttentionBox
Displays content classification.
Tooltip
Displays information related to an element over it.
