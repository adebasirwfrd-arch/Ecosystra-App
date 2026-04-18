---
id: components-toast--docs
type: docs
title: "Components/Toast"
name: "Docs"
importPath: "./src/pages/components/Toast/Toast.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-toast--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:48:07.448Z
---

Toast

A toast notification is a message object that presents timely information, including confirmation of actions, alerts, and errors.

General message toast
Button
Show code
Import
import { Toast } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

action	
The action element displayed in the toast.
Element
	-	Set object
actions	
The actions available in the toast.
ToastAction[]
	-	
RAW
actions : [
0 : {...} 2 keys
]

autoHideDuration	

The number of milliseconds before the toast automatically closes. (0 or null disables auto-close behavior).

number
	-	Set number
children	
The content displayed inside the toast.
string | ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
	-	

className	
A CSS class name to apply to the component.
string
	-	Set string
closeable	
If false, hides the close button.
boolean
	
true
	Set boolean
closeButtonAriaLabel	
The aria-label for the close button.
string
	
"Close"
	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
hideIcon	
If true, hides the toast icon.
boolean
	
false
	Set boolean
icon	
The icon displayed in the toast.
string | FC<IconSubComponentProps>
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

loading	
If true, displays a loading indicator inside the toast.
boolean
	
false
	Set boolean
onClose	
Callback fired when the toast is closed.
() => void
	-	-
open	
If true, the toast is open (visible).
boolean
	
false
	
FalseTrue
type	
The type of toast.
ToastType
	
normal
	Set object
Usage
Use toast notifications immediately after a specific event such as a user action that does not relate to an object on the page. Toast used as a feedback loop to a user’s action.
Toasts should appear one at a time, and only disappear when no longer required.
Always be concise, write a short and clear message.
Where possible, give follow up actions to allow the user to become more informed or resolve the issue.
Always provide an action button or option to undo.
Toast should overlay permanent UI elements without blocking important actions.
🤓
Check yourself
Need to inform the user about a system’s action? Use an 
AlertBanner
 instead.
Accessibility
For dismissible Toasts, use the closeButtonAriaLabel prop to provide a descriptive accessible name for the close button (e.g., "Dismiss notification", "Close success message").
Variants
Default with button
General message toast
Button
Story Editor
() => {
  return (
    <Toast
      id="default-with-button"
      open
      actions={[
        {
          type: "button",
          content: "Button",
        },
      ]}
    >
      General message toast
    </Toast>
  );
}
Copy
Format
Reset
Toast with link
General message toast
Link to action
Story Editor
() => {
  return (
    <Toast
      id="toast-with-link"
      open
      actions={[
        {
          type: "link",
          text: "Link to action",
          href: "https://monday.com",
        },
      ]}
    >
      General message toast
    </Toast>
  );
}
Copy
Format
Reset
Toast with loading
General message toast
Story Editor
() => {
  return (
    <Toast id="toast-loading" open loading>
      General message toast
    </Toast>
  );
}
Copy
Format
Reset
Success message

Use to providing a feedback loop. For example: Item copied.

Positive message toast
Undo 5
Story Editor
() => {
  return (
    <Toast
      id="success-message"
      open
      type="positive"
      actions={[
        {
          type: "button",
          content: "Undo 5",
        },
      ]}
    >
      Positive message toast
    </Toast>
  );
}
Copy
Format
Reset
Error message

Use when something was deleted, a problem has occurred, etc.

Negative message toast
Button
Story Editor
() => {
  return (
    <Toast
      id="error-message"
      open
      actions={[
        {
          type: "button",
          content: "Button",
        },
      ]}
      type="negative"
    >
      Negative message toast
    </Toast>
  );
}
Copy
Format
Reset
Warning message
Warning message toast
Button
Story Editor
() => {
  return (
    <Toast
      id="warning-message"
      open
      actions={[
        {
          type: "button",
          content: "Button",
        },
      ]}
      type="warning"
    >
      Warning message toast
    </Toast>
  );
}
Copy
Format
Reset
Dark message
Dark message toast
Button
Story Editor
() => {
  return (
    <Toast
      id="dark-message"
      open
      actions={[
        {
          type: "button",
          content: "Button",
        },
      ]}
      type="dark"
    >
      Dark message toast
    </Toast>
  );
}
Copy
Format
Reset
Do’s and Don’ts
Do
Use only one toast on a screen at a time.
Don't
Don’t place more than one toast on a screen at a time.
Do
Always offer an option to undo the action. Keep the toast for 60 seconds before auto-removing it.
Don't
Don’t offer an action without letting the user undo it.
Do
If the toast message has 2 steps, make sure both toasts have roughly the same width.
Don't
If the toast message has 2 steps, don’t use toasts with very different widths.
Use cases and examples
Feedback loop

After a user has done an action, provide feedback to close the loop. For example, when an item has been deleted, duplicated, etc.

We successfully deleted 1 item
Undo
Story Editor
() => {
  return (
    <Toast
      id="feedback-loop"
      open
      type="positive"
      actions={[
        {
          type: "button",
          content: "Undo",
        },
      ]}
    >
      We successfully deleted 1 item
    </Toast>
  );
}
Copy
Format
Reset
Animation

Our toast includes 2 animations: slide-in and transform. The transform animation is triggered when the toast changes from one state to another (for example, from loading to success).

Success action
Failure action
Story Editor
() => {
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [failureToastOpen, setFailureToastOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const onSuccessClick = useCallback(() => {
    setSuccessToastOpen(true);
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
    }, 1000);
  }, []);
  const onFailureClick = useCallback(() => {
    setFailureToastOpen(true);
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
    }, 1000);
  }, []);
  return (
    <Flex gap="medium">
      <Button
        id="animation-success-button"
        aria-label="Trigger success toast"
        onClick={onSuccessClick}
        kind="secondary"
      >
        Success action
      </Button>
      <Button
        id="animation-failure-button"
        aria-label="Trigger failure toast"
        onClick={onFailureClick}
        kind="secondary"
      >
        Failure action
      </Button>
Copy
Format
Reset
Related components
Alert banner message
AlertBanner
Noticed high-signal messages, such as system alerts.
Tooltip
Displays information related to an element over it.
Attention box title

Studies show that 100% of people who celebrate birthdays, will die.

AttentionBox
Displays content classification.
