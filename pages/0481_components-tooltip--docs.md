---
id: components-tooltip--docs
type: docs
title: "Components/Tooltip"
name: "Docs"
importPath: "./src/pages/components/Tooltip/Tooltip.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-tooltip--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:48:39.231Z
---

Tooltip

Tooltips provide helpful information and can include detailed context about a specific component when a user hovers on it.

Show code
Import
import { Tooltip } from "@vibe/core";
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
arrowClassName	
Class name applied to the tooltip arrow.
string
	-	Set string
children	
The children elements that the tooltip is attached to.
ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
containerSelector	
CSS selector of the container where the dialog is portaled.
string
	-	Set string
content*	
The content displayed inside the tooltip.
ElementContent
	-	

data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dir	
The text direction of the tooltip: "ltr", "rtl", or "auto".
"auto"
"ltr"
"rtl"
	-	
auto
ltr
rtl

disable	
If true, disables opening the dialog.
boolean
	-	Set boolean
disableContainerScroll	
If true or a selector string, disables scrolling in the container when open.
string
boolean
	-	Set object
disableDialogSlide	
If true, disables the slide animation of the tooltip.
boolean
	
true
	Set boolean
enableNestedDialogLayer	

If true, provides a LayerProvider context for nested dialogs to render correctly. This is useful when you have components that use Dialog internally (like Dropdown) inside another Dialog, ensuring proper z-index stacking and click-outside behavior.

boolean
	-	Set boolean
forceRenderWithoutChildren	
If true, the tooltip will be rendered even if there are no children.
boolean
	-	Set boolean
getContainer	
Function to get the container where the tooltip should be rendered.
() => HTMLElement
	-	-
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
DialogTriggerEvent | DialogTriggerEvent[]
	
mouseleave
	Set object
hideTriggerIgnoreClass	
CSS class names that, when present on target, prevent hiding the dialog.
string | string[]
	-	Set object
hideWhenReferenceHidden	
If true, hides the dialog when the reference element scrolls out of view.
boolean
	
false
	Set boolean
icon	
The icon displayed next to the title.
SubIcon
	-	
Choose option...
ZoomIn
ZoomOut
NavigationArrow
EnterArrow
RemoveRound
ScheduledSend
NotificationChecked
TextFormatting
Signature
PDF
WrapText
MinusSmall
ClassicFolder
AlignRight
AlignLeft
AlignCenter
MoveArrowLeftNarrow
CollapseHorizontally
MoveArrowRightNarrow
Files
WarningFull
Move
Downgrade
ScheduledEmail
PinFull
ThumbsDown
Clipboard
Forward
Shuffle
Upgrade
Key
CloseMedium
ReplyAll
Baseline
ItemHeightSingle
ItemHeightDouble
Prompt
Heart
Placeholder
Translation
Warning
SortDescending
SortAscending
Erase
Workflow
ContentDirectory
Form
Launch
NotificationsMuted
Connect
Idea
Forum
Education
Academy
Offline
Timeline
Tags
Dropdown
Country
MondayDoc
MoveArrowLeftDouble
Formula
ItemDefaultValues
ConnectedDoc
AddNewDoc
Switcher
Description
LearnMore
ItemHeightTriple
TextMedium
NavigationDoubleChevronLeft
Night
Mirror
Minimize
Layout
DocTemplate
ConvertToItem
TextCopy
Open
Expand
ConvertToSubitem
Clear
TextColorIndicator
Bug
Battery
Status
Subitems
Gantt
Counter
Widgets
Recurring
DueDate
Dependency
Custom
Basic
Work
MoreBelowFilled
MoreBelow
CollapseRound
CloseRound
Bulllet
MoreActions
Apps
Globe
Radio
LongText
ShortText
Activity
Add
AddSmall
AddUpdate
Alert
Announcement
API
Archive
Attach
BlockQuote
Board
BoardPrivate
BoardShareable
BoardTemplate
Bold
Bolt
Broadcast
Broom
Bullets
Bullet
Bookmark
Calendar
Chart
Check
Checkbox
CheckList
Close
CloseSmall
Code
Collapse
Column
Comment
Completed
CreditCard
Cut
Dashboard
DashboardPrivate
Delete
DisabledUser
Divider
Doc
DocPrivate
DocShareable
DoubleCheck
Download
Drag
DropdownChevronDown
DropdownChevronLeft
DropdownChevronRight
DropdownChevronUp
Duplicate
Edit
Email
Embed
Enter
Event
Emoji
ExternalPage
Favorite
Feedback
File
Filter
Folder
Fullscreen
Graph
FullscreenClose
Gallery
GIF
Group
Guest
Help
Health
Hide
Highlight
HighlightColorBucket
Home
Image
Inbox
Info
Integrations
Invite
IPRestrictions
Italic
Item
Keyboard
Labs
Lines
Link
Location
Locked
LogIn
LogOut
Mention
Menu
Microphone
Mobile
MondayLogoOutline
Moon
MoveArrowDown
MoveArrowLeft
MoveArrowRight
MoveArrowUp
Mute
MyWeek
NavigationChevronDown
NavigationChevronLeft
NavigationChevronRight
NavigationChevronUp
NewTab
NoColor
Note
Notifications
Numbers
Page
Paste
Pause
Person
Pin
Play
Print
PushNotification
Quote
RecycleBin
Redo
Remove
Reply
Retry
Robot
Rotate
Search
Security
Send
Settings
SettingsKnobs
Share
Show
Shredder
Sort
Sound
StrikethroughS
StrikethroughT
Sun
Switch
Table
Team
Text
TextBig
Textcolor
TextHuge
TextSmall
ThumbsUp
Time
Underline
TurnInto
Undo
Unlocked
Update
Upload
Versioning
Video
Wand
WhatsNew
Workspace
Deactivate
AddToTeam
PersonRound
UserDomain
UserStatus

id	
An HTML id attribute for the component.
string
	-	Set string
image	
The image displayed inside the tooltip.
string
	-	Set string
immediateShowDelay	
Delay in milliseconds before showing the tooltip immediately.
number
	-	Set number
instantShowAndHide	
If true, shows and hides the dialog without delay.
boolean
	-	Set boolean
isOpen	
Controlled open state for derived state pattern.
boolean
	-	Set boolean
maxWidth	
The maximum width of the tooltip.
number
	-	Set number
middleware	

Custom Floating UI middleware for positioning logic. If you provide offset, flip, or shift middleware, the defaults will be skipped. Other middleware (like size, inline, autoPlacement) are added to the chain.

{ options?: any; name: string; fn: (state: { x: number; y: number; initialPlacement: Placement; placement: Placement; strategy: Strategy; middlewareData: MiddlewareData; rects: ElementRects; platform: { ...; } & Platform; elements: Elements; }) => Promisable<...>; }[]
	-	Set object
moveBy	

Offset values for positioning adjustments. main - distance from reference element secondary - cross-axis offset (skidding)

{ main?: number; secondary?: number; }
	{ main: 4, secondary: 0 }	Set object
observeContentResize	
If true, automatically updates position when content resizes.
boolean
	-	Set boolean
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
onTooltipHide	
Callback fired when the tooltip is hidden.
() => void
	-	-
onTooltipShow	
Callback fired when the tooltip is shown.
() => void
	-	-
open	
Controls the open state of the dialog (controlled mode).
boolean
	
false
	Set boolean
position	
The placement of the tooltip relative to the reference element.
TooltipPositions
	
top
	Set object
preventAnimationOnMount	
If true, prevents animation when mounting.
boolean
	-	Set boolean
referenceWrapperClassName	
Class name applied to the reference wrapper element.
string
	
""
	Set string
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
	-	Set boolean
shouldShowOnMount	
If true, shows the dialog when the component mounts.
boolean
	-	
FalseTrue
showDelay	
Delay in milliseconds before showing the dialog.
number
	
300
	Set number
showOnDialogEnter	
If true, keeps the dialog open when mouse enters it.
boolean
	
true
	Set boolean
showTrigger	
Events that trigger showing the dialog.
DialogTriggerEvent | DialogTriggerEvent[]
	
mouseenter
	Set object
showTriggerIgnoreClass	
CSS class names that, when present on target, prevent showing the dialog.
string | string[]
	-	Set object
startingEdge	
The starting edge of the dialog animation.
DialogStartingEdge
	-	Set object
style	
Inline styles applied to the tooltip container.
CSSProperties
	-	Set object
theme	
The theme of the tooltip.
TooltipTheme
	
dark
	Set object
tip	
If false, hides the arrow of the tooltip.
boolean
	
true
	Set boolean
title	
The title of the tooltip.
string
	-	Set string
tooltip	
If true, renders with tooltip arrow styling.
boolean
	-	Set boolean
tooltipClassName	
Class name applied to the tooltip arrow element.
string
	-	Set string
useDerivedStateFromProps	
If true, uses derived state from props pattern.
boolean
	-	Set boolean
withoutDialog	
If true, renders the tooltip without a dialog.
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
Usage
Should never contain critical information that a user would definitely need to proceed.
Use when the description content would be too much information to include inline or create too much clutter. For example, when expert users have seen it many times.
Only show 1 tooltip at a time.
Whenever text is shortened and an ellipsis (...) appears, add a tooltip that contains the full version of the text.
🤓
Tip
As tooltips only surface from a hover, never include links or buttons in the copy. If your tooltip requires either of these, considers putting your content in a 
Attention box
 or 
Dialog.
Accessibility
Provide an id for the Tooltip to enable proper accessibility associations and unique identification.
Ensure tooltip content is descriptive and provides meaningful information. Avoid using tooltips to repeat information that's already visible in the UI.
Configure showTrigger and hideTrigger events to ensure tooltips are accessible via both mouse and keyboard interactions.
Use hideWhenReferenceHidden prop to ensure tooltips disappear when their reference elements are hidden or removed from the DOM.
Avoid placing critical information only in tooltips - ensure the core functionality is accessible without tooltips for users who cannot see them.
Variants
Tooltip with title

Use tooltip with title when you want to present more complex content and you need to add a heading to emphasize the main idea. Titles can also come with an icon.

Show code
Tooltip with image

Use tooltip with image to provide a preview for an image or when giving a closer look at a feature.

Show code
Positions

Tooltip's arrow can appear from top, bottom, left or right.

Show code
Do's and Don'ts
Do
Use tooltips for interactive imagery.
Quick search
Don't
Don't use tooltips to restate visible UI text.
Boards
Items
Do
If an element doesn't need additional clarification, don't use a tooltip.
Boards
Items
Don't
Don't use tooltips to restate text that is already displayed within the element.
Do
Add links inline and in the same color of the text.
Don't
Don't add links on a separate line or in a different color from the text.
Do
Use this app to visualize data.
Don't
Don't add an image just for aesthetic reasons, or if it doesn't help the user.
Use cases and examples
Icon tooltip

An icon tooltip is used to clarify the action or name of an interactive icon button. Provide tooltips for all unlabelled icons.

Show code
Definition tooltip

The definition tooltip provides additional help or defines an item or term. It may be used on the label of a UI element, or on a word embedded in a paragraph.

Subitem
Show code
Immediate tooltips

Immediately show when another is shown. The two left tooltips uses the immediate show prop, the right one ignores it and should always have show delay.

Show code
Related components
This is a chip
Chip
Compact elements that represent an input, attribute, or action.
New
Label
Offers content classification.
Tipseen
Displays information related to an element over it.
