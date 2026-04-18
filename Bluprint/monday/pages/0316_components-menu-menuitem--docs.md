---
id: components-menu-menuitem--docs
type: docs
title: "Components/Menu/MenuItem"
name: "Docs"
importPath: "./src/pages/components/Menu/MenuItem.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-menu-menuitem--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:41:36.417Z
---

Menu Item

Use menu item for drawing one options that displayed inside a menu.

Menu item
Show code
Import
import { MenuItem } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

activeItemIndex	
The active item index in the menu.
number
	-	Set number
aria-label	
The label of the menu item for accessibility.
string
	-	Set string
autoAdjustOnSubMenuContentResize	
If true, automatically repositions the submenu when its content changes.
boolean
	-	Set boolean
children	
The submenu, if applicable. Must be a single Menu element.
MenuChild
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
closeMenu	
Function to close the menu with a given option.
(option: CloseMenuOption) => void
	-	-
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the menu item is disabled.
boolean
	
false
	Set boolean
disableReason	
The reason for disabling the item, shown in a tooltip.
string
	-	Set string
hasOpenSubMenu	
If true, a submenu is open.
boolean
	-	Set boolean
icon	
The icon displayed in the menu item.
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

iconBackgroundColor	
The background color of the icon.
string
	-	Set string
iconType	
The type of icon.
IconType
	-	Set object
iconWrapperClassName	
Class name applied to the icon wrapper.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	-	Set string
index	
The index of the menu item.
number
	-	Set number
isInitialSelectedState	
If true, the menu item starts as selected.
boolean
	-	Set boolean
isParentMenuVisible	
If true, the parent menu is visible.
boolean
	-	Set boolean
key	
The key of the menu item.
string
	-	Set string
label	
The label displayed alongside the title.
string | ReactElement<ForwardRefExoticComponent<LabelProps & RefAttributes<HTMLElement>>, string | JSXElementConstructor<any>>
	
""
	Set object
menuRef	
Reference to the menu container.
RefObject<HTMLElement>
	-	Set object
onClick	
Callback fired when the menu item is clicked.
(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>) => void
	-	-
onMouseEnter	
Callback fired when the mouse enters the item.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onMouseLeave	
Callback fired when the mouse leaves the item.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
resetOpenSubMenuIndex	
Callback to reset the open submenu index.
() => void
	-	-
rightIcon	
The right icon to be displayed.
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

rightIconBackgroundColor	
The background color of the right icon.
string
	-	Set string
rightIconType	
The type of right icon.
IconType
	-	Set object
rightIconWrapperClassName	
Class name applied to the icon wrapper.
string
	-	Set string
selected	
If true, the menu item is selected.
boolean
	
false
	Set boolean
setActiveItemIndex	
Callback to set the active item index.
(index: number) => void
	-	-
setSubMenuIsOpenByIndex	
Callback to open or close a submenu by index.
(index: number, isOpen: boolean) => void
	-	-
shouldScrollMenu	
If true, the menu scrolls to ensure visibility.
boolean
	-	Set boolean
splitMenuItem	

If true, enables a split menu item interaction where the main area triggers an action, while the icon button opens the submenu.

boolean
	-	Set boolean
submenuPosition	
The position of a submenu relative to the menu item.
SubmenuPosition
	-	Set object
title	
The title of the menu item.
string | ReactElement<any, string | JSXElementConstructor<any>>
	
""
	

tooltipContent	
The tooltip content for the menu item.
string
	-	Set string
tooltipPosition	
The position of the tooltip.
TooltipPositions
	
right
	Set object
tooltipProps	
Additional props for customizing the tooltip.
Partial<TooltipProps>
	-	Set object
tooltipShowDelay	
The delay in milliseconds before the tooltip shows.
number
	
300
	Set number
useDocumentEventListeners	
If true, document event listeners are used for handling interactions.
boolean
	-	Set boolean
Accessibility
Use the aria-label prop when you need to provide a custom accessible name that differs from the visible title text, especially for icon-only menu items.
For menu items with submenus, ensure the submenu content is properly structured with descriptive menu item titles for clear navigation hierarchy.
Use the disabled prop appropriately with a disableReason to provide context for why a menu item cannot be selected.
Variants
States
Regular menu item
Selected menu item
Disabled menu item
Story Editor
<Menu>
  <MenuItem title="Regular menu item" />
  <MenuItem title="Selected menu item" selected />
  <MenuItem title="Disabled menu item" disabled />
</Menu>
Copy
Format
Reset
Icons
Left icon
SVG icon
Font icon
Right icon
SVG right icon
Font right icon
Story Editor
<Flex gap="large" align="start" justify="start">
  <Flex direction="column" gap="medium">
    <Text>Left icon</Text>
    <Menu>
      <MenuItem title="SVG icon" icon={Activity} />
      <MenuItem title="Font icon" icon="fa fa-star" type="font" />
    </Menu>
  </Flex>
  <Flex direction="column" gap="medium">
    <Text>Right icon</Text>
    <Menu>
      <MenuItem title="SVG right icon" rightIcon={Activity} />
      <MenuItem
        title="Font right icon"
        rightIcon="fa fa-star"
        rightType="font"
      />
    </Menu>
  </Flex>
</Flex>
Copy
Format
Reset
Label
Menu item
New
Story Editor
<Menu>
  <MenuItem title="Menu item" label="New" />
</Menu>
Copy
Format
Reset
SubMenu
Opens on item hover
Opens on icon hover
Story Editor
<Menu>
  <MenuItem title="Opens on item hover">
    <Menu tabIndex={0} id="sub-menu">
      <MenuItem
        title="Sub menu item 1"
        onClick={() => alert("clicked on sub menu item 1")}
      />
      <MenuItem
        title="Sub menu item 2"
        onClick={() => alert("clicked on sub menu item 2")}
      />
      <MenuItem
        title="Sub menu item 3"
        onClick={() => alert("clicked on sub menu item 3")}
      />
    </Menu>
  </MenuItem>
  <MenuItem
    title="Opens on icon hover"
    splitMenuItem
    onClick={() => alert("clicked on menu item")}
  >
    <Menu tabIndex={0} id="sub-menu">
      <MenuItem
        title="Sub menu item 1"
        onClick={() => alert("clicked on sub menu item 1")}
      />
      <MenuItem
        title="Sub menu item 2"
        onClick={() => alert("clicked on sub menu item 2")}
      />
      <MenuItem
        title="Sub menu item 3"
        onClick={() => alert("clicked on sub menu item 3")}
      />
    </Menu>
Copy
Format
Reset
Overflow
short text
long text - bla bla bla bla bla bla bla bla bla bla bla
long text with sub menu - bla bla bla bla bla bla bla bla bla bla bla
Story Editor
<Menu>
  <MenuItem title="short text" />
  <MenuItem title="long text - bla bla bla bla bla bla bla bla bla bla bla" />
  <MenuItem title="long text with sub menu - bla bla bla bla bla bla bla bla bla bla bla">
    <Menu tabIndex={0} id="sub-menu">
      <MenuItem title="Sub menu item 1" />
      <MenuItem title="Sub menu item 2" />
      <MenuItem title="Sub menu item 3" />
    </Menu>
  </MenuItem>
</Menu>
Copy
Format
Reset
Tooltips
Menu item with tooltip
Disabled menu item with tooltip
I am a very very very very long text please hover me to get a tooltip
Menu item with bottom tooltip
Menu item with icon and tooltip
Story Editor
<Menu>
  <MenuItem title="Menu item with tooltip" tooltipContent="I am tooltip" />
  <MenuItem
    title="Disabled menu item with tooltip"
    disabled={true}
    disableReason="I am a disabled tooltip"
  />
  <MenuItem title="I am a very very very very long text please hover me to get a tooltip" />
  <MenuItem
    title="Menu item with bottom tooltip"
    tooltipContent="I am tooltip"
    tooltipPosition="bottom"
  />
  <MenuItem
    title="Menu item with icon and tooltip"
    tooltipContent="Menu item with icon and tooltip"
    tooltipPosition="left"
    icon={Activity}
    type="svg"
  />
</Menu>
Copy
Format
Reset
Do's and Don’ts
Menu item 1
New
Menu item 2
Menu item 3
Do
Keep the label text in the menu item short and informative. Use 1 word only.
Menu Item 1
Long menu item label
Menu Item 2
Menu Item 3
Don't
Dont use long text with more than 1 word, to ensure clarity and to avoid ellipsis.
