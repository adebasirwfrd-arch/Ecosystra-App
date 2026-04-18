This is guidance for avatar setting on the ecosystra app.
Import
import { Avatar } from "@vibe/core";


Props (attached picture)

Usage
Use an avatar to help a user in the platform efficiently identify another person or a team.
When there is no personal photo to show, use initials.
If an image fails to load, fall back to the default user avatar.
An avatar may contain a status icon to indicate a user’s status (working from home, busy, etc.).
Use a tooltip or dialog when hovering over the avatar to offer more information. For example: with a person’s name.

Accessibility
Always provide an ariaLabel prop to describe the person or entity represented by the avatar (e.g., "John Smith", "Design Team", "Guest User"). This label is automatically used as tooltip content.
Use the role prop when the avatar represents something other than a person (e.g., role="img" for team avatars, role="button" for clickable workspace avatars).
For clickable avatars, ensure the ariaLabel describes the action that will occur when clicked (e.g., "Open John Smith's profile", "View Design Team details").
Use ariaHidden prop appropriately when the avatar is purely decorative and provides no meaningful information to screen readers.
For avatars with badges (status indicators), ensure the ariaLabel includes relevant status information (e.g., "John Smith (Away)", "Design Team (3 members online)").

Disabled
Use when a user is inactive in the system.
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

Avatar with text
Use when a user’s image is not available, use their initials.
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

Square avatar with icon or text
Use for non-person avatars, such as a workspace or team.
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
  />
</Flex>

Use cases and examples
Avatar with right badge
Use to indicate the user’s permissions such as: Guest, owner.
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

Multiple avatars
To group multiple Avatars together
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

AvatarGroup
Use this component if you need to stack avatars as a group.
<AvatarGroup
  max={3}
  size="large"
>
  <Avatar
    aria-label="Sophia Johnson"
    src="https://vibe.monday.com/assets/person2-C3M6GG-9.png"
    type="img"
  />
  <Avatar
    aria-label="Marco DiAngelo"
    src="https://vibe.monday.com/assets/person3-BJmOcBh7.png"
    type="img"
  />
  <Avatar
    aria-label="Liam Caldwell"
    src="https://vibe.monday.com/assets/person4-D4rM0hOC.png"
    type="img"
  />
  <Avatar
    aria-label="Julia Martinez"
    src="https://vibe.monday.com/assets/person-02JXxArq.png"
    type="img"
  />
  <Avatar
    aria-label="Sophia Johnson"
    src="https://vibe.monday.com/assets/person2-C3M6GG-9.png"
    type="img"
  />
  <Avatar
    aria-label="Marco DiAngelo"
    src="https://vibe.monday.com/assets/person3-BJmOcBh7.png"
    type="img"
  />
  <Avatar
    aria-label="Liam Caldwell"
    src="https://vibe.monday.com/assets/person4-D4rM0hOC.png"
    type="img"
  />
  <Avatar
    aria-label="Julia Martinez"
    src="https://vibe.monday.com/assets/person-02JXxArq.png"
    type="img"
  />
  <Avatar
    aria-label="Sophia Johnson"
    src="https://vibe.monday.com/assets/person2-C3M6GG-9.png"
    type="img"
  />
  <Avatar
    aria-label="Marco DiAngelo"
    src="https://vibe.monday.com/assets/person3-BJmOcBh7.png"
    type="img"
  />
  <Avatar
    aria-label="Liam Caldwell"
    src="https://vibe.monday.com/assets/person4-D4rM0hOC.png"
    type="img"
  />
  <Avatar
    aria-label="Julia Martinez"
    src="https://vibe.monday.com/assets/person-02JXxArq.png"
    type="img"
  />
  <Avatar
    aria-label="Mark Roytstein"
    text="MR"
    type="text"
  />
</AvatarGroup>

import { AvatarGroup } from "@vibe/core";

Accessibility
Use the counterAriaLabel prop to provide a descriptive accessible name for the counter (e.g., "3 additional team members", "5 more participants", "2 hidden collaborators").
Ensure each Avatar in the group has a meaningful ariaLabel prop that describes the person or entity (e.g., "John Smith", "Sarah Johnson", "Design Team").

Variants
Size
Avatar Group appears in 4 sizes: XS, Small, Medium, and Large.
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
    description="Small"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup size="small" type="img" max={4}>
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
    description="XS"
    vertical
    align={StoryDescription.align.START}
  >
    <AvatarGroup size="xs" type="img" max={4}>
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
</Flex>

Color variants
You can use Light or Dark counter color to maintain visual hierarchy.
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
      size="large"
      type="img"
      max={4}
      counterProps={{
        color: "dark",
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
</Flex>

Clickable vs. Hover
If avatars are clickable, they will be displayed via 
Menu
 and user will be able to navigate each additional item. Otherwise, avatars will be displayed in a Tooltip with no item's navigation.
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
      >
        <AvatarGroup
          size="large"
          max={4}
          counterTooltipCustomProps={{
            position: "bottom",
          }}
        >
          {getDummyAvatarsProps(14).map(avatarProps => (
            <Avatar {...avatarProps} />
          ))}
        </AvatarGroup>
      </StoryDescription>
      <StoryDescription
        description="Counter click"
        vertical
        align={StoryDescription.align.START}
      >
        <Flex>
          <AvatarGroup size="large" max={4}>
            {getDummyAvatarsProps(14).map((avatarProps, index) => (
              <Avatar {...avatarProps} onClick={() => {}} id={String(index)} />
            ))}
          </AvatarGroup>
        </Flex>
      </StoryDescription>
    </Flex>
  );
}

Disabled
Use when the avatar group is inactive in the specific context.
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

Use cases and examples
Last seen users
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

Displaying teams
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
            aria-label="Julia Martinez"
          />
          Julia Martinez
        </Flex>
      </TableCell>
      <TableCell>julia@martinez.com</TableCell>
      <TableCell>Developer</TableCell>
      <TableCell>
        <AvatarGroup
          size="medium"
          max={2}
          counterProps={{
            ariaLabelItemsName: "teams",
          }}
        >
          <Avatar
            type="text"
            text="T1"
            backgroundColor="peach"
            aria-label="Team 1"
          />
          <Avatar
            type="text"
            text="T2"
            backgroundColor="bubble"
            aria-label="Team 2"
          />
          <Avatar
            type="text"
            text="T3"
            backgroundColor="berry"
            aria-label="Team 3"
          />
        </AvatarGroup>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

