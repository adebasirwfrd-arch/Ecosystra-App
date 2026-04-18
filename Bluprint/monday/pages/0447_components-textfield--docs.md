---
id: components-textfield--docs
type: docs
title: "Components/TextField"
name: "Docs"
importPath: "./src/pages/components/TextField/TextField.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-textfield--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:47:34.384Z
---

TextField

An input field includes a label and a text field users can type text into. They typically appear in forms and dialogs.

Name
Helper text
0
Maximum of null characters
Show code
Import
import { TextField } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

activeDescendant	
The ID of the currently active search result.
string
	
""
	Set string
allowExceedingMaxLength	
If true, allows the user to exceed the character limit set by maxLength.
boolean
	
false
	Set boolean
autoComplete	
Configures the browser's autocomplete behavior.
string
	
"off"
	Set string
autoFocus	
If true, the input is automatically focused on mount.
boolean
	
false
	Set boolean
className	
A CSS class name to apply to the component.
string
	
""
	Set string
clearOnIconClick	
If true, clears the input when the icon is clicked.
boolean
	
false
	Set boolean
controlled	
If true, the component is controlled by an external state.
boolean
	
false
	Set boolean
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
debounceRate	
The debounce rate for input value changes.
number
	
0
	Set number
dir	
The text direction of the input.
"auto"
"ltr"
"rtl"
	-	
auto
ltr
rtl

disabled	
If true, disables the text field.
boolean
	
false
	Set boolean
icon	
The primary icon displayed inside the text field.
string | FunctionComponent<{}>
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

iconLabel	
Accessible label for the primary icon.
string
	-	Set string
iconTooltipContent	
Tooltip content for the primary icon.
string
	-	Set string
id	
An HTML id attribute for the component.
string
	
"input"
	

inputAriaLabel	
The ARIA label for the input field.
string
	-	Set string
labelIconName	
The icon displayed inside the label.
string | FunctionComponent<{}>
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

loading	
If true, displays a loading indicator inside the text field.
boolean
	
false
	Set boolean
maxLength	
The maximum number of characters allowed.
number
	-	Set number
name	
The name attribute for the input field.
string
	-	Set string
onBlur	
Callback fired when the text field loses focus.
(event: FocusEvent<Element, Element>) => void
	-	-
onChange	
Callback fired when the text field value changes.
(value: string, event: ChangeEvent<HTMLInputElement> | Pick<ChangeEvent<HTMLInputElement>, "target">) => void
	-	-
onFocus	
Callback fired when the text field gains focus.
(event: FocusEvent<Element, Element>) => void
	-	-
onIconClick	
Callback fired when the icon inside the text field is clicked.
(icon: string | FunctionComponent<{}>) => void
	-	-
onKeyDown	
Callback fired when a key is pressed inside the text field.
(event: KeyboardEvent<Element>) => void
	-	-
onWheel	
Callback fired when the mouse wheel is used inside the text field.
(event: WheelEvent<Element>) => void
	-	-
placeholder	
The placeholder text displayed when the input is empty.
string
	
""
	

readonly	
If true, makes the text field read-only.
boolean
	
false
	Set boolean
required	
If true, marks the input as required.
boolean
	
false
	Set boolean
requiredErrorText	
The error message displayed when a required field is left empty.
string
	
""
	Set string
role	
The ARIA role of the text field.
string
	
""
	Set string
searchResultsContainerId	
The ID of the container where search results are displayed.
string
	
""
	Set string
secondaryDataTestId	
Test ID for the secondary icon.
string
	-	Set string
secondaryIconLabel	
Accessible label for the secondary icon.
string
	-	Set string
secondaryIconName	
The secondary icon displayed inside the text field.
string | FunctionComponent<{}>
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

secondaryTooltipContent	
Tooltip content for the secondary icon.
string
	-	Set string
setRef	
A function to set a reference to the input element.
(node: HTMLElement) => void
	-	-
showCharCount	
If true, displays the character count.
boolean
	
false
	
FalseTrue
size	
The size of the text field.
TextFieldSize
	
small
	Set object
tabIndex	
The tab order of the input field.
number
	-	Set number
title	
The label displayed above the text field.
string
	
""
	

trim	
If true, trims whitespace from the input value.
boolean
	
false
	Set boolean
type	
The type of the text field.
TextFieldType
	
text
	Set object
underline	
If true, renders only an underline style for the text field.
boolean
	
false
	Set boolean
validation	
Validation state for the text field.
{ status?: "error" | "success"; text?: ReactNode; }
	-	
RAW
validation : {
text : "Helper text"
}

value	
The current value of the text field.
string
	-	Set string
wrapperClassName	
Class name applied to the text field wrapper.
string
	
""
	Set string
Usage
Always use placeholder in input field
Icons can be used to message alerts as well. Pair them with error messages to provide redundant alerts.
Character or word counters should be used if there is a character or word limit.
Accessibility
Using an id is highly recommended for all instances to ensure the best accessibility.
Always provide a visible title or an inputAriaLabel to ensure the input's purpose is clear to all users.
When using title or validation text, you must also provide an id. This is crucial, as it allows screen readers to correctly associate the input with its label and description.
For required fields, use the required prop to ensure proper screen reader announcements and native browser validation.
Provide descriptive error messages using validation prop with status 'error' to help users understand and correct validation issues.
When using icons, provide meaningful labels through iconLabel and secondaryIconLabel props for screen reader users.
For search inputs, use type='search' and provide searchResultsContainerId to properly associate with search results.
Character counting with showCharCount automatically provides accessibility labels for screen readers.
Variants
Sizes

There are three sizes available: Small (32px), Medium (40px) and Large (48px).

Story Editor
<Flex
  direction="column"
  gap="medium"
  style={{
    width: 300,
  }}
>
  <TextField
    id="sizes-small"
    inputAriaLabel="Small text field"
    placeholder="Small"
  />
  <TextField
    id="sizes-medium"
    inputAriaLabel="Medium text field"
    placeholder="Medium"
    size="medium"
  />
  <TextField
    id="sizes-large"
    inputAriaLabel="Large text field"
    placeholder="Large"
    size="large"
  />
</Flex>
Copy
Format
Reset
States
Name
Story Editor
<Flex gap="large">
  <Flex
    direction="column"
    gap="medium"
    style={{
      marginTop: "var(--space-32)",
      width: 300,
    }}
  >
    <TextField
      id="states-disabled"
      inputAriaLabel="Disabled text field"
      placeholder="Disabled"
      size="medium"
      disabled
    />
    <TextField
      id="states-with-icon"
      inputAriaLabel="Text field with icon"
      placeholder="With icon"
      icon={Email}
      size="medium"
    />
    <TextField
      id="states-clickable-icon"
      inputAriaLabel="Text field with clickable icon"
      placeholder="With clickable icon"
      iconTooltipContent="Copy"
      icon={Duplicate}
      onIconClick={() => {}}
      size="medium"
    />
  </Flex>
  <Flex
    direction="column"
    gap="medium"
Copy
Format
Reset
Validation

Use validation to give feedback to the user for a case where he has provided an invalid input. The validation error should appear when the user is done typing and getting out of the input’s focus.

The validation object has two status states - error, success
Name
Validation text
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <TextField
    id="validation-textfield"
    placeholder="Validate me"
    title="Name"
    size="medium"
    validation={{
      status: "error",
      text: "Validation text",
    }}
  />
</div>
Copy
Format
Reset
Do’s and Don’ts
Email
Do
Make sure your text field has a short, descriptive label above it that describes what the user should type into the box below.
What is your email address?
Don't
Avoid phrasing your labels as questions. Keep in mind that your label shouldn’t contain instructions. Reserve those for the helper text.
Email
Do
Use the help text description to convey requirements or to show any formatting examples that would help user comprehension.
Email
For example: email@monday.com
Don't
Avoid repeating the field label. If the field label provides sufficient context for completing the action, then you likely don’t need to add help text.
Use cases and examples
Text field in a form

Users can insert text.

Dark Mode Feedback Form
Your Name
Email
Story Editor
<Flex
  align="stretch"
  direction="column"
  gap="large"
  style={{
    width: 300,
  }}
>
  <Heading type="h1" weight="bold" maxLines={2}>
    Dark Mode Feedback Form
  </Heading>
  <Flex direction="column" gap="medium">
    <TextField
      id="form-name"
      title="Your Name"
      size="medium"
      placeholder="John Doe"
    />
    <TextField
      id="form-email"
      title="Email"
      size="medium"
      placeholder="email@monday.com"
    />
  </Flex>
</Flex>
Copy
Format
Reset
Input field with placeholder text
Invite with email
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <TextField
    id="placeholder-text-field"
    title="Invite with email"
    labelIconName={Email}
    placeholder="Enter one or more email"
    size="medium"
  />
</div>
Copy
Format
Reset
Required input field
Email Address *
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <TextField
    id="required-field"
    placeholder="Your email"
    title="Email Address"
    size="medium"
    required
  />
</div>
Copy
Format
Reset
Input field with date
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <TextField
    id="date-field"
    inputAriaLabel="Select a date"
    size="medium"
    type="date"
  />
</div>
Copy
Format
Reset
Input field with datetime
Story Editor
<div
  style={{
    width: 300,
  }}
>
  <TextField
    id="datetime-field"
    inputAriaLabel="Select date and time"
    size="medium"
    type="datetime-local"
  />
</div>
Copy
Format
Reset
Related components
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
Search
Displays content classification.
Option 1
Option 2
Option 3
Combobox
Combobox allowing users to filter longer lists to only the selections matching a query.
