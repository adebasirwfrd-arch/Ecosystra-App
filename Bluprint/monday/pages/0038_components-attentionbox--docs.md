---
id: components-attentionbox--docs
type: docs
title: "Components/AttentionBox"
name: "Docs"
importPath: "./src/pages/components/AttentionBox/AttentionBox.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-attentionbox--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:32:02.956Z
---

AttentionBox

Attention box lets users know important information within content areas, as close as possible to the content it’s about. An optional smooth entrance animation can be used to enhance visibility.

Overview
Attention box title

This action will cause your team to lose access to the account until you use the correct SSO source.

Read more
Button
Show code
Import path
import { AttentionBox } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

action	
Action button configuration
AttentionBoxButtonProps
	-	
RAW
action : {
text : "Button"
onClick : ()=>{}
}

animate	
Whether to animate the entrance
boolean
	
true
	Set boolean
children	
Custom children to override the default text content
ReactNode
	-	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
closeButtonAriaLabel	
Custom aria label for the close button
string
	-	Set string
compact	
When true, the attention box will be displayed in compact mode of one-liner
boolean
	
false
	Set boolean
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
icon	
The icon to display. Pass false to hide the icon entirely, or omit to use the default icon for the type.
false
SubIcon
	-	Set object
iconType	
The type of the icon
IconType
	
svg
	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
link	
Link configuration
Omit<LinkProps, "inlineText">
	-	
RAW
link : {
href : "#"
text : "Read more"
}

onClose	
Callback when the close button is clicked
(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void
	-	-
text	
The main text content
string
	-	

title	
The title of the attention box
string
	-	

type	
The variant type of the attention box
AttentionBoxType
	
primary
	Set object
Usage
Use attention box if there is crucial information for user to finish or be acknowledged about a task.
Attention box do not dismiss automatically. They persist on the page until the user dismisses them or takes action that resolves the notification.
The width of attention box is based on content and layout. They can expand to the fill the container or content area they relate to.
Variants
Types

There are five types of attention boxes: primary, neutral, positive, warning and negative.

Primary
Heads up

This message gives you helpful context without requiring immediate action.

Neutral
General note

Use this style for more subtle visual emphasis, or for or neutral custom contexts.

Positive
You're doing great

Indicates success , the user can keep working without interruptions.

Warning
Caution

Shows important warnings the user should review before moving forward.

Negative
Low on free space

Highlights errors or limitations the user should be aware of.

Story Editor
<div
  style={{
    display: "grid",
    gridTemplateColumns: "240px 600px",
    columnGap: "var(--space-16)",
    rowGap: "var(--space-24)",
    alignItems: "center",
  }}
>
  <Text type="text1" weight="bold">
    Primary
  </Text>
  <AttentionBox
    title="Heads up"
    text="This message gives you helpful context without requiring immediate action."
    onClose={() => {}}
  />
  <Text type="text1" weight="bold">
    Neutral
  </Text>
  <AttentionBox
    type="neutral"
    title="General note"
    text="Use this style for more subtle visual emphasis, or for or neutral custom contexts."
    onClose={() => {}}
  />
  <Text type="text1" weight="bold">
    Positive
  </Text>
  <AttentionBox
    type="positive"
    title="You're doing great"
    text="Indicates success , the user can keep working without interruptions."
    onClose={() => {}}
  />
  <Text type="text1" weight="bold">
Copy
Format
Reset
Default

The default Attention Box presents content in multiple lines, with or without title. It can include a link, a button, or both.

Heads up

This message gives you helpful context without requiring immediate action.

Read more
Button

This message gives you helpful context without requiring immediate action.

Read more
Button
Story Editor
<Flex gap="large" align="start">
  <AttentionBox
    title="Heads up"
    text="This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
  <AttentionBox
    text="This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
</Flex>
Copy
Format
Reset
Compact

The compact Attention Box presents content in a single line. It can include a link, a button, or both. If the text exceeds the available space it display an ellipsis and tooltip, when necessary.

Here's something you might want to know. This message gives you helpful context without requiring immediate action.

Read more
Button
Story Editor
<div
  style={{
    maxWidth: 600,
  }}
>
  <AttentionBox
    compact
    text="Here's something you might want to know. This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
</div>
Copy
Format
Reset
Link and Button

Both compact and default Attention Box can present CTA. They can include a link, a button, both, or be displayed without any CTA if none is needed.

Heads up

Here's something you might want to know. This message gives you helpful context without requiring immediate action.

Read more
Button
Story Editor
<div
  style={{
    maxWidth: 600,
  }}
>
  <AttentionBox
    title="Heads up"
    text="Here's something you might want to know. This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
</div>
Copy
Format
Reset
Dismissible

The Attention Box may be configured to be dismissible or not, depending on the use case.

This message gives you helpful context without requiring immediate action.

Story Editor
() => {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <div
      style={{
        maxWidth: 600,
      }}
    >
      <AttentionBox
        compact
        text="This message gives you helpful context without requiring immediate action."
        onClose={() => setVisible(false)}
      />
    </div>
  ) : (
    <Button onClick={() => setVisible(true)}>Show AttentionBox</Button>
  );
}
Copy
Format
Reset
Icon

Attention Box can include an icon to reinforce its purpose. Each type has a default icon, which you may replace or remove as needed.

This message gives you helpful context without requiring immediate action.

Read more
Button

This message gives you helpful context without requiring immediate action.

Read more
Button
Story Editor
<Flex gap="large" align="start">
  <AttentionBox
    icon={false}
    text="This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
  <AttentionBox
    text="This message gives you helpful context without requiring immediate action."
    action={{
      text: "Button",
      onClick: () => {},
    }}
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
</Flex>
Copy
Format
Reset
Do's and Don'ts
Birthday/death rate

Studies show that 100% of people who celebrate birthdays will eventually die.

Do
Provide a brief title, and explanation related to the title.
Birthday/death rate
Don't
Don't use only a title to explain something.
Inbox
Catch up on updates from all your boards.

Get your monday.com notifications

Subscribe
Do
Use when you are speaking directly to a piece of content and the notification can be positioned close to the content.
Inbox
Catch up on updates from all your boards.

7 days left on your free trial

Upgrade
Don't
Don’t use when not to a specific piece of content. If the message applies at a system level, use 
Alert Banner
 instead.

Need guidance?

View docs
Do
If link is needed, keep it aligned to the right.
Need guidance? 
View docs
Don't
Don’t use the link as an inline action.
Use cases and examples
Attention box within layouts

The width of the Attention Box adapts to its content and layout, expanding to fill the container or area it belongs to.

Cross-Account Copier
Copy boards and dashboards to another account

First, move the content you want to copy into folder. Only main boards and dashboards can be copied.

Read more
Story Editor
<Flex
  direction="column"
  align="start"
  gap="small"
  style={{
    width: "100%",
  }}
>
  <Heading type="h3" weight="bold">
    Cross-Account Copier
  </Heading>
  <Text>Copy boards and dashboards to another account</Text>
  <AttentionBox
    compact
    type="neutral"
    text="First, move the content you want to copy into folder. Only main boards and dashboards can be copied."
    link={{
      href: "#",
      text: "Read more",
    }}
    onClose={() => {}}
  />
</Flex>
Copy
Format
Reset
Attention box inside a dialog/combobox

Provides contextual and related information.

Suggested people
Julia Martinez
(UX/UI Product Designer)
Invite new board member by email

Hold ⌘ to select more than one person or team

Story Editor
() => {
  return (
    <DialogContentContainer
      style={{
        padding: 0,
      }}
    >
      <Box
        style={{
          width: 380,
        }}
        padding="medium"
      >
        <Flex direction="column" gap="medium" align="stretch">
          <Search placeholder="Search by name, role, team, or email" />
          <Text>Suggested people</Text>
          <Flex direction="column" gap="medium" align="start">
            <Flex gap="small">
              <Avatar size="medium" src={person} type="img" />
              <Flex gap="xs">
                <Text element="span">Julia Martinez </Text>
                <Text color="secondary" element="span">
                  (UX/UI Product Designer)
                </Text>
              </Flex>
            </Flex>
            <Flex gap="small">
              <Icon size="32" icon={Invite} />
              <Text>Invite new board member by email</Text>
            </Flex>
            <AttentionBox
              text="Hold ⌘ to select more than one person or team"
              onClose={() => {}}
            />
          </Flex>
        </Flex>
Copy
Format
Reset
Entry animation

The Attention box component consist of enter animation prop to increase user attention. It is highly recommended to use a delay before the attention box entry motion, once the page is fully loaded.

Entry animation
Story Editor
() => {
  type Stage = "button" | "skeleton" | "content" | "attention";
  const [stage, setStage] = useState<Stage>("button");
  const onClick = useCallback(() => {
    setStage("skeleton");
    setTimeout(() => {
      setStage("content");
    }, 2000);
  }, []);
  useEffect(() => {
    if (stage === "content") {
      setTimeout(() => {
        setStage("attention");
      }, 750);
    }
  }, [stage]);
  const reset = useCallback(() => {
    setStage("button");
  }, []);
  return (
    <Flex
      align="start"
      direction="column"
      gap="medium"
      style={{
        width: "100%",
        maxWidth: 720,
        minHeight: 260,
      }}
    >
      {/* Button Stage */}
      {stage === "button" && (
        <Button onClick={onClick} kind="secondary">
          Entry animation
        </Button>
      )}
Copy
Format
Reset
Related components
Alert banner message
AlertBanner
Noticed high-signal messages, such as system alerts.
Tipseen
Displays information related to an element over it.
Tooltip
Displays information related to an element over it.
