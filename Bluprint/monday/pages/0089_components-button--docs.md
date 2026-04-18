---
id: components-button--docs
type: docs
title: "Components/Button"
name: "Docs"
importPath: "./src/pages/components/Button/Button.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-button--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:33:45.992Z
---

Button

Buttons allow users to trigger an action or event with a single click. For example, you can use a button for allowing the functionality of submitting a form, opening a dialog, canceling an action, or performing a delete operation.

Button
Show code
Import
import { Button } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

active	
displays the active state
boolean
	
false
	Set boolean
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
	-	

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
	
true
	Set boolean
children	
	-	

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
	"rgba(0, 0, 0, 0)"	Set string
disabled	
Whether the button should be disabled or not
boolean
	
false
	Set boolean
id	
id to pass to the button
string
	-	

insetFocus	
Change the focus indicator from around the button to within it
boolean
	
false
	Set boolean
kind	
The button's kind
ButtonType
	
primary
	Set object
leftFlat	
boolean
	
false
	Set boolean
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
	
false
	Set boolean
marginRight	
adds 8px margin to the right
boolean
	
false
	Set boolean
name	
Name of the button - for form submit usages
string
	-	Set string
noSidePadding	
boolean
	
false
	Set boolean
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
preventClickAnimation	
boolean
	
false
	Set boolean
rightFlat	
boolean
	
false
	Set boolean
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

size	
The button's size
ButtonSize
	
medium
	Set object
style	
CSSProperties
	-	Set object
success	
the success props are used when you have async action and wants to display a success message
boolean
	
false
	Set boolean
successIcon	
Success icon name
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

successText	
Success text
string
	
""
	Set string
tabIndex	
Specifies the tab order of an element
number
	-	Set number
type	
The button's type
ButtonInputType
	
button
	Set object
Usage
Buttons may contain icon, on the left or the right side
Use 8 px spacing between buttons
Replace text with a loader if action is submitted, but still processing
Button width is set by it’s content, avoid changing it width
Use only one primary button, and any remaining calls to action should be represented as lower emphasis buttons
🤓
Tip
If you need to use icon as button with no text, check out 
IconButton
 component
Accessibility
Using an id is recommended for all instances to ensure proper label association.
Always provide descriptive text content for buttons, or use ariaLabel prop when buttons contain only icons.
Use ariaLabel prop when you need to provide a custom accessible name that differs from the visible button text or for icon-only buttons.
Use ariaLabeledBy prop when an external element provides the accessible name for the button.
Use ariaHasPopup prop when the button triggers a popup menu or dialog.
Use ariaExpanded prop to indicate when a popup triggered by the button is open or closed.
Use ariaControls prop to link the button to the element it controls.
Use aria-describedby prop when additional descriptive text is needed for the button.
Use aria-pressed prop for toggle buttons to indicate their current pressed state.
Variants
Button kinds

There can be more than one button in a screen, but to create the hierarchy of actions we need to use button kinds.

Primary
Secondary
Tertiary
Story Editor
<>
  <Button id="button-kinds-primary" aria-label="Primary button">
    Primary
  </Button>
  <Button
    id="button-kinds-secondary"
    aria-label="Secondary button"
    kind="secondary"
  >
    Secondary
  </Button>
  <Button
    id="button-kinds-tertiary"
    aria-label="Tertiary button"
    kind="tertiary"
  >
    Tertiary
  </Button>
</>
Copy
Format
Reset
Sizes
Large
Medium
Small
Story Editor
<>
  <Button id="sizes-large" aria-label="Large button" size="large">
    Large
  </Button>
  <Button id="sizes-medium" aria-label="Medium button" size="medium">
    Medium
  </Button>
  <Button id="sizes-small" aria-label="Small button" size="small">
    Small
  </Button>
</>
Copy
Format
Reset
Disabled

Set disable button for something that isn’t usable. Use a tooltip on hover in order to indicate the reason of the disabled action.

Primary
Secondary
Tertiary
Story Editor
<>
  <Button id="disabled-primary" aria-label="Primary button disabled" disabled>
    Primary
  </Button>
  <Button
    id="disabled-secondary"
    aria-label="Secondary button disabled"
    kind="secondary"
    disabled
  >
    Secondary
  </Button>
  <Button
    id="disabled-tertiary"
    aria-label="Tertiary button disabled"
    kind="tertiary"
    disabled
  >
    Tertiary
  </Button>
</>
Copy
Format
Reset
States
Regular
Active
Story Editor
<>
  <Button id="state-regular" aria-label="Regular button">
    Regular
  </Button>
  <Button id="state-active" aria-label="Active button" active>
    Active
  </Button>
</>
Copy
Format
Reset
Positive and Negative
Positive
Negative
Story Editor
<>
  <Button id="color-positive" aria-label="Positive button" color="positive">
    Positive
  </Button>
  <Button id="color-negative" aria-label="Negative button" color="negative">
    Negative
  </Button>
</>
Copy
Format
Reset
Icons
Right icon
Left icon
Story Editor
<>
  <Button
    id="icons-right"
    rightIcon={Calendar}
    aria-label="Open calendar on the right icon button"
  >
    Right icon
  </Button>
  <Button
    id="icons-left"
    leftIcon={Calendar}
    aria-label="Open calendar on the left icon button"
  >
    Left icon
  </Button>
</>
Copy
Format
Reset
Do’s and Don’ts
Get started
Do
Use 1 or 2 words, no longer than 4 words, with fewer than 20 characters including spaces.
Get started and enjoy discount!
Don't
Don’t use punctuation marks such as periods or exclamation points.
Get started
Do
Use sentence-case capitalization.
Get Started
GET STARTED
Don't
Don’t use title case captalization or all caps.
Cancel
Get started
Do
Use primary button as the main action , put the tertiary as the second option.
Get started
Cancel
Don't
Use primary button next to secondary.
Cancel
Get started
Do
Use active verbs or phrases that clearly indicate action.
Yes
No
Don't
Use vague and generic labels that make the user read the dialog before taking action.
Use cases and examples
Loading state
Click here for loading
Story Editor
() => {
  const [loading, setLoading] = useState(false);
  const onClick = useCallback(() => {
    setLoading(true);
  }, [setLoading]);
  return (
    <Button
      id="loading-state-button"
      aria-label="Start loading"
      loading={loading}
      onClick={onClick}
    >
      Click here for loading
    </Button>
  );
}
Copy
Format
Reset
Success state
Click here for success
Story Editor
() => {
  const [success, setSuccess] = useState(false);
  const onClick = useCallback(() => {
    setSuccess(true);
  }, [setSuccess]);
  return (
    <Button
      id="success-state-button"
      aria-label="Trigger success"
      success={success}
      onClick={onClick}
      successIcon={Check}
      successText="Success"
    >
      Click here for success
    </Button>
  );
}
Copy
Format
Reset
On color state
Regular
Primary on colorSecondary on colorTertiary on color


Disabled
Primary on colorSecondary on colorTertiary on color
Story Editor
<>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Text type="text1">Regular</Text>
    <div
      style={{
        backgroundColor: "var(--sb-primary-color)",
        padding: "16px",
      }}
    >
      <Button
        id="on-color-primary"
        aria-label="Primary on color"
        color="on-primary-color"
        marginRight
      >
        Primary on color
      </Button>
      <Button
        id="on-color-secondary"
        aria-label="Secondary on color"
        color="on-primary-color"
        kind="secondary"
        marginRight
      >
        Secondary on color
      </Button>
      <Button
        id="on-color-tertiary"
        aria-label="Tertiary on color"
        color="on-primary-color"
Copy
Format
Reset
Adjacent buttons
Story Editor
<div>
  <Button
    id="decrease-zoom-button"
    kind="secondary"
    size="small"
    aria-label="Decrease zoom level"
    rightFlat
  >
    <Remove />
  </Button>
  <Button
    id="increase-zoom-button"
    kind="secondary"
    size="small"
    aria-label="Increase zoom level"
    leftFlat
  >
    <Add />
  </Button>
</div>
Copy
Format
Reset
Related components
Button
SplitButton
Dual-function menu button offers a default action and a secondary action
Alpha
Beta
Delta
ButtonGroup
Used to group related options.
What's new
Badge
Used to place an indicator / counter on a child component
