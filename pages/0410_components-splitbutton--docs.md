---
id: components-splitbutton--docs
type: docs
title: "Components/SplitButton"
name: "Docs"
importPath: "./src/pages/components/SplitButton/SplitButton.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-splitbutton--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:46:22.287Z
---

SplitButton

A split button is a dual-function menu button that offers a default action as well as the possibility of choosing a secondary action, by selecting from a set of alternatives.

Button
Show code
Import
import { SplitButton, SplitButtonMenu } from "@vibe/core";
Copy
Props
SplitButtonSplitButtonMenu
Name	Description	Default	
Control

active	
displays the active state
boolean
	-	Set boolean
activeButtonClassName	
string
	-	Set string
aria-controls	
aria controls - receives id for the controlled region
string
	-	Set string
aria-describedby	
string
	-	Set string
aria-expanded	
aria to be set if the popup is open
boolean
	-	Set boolean
aria-haspopup	
aria for a button popup
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
aria to be used for screen reader to know if the button is hidden
Booleanish
	-	Set object
aria-label	
aria label to provide important when providing only Icon
string
	-	Set string
aria-labelledby	
element id to describe the button accordingly
string
	-	Set string
aria-pressed	
Indicates the current "pressed" state of toggle buttons
boolean
"true"
"false"
"mixed"
	-	Set object
blurOnMouseUp	
Blur on button click
boolean
	-	Set boolean
className	
Custom class names to pass to the component
string
	-	Set string
color	
The button's color
ButtonColor
	
primary
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
defaultTextColorOnPrimaryColor	
default color for text color in ON_PRIMARY_COLOR kind (should be any type of css color (rbg, var, hex...)
string
	-	Set string
dialogContainerSelector	
The CSS selector of the container where the dialog should be rendered.
string
	-	Set string
dialogPaddingSize	
The padding size inside the secondary dialog.
DialogSize
	
medium
	Set object
disabled	
Whether the button should be disabled or not
boolean
	-	Set boolean
id	
id to pass to the button
string
	-	Set string
insetFocus	
Change the focus indicator from around the button to within it
boolean
	-	Set boolean
kind	
The button's kind
ButtonType
	
primary
	Set object
leftFlat	
boolean
	-	Set boolean
leftIcon	
Icon to place on the left
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

loaderClassName	
className which is applied to loader container *
string
	-	Set string
loading	
loading boolean which switches the text to a loader
boolean
	-	Set boolean
marginLeft	
adds 8px margin to the left
boolean
	-	Set boolean
marginRight	
adds 8px margin to the right
boolean
	-	Set boolean
name	
Name of the button - for form submit usages
string
	-	Set string
noSidePadding	
boolean
	-	Set boolean
onBlur	
On Button Blur callback
(event: FocusEvent<HTMLButtonElement, Element>) => void
	-	-
onClick	
Callback function to run when the button is clicked
(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
	-	-
onFocus	
On Button Focus callback
(event: FocusEvent<HTMLButtonElement, Element>) => void
	-	-
onMouseDown	
(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
	-	-
onSecondaryDialogDidHide	
Callback fired when the secondary dialog is hidden.
() => void
	-	-
onSecondaryDialogDidShow	
Callback fired when the secondary dialog is shown.
() => void
	-	-
preventClickAnimation	
boolean
	-	Set boolean
rightFlat	
boolean
	-	Set boolean
rightIcon	
Icon to place on the right
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

secondaryDialogClassName	
Class name applied to the wrapper of the secondary dialog.
string
	
""
	Set string
secondaryDialogContent	
The element or renderer that is displayed inside the dialog opened by clicking the secondary button.
ReactElement<any, string | JSXElementConstructor<any>> | (() => string | ReactElement<any, string | JSXElementConstructor<any>>)
	-	-
secondaryDialogPosition	
The position of the secondary dialog.
SplitButtonSecondaryContentPositionType
	
bottom-start
	Set object
shouldCloseOnClickInsideDialog	
If true, clicking inside the dialog will close it.
boolean
	-	Set boolean
size	
The button's size
ButtonSize
	-	Set object
style	
CSSProperties
	-	Set object
success	
the success props are used when you have async action and wants to display a success message
boolean
	-	Set boolean
successIcon	
Success icon name
SubIcon
	-	Set object
successText	
Success text
string
	-	Set string
tabIndex	
Specifies the tab order of an element
number
	-	Set number
type	
The button's type
ButtonInputType
	-	Set object
zIndex	
The z-index applied to the secondary dialog.
number
	-	Set number
Usage
Try limiting the overall number of choices within the menu to less than four.
Order the items within the menu by popularity for a small number of items, or alphabetically for a larger number of items.
Avoid submenus within split button menu.
Split button contains two actions: One primary action and a list of secondary actions.
🤓
Tip
If the actions in the menu are not related to each other, consider using a 
Menu
 component.
Variants
Types

The split button has three variants: primary, secondary, and tertiary.

Primary
Secondary
Tertiary
Story Editor
<>
  <SplitButton
    id="types-primary"
    aria-label="Primary split button"
    secondaryDialogContent={
      <SplitButtonMenu id="types-primary-menu">
        <MenuItem id="types-primary-check" icon={Check} title="Hey" />
        <MenuItem
          id="types-primary-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Primary
  </SplitButton>
  <SplitButton
    id="types-secondary"
    aria-label="Secondary split button"
    kind="secondary"
    secondaryDialogContent={
      <SplitButtonMenu id="types-secondary-menu">
        <MenuItem id="types-secondary-check" icon={Check} title="Hey" />
        <MenuItem
          id="types-secondary-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Secondary
  </SplitButton>
  <SplitButton
    id="types-tertiary"
Copy
Format
Reset
Sizes

The split button has supports multiple sizes: small, medium and large.

Small
Medium
Large
Story Editor
<>
  <SplitButton
    id="sizes-small"
    aria-label="Small split button"
    size="small"
    secondaryDialogContent={
      <SplitButtonMenu id="sizes-small-menu">
        <MenuItem id="sizes-small-check" icon={Check} title="Hey" />
        <MenuItem
          id="sizes-small-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Small
  </SplitButton>
  <SplitButton
    id="sizes-medium"
    aria-label="Medium split button"
    size="medium"
    secondaryDialogContent={
      <SplitButtonMenu id="sizes-medium-menu">
        <MenuItem id="sizes-medium-check" icon={Check} title="Hey" />
        <MenuItem
          id="sizes-medium-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Medium
  </SplitButton>
  <SplitButton
Copy
Format
Reset
Icon usage
Left icon
Right icon
Story Editor
<>
  <SplitButton
    id="icons-left"
    aria-label="Split button with left icon"
    leftIcon={Add}
    secondaryDialogContent={
      <SplitButtonMenu id="icons-left-menu">
        <MenuItem id="icons-left-check" icon={Check} title="Hey" />
        <MenuItem
          id="icons-left-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Left icon
  </SplitButton>
  <SplitButton
    id="icons-right"
    aria-label="Split button with right icon"
    rightIcon={Add}
    secondaryDialogContent={
      <SplitButtonMenu id="icons-right-menu">
        <MenuItem id="icons-right-check" icon={Check} title="Hey" />
        <MenuItem
          id="icons-right-announcement"
          icon={Announcement}
          title="There"
        />
      </SplitButtonMenu>
    }
  >
    Right icon
  </SplitButton>
</>
Copy
Format
Reset
Do’s and Don’ts
New item
Search
Filter
Do
Use only one primary action within a single view.
New item
Search
Don't
Don’t use multiple primary buttons within a single view.
New item
Do
Use split button if there are more than one action within the menu.
New item
Don't
Don’t use split button if there’s only one option within the menu. Use 
Button
 instead (see example in the secondary dialog).
New item
Do
Use a split button to display an action with related actions. The main action should be the most common.
New item
Don't
Don’t use a split button to group not related actions (see example in the secondary dialog).
Use cases and examples
Split button as the primary action

Use template is the main action.

Use template
Story Editor
<SplitButton
  id="primary-action"
  aria-label="Use template split button"
  secondaryDialogPosition="bottom-start"
  secondaryDialogContent={
    <SplitButtonMenu id="primary-action-menu">
      <MenuItem
        id="primary-action-import"
        icon={Download}
        title="Import template"
      />
      <MenuItem
        id="primary-action-export"
        icon={Upload}
        title="Export template"
      />
    </SplitButtonMenu>
  }
>
  Use template
</SplitButton>
Copy
Format
Reset
Secondary split button

When there’s already a primary button in the view, use a secondary split button.

Export to CSV
New item
Story Editor
<>
  <SplitButton
    id="secondary-export"
    aria-label="Export options split button"
    kind="secondary"
    secondaryDialogPosition="bottom-start"
    secondaryDialogContent={
      <SplitButtonMenu id="secondary-export-menu">
        <MenuItem id="secondary-export-pdf" title="Export to PDF" />
        <MenuItem id="secondary-export-docx" title="Export to DOCX" />
        <MenuItem id="secondary-export-excel" title="Export to Excel" />
      </SplitButtonMenu>
    }
  >
    Export to CSV
  </SplitButton>
  <Button id="new-item-button" aria-label="Create new item">
    New item
  </Button>
</>
Copy
Format
Reset
Custom menu

The split button can accept a custom Menu in case there's a need to override the default behavior.

Notice to always include focusItemIndexOnMount prop for accessibility reasons when using custom menus.

Custom menu
Story Editor
<SplitButton
  id="custom-menu"
  aria-label="Custom menu split button"
  secondaryDialogContent={
    <Menu focusItemIndexOnMount={2} id="custom-menu-content" size="medium">
      <MenuTitle caption="Look up, you might see" captionPosition="top" />
      <MenuItem id="custom-menu-sun" icon={Sun} type="svg" title="The sun" />
      <MenuItem id="custom-menu-moon" icon={Moon} type="svg" title="The moon" />
      <MenuItem
        id="custom-menu-stars"
        icon={Favorite}
        type="svg"
        title="And the stars"
      />
    </Menu>
  }
>
  Custom menu
</SplitButton>
Copy
Format
Reset
Related components
Get started
Button
Allow users take actions with a single click.
Alpha
Beta
Delta
ButtonGroup
Used to group related options.
Send
Delete
More info
Menu
Displays information related to an element over it.
