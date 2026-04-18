---
id: components-chips--docs
type: docs
title: "Components/Chips"
name: "Docs"
importPath: "./src/pages/components/Chips/Chips.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-chips--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:34:57.094Z
---

Chip

Chips are compact elements that represent an input, attribute, or action. They may display text, icons, or both.

This is a chip
Show code
Import
import { Chips } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

allowTextSelection	
If true, allows the user to select text inside the chip.
boolean
	
false
	Set boolean
aria-haspopup	
If true, indicates that the chip has a popup.
boolean
	-	Set boolean
aria-label	
The label of the chip for accessibility.
string
	-	

avatarClassName	
Class name applied to left or right avatars.
string
	-	Set string
className	
A CSS class name to apply to the component.
string
	-	Set string
closeButtonAriaLabel	
The label for the close button.
string
	
"Remove"
	Set string
color	
The background color of the chip.
"primary"
"negative"
"positive"
"grass_green"
"done-green"
"bright-green"
"saladish"
"egg_yolk"
Show 7 more...
	
primary
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the chip is disabled.
boolean
	
false
	Set boolean
iconClassName	
Class name applied to left or right icons.
string
	-	Set string
iconSize	
The size of the icons inside the chip.
string
number
	
18
	Set object
id	
An HTML id attribute for the component.
string
	-	

label	
The text or content displayed inside the chip.
ElementContent
	
""
	

leftAvatar	
Image URL or text for an avatar displayed on the left.
string
	-	Set string
leftAvatarType	
The type of avatar displayed on the left.
AvatarType
	
img
	Set object
leftIcon	
Icon displayed on the left side.
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

leftRenderer	
A React element displayed on the left side.
ElementContent
	-	Set string
noAnimation	
If true, disables the chip's entry animation.
boolean
	
true
	Set boolean
noMargin	
If true, removes the default margin from the chip.
boolean
	
false
	Set boolean
onClick	
Callback fired when the chip is clicked.
(event: MouseEvent<HTMLDivElement, MouseEvent>) => void
	-	-
onDelete	
Callback fired when the chip is deleted.
(id: string, event: MouseEvent<HTMLSpanElement, MouseEvent>) => void
	(_id: string, _e: React.MouseEvent<HTMLSpanElement>) => {}	-
onMouseDown	
Callback fired when the mouse button is pressed on the chip.
(event: MouseEvent<HTMLDivElement, MouseEvent>) => void
	-	-
readOnly	
If true, the chip is read-only and cannot be deleted.
boolean
	
false
	Set boolean
rightAvatar	
Image URL or text for an avatar displayed on the right.
string
	-	Set string
rightAvatarType	
The type of avatar displayed on the right.
AvatarType
	
img
	Set object
rightIcon	
Icon displayed on the right side.
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

rightRenderer	
A React element displayed on the right side.
ElementContent
	-	Set string
showBorder	
If true, displays a border around the chip.
boolean
	
false
	Set boolean
Usage
Chips represent a complex piece of information in compact form, such as an entity (person, place, or thing) or text. They enable user input and verify that input by converting text into chips.
Use 8px spacing between chips.
Use chips when content is mapped to multiple categories, and the user needs a way to differentiate between them.
Accessibility
Provide an id for the Chips to enable proper accessibility associations and unique identification.
For removable chips, use the closeButtonAriaLabel prop to provide a descriptive accessible name for the remove button (defaults to "Remove", but should be more specific like "Remove John Smith" or "Delete tag").
Use the ariaLabel prop when the visible label text alone doesn't provide enough context for screen readers to understand the chip's purpose or when chips contain complex content.
For clickable chips, ensure the ariaLabel describes the action that will occur when clicked.
When using icons or avatars in chips, ensure they are purely decorative and don't replace the descriptive text. Screen readers will announce the text content, and icons should be hidden from assistive technologies.
🤓
Tip
Chips will always show up in context of a field. If you just need to add information, use 
Label.
Variants
With read only state
Read only chip
Story Editor
<Chips
  id="readonly-chip"
  aria-label="Read only chip"
  label="Read only chip"
  readOnly
/>
Copy
Format
Reset
With icons
Chip with left icon
Chip with right icon
Story Editor
<Flex gap="medium">
  <Chips
    id="chip-left-icon"
    aria-label="Chip with left email icon"
    label="Chip with left icon"
    leftIcon={Email}
  />
  <Chips
    id="chip-right-icon"
    aria-label="Chip with right email icon"
    label="Chip with right icon"
    rightIcon={Email}
  />
</Flex>
Copy
Format
Reset
With avatars
Chip with left avatar
Chip with right avatar
Story Editor
<Flex gap="medium">
  <Chips
    id="chip-left-avatar"
    aria-label="Chip with left avatar"
    label="Chip with left avatar"
    leftAvatar={person1}
  />
  <Chips
    id="chip-right-avatar"
    aria-label="Chip with right avatar"
    label="Chip with right avatar"
    rightAvatar={person1}
  />
</Flex>
Copy
Format
Reset
Themes
This is a long chip
Chip positive
Chip negative
Chip warning
Chip neutral
Disabled
Story Editor
<>
  <Chips id="theme-long" aria-label="Long chip" label="This is a long chip" />
  <Chips
    id="theme-positive"
    aria-label="Positive chip"
    label="Chip positive"
    color="positive"
  />
  <Chips
    id="theme-negative"
    aria-label="Negative chip"
    label="Chip negative"
    color="negative"
  />
  <Chips
    id="theme-warning"
    aria-label="Warning chip"
    label="Chip warning"
    color="warning"
  />
  <Chips
    id="theme-neutral"
    aria-label="Neutral chip"
    label="Chip neutral"
    color="neutral"
  />
  <Chips
    id="theme-disabled"
    aria-label="Disabled chip"
    label="Disabled"
    disabled
  />
</>
Copy
Format
Reset
Clickable chips
Clickable default chip
Clickable removable chip
Story Editor
() => {
  return (
    <Flex direction="row" gap="medium" align="start">
      <Chips
        id="clickable-default"
        aria-label="Clickable default chip"
        label="Clickable default chip"
        readOnly
        onClick={() => {}}
      />
      <Chips
        id="clickable-removable"
        aria-label="Clickable removable chip"
        label="Clickable removable chip"
        onClick={() => {}}
      />
    </Flex>
  );
}
Copy
Format
Reset
Color coded chips

Use chips with colors to indicate different categories. e.g.

<Chips label="GRASS_GREEN" color="grass_green" />
Copy
grass_green
done-green
bright-green
saladish
egg_yolk
working_orange
dark-orange
peach
sunset
stuck-red
dark-red
sofia_pink
lipstick
bubble
purple
dark_purple
berry
indigo
navy
bright-blue
dark-blue
aquamarine
chili-blue
river
winter
explosive
american_gray
brown
orchid
tan
sky
coffee
royal
teal
lavender
steel
lilac
pecan
positive
negative
primary
warning
neutral
Story Editor
() => {
  const excludedColors = ["dark_indigo", "blackish"];
  const stateColors = ["positive", "negative", "primary", "warning", "neutral"];
  const allColors = [
    ...ColorUtils.contentColors.filter(
      (c: string) => !excludedColors.includes(c)
    ),
    ...stateColors,
  ];
  const allowedColorsChunks = _chunk(allColors, 7);
  return (
    <Flex
      style={{
        width: "100%",
        height: 300,
      }}
      align="stretch"
    >
      {allowedColorsChunks.map((colorChunk: any) => {
        return (
          <Flex
            direction="column"
            key={colorChunk}
            justify="space-between"
            align="stretch"
          >
            {colorChunk.map((colorName: any) => (
              <Chips
                label={colorName}
                key={colorName}
                color={colorName}
                readOnly
                allowTextSelection
              />
            ))}
          </Flex>
Copy
Format
Reset
Chips on colored backgrounds

When a chip appears on a background color identical to its color, use showBorder prop in order to add a distinctive white border.

On selected
On positive
On negative
On neutral
Story Editor
<Flex
  style={{
    width: "100%",
  }}
  align="stretch"
  justify="start"
>
  <Flex
    align="center"
    justify="center"
    style={{
      background: "var(--sb-primary-selected-color)",
      width: "124px",
      height: "64px",
      margin: "var(--sb-spacing-small)",
      borderRadius: "var(--sb-border-radius-small)",
    }}
  >
    <Chips label="On selected" showBorder readOnly />
  </Flex>
  <Flex
    align="center"
    justify="center"
    style={{
      background: "var(--positive-color-selected)",
      width: "124px",
      height: "64px",
      margin: "var(--sb-spacing-small)",
      borderRadius: "var(--sb-border-radius-small)",
    }}
  >
    <Chips label="On positive" showBorder color="positive" readOnly />
  </Flex>
  <Flex
    align="center"
    justify="center"
Copy
Format
Reset
Do’s and Don’ts
Jason Tal
Do
When using a chip, the width will automatically size itself to fit the content.
This is a chip
Don't
Don’t change the chip width.
Use cases and examples
Colorful chips for different content

Sometimes when needed, chips can change fill color.

January
August
April
March
Story Editor
<Flex>
  <DialogContentContainer>
    <Flex
      direction="column"
      align="start"
      gap="medium"
      style={{
        padding: "var(--space-8)",
      }}
    >
      <div>
        <Chips label="January" color="positive" />
      </div>
      <Search />
      <div>
        <Chips label="August" readOnly color="lipstick" />
      </div>
      <div>
        <Chips label="April" readOnly color="bubble" />
      </div>
      <div>
        <Chips label="March" readOnly color="egg_yolk" />
      </div>
    </Flex>
  </DialogContentContainer>
</Flex>
Copy
Format
Reset
Chips in a person picker combo box

Chips can be removable, and can be used in a multiple options selection use cases.

Julia Martinez
Juan Rodriguez
Suggested people
May Kishon
(UX/UI Product Designer)
LC
Liron Cohen
(Customer Experience)
AL
Amanda Lawrence
(Customer Experience Designer)
DY
Dor Yehuda
(Customer Experience Designer)
Story Editor
<Flex>
  <DialogContentContainer>
    <Flex
      direction="column"
      align="start"
      gap="medium"
      style={{
        padding: "var(--space-8)",
      }}
    >
      <Search placeholder="Search names, positions, or a team" />
      <Flex align="center" justify="center">
        <Chips label="Julia Martinez" leftAvatar={person1} />
        <Chips label="Juan Rodriguez" leftAvatar={person3} />
      </Flex>
      <Text
        style={{
          paddingInlineStart: "var(--space-4)",
          marginTop: "var(--space-4)",
        }}
      >
        Suggested people
      </Text>
      <Flex direction="column" align="start" gap="medium">
        <Flex align="center" justify="center" key="cont-1" gap="small">
          <Avatar size="small" src={person1} type="img" />
          <Flex gap="xs">
            <Text>May Kishon </Text>
            <Text color="secondary">(UX/UI Product Designer)</Text>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" key="cont-2" gap="small">
          <Avatar
            size="small"
            backgroundColor="dark_purple"
            text="LC"
Copy
Format
Reset
Related components
New
Label
Offers content classification.
Tooltip
Displays information related to an element over it.
5
Counter
Show the count of some adjacent data.
