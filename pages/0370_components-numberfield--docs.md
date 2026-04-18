---
id: components-numberfield--docs
type: docs
title: "Components/NumberField"
name: "Docs"
importPath: "./src/pages/components/NumberField/NumberField.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-numberfield--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:43:36.559Z
---

NumberField
Overview

The NumberField component provides an accessible, strictly numeric input with built-in vertical stepper controls for incrementing or decrementing values. It supports controlled usage, custom sizing, min/max clamping, and visual feedback states (error, success, disabled, read-only).

Story Editor
args => {
  const [value, setValue] = useState(args.value || 0);
  return (
    <div
      style={{
        width: 300,
      }}
    >
      <NumberField
        id="overview-number-field"
        {...args}
        value={value}
        onChange={newValue => setValue(newValue)}
      />
    </div>
  );
}
Copy
Format
Reset
Import path
import { NumberField } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

allowOutOfBounds	

If false, the value will be clamped to the min/max values on change. If true, the value can exceed the min/max values. Can be used alongside onValidityChange to handle the validity of the value.

boolean
	-	Set boolean
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the input will be disabled.
boolean
	-	Set boolean
error	
If true, the input will be in an error state.
boolean
	-	Set boolean
id	

The id of the input. Required when label or infoText is provided for accessibility reasons. The id of the input. Required when infoText or label is provided for accessibility reasons. The id of the input.

string
	-	Set string
infoText	

Informational text to display below the input. Informational text to display below the input. If provided, an id is also required for accessibility.

string
	-	Set string
label	
The label for the input.
string
	-	Set string
leftIcon	
An icon to display on the left side of the input.
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

max	
The maximum value allowed.
number
	-	Set number
min	
The minimum value allowed.
number
	-	Set number
onChange*	
Callback fired when the value changes.
(value: number, event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element> | ChangeEvent<HTMLInputElement>) => void
value	The new value.
event	The event that triggered the change.
	-	-
onValidityChange	
Callback fired when the validity of the value changes (if it is within the min/max bounds).
(isValid: boolean) => void
	-	-
placeholder	
The placeholder text to display when the input is empty.
string
	-	Set string
readOnly	
If true, the input will be read-only.
boolean
	-	Set boolean
required	
If true, the input will be required.
boolean
	-	Set boolean
size	
The size of the input.
"small"
"medium"
"large"
	
medium
	
small
medium
large

step	
The amount to increment or decrement the value by.
number
	
1
	Set number
success	
If true, the input will be in a success state.
boolean
	-	Set boolean
value*	
The current value of the number field.
number
	-	Set number
Usage
Always pass both `value` and `onChange` props to use the component in controlled mode.
Use `min`, `max`, and `step` to enforce value boundaries and configure stepping behavior.
Use `allowOutOfBounds` when you want to allow users to enter invalid values and handle validation externally.
Leverage validation states (`error`, `success`) with `infoText` to provide clear feedback to users.
Apply `disabled` or `readOnly` states to prevent user interaction when necessary.
Use `step` to control increment/decrement granularity - defaults to 1 for whole numbers.
Accessibility
Using an id is highly recommended for all instances to ensure the best accessibility.
Always provide a visible label or an aria-label to ensure the input's purpose is clear to all users.
When using label or infoText, you must also provide an id. This is crucial, as it allows screen readers to correctly associate the input with its label and description.
Providing an id also automatically links the Increment and Decrement buttons to the input via the aria-controls attribute, further improving the experience for users of assistive technologies.
Variants
Size Variants

There are three sizes available: Small (32px), Medium (40px), and Large (48px).

Large
Medium
Small
Story Editor
() => {
  const [valueL, setValueL] = useState(2);
  const [valueM, setValueM] = useState(2);
  const [valueS, setValueS] = useState(2);
  return (
    <Flex gap="medium" align="start">
      <NumberField
        id="size-large"
        value={valueL}
        onChange={setValueL}
        label="Large"
        size="large"
      />
      <NumberField
        id="size-medium"
        value={valueM}
        onChange={setValueM}
        label="Medium"
        size="medium"
      />
      <NumberField
        id="size-small"
        value={valueS}
        onChange={setValueS}
        label="Small"
        size="small"
      />
    </Flex>
  );
}
Copy
Format
Reset
States

Different states including success, error, disabled, and read-only with reactive validation feedback.

Success State
This is a success message
Error State
This is an error message
Read Only State
Read-only field
Disabled State
Cannot edit when disabled
Story Editor
() => {
  const [successValue, setSuccessValue] = useState(10);
  const [errorValue, setErrorValue] = useState(5);
  return (
    <Flex direction="column" gap="medium" align="start">
      <NumberField
        id="success-state"
        value={successValue}
        onChange={setSuccessValue}
        label="Success State"
        success
        infoText="This is a success message"
      />
      <NumberField
        id="error-state"
        value={errorValue}
        onChange={setErrorValue}
        label="Error State"
        error
        infoText="This is an error message"
      />
      <NumberField
        id="readonly-state"
        value={42}
        onChange={() => {}}
        label="Read Only State"
        readOnly
        infoText="Read-only field"
      />
      <NumberField
        id="disabled-state"
        value={5}
        onChange={() => {}}
        label="Disabled State"
        disabled
        infoText="Cannot edit when disabled"
Copy
Format
Reset
Additional Variants

Examples with icons and informational text.

With Icon
With Info Text
You are doing great!
Story Editor
() => {
  const [iconValue, setIconValue] = useState(1);
  const [infoValue, setInfoValue] = useState(100);
  return (
    <Flex direction="column" gap="medium" align="start">
      <NumberField
        id="with-icon"
        value={iconValue}
        onChange={setIconValue}
        label="With Icon"
        leftIcon={TextBig}
      />
      <NumberField
        id="with-info"
        value={infoValue}
        onChange={setInfoValue}
        label="With Info Text"
        infoText="You are doing great!"
      />
    </Flex>
  );
}
Copy
Format
Reset
Validation

The NumberField supports comprehensive validation with dynamic feedback. Use allowOutOfBounds to permit invalid entries while providing real-time validation feedback.

Validation Example (Range: 0-100)
Value is within valid range!
Story Editor
() => {
  const [value, setValue] = useState(50);
  const [isValid, setIsValid] = useState(true);
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  const handleValidityChange = (valid: boolean) => {
    setIsValid(valid);
  };
  return (
    <Flex
      direction="column"
      gap="medium"
      align="start"
      style={{
        width: 300,
      }}
    >
      <NumberField
        id="validation-example"
        value={value}
        onChange={handleChange}
        onValidityChange={handleValidityChange}
        label="Validation Example (Range: 0-100)"
        min={0}
        max={100}
        allowOutOfBounds
        success={isValid}
        error={!isValid}
        infoText={
          isValid
            ? "Value is within valid range!"
            : "Value is outside the valid range (0-100)"
        }
      />
    </Flex>
Copy
Format
Reset
Do's and Don'ts
Age
Enter your age
Do
Provide specific, descriptive labels and helpful context with explanatory helper text to clarify the expected input.
Number
Enter a value
Don't
Avoid generic labels like 'Number' or 'Value'. The label should be specific about what the user needs to enter.
Temperature (°C)
Temperature cannot be negative
Do
When input is invalid, provide immediate visual feedback but allow the user to see and correct their entry.
Temperature (°C)
Don't
Don't show an error state without a clear explanation. Always provide a helpful message that guides the user to a valid input.
Related components
TextField
Allows users take actions with a single click.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
Search
Displays content classification.
