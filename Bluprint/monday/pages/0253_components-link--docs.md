---
id: components-link--docs
type: docs
title: "Components/Link"
name: "Docs"
importPath: "./src/pages/components/Link/Link.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-link--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:39:33.778Z
---

Link

Link is an actionable text component with connection to another web pages.

Read more
Show code
Import
import { Link } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-describedby	
The ID of the element that describes this link.
string
	-	Set string
aria-label	
The ARIA label for accessibility.
string
	-	Set string
aria-labelledby	
The ID of the element labeling this link.
string
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The link's color style
LinkColor
	
primary
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disableNavigation	
If true, disables navigation when the link is clicked.
boolean
	
false
	Set boolean
href	
The URL the link points to.
string
	
""
	Set string
icon	
Icon displayed next to the link text.
SubIcon
	
""
	
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

iconPosition	
The position of the icon relative to the text.
LinkIconPosition
	
start
	Set object
id	
An HTML id attribute for the component.
string
	
""
	Set string
inheritFontSize	
If true, the link inherits the surrounding text's font size.
boolean
	
false
	Set boolean
inlineText	
If true, the link is styled to fit within inline text content.
boolean
	
false
	Set boolean
onClick	
Callback fired when the link is clicked.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
rel	
Specifies the relationship between the current document and the linked resource.
string
	
"noreferrer"
	Set string
style	
Inline style object applied to the link element.
CSSProperties
	-	Set object
target	
Specifies where to open the linked document.
LinkTarget
	
_blank
	Set object
text	
The text content of the link.
string
	
""
	Set string
textClassName	
Class name applied to the link text.
string
	-	Set string
Usage
Use links only as part of the text or scentence.
Use links in order to redirect people outside of the system.
Links should be short with a clear action name. read more, go to, etc...
🤓
Tip
If you need an action that does not have context with text 
Button
.
Accessibility
Use the ariaLabelDescription prop when the link text alone doesn't provide enough context for screen readers to understand the link's purpose.
Use ariaDescribedby prop to link the link to additional descriptive text that provides more context about the link's destination or action.
Use ariaLabeledBy prop when an external element provides the accessible name for the link. Pass the id of that external element.

Link's color on Primary

The link on Primary surface should be text-color-on-primary with underline.

For hover state the cursor should transit to pointer to represent clickable area.

Link's color on inverted

The link on inverted surface should be text-color-on-inverted with underline.

For hover state the cursor should transit to pointer to represent clickable area.

Variants
States
Default
Story Editor
<Link id="states-default" text="Default" href="https://www.monday.com" />
Copy
Format
Reset
Right to left
اقرأ أكثر
קרא עוד
Story Editor
<>
  <Link
    id="rtl-arabic"
    text="اقرأ أكثر"
    href="https://www.monday.com"
    icon={IconLink}
  />
  <Link
    id="rtl-hebrew"
    text="קרא עוד"
    href="https://www.monday.com"
    iconPosition="end"
    icon={Info}
  />
</>
Copy
Format
Reset
With icons
Read more
Read more
Story Editor
<>
  <Link
    id="icon-start"
    text="Read more"
    href="https://www.monday.com"
    icon={ExternalPage}
  />
  <Link
    id="icon-end"
    text="Read more"
    href="https://www.monday.com"
    iconPosition="end"
    icon={ExternalPage}
  />
</>
Copy
Format
Reset
Do’s and Don’ts
Read more
Do
Keep the copy short and to the point.
Go to this url and read all about it
Don't
Don’t write long messages that are clickable.
Read more
Do
Use icon from the left or right side of the link
Read more
Don't
Don’t use two icons for one link.
Read more
Do
Use only one link in context in text
Read this
or
this
Nice article
Don't
Don’t use multiple links near each other
Use cases and examples
Reference link

Use this menu to allow a user to either select one or more items from the list.

Lorem Ipsum has been the industry's 
standard
 dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
Story Editor
<div>
  {`Lorem Ipsum has been the industry's `}
  <Link
    id="reference-link"
    inlineText
    inheritFontSize
    text="standard"
    href="https://www.monday.com"
  />
  {` dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`}
</div>
Copy
Format
Reset
Shortening texts

Use read more to shorten long paragraphs of text

Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
Read more
Story Editor
<div>
  {`Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. `}
  <Link
    id="shortening-link"
    text="Read more"
    href="https://www.monday.com"
    inheritFontSize
    inlineText
  />
</div>
Copy
Format
Reset
Related components
Get started
Button
Allow users take actions with a single click.
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
What's new
Badge
Used to place an indicator / counter on a child component
