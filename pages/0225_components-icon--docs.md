---
id: components-icon--docs
type: docs
title: "Components/Icon"
name: "Docs"
importPath: "./src/pages/components/Icon/Icon.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-icon--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:38:39.911Z
---

Icon

Icon component is our component to unify the supported icon types (Vibe Icons, FontIcon and Custom SVG Icons)

Show code
Import
import { Icon } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-hidden	
If true, hides the icon from screen readers.
boolean
	-	Set boolean
className	
A CSS class name to apply to the component.
string
	-	Set string
customColor	
Overrides the default color with a custom color.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
icon	
The icon name, component, or source URL.
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

id	
An HTML id attribute for the component.
string
	-	

ignoreFocusStyle	
If true, removes focus styles from the icon.
boolean
	
false
	Set boolean
label	
The accessible label for the icon.
string
	-	Set string
size	
The size of the icon.
string
number
	
16
	Set object
style	
Inline styles applied to the icon.
CSSProperties
	-	Set object
tabindex	
The tab index of the icon for keyboard navigation.
string
number
	-	Set object
type	
The type of the icon: svg, font, or src (external source).
IconType
	
svg
	Set object
useCurrentColor	
If true, replaces fill property with currentColor when using an src icon.
boolean
	
false
	Set boolean
Usage
Always wrap icons with Icon component
Try to always use icon alongside text or provide tooltip to accommodate the icon
Variants
Vibe Icon
Story Editor
<Icon
  id="vibe-icon"
  type="svg"
  icon={Bolt}
  label="my bolt svg icon"
  size={16}
/>
Copy
Format
Reset
FontIcon
Story Editor
<Icon
  id="font-icon"
  type="font"
  label="my font awesome start icon"
  icon="fa fa-star"
/>
Copy
Format
Reset
Custom SVG
Story Editor
<Icon
  id="custom-svg-icon"
  type="src"
  icon="https://cdn.monday.com/images/apps/custom-icons/Form.svg"
  label="my src awesome icon"
  size={20}
  useCurrentColor
/>
Copy
Format
Reset
States
Color

As a default the icon will inherit the color of it's parent container

Story Editor
<div
  style={{
    color: "var(--sb-color-sofia_pink)",
  }}
>
  <Icon
    id="colored-icon"
    type="svg"
    icon={Bolt}
    label="my bolt svg icon"
    size={16}
  />
</div>
Copy
Format
Reset
Icons List

Icons are exported by name from @vibe/icons:

import { DoubleCheck } from "@vibe/icons";
Copy
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
Story Editor
() => {
  interface IconMeta {
    name: string;
    tags: string;
    file: string;
  }
  const [query, setQuery] = useState("");
  return (
    <section
      style={{
        width: "100%",
      }}
    >
      <Search
        value={query}
        onChange={setQuery}
        placeholder="Search for icons"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "var(--sb-spacing-large)",
          marginTop: "var(--sb-spacing-large)",
        }}
      >
        {iconsMetaData
          .filter((icon: IconMeta) => {
            return `${icon.tags},${icon.name}`
              .toLowerCase()
              .includes(query.toLowerCase());
          })
          .map((icon: IconMeta) => {
            const fileName = icon.file.split(".")[0] as string;
            const Component = allIcons[
              fileName as keyof typeof allIcons
Copy
Format
Reset
