---
id: components-breadcrumbsbar-breadcrumbitem--docs
type: docs
title: "Components/BreadcrumbsBar/BreadcrumbItem"
name: "Docs"
importPath: "./src/pages/components/BreadcrumbsBar/BreadcrumbItem.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-breadcrumbsbar-breadcrumbitem--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:33:26.437Z
---

BreadcrumbItem
Workspace
Show code
Import
import { BreadcrumbItem } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the item is disabled.
boolean
	-	Set boolean
icon	
The icon displayed next to the text.
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
isClickable	
If true, the item is clickable.
boolean
	
false
	Set boolean
isCurrent	
If true, applies styling for the current page.
boolean
	
false
	Set boolean
link	
The URL the item links to if navigation is handled via a link.
string
	-	Set string
onClick	
Callback fired when the item is clicked.
() => void
	-	-
showText	
If true, the breadcrumb text is shown.
boolean
	
true
	Set boolean
text	
The display text of the breadcrumb item.
string
	
""
	
Variants
States
Link
Workspace
Function
Workspace
Disabled
Workspace
Current
Workspace
Story Editor
<div className="monday-storybook-breadcrumb-item_column-wrapper">
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>Link</span>
    <BreadcrumbsBar type="navigation">
      <BreadcrumbItem
        text="Workspace"
        icon={Workspace}
        link="https://www.google.com"
      />
    </BreadcrumbsBar>
  </div>
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>Function</span>
    <BreadcrumbsBar type="navigation">
      <BreadcrumbItem
        text="Workspace"
        icon={Workspace}
        onClick={() => {
          alert("Hello");
        }}
      />
    </BreadcrumbsBar>
  </div>
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>Disabled</span>
    <BreadcrumbsBar type="indication">
      <BreadcrumbItem text="Workspace" icon={Workspace} disabled />
    </BreadcrumbsBar>
  </div>
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>Current</span>
    <BreadcrumbsBar type="indication">
      <BreadcrumbItem text="Workspace" icon={Workspace} isCurrent />
    </BreadcrumbsBar>
  </div>
</div>
Copy
Format
Reset
With icon
With Icon
Workspace
Without Icon
Workspace
Story Editor
<div className="monday-storybook-breadcrumb-item_column-wrapper">
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>With Icon</span>
    <BreadcrumbsBar type="indication">
      <BreadcrumbItem text="Workspace" icon={Workspace} />
    </BreadcrumbsBar>
  </div>
  <div className="monday-storybook-breadcrumb-item_row-wrapper">
    <span>Without Icon</span>
    <BreadcrumbsBar type="indication">
      <BreadcrumbItem text="Workspace" />
    </BreadcrumbsBar>
  </div>
</div>
Copy
Format
Reset
