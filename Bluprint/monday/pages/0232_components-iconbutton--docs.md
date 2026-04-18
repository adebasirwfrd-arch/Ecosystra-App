---
id: components-iconbutton--docs
type: docs
title: "Components/IconButton"
name: "Docs"
importPath: "./src/pages/components/IconButton/IconButton.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-iconbutton--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:38:53.471Z
---

IconButton

Icon button is a square button contains only icon with no visible text labels used mostly in control bars.

Show code
Import
import { IconButton } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

active	
If true, the button is in an active state.
boolean
	-	Set boolean
aria-controls	
The ID of the region controlled by the button.
string
	-	Set string
aria-describedby	
ID of the element describing the button.
string
	-	Set string
aria-expanded	
If true, indicates that the associated popup is open.
boolean
	-	Set boolean
aria-haspopup	
If true, indicates that the button controls a popup.
boolean
"dialog"
"grid"
"listbox"
"menu"
"tree"
"true"
"false"
	-	Set object
aria-hidden	
If true, hides the button from assistive technologies.
Booleanish
	-	Set object
aria-label	
The ARIA label for accessibility.
string
	-	

aria-labelledby	
The ID of the element that labels this button.
string
	-	Set string
aria-pressed	
Indicates the current "pressed" state of toggle buttons.
boolean
"true"
"false"
"mixed"
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The color of the button.
ButtonColor
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the button is disabled.
boolean
	
false
	Set boolean
disabledReason	
If disabled, this message will be displayed in the tooltip.
string
	-	Set string
hideTooltip	
If true, hides the tooltip.
boolean
	
false
	Set boolean
icon	
The icon displayed inside the button.
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

iconClassName	
Class name applied to the icon.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	

insetFocus	
If true, the focus indicator is displayed inside the button instead of around it.
boolean
	
false
	Set boolean
kind	
The button variant.
ButtonType
	
tertiary
	Set object
loading	
If true, a loader replaces the icon.
boolean
	
false
	Set boolean
onClick	
Callback fired when the button is clicked.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
size	
The size of the button.
Size
	
medium
	Set object
tabIndex	
The tab order of the button.
number
	-	Set number
tooltipContent	
Tooltip content displayed on hover.
string
	-	Set string
tooltipProps	
Props for the Tooltip component.
Partial<TooltipProps>
	{} as TooltipProps	Set object
wrapperClassName	
Class name applied to the button wrapper.
string
	-	Set string
Usage
Icon button will always appear with a 
tooltip
 while hovering, defining the icon’s meaning.
Use an icon button when a user can perform an inline action on this page and there's no room for a default button.
Use icon button when you want to display an active state of a button.
Use a Primary icon button when it's the most important action to take.
Use icon button only when the icons is clear and understandable.
Icon buttons are often used when there are 2 or 3 adjacent icons buttons that perform actions on a single item presented in a row.
🤓
Check yourself
To display icons that do not have actions associated with them, use the 
Icon component
.
Accessibility
Provide an id for the IconButton to enable proper accessibility associations and unique identification.
Always provide an accessible name using either ariaLabel prop or tooltipContent prop. The component automatically uses tooltipContent as the accessible name if no ariaLabel is provided.
Use ariaLabel prop when you need a different accessible name than the tooltip text, or when the icon button doesn't have a tooltip.
Use ariaLabeledBy prop when an external element provides the accessible name for the icon button. Pass the id of that external element.
Use ariaHasPopup prop when the icon button opens a menu, dialog, or popup.
Use ariaExpanded prop to indicate when a popup or menu opened by the icon button is currently open (true) or closed (false).
Use ariaControls prop to link the icon button to the element it controls. Pass the id of the controlled element.
Use aria-describedby prop to link the icon button to additional descriptive text. Pass the id of the descriptive element.
Use aria-pressed prop for toggle icon buttons to indicate their current pressed state (true, false, or mixed).
Use aria-hidden prop appropriately to hide the icon button from screen readers when necessary, but use sparingly as it removes the button from the accessibility tree entirely.
Use tabIndex prop to control the icon button's position in the keyboard navigation order. The default value allows normal tab navigation.
Provide disabledReason prop when disabling an icon button to give users context about why the button is unavailable. This will be displayed in the tooltip.
🤓
Tip
If you need to use an icon as a button that opens info dialog with additional information, check out 
Info
 component.
Variants
Kinds

There can be more than one button in a screen, but to create the hierarchy of actions we need to use button kinds.

Story Editor
<div
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  }}
>
  <IconButton
    id="kinds-primary"
    icon={Bolt}
    kind="primary"
    aria-label="My primary IconButton"
  />
  <IconButton
    id="kinds-secondary"
    icon={Bolt}
    kind="secondary"
    aria-label="My secondary IconButton"
  />
  <IconButton
    id="kinds-tertiary"
    icon={Bolt}
    kind="tertiary"
    aria-label="My tertiary IconButton"
  />
</div>
Copy
Format
Reset
🤓
Tip
If you need to use an icon as a button that opens menu next to it, check out 
Menu button
 component.
Sizes
Story Editor
<div
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  }}
>
  <IconButton
    key="xxs"
    id="sizes-xxs"
    icon={Robot}
    kind="secondary"
    size="xxs"
    aria-label="My xxs IconButton"
  />
  <IconButton
    key="xs"
    id="sizes-xs"
    icon={Robot}
    kind="secondary"
    size="xs"
    aria-label="My xs IconButton"
  />
  <IconButton
    key="small"
    id="sizes-small"
    icon={Robot}
    kind="secondary"
    size="small"
    aria-label="My small IconButton"
  />
  <IconButton
    key="medium"
    id="sizes-medium"
    icon={Robot}
Copy
Format
Reset
Active
Story Editor
<div
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  }}
>
  <IconButton
    id="active-primary"
    icon={Doc}
    kind="primary"
    aria-label="My small active IconButton"
    active
  />
  <IconButton
    id="active-secondary"
    icon={Doc}
    kind="secondary"
    aria-label="My active medium IconButton"
    active
  />
  <IconButton
    id="active-tertiary"
    icon={Doc}
    kind="tertiary"
    aria-label="My active large IconButton"
    active
  />
</div>
Copy
Format
Reset
Disabled

Set disable button for something that isn’t usable. Use a tooltip on hover in order to indicate the reason of the disabled action.

Story Editor
<div
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  }}
>
  <IconButton
    id="disabled-primary"
    icon={Doc}
    kind="primary"
    aria-label="My small disabled IconButton"
    disabled
    disabledReason="This function is not available"
  />
  <IconButton
    id="disabled-secondary"
    icon={Doc}
    kind="secondary"
    aria-label="My disabled medium IconButton"
    disabled
    disabledReason="This function is not available"
  />
  <IconButton
    id="disabled-tertiary"
    icon={Doc}
    kind="tertiary"
    aria-label="My disabled large IconButton"
    disabled
    disabledReason="This function is not available"
  />
</div>
Copy
Format
Reset
Do’s and Don’ts
Do
Use Icon button when action is lower priority than a regular action or there’s no space available to place a button.
Don't
Don’t use Icon button as the main action on the page. Instead, use the 
Button component
 with an icon.
Do
Always provide ariaLabel or tooltipContent
Don't
Don’t use icon button without adding a tooltip while hovering.
Use cases and examples
Icon button as toolbar button
Widget name
Story Editor
<Box
  border
  rounded="medium"
  style={{
    width: "50%",
  }}
>
  <Flex direction="column" align="start">
    <Flex
      gap="small"
      style={{
        padding: "var(--sb-spacing-small)",
      }}
    >
      <Icon icon={Drag} />
      <Text type="text1">Widget name</Text>
      <IconButton
        id="toolbar-filter-button"
        icon={Filter}
        aria-label="Filter the widget by everything"
        size="small"
      />
    </Flex>
    <Divider withoutMargin />
    <div
      style={{
        height: "200px",
        width: "100%",
        backgroundColor: "var(--sb-primary-background-hover-color)",
      }}
    />
  </Flex>
</Box>
Copy
Format
Reset
Icon button as close button
Item
Hadas Farhi
deleted the item
Hello World
from the board
Tasks
13m
(Available for restore in the next 1M)
Restore
Story Editor
<Flex
  gap="medium"
  style={{
    width: "100%",
  }}
>
  <Box
    border
    rounded="small"
    paddingX="large"
    style={{
      width: "100%",
    }}
  >
    <Flex
      justify="start"
      gap="large"
      style={{
        height: "94px",
      }}
    >
      <Flex
        direction="column"
        justify="center"
        style={{
          color: "var(--sb-icon-color)",
        }}
      >
        <Icon icon={Item} size={40} />
        <Text type="text1" id="monday-recycle-bin-title">
          Item
        </Text>
      </Flex>
      <Divider direction="vertical" />
      <Avatar size="large" src={person1} type="img" />
      <Flex
Copy
Format
Reset
Related components
Get started
Button
Allow users take actions with a single click.
MenuButton
A component to open content next to another component
Icon
When you want to display an icon.
