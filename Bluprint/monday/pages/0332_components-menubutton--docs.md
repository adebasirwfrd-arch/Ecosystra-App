---
id: components-menubutton--docs
type: docs
title: "Components/MenuButton"
name: "Docs"
importPath: "./src/pages/components/MenuButton/MenuButton.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-menubutton--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:42:14.329Z
---

MenuButton

MenuButton is a component that opens a Dialog next to a button, the content of the dialog could be anything you want.

Show code
Import
import { MenuButton } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

active	
If true, the button is in an active state.
boolean
	-	Set boolean
aria-controls	
The ARIA control of the menu button for accessibility.
string
	-	Set string
aria-label	
The label of the button for accessibility.
string
	-	Set string
children	
The content inside the menu button.
ElementContent
	-	-
className	
A CSS class name to apply to the component.
string
	-	Set string
closeDialogOnContentClick	
If true, closes the menu when clicking inside the dialog.
boolean
	
false
	Set boolean
closeMenuOnItemClick	
If true, closes the menu when a menu item is clicked.
boolean
	-	Set boolean
component	
The component used as the button icon.
(() => Element) | ElementType<any, keyof IntrinsicElements>
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

componentPosition	
The position of the component relative to the text.
MenuButtonComponentPosition
	
start
	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dialogClassName	
Class name applied to the menu dialog wrapper.
string
	-	Set string
dialogContainerSelector	
The container selector in which to append the dialog.
string
	-	Set string
dialogHideTriggerIgnoreClass	
Classes that prevent hiding the dialog when present.
string | string[]
	-	Set object
dialogOffset	
The offset of the menu relative to the button.
DialogOffset
	{ main: 8, secondary: 0 }	Set object
dialogPaddingSize	
The padding size inside the menu dialog.
DialogSize
	
small
	Set object
dialogPosition	
The position of the menu dialog relative to the button.
DialogPosition
	
bottom-start
	Set object
dialogShowTriggerIgnoreClass	
Classes that prevent showing the dialog when present.
string | string[]
	-	Set object
disabled	
If true, the button is disabled.
boolean
	
false
	Set boolean
hideWhenReferenceHidden	
If true, hides the menu and tooltip when the button is not visible.
boolean
	
true
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
onClick	
Callback fired when the button is clicked.
(event: MouseEvent<Element, MouseEvent>) => void
	-	-
onMenuHide	
Callback fired when the menu is hidden.
() => void
	-	-
onMenuShow	
Callback fired when the menu is shown.
() => void
	-	-
open	
If true, the menu is open.
boolean
	
false
	Set boolean
openDialogComponentClassName	
Class name applied to the button when the dialog is open.
string
	-	Set string
removeTabCloseTrigger	
If true, removes the tab key from the hide trigger.
boolean
	
false
	Set boolean
showTooltipOnlyOnTriggerElement	
If true, the tooltip appears only when hovering over the trigger element, not the menu dialog.
boolean
	-	Set boolean
size	
The size of the button.
MenuButtonSize
	
small
	Set object
startingEdge	
The starting edge alignment of the menu.
DialogStartingEdge
	
bottom
	Set object
text	
The text displayed inside the button.
string
	-	Set string
tooltipContent	
The tooltip content displayed when hovering over the button.
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
tooltipReferenceClassName	
Class name applied to the tooltip reference wrapper.
string
	-	Set string
tooltipTriggers	
The triggers that cause the tooltip to show or hide.
DialogTriggerEvent | DialogTriggerEvent[]
	['mouseleave']	Set object
triggerElement	
The element used as the trigger for the menu.
ElementType<any, keyof IntrinsicElements>
	-	Set object
zIndex	
The z-index of the menu.
number
	-	Set number
Usage
When you want to place content next to an element
When the content needs to be on top of adjacent content
Accessibility
Provide an id for the MenuButton to enable proper accessibility associations.
Use descriptive ariaLabel values for MenuButtons that clearly indicate the menu's purpose.
Use ariaControls prop to link the MenuButton to its menu content. Pass the id of the menu element to establish the relationship between the button and its controlled menu.
Variants
Sizes
Story Editor
<>
  <MenuButton
    id="sizes-xxs"
    aria-label="Extra extra small menu button"
    size="xxs"
  >
    <Menu id="sizes-xxs-menu" size="medium">
      <MenuItem
        id="sizes-xxs-sun"
        icon={Sun}
        onClick={NOOP}
        type="svg"
        title="The sun"
      />
      <MenuItem
        id="sizes-xxs-moon"
        icon={Moon}
        onClick={NOOP}
        type="svg"
        title="The moon"
      />
      <MenuItem
        id="sizes-xxs-stars"
        icon={Favorite}
        onClick={NOOP}
        type="svg"
        title="And the stars"
      />
    </Menu>
  </MenuButton>
  <MenuButton id="sizes-xs" aria-label="Extra small menu button" size="xs">
    <Menu id="sizes-xs-menu" size="medium">
      <MenuItem
        id="sizes-xs-sun"
        icon={Sun}
        onClick={NOOP}
Copy
Format
Reset
Different Icon
Story Editor
<MenuButton
  id="different-icon"
  aria-label="Menu button with different icon"
  component={MoveArrowDown}
>
  <Menu id="different-icon-menu" size="medium">
    <MenuItem
      id="different-icon-sun"
      icon={Sun}
      onClick={NOOP}
      type="svg"
      title="The sun"
    />
    <MenuItem
      id="different-icon-moon"
      icon={Moon}
      onClick={NOOP}
      type="svg"
      title="The moon"
    />
    <MenuItem
      id="different-icon-stars"
      icon={Favorite}
      onClick={NOOP}
      type="svg"
      title="And the stars"
    />
  </Menu>
</MenuButton>
Copy
Format
Reset
With Text
Open
Story Editor
<div
  style={{
    width: 200,
  }}
>
  <MenuButton text="Open">
    <Menu id="menu" size="medium">
      <MenuItem icon={Sun} onClick={NOOP} type="svg" title="The sun" />
      <MenuItem icon={Moon} onClick={NOOP} type="svg" title="The moon" />
      <MenuItem
        icon={Favorite}
        onClick={NOOP}
        type="svg"
        title="And the stars"
      />
    </Menu>
  </MenuButton>
</div>
Copy
Format
Reset
With Text and Icon at the end
Open
Story Editor
<div
  style={{
    width: 200,
  }}
>
  <MenuButton
    text="Open"
    component={DropdownChevronDown}
    componentPosition="end"
  >
    <Menu id="menu" size="medium">
      <MenuItem icon={Sun} onClick={NOOP} type="svg" title="The sun" />
      <MenuItem icon={Moon} onClick={NOOP} type="svg" title="The moon" />
      <MenuItem
        icon={Favorite}
        onClick={NOOP}
        type="svg"
        title="And the stars"
      />
    </Menu>
  </MenuButton>
</div>
Copy
Format
Reset
Disabled
Story Editor
<MenuButton disabled tooltipContent="This action is not available now">
  <Menu id="menu" size="medium">
    <MenuItem icon={Sun} onClick={NOOP} type="svg" title="The sun" />
    <MenuItem icon={Moon} onClick={NOOP} type="svg" title="The moon" />
    <MenuItem icon={Favorite} onClick={NOOP} type="svg" title="And the stars" />
  </Menu>
</MenuButton>
Copy
Format
Reset
Custom trigger element

You can use any element as a trigger for the menu button, just pass it as a triggerElement to the MenuButton component.

Button
Story Editor
() => {
  const ref = useRef(null);
  return (
    <MenuButton
      triggerElement={props => (
        <Button kind="secondary" {...props} className={""} ref={ref}>
          Button
        </Button>
      )}
    >
      <Menu id="menu" size="medium">
        <MenuItem icon={Sun} onClick={NOOP} type="svg" title="The sun" />
        <MenuItem icon={Moon} onClick={NOOP} type="svg" title="The moon" />
        <MenuItem
          icon={Favorite}
          onClick={NOOP}
          type="svg"
          title="And the stars"
        />
      </Menu>
    </MenuButton>
  );
}
Copy
Format
Reset
Related components
Get started
Button
Allow users take actions with a single click.
IconButton
When you want to have a button with just an Icon
Button
SplitButton
Dual-function menu button offers a default action and a secondary action
