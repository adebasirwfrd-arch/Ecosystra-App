---
id: foundations-accessibility--docs
type: docs
title: "Foundations/Accessibility"
name: "Docs"
importPath: "./src/pages/foundations/accessibility/accessibility.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=foundations-accessibility--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:08.393Z
---

Accessibility
Intro
Accessibility principles
Color contrast
Imagery
Hierarchy and focus
Navigation
Assistive Technology
Feedback
Intro

Web Accessibility is focused on ensuring people with disabilities can equally perceive, understand, navigate, and interact with digital content. It also means that they can contribute equally like anyone else. Web Accessibility is based on guidelines published by The World Wide Web Consortium (W3C) for accessible content called Web Content Accessibility Guidelines or WCAG.

WCAG Quick Reference

🤓
Get our Accessibility checklist
Download
our accessibility checklist file.
Accessibility principles
Clear
Create clear information and design components that will be easy to perceive to all users' senses.
Operable
Design components and elements that users would be able to use with a keyboard or a keyboard equivalent.
Understandable
Use simple language and design an easy to use interface that can be understood by all users.
Robust
Create robust content that can accommodate a wide variety of users.
Color contrast
Text Color Contrast

Applies to text in the page, including placeholder text, hover text and text shown on keyboard focus. The visual presentation of text and images should have a contrast ratio of at least 4.5:1 with the background

Except for:

Large Text - at least 18pt (typically 24px) or 14pt (typically 18.66px) and bold must have a contrast ratio of at least 3:1

Incidental - inactive user interface (disabled items), decorative (icons, Illustartions) non-visible, insignificant part of a picture

Logotypes - Text that is part of a logo or brand name
Non-Text Color Contrast

The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color

UI Components - Visual information required to identify active UI components and states, including borders for input elements (text input, radio buttons, checkboxes, etc.) as well as Focus Indicator (visible focus around active elements when they receive keyboard focus)
Graphical Objects - Parts of graphics required to understand the content

🤓
Use color contrast tools for code and design
To check color contrast in design use
contrast figma plugin
and inspect elements accessibility tab for live code verification
Imagery

People with vision impairments or difficulties reading rely on text alternatives for most of the visual content.

Note: Alternative text is very important since it is adaptable. Assistive technology can convey this content to the user in different ways: visually, enlarged, spoken aloud, and rendered in a tactile form.

Information Images

Are all images that convey important information and communicate information visually:

The alt-text needs to convey the same information as the image
Ensure the alt-text is short and appropriate to the context

If the same information already is present as text on the screen, the image becomes decorative

Do not use the words like "graphic", "An image of", "A picture of", "an icon of"
Decorative Images

Such as borders, empty states, background ambience images:

Do not convey information
Should be ignored by the screen reader
Can be defined as background image in the stylesheet
Should use role="presentation"
Hierarchy and focus
Reading Order

The reading and navigation order is determined by code order
The reading order must be logical and intuitive.
We arrange the order of the elements within the HTML so that the reading order follows the same order as the visual presentation of the screen.

Semantic Markup

Semantic markup is used to define: Headings, Regions/Landmarks, Lists, Emphasized or special text, Tables and Text labels & form group labels

Headings

Headings communicate the structure of the content on the page. Assistive technologies users can use them as in-page navigation elements.

Arrange the headings on the page according to their level (H1...H6).
The most important heading on the page is heading level 1 (H1).
Only one heading level 1 H1 is allowed on a page.

Headings should be placed at the start of new sections of content not for decoration

void skipping heading levels. Ensure that a heading level 1 H1 is not followed directly by an H3, for example.

Navigation
Keyboard Access

All active elements that can be activated with a mouse have to be operable by keyboard, or have a keyboard equivalent.
Dynamic components such as dialogs, not initially in the tab order must also receive keyboard focus.
Elements that show content on mouse hover needs to be added to the tab-order and be operable with the keyboard.
In your design, annotate the tab-order and number the tab stops.

Focus Management

Keyboard navigation in a rich internet application is different from tabbing in a website.
In rich internet applications, users tab to complex components such as comboboxes, grids, menus etc. then use the arrow keys to navigate within the component.
Dynamic components such as dialogs, not initially in the tab order have to receive keyboard focus.
When dynamic components are closed, focus shifts back to the point where interaction started.
Receiving focus or interacting with an input element must not result in a substantial change to the page like invoking a dialog or sending focus somewhere else on the page.

🤓
We got you covered with tab navigation
Use this keyboard navigation infra in any UI that requires it.
Focus Visible

Provide a visible focus indicator to mark currently focused active elements.
As keyboard users tab through the page, they can see where they are.

Assistive Technology

Software and hardware that people with disabilities use to interact with digital content. A screen reader is a piece of software that makes digital content accessible to blind people. The software converts text to speach and helps blind people navigate and understand the content on the page. The screen reader reads the DOM (Document Object Model) and transfers it into a Virtual Buffer (acts like a word document).

Screen reader users navigate the virtual buffer in Virtual Mode or Browse Mode:

With shortcut keys like H for the next heading, E for the next editable field, B for the next button, etc..

With the keyboard arrow keys. The navigation is object by object.

Screen reader users navigate the virtual buffer in Input Mode or Forms Mode:

The standard mode in which the users will type letters via the keyboard.

For example:

Screen readers that read aloud web content for people who cannot read the text, usually blind people and people with cognitive impairmants. For example: JAWS and NVDA on windows machines, VoiceOver for MacOS.

Screen magnifiers for people with low vision. For example: Zoomtext

Voice recognition software and selection switches for people who cannot use a keyboard or a mouse. For example: Dragon Naturally Speaking

Up next
Colors
Ensure accessible text, and distinguish UI elements and surfaces from one another.
H1
H2
H3
Typography
Typography expresses hierarchy and brand presence.
