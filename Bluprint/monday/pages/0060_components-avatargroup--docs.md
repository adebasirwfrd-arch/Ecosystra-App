---
id: components-avatargroup--docs
type: docs
title: "Components/AvatarGroup"
name: "Docs"
importPath: "./src/pages/components/AvatarGroup/AvatarGroup.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-avatargroup--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:32:48.212Z
---

AvatarGroup

Use this component if you need to stack avatars as a group.

+10
Show code
Import
import { AvatarGroup } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

avatarClassName	
Class name applied to each avatar.
string
	-	Set string
children	
The avatars displayed in the group.
ReactElement<AvatarProps, string | JSXElementConstructor<any>> | ReactElement<AvatarProps, string | JSXElementConstructor<any>>[]
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
counterProps	
Props for customizing the counter display.
AvatarGroupCounterVisualProps
	-	Set object
counterTooltipCustomProps	
Props passed to the Tooltip component. See full options in the Tooltip documentation.
Partial<TooltipProps>
	-	Set object
counterTooltipIsVirtualizedList	
If true, the counter tooltip uses a virtualized list for performance optimization.
boolean
	
false
	Set boolean
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
disabled	
If true, the component is disabled and non-interactive.
boolean
	-	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
max	
The maximum number of avatars displayed before showing a counter.
number
	
5
	Set number
size	
The size of the avatars in the group.
AvatarSize
	-	Set object
type	
The type of the avatars in the group.
AvatarType
	-	Set object
Usage
Use 
tooltip
 component while hovering on the counter when you need only to display the content
If clickable and navigable list is required on counter, use 
Menu
 component
Accessibility
Use the counterAriaLabel prop to provide a descriptive accessible name for the counter (e.g., "3 additional team members", "5 more participants", "2 hidden collaborators").
Ensure each Avatar in the group has a meaningful ariaLabel prop that describes the person or entity (e.g., "John Smith", "Sarah Johnson", "Design Team").
Variants
Size

Avatar Group appears in 4 sizes: XS, Small, Medium, and Large.

Large
+10
Medium
+10
Small
+10
XS
+10
Story Editor
<Flex direction="column" gap="large" align="start">
  <StoryDescription
    description="Large"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup size="large" type="img" max={4}>
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
    </AvatarGroup>
  </StoryDescription>
  <StoryDescription
    description="Medium"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup size="medium" type="img" max={4}>
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
Copy
Format
Reset
Color variants

You can use Light or Dark counter color to maintain visual hierarchy.

Light
+10
Dark
+10
Story Editor
<Flex direction="column" gap="large" align="start">
  <StoryDescription
    description="Light"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup
      size="large"
      type="img"
      max={4}
      counterProps={{
        color: "light",
      }}
    >
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
    </AvatarGroup>
  </StoryDescription>
  <StoryDescription
    description="Dark"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup
Copy
Format
Reset
Clickable vs. Hover

If avatars are clickable, they will be displayed via 
Menu
 and user will be able to navigate each additional item. Otherwise, avatars will be displayed in a Tooltip with no item's navigation.

Counter hover
+10
Counter click
+10
Story Editor
() => {
  const getDummyAvatarsProps = useCallback((numItems: number) => {
    const avatarsProps = [
      {
        type: "img",
        src: person1,
        "aria-label": "Julia Martinez",
      },
      {
        type: "img",
        src: person2,
        "aria-label": "Sophia Johnson",
      },
      {
        type: "img",
        src: person3,
        "aria-label": "Marco DiAngelo",
      },
      {
        type: "img",
        src: person4,
        "aria-label": "Liam Caldwell",
      },
    ];
    const result = [];
    for (let i = 0; i < numItems; i++) {
      result.push(avatarsProps[i % avatarsProps.length]);
    }
    return result;
  }, []);
  return (
    <Flex direction="row" gap="large">
      <StoryDescription
        description="Counter hover"
        vertical
        align={StoryDescription.align.START}
Copy
Format
Reset
Disabled

Use when the avatar group is inactive in the specific context.

+10
Story Editor
() => {
  return (
    <AvatarGroup size="large" max={4} disabled>
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
      <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
      <Avatar type="img" src={person1} aria-label="Julia Martinez" />
      <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
    </AvatarGroup>
  );
}
Copy
Format
Reset
Max avatars shown

Choose the ammount of avatars you want to show

+10
Story Editor
() => {
  const [max, setMax] = useState(4);
  return (
    <Flex
      direction="column"
      gap="medium"
      align="start"
      style={{
        width: "100%",
      }}
    >
      <Slider
        size="small"
        min={1}
        max={14}
        defaultValue={max}
        onChange={value => setMax(value as number)}
        valueText={`${max}`}
      />
      <AvatarGroup size="large" max={max}>
        <Avatar type="img" src={person1} aria-label="Julia Martinez" />
        <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
        <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
        <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
        <Avatar type="img" src={person1} aria-label="Julia Martinez" />
        <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
        <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
        <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
        <Avatar type="img" src={person1} aria-label="Julia Martinez" />
        <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
        <Avatar type="img" src={person3} aria-label="Marco DiAngelo" />
        <Avatar type="img" src={person4} aria-label="Liam Caldwell" />
        <Avatar type="img" src={person1} aria-label="Julia Martinez" />
        <Avatar type="img" src={person2} aria-label="Sophia Johnson" />
      </AvatarGroup>
    </Flex>
Copy
Format
Reset
Custom counter

You can pass counterProps to specify counter params.

99999+
Story Editor
<AvatarGroup
  size="large"
  type="img"
  max={4}
  counterProps={{
    count: 100500,
    color: "dark",
    prefix: "",
    maxDigits: 5,
  }}
>
  <Avatar src={person1} aria-label="Julia Martinez" />
  <Avatar src={person2} aria-label="Sophia Johnson" />
  <Avatar src={person3} aria-label="Marco DiAngelo" />
  <Avatar src={person4} aria-label="Liam Caldwell" />
</AvatarGroup>
Copy
Format
Reset
Grid tooltip

When tooltip text for additional avatars is not passed, extra avatars will be displayed in a grid mode.

+12
Story Editor
<AvatarGroup size="large" type="img" max={4}>
  <Avatar src={person1} />
  <Avatar src={person2} />
  <Avatar src={person3} />
  <Avatar src={person4} />
  <Avatar src={person1} />
  <Avatar src={person2} />
  <Avatar src={person3} />
  <Avatar src={person4} />
  <Avatar src={person1} />
  <Avatar src={person2} />
  <Avatar src={person3} />
  <Avatar src={person4} />
  <Avatar src={person1} />
  <Avatar src={person2} />
  <Avatar src={person3} />
  <Avatar src={person4} />
</AvatarGroup>
Copy
Format
Reset
Virtualized list

Should be used only to display large amount of avatars in default counter tooltip

+999+
Story Editor
() => {
  const avatars = [
    <Avatar src={person1} aria-label="Julia Martinez" />,
    <Avatar src={person2} aria-label="Sophia Johnson" />,
    <Avatar src={person3} aria-label="Marco DiAngelo" />,
    <Avatar src={person4} aria-label="Liam Caldwell" />,
  ];
  const getDummyAvatars = (multiplier: number) => {
    let result: typeof avatars = [];
    for (let i = 0; i < multiplier; ++i) {
      result = result.concat(avatars);
    }
    return result;
  };
  return (
    <AvatarGroup
      size="large"
      max={4}
      counterTooltipIsVirtualizedList
      type="img"
    >
      {getDummyAvatars(334)}
    </AvatarGroup>
  );
}
Copy
Format
Reset
Counter custom tooltip content

Counter tooltip props can be specified in order to render tooltip with custom content.

+4
Story Editor
<AvatarGroup
  size="large"
  type="img"
  max={4}
  counterTooltipCustomProps={{
    content: "... and plenty more employees",
  }}
>
  <Avatar src={person1} aria-label="Julia Martinez" />
  <Avatar src={person2} aria-label="Sophia Johnson" />
  <Avatar src={person3} aria-label="Marco DiAngelo" />
  <Avatar src={person4} aria-label="Liam Caldwell" />
  <Avatar src={person1} aria-label="Julia Martinez" />
  <Avatar src={person2} aria-label="Sophia Johnson" />
  <Avatar src={person3} aria-label="Marco DiAngelo" />
  <Avatar src={person4} aria-label="Liam Caldwell" />
</AvatarGroup>
Copy
Format
Reset
Use cases and examples
Last seen users
Last seen
+10
Story Editor
<Flex direction="row" gap="medium">
  <div>Last seen</div>
  <AvatarGroup
    size="medium"
    max={4}
    counterProps={{
      color: "dark",
    }}
    type="img"
  >
    <Avatar src={person1} aria-label="Julia Martinez" />
    <Avatar src={person2} aria-label="Sophia Johnson" />
    <Avatar src={person3} aria-label="Marco DiAngelo" />
    <Avatar src={person4} aria-label="Liam Caldwell" />
    <Avatar src={person1} aria-label="Julia Martinez" />
    <Avatar src={person2} aria-label="Sophia Johnson" />
    <Avatar src={person3} aria-label="Marco DiAngelo" />
    <Avatar src={person4} aria-label="Liam Caldwell" />
    <Avatar src={person1} aria-label="Julia Martinez" />
    <Avatar src={person2} aria-label="Sophia Johnson" />
    <Avatar src={person3} aria-label="Marco DiAngelo" />
    <Avatar src={person4} aria-label="Liam Caldwell" />
    <Avatar src={person1} aria-label="Julia Martinez" />
    <Avatar src={person2} aria-label="Sophia Johnson" />
  </AvatarGroup>
</Flex>
Copy
Format
Reset
Displaying teams
Name
Email
Title
Teams
Julia Martinez
julia@martinez.com
Developer
T1
T2
+1
Story Editor
<Table
  columns={[
    {
      id: "name",
      title: "Name",
    },
    {
      id: "email",
      title: "Email",
    },
    {
      id: "title",
      title: "Title",
    },
    {
      id: "teams",
      title: "Teams",
    },
  ]}
  errorState={<div />}
  emptyState={<div />}
>
  <TableHeader>
    <TableHeaderCell title="Name" />
    <TableHeaderCell title="Email" />
    <TableHeaderCell title="Title" />
    <TableHeaderCell title="Teams" />
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <Flex direction="row" gap="small">
          <Avatar
            type="img"
            src={person1}
            size="medium"
Copy
Format
Reset
Related components
Avatar
An avatar is a visual representation of a user or entity.
What's new
Badge
Used to place an indicator / counter on a child component
5
Counter
Show the count of some adjacent data.
