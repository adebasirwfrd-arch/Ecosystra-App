---
id: components-avatar--docs
type: docs
title: "Components/Avatar"
name: "Docs"
importPath: "./src/pages/components/Avatar/Avatar.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-avatar--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:32:25.348Z
---

Avatar

Avatar is a graphical representation of a person through a profile picture, image, icon, or set of initials.

Show code
Import
import { Avatar } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

aria-hidden	
If true, the avatar is hidden from assistive technologies.
boolean
	-	Set boolean
aria-label	
The ARIA label of the avatar.
string
	-	

avatarContentWrapperClassName	
Class name applied to the avatar content wrapper.
string
	-	Set string
backgroundColor	
The background color of the avatar.
ElementAllowedColor
	
chili-blue
	Set object
bottomLeftBadgeProps	
Props for the bottom-left badge.
AvatarBadgeProps
	-	Set object
bottomRightBadgeProps	
Props for the bottom-right badge.
AvatarBadgeProps
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
customBackgroundColor	
A custom background color.
string
	-	Set string
customSize	
A custom size in pixels.
number
	-	Set number
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the avatar is disabled.
boolean
	-	Set boolean
icon	
The icon displayed inside the avatar.
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
	-	

onClick	
Callback fired when the avatar is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>, avatarId: string) => void
	-	-
role	
The ARIA role of the avatar.
AriaRole
	-	Set object
size	
The size of the avatar.
AvatarSize
	
large
	

square	
If true, renders the avatar as a square instead of a circle.
boolean
	-	Set boolean
src	
The image source for the avatar.
string
	-	

tabIndex	
The tab index of the avatar.
number
	-	Set number
text	
The text displayed inside the avatar.
string
	-	Set string
textClassName	
Class name applied to the text inside the avatar.
string
	
""
	Set string
tooltipProps	
Props passed to the Tooltip component. See full options in the Tooltip documentation.
Partial<TooltipProps>
	-	Set object
topLeftBadgeProps	
Props for the top-left badge.
AvatarBadgeProps
	-	Set object
topRightBadgeProps	
Props for the top-right badge.
AvatarBadgeProps
	-	Set object
type	
The type of the avatar.
AvatarType
	
text
	

withoutBorder	
If true, removes the avatar's border.
boolean
	
false
	Set boolean
withoutTooltip	
If true, the tooltip is disabled.
boolean
	
false
	Set boolean
Usage
Use an avatar to help a user in the platform efficiently identify another person or a team.
When there is no personal photo to show, use initials.
If an image fails to load, fall back to the default user avatar.
An avatar may contain a status icon to indicate a user’s status (working from home, busy, etc.).
Use a tooltip or dialog when hovering over the avatar to offer more information. For example: with a person’s name.
🤓
Mutiple avatars togethers?
If you want to stack multiple avatars together, check out 
AvatarGroup
 component
Accessibility
Always provide an ariaLabel prop to describe the person or entity represented by the avatar (e.g., "John Smith", "Design Team", "Guest User"). This label is automatically used as tooltip content.
Use the role prop when the avatar represents something other than a person (e.g., role="img" for team avatars, role="button" for clickable workspace avatars).
For clickable avatars, ensure the ariaLabel describes the action that will occur when clicked (e.g., "Open John Smith's profile", "View Design Team details").
Use ariaHidden prop appropriately when the avatar is purely decorative and provides no meaningful information to screen readers.
For avatars with badges (status indicators), ensure the ariaLabel includes relevant status information (e.g., "John Smith (Away)", "Design Team (3 members online)").
Variants
Size

Avatars appear in 4 sizes: XS, Small, Medium, and Large.

Story Editor
<Flex gap="medium">
  <Avatar
    id="size-xs"
    size="xs"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
  />
  <Avatar
    id="size-small"
    size="small"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
  />
  <Avatar
    id="size-medium"
    size="medium"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
  />
  <Avatar
    id="size-large"
    size="large"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
  />
</Flex>
Copy
Format
Reset
Disabled

Use when a user is inactive in the system.

Story Editor
<Flex gap="medium">
  <Avatar
    id="disabled-xs"
    size="xs"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
    disabled
  />
  <Avatar
    id="disabled-small"
    size="small"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
    disabled
  />
  <Avatar
    id="disabled-medium"
    size="medium"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
    disabled
  />
  <Avatar
    id="disabled-large"
    size="large"
    src={person1}
    type="img"
    aria-label="Julia Martinez"
    disabled
  />
</Flex>
Copy
Format
Reset
Avatar with text

Use when a user’s image is not available, use their initials.

RM
RM
RM
RM
Story Editor
<Flex gap="medium">
  <Avatar
    id="text-xs"
    size="xs"
    type="text"
    text="RM"
    backgroundColor="lipstick"
    aria-label="Ron Meir"
  />
  <Avatar
    id="text-small"
    size="small"
    type="text"
    text="RM"
    backgroundColor="lipstick"
    aria-label="Ron Meir"
  />
  <Avatar
    id="text-medium"
    size="medium"
    type="text"
    text="RM"
    backgroundColor="lipstick"
    aria-label="Ron Meir"
  />
  <Avatar
    id="text-large"
    size="large"
    type="text"
    text="RM"
    backgroundColor="done-green"
    aria-label="Ron Meir"
  />
</Flex>
Copy
Format
Reset
Square avatar with icon or text

Use for non-person avatars, such as a workspace or team.

R
R
RM
Story Editor
<Flex gap="medium">
  <Avatar
    id="square-xs"
    size="xs"
    type="text"
    text="R"
    backgroundColor="bright-blue"
    square
    aria-label="Ron"
  />
  <Avatar
    id="square-small"
    size="small"
    type="text"
    text="R"
    backgroundColor="bright-blue"
    square
    aria-label="Ron"
  />
  <Avatar
    id="square-medium"
    size="medium"
    type="icon"
    icon={WhatsNew}
    backgroundColor="aquamarine"
    square
    aria-label="Present"
  />
  <Avatar
    id="square-large"
    size="large"
    type="text"
    text="RM"
    backgroundColor="working_orange"
    square
    aria-label="Ron Meir"
Copy
Format
Reset
Do’s and Don’ts
Do
Use consistent avatar sizes for common use cases to convey their purpose.
Don't
Avoid using a mix of avatar sizes that display together and create design imbalance.
Do
Use branded generic avatars when a user has not set their avatar image.
Don't
Don’t make assumptions and use gendered placeholder avatars.
Use cases and examples
Avatar with right badge

Use to indicate the user’s permissions such as: Guest, owner.

Story Editor
<Flex gap="medium">
  <Avatar
    id="right-badge-guest"
    size="large"
    type="img"
    src={person1}
    bottomRightBadgeProps={{
      src: guest,
    }}
    aria-label="Julia Martinez with guest badge"
  />
  <Avatar
    id="right-badge-owner"
    size="large"
    type="img"
    src={person1}
    bottomRightBadgeProps={{
      src: owner,
    }}
    aria-label="Julia Martinez with owner badge"
  />
</Flex>
Copy
Format
Reset
Avatar with left badge

Use to indicate the status of a user such as: Working from home, out of office etc.

Story Editor
<Flex gap="medium">
  <Avatar
    id="left-badge-home"
    size="large"
    type="img"
    src={person1}
    bottomLeftBadgeProps={{
      src: home,
    }}
    aria-label="Julia Martinez with home badge"
  />
  <Avatar
    id="left-badge-minus"
    size="large"
    type="img"
    src={person1}
    bottomLeftBadgeProps={{
      src: minus,
    }}
    aria-label="Julia Martinez with minus badge"
  />
</Flex>
Copy
Format
Reset
Avatar with tooltip

Use to display tooltip on onHover Avatar event.

Aria label tooltip
Text tooltip
JSX tooltip
Story Editor
<Flex direction="row" gap="large" align="start">
  <StoryDescription
    description="Aria label tooltip"
    vertical
    align={StoryDescription.align.START}
  >
    <Avatar
      id="tooltip-aria"
      size="large"
      type="img"
      src={person1}
      aria-label={"Julia Martinez"}
    />
  </StoryDescription>
  <StoryDescription
    description="Text tooltip"
    vertical
    align={StoryDescription.align.START}
  >
    <Avatar
      id="tooltip-text"
      size="large"
      type="img"
      src={person1}
      tooltipProps={{
        content: "Julia Martinez",
      }}
      aria-label={"Julia Martinez"}
    />
  </StoryDescription>
  <StoryDescription
    description="JSX tooltip"
    vertical
    align={StoryDescription.align.START}
  >
    <Avatar
Copy
Format
Reset
Clickable avatar

Use to fire actions on avatar click event.

0
Story Editor
() => {
  const [count, setCount] = useState(0);
  const incrementCount = useCallback(() => {
    setCount(prevState => prevState + 1);
  }, []);
  return (
    <Flex>
      <Flex direction="column" gap="medium">
        <Avatar
          id="clickable-avatar"
          size="large"
          type="img"
          src={person1}
          aria-label="Julia Martinez (clickable)"
          onClick={incrementCount}
        />
        <Counter id="avatar-click-counter" count={count} />
      </Flex>
    </Flex>
  );
}
Copy
Format
Reset
Multiple avatars

To group multiple Avatars together, use the 
AvatarGroup
 component.

+1
Story Editor
<AvatarGroup id="multiple-avatars-group" max={2} size="large">
  <Avatar
    id="multiple-avatar-1"
    type="img"
    src={person1}
    aria-label="Julia Martinez"
  />
  <Avatar
    id="multiple-avatar-2"
    type="img"
    src={person2}
    aria-label="Marco DiAngelo"
  />
  <Avatar
    id="multiple-avatar-3"
    type="img"
    src={person3}
    aria-label="Liam Caldwell"
  />
</AvatarGroup>
Copy
Format
Reset
Related components
+5
AvatarGroup
An avatar group displays a number of avatars grouped together in a stack or grid.
Tooltip
Displays information related to an element over it.
What's new
Badge
Used to place an indicator / counter on a child component
