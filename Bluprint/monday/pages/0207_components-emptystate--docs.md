---
id: components-emptystate--docs
type: docs
title: "Components/EmptyState"
name: "Docs"
importPath: "./src/pages/components/EmptyState/EmptyState.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-emptystate--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:37:58.498Z
---

EmptyState

An empty state component is a user interface element that communicates to users that a particular section or feature contains no data or content at the moment. It often provides visual cues, prompts, or suggestions on what actions can be taken to fill the space.

The title should be concise and reflect the purpose
This optional paragraph should be use to extend the title. Keep it short and to the point. For longer texts add a link below.
Main Action
Read more
Show code
Props
Name	Description	Default	
Control

title	
Optional title for the empty state
string
	-	Set string
description*	
Required description text explaining the empty state
ReactNode
	-	Set string
visual	
Optional visual element like image, animation, video, or illustration
ReactNode
	-	Set object
mainAction	
Main action button configuration
ReactElement<ButtonProps, string | JSXElementConstructor<any>> | (Omit<ButtonProps, "children" | "size" | "kind"> & { ...; })
	-	Set object
supportingAction	
Supporting action (link or tertiary button) configuration
ReactElement<LinkProps | ButtonProps, string | JSXElementConstructor<any>> | (Omit<ButtonProps, "children" | ... 1 more ... | "kind"> & { ...; }) | (LinkProps & { ...; })
	-	Set object
layout	
Layout style of the empty state
EmptyStateLayout
	
default
	
Choose option...
default
compact
Usage
Provide a clear and concise message that informs the user about the expected outcome.
Handle errors and edge cases that might occur during data loading or rendering.
Use the empty state component to provide an initial state that prevents confusion when no data is available.
🤓
When to use EmptyState
Actions help guide users towards the next steps they can take, ensuring that they remain engaged and know how to proceed. Depending on the context and user needs, you can include a primary action, a link, both, or no actions at all.
Actions
Main Action

Designers should be able to add custom action in specific situations. Like a primary and secondary with consideration to location and layout.

Your favorites are empty
Add boards, docs, or dashboards to your favorites for quick access.
Add favorites
Your favorites are empty
Add boards, docs, or dashboards to your favorites for quick access.
Add favorites
Story Editor
<Flex direction="row" gap="large">
  <EmptyState
    title="Your favorites are empty"
    description="Add boards, docs, or dashboards to your favorites for quick access."
    visual={
      <img
        src={emptyStateImage}
        alt="No items found"
        width={280}
        height={184}
      />
    }
    mainAction={{
      kind: "secondary",
      text: "Add favorites",
      onClick: () => {
        console.log("First view - Add item clicked");
      },
    }}
  />
  <EmptyState
    title="Your favorites are empty"
    description="Add boards, docs, or dashboards to your favorites for quick access."
    visual={
      <img
        src={emptyStateImage}
        alt="No items found"
        width={280}
        height={184}
      />
    }
    mainAction={{
      kind: "primary",
      text: "Add favorites",
      onClick: () => {
        console.log("Second view - View details clicked");
Copy
Format
Reset
Link

Links should guide users to troubleshoot the issue or learn more about how to populate the section. If there’s no action to the section the link can stand alone.

This workspace is empty
To get started, click the "+" above, then click "add new board".
Read more
Story Editor
<EmptyState
  title="This workspace is empty"
  description='To get started, click the "+" above, then click "add new board".'
  supportingAction={{
    href: "https://example.com/help",
    text: "Read more",
  }}
  {...args}
/>
Copy
Format
Reset
Two buttons

Instead of link you can use a supporting action as a button. The supporting action cannot be the only button. You should include a main action with it.

This workspace is empty
Get started by choosing a board template or creating a board from scratch.
Browse templates
Start from scratch
Story Editor
<EmptyState
  title="This workspace is empty"
  description="Get started by choosing a board template or creating a board from scratch."
  mainAction={{
    kind: "secondary",
    text: "Browse templates",
    onClick: () => {
      console.log("Main action clicked");
    },
  }}
  supportingAction={{
    kind: "tertiary",
    text: "Start from scratch",
    onClick: () => {
      console.log("Supporting action clicked");
    },
  }}
  {...args}
/>
Copy
Format
Reset
Typography

Empty state can be with or without a title.

Create your first Gantt chart
Gantt charts keep your projects organized.
Connect boards to start
Create your first Gantt chart
Connect boards to start
Story Editor
<Flex
  direction="row"
  gap="large"
  justify="space-between"
  style={{
    width: "100%",
  }}
>
  <EmptyState
    title="Create your first Gantt chart"
    description="Gantt charts keep your projects organized."
    mainAction={{
      kind: "secondary",
      text: "Connect boards to start",
      onClick: () => {
        console.log("Main action clicked");
      },
    }}
  />
  <EmptyState
    description="Create your first Gantt chart"
    mainAction={{
      kind: "secondary",
      text: "Connect boards to start",
      onClick: () => {
        console.log("Main action clicked");
      },
    }}
    {...args}
  />
</Flex>
Copy
Format
Reset
Layout
Default

The Default layout is meant for most layouts and locations.

Visualize data from multiple boards
Use charts, timelines, and other widgets to see your data clearly.
Add your first widget
Read more
Show code
Compact

Instead of link you can use a supporting action as a button. The supporting action cannot be the only button. You should include a main action with it.

Visualize data from multiple boards
Use charts, timelines, and other widgets to see your data clearly.
Add your first widget
Read more
Story Editor
<EmptyState
  title="Visualize data from multiple boards"
  description="Use charts, timelines, and other widgets to see your data clearly."
  visual={
    <img
      src={emptyStateImage}
      alt="No notifications"
      width={280}
      height={184}
    />
  }
  layout="compact"
  mainAction={{
    text: "Add your first widget",
    onClick: () => {
      console.log("Main action clicked");
    },
  }}
  supportingAction={{
    text: "Read more",
    href: "#",
    onClick: () => {
      console.log("Supporting action clicked");
    },
  }}
  {...args}
/>
Copy
Format
Reset
Do's and Don'ts
Do
Provide clear guidance and an action to help users resolve the empty state.
Don't
Don't use vague messaging or unhelpful actions that don't guide users.
Do
Offer clear next steps with supporting information when needed.
Don't
Don't provide minimal or unclear information about how to proceed.
Do
Offer clear next steps with supporting information when needed.
Don't
Don't provide minimal or unclear information about how to proceed.
Related components
Alert banner message
AlertBanner
Noticed high-signal messages, such as system alerts.
Tipseen
Displays information related to an element over it.
Attention box title

Studies show that 100% of people who celebrate birthdays, will die.

AttentionBox
Displays content classification.
