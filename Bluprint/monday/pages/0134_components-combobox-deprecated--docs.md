---
id: components-combobox-deprecated--docs
type: docs
title: "Components/Combobox [Deprecated]"
name: "Docs"
importPath: "./src/pages/components/Combobox/Combobox.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-combobox-deprecated--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:35:35.049Z
---

Combobox
🚨
Deprecated component
This is a legacy component and will be deprecated in the next major version. Please consider using the
Dropdown box mode
component for your needs instead. See the 
Combobox migration guide
 for detailed migration instructions.

Combobox allowing users to filter longer lists to only the selections matching a query.

Option 1
Option 2
Option 3
Show code
Import
import { Combobox } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

addNewLabel	
Label displayed for the "Add new" button.
string | ((label: string) => ElementContent)
	
Add new
	Set object
autoFocus	
If true, the search input is focused when the component mounts.
boolean
	
false
	Set boolean
categories	
The list of available categories.
IComboboxCategoryMap
	-	Set object
className	
A CSS class name to apply to the component.
string
	
""
	Set string
clearFilterOnSelection	
If true, clears the search input when an option is selected.
boolean
	
false
	
FalseTrue
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
debounceRate	
The debounce rate for filtering.
number
	-	Set number
defaultFilter	
The default search input
string
	-	Set string
defaultVisualFocusFirstIndex	
If true, visually focuses the first item by default.
boolean
	-	Set boolean
disabled	
If true, the combobox is disabled.
boolean
	
false
	Set boolean
disableFilter	
If true, disables filtering.
boolean
	
false
	Set boolean
filter	
Custom filter function for searching options.
(filterValue: string, options: IComboboxOption[]) => IComboboxOption[]
	(filterValue: string, options: IComboboxOption[]) => options.filter( ({ label }: { label: string }) => !filterValue || label.toLowerCase().includes(filterValue.toLowerCase()) )	-
filterValue	
Controlled search input value.
string
	-	Set string
hideRenderActionOnInput	
If true, hides the additional action when the user types in the search input.
boolean
	-	Set boolean
id	
An HTML id attribute for the component.
string
	
""
	Set string
loading	
If true, displays a loading state.
boolean
	
false
	Set boolean
maxOptionsWithoutScroll	
Maximum number of options displayed before scrolling.
number
	-	Set number
noResultsMessage	
Message displayed when no results are found.
string
	
"No results found"
	Set string
noResultsRenderer	
Custom renderer for when no results are found.
() => Element
	-	-
onAddNew	
Callback fired when the "Add new" button is clicked.
(value: string) => void
	-	-
onClick	
Callback fired when an option is clicked.
(optionData: IComboboxOption) => void
	(_optionData: IComboboxOption) => {}	-
onFilterChanged	
Callback fired when the search input value changes.
(value: string) => void
	-	-
onOptionHover	
Callback fired when an option is hovered.
(event: MouseEvent<Element, MouseEvent>, index: number, option: IComboboxOption) => void
	-	-
onOptionLeave	
Callback fired when the mouse leaves an option.
() => void
	-	-
optionClassName	
Class name applied to each option item.
string
	
""
	Set string
optionLineHeight	
The height of each option item.
number
	
32
	Set number
optionRenderer	
Custom renderer for options.
(option: IComboboxOption) => Element
	-	-
options	
The list of available options.
IComboboxOption[]
	[]	
RAW
options : [
0 : {...} 2 keys
1 : {...} 2 keys
2 : {...} 2 keys
]

optionsListHeight	
The height of the options list.
number
	-	Set number
placeholder	
Placeholder text displayed in the search input.
string
	
""
	

renderAction	
Additional action button inside the search input.
ReactElement<ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLElement>> | ForwardRefExoticComponent<MenuButtonProps & RefAttributes<...>>, string | JSXElementConstructor<...>>
	-	Set object
renderOnlyVisibleOptions	
If true, renders only visible options for performance optimization.
boolean
	
false
	Set boolean
searchIcon	
Custom search icon.
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

searchInputAriaLabel	
ARIA label for the search input.
string
	
"Search for content"
	Set string
searchInputRef	
Ref for the search input element.
RefObject<HTMLInputElement>
	-	Set object
searchWrapperClassName	
Class name applied to the search wrapper.
string
	-	Set string
shouldScrollToSelectedItem	
If true, automatically scrolls to the selected option.
boolean
	
true
	Set boolean
size	
The size of the combobox.
ComboboxSizes
	
medium
	Set object
stickyCategories	
If true, keeps categories visible when scrolling.
boolean
	
false
	Set boolean
stickyCategoryClassName	
Class name applied to the sticky category header.
string
	-	Set string
withCategoriesDivider	
If true, displays a divider between category sections.
boolean
	
false
	Set boolean
Usage
Allows the user to make a selection from a predefined list of options and is typically used when there are a large amount of options to choose from.
The menu opens by clicking anywhere in the field.
The option that best matches the typed characters is highlighted.
Limit the text content of Combobox items to a single line.
Could be used inside a dialog or as a standalone component.
🤓
Tip
When there are fewer than five items, consider using 
Radio buttons
 (if only one item can be selected) or 
Checkboxes
 (if multiple items can be selected).
Accessibility
Using an id is highly recommended for all instances to ensure proper label association.
Use searchInputAriaLabel prop when you need to provide a custom accessible name for the search input.
Use disabled prop appropriately to indicate when the combobox is not available for interaction.
Use autoFocus prop when the combobox should receive initial focus for keyboard navigation.
Variants
Default

Default Combobox can be used without dialog or as part of the layout.

Option 1
Option 2
Option 3
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
      },
      {
        id: "2",
        label: "Option 2",
      },
      {
        id: "3",
        label: "Option 3",
      },
    ],
    []
  );
  return <Combobox placeholder="Placeholder text here" options={options} />;
}
Copy
Format
Reset
Combobox inside a dialog

Use this for Combobox that triggered by button.

Option 1
Option 2
Option 3
Option 4
Option 5
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
      },
      {
        id: "2",
        label: "Option 2",
      },
      {
        id: "3",
        label: "Option 3",
      },
      {
        id: "4",
        label: "Option 4",
      },
      {
        id: "5",
        label: "Option 5",
      },
    ],
    []
  );
  return (
    <DialogContentContainer>
      <Combobox options={options} placeholder="Placeholder text here" />
    </DialogContentContainer>
  );
}
Copy
Format
Reset
Sizes

We have three pre-defined sizes for Combobox width size: Small 200px, Medium 240px, Large 260px.

Option 1
Option 2
Option 3
Option 4
Option 5
Option 1
Option 2
Option 3
Option 4
Option 5
Option 1
Option 2
Option 3
Option 4
Option 5
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
      },
      {
        id: "2",
        label: "Option 2",
      },
      {
        id: "3",
        label: "Option 3",
      },
      {
        id: "4",
        label: "Option 4",
      },
      {
        id: "5",
        label: "Option 5",
      },
    ],
    []
  );
  return (
    <Flex gap="large">
      <DialogContentContainer>
        <Combobox
          options={options}
          size="small"
          placeholder="Placeholder text here"
        />
      </DialogContentContainer>
      <DialogContentContainer>
Copy
Format
Reset
With categories

When having a lot of options, you may use headings to categorize them.

Regular
Favorites
Favorites
Workspaces
Main workspace
Client Foundations
Design
Marketing Cluster
Mobile
Sticky mode
Favorites
Favorites
Workspaces
Main workspace
Client Foundations
Design
Marketing Cluster
Mobile
With divider
Favorites
Favorites
Workspaces
Main workspace
Client Foundations
Design
Marketing Cluster
Mobile
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Favorites",
        categoryId: "favorites",
      },
      {
        id: "2",
        label: "Main workspace",
        categoryId: "workspace",
      },
      {
        id: "3",
        label: "Client Foundations",
        categoryId: "workspace",
      },
      {
        id: "4",
        label: "Design",
        categoryId: "workspace",
      },
      {
        id: "5",
        label: "Marketing Cluster",
        categoryId: "workspace",
      },
      {
        id: "6",
        label: "Mobile",
        categoryId: "workspace",
      },
    ],
    []
  );
Copy
Format
Reset
With icons
Option 1
Option 2
Option 3
Option 4
Option 5
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
        leftIcon: Wand,
      },
      {
        id: "2",
        label: "Option 2",
        leftIcon: ThumbsUp,
      },
      {
        id: "3",
        label: "Option 3",
        leftIcon: Time,
      },
      {
        id: "4",
        label: "Option 4",
        leftIcon: Update,
      },
      {
        id: "5",
        label: "Option 5",
        leftIcon: Upgrade,
      },
    ],
    []
  );
  return (
    <DialogContentContainer>
      <Combobox options={options} placeholder="Placeholder text here" />
    </DialogContentContainer>
  );
Copy
Format
Reset
With optionRenderer
 I can render anything with Option 1
 I can render anything with Option 2
 I can render anything with Option 3
 I can render anything with Option 4
 I can render anything with Option 5
 I can render anything with Option 6
 I can render anything with Option 7
 I can render anything with Option 8
 I can render anything with Option 9
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
      },
      {
        id: "2",
        label: "Option 2",
      },
      {
        id: "3",
        label: "Option 3",
      },
      {
        id: "4",
        label: "Option 4",
      },
      {
        id: "5",
        label: "Option 5",
      },
      {
        id: "6",
        label: "Option 6",
      },
      {
        id: "7",
        label: "Option 7",
      },
      {
        id: "8",
        label: "Option 8",
      },
      {
Copy
Format
Reset
With Button

If Combobox requires action, use button component at the end of the list.

Option 1
Option 2
Option 3
Option 4
Option 5
Edit
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
        leftIcon: Wand,
      },
      {
        id: "2",
        label: "Option 2",
        leftIcon: ThumbsUp,
      },
      {
        id: "3",
        label: "Option 3",
        leftIcon: Time,
      },
      {
        id: "4",
        label: "Option 4",
        leftIcon: Update,
      },
      {
        id: "5",
        label: "Option 5",
        leftIcon: Upgrade,
      },
    ],
    []
  );
  return (
    <DialogContentContainer>
      <Flex direction="column" align="stretch">
        <Combobox options={options} placeholder="Placeholder text here" />
        <Button kind="tertiary" leftIcon={Edit}>
Copy
Format
Reset
With creation when no items are available
Story Editor
() => {
  const [options, setOptions] = useState([]);
  return (
    <DialogContentContainer>
      <Combobox
        options={options}
        placeholder="Type to create"
        addNewLabel="Create new item"
        onAddNew={() =>
          setOptions([
            ...options,
            {
              id: options.length + 1,
              label: `Option: ${options.length + 1}`,
            },
          ])
        }
      />
    </DialogContentContainer>
  );
}
Copy
Format
Reset
With virtualization optimization

When you display a large number of options, you may want to render only the options shown at a given moment to allow better performance and a better user experience.

Virtualization without categories
Option 1
Option 2
Option 3
Option 4
Option 5
Virtualization with categories
Group 1
Option 1
Option 2
Option 3
Option 4
Virtualization with sticky categories
Group 1
Group 1
Option 1
Option 2
Option 3
Option 4
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Option 1",
        categoryId: "Group1",
      },
      {
        id: "2",
        label: "Option 2",
        categoryId: "Group1",
      },
      {
        id: "3",
        label: "Option 3",
        categoryId: "Group1",
      },
      {
        id: "4",
        label: "Option 4",
        categoryId: "Group1",
      },
      {
        id: "5",
        label: "Option 5",
        categoryId: "Group1",
      },
      {
        id: "6",
        label: "Option 6",
        categoryId: "Group1",
      },
      {
        id: "7",
        label: "Option 7",
Copy
Format
Reset
Loading state

If importing the Combobox options may take time, you reflect this to the user by using our Combobox loading mode.

Story Editor
() => {
  const options = useMemo(() => [], []);
  return (
    <DialogContentContainer>
      <Combobox loading options={options} placeholder="Board name" />
    </DialogContentContainer>
  );
}
Copy
Format
Reset
Do’s and Don’ts
1 Days
2 Days
3 Days
4 Days
5 Days
Do
Use Combobox to make large lists easier to search.
1 Days
2 Days
3 Days
Don't
Don’t use Combobox if you have less than 5 list items. If it's not complex enough for a Combobox, use a 
Radio button
 or 
Dropdown.
Hadas
Orr
Evgeniy
Moshe
Sahar
Do
Use the Combobox input to filter results from the list.
Hadas
Orr
Evgeniy
Moshe
Sahar
Don't
Don’t use the Combobox as a search input to search results that are not within the list.
Use cases and examples
Combobox as person picker

We are using Combobox component for our board person picker.

Select people
Story Editor
() => {
  const options = useMemo(
    () => [
      {
        id: "1",
        label: "Julia Martinez",
        src: person1,
        type: "img",
        position: "(Frontend Developer)",
        categoryId: "suggestedPeople",
      },
      {
        id: "2",
        label: "Marco DiAngelo",
        src: person2,
        type: "img",
        position: "(Product Designer)",
        categoryId: "suggestedPeople",
      },
      {
        id: "3",
        label: "Liam Caldwell",
        src: person3,
        type: "img",
        position: "(Brand Designer)",
        categoryId: "suggestedPeople",
      },
    ],
    []
  );
  const categories = useMemo(
    () => ({
      suggestedPeople: {
        id: "suggestedPeople",
        label: "Suggested people",
      },
Copy
Format
Reset
Related components
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
Send
Delete
More info
Menu
Displays information related to an element over it.
Search
Displays content classification.
