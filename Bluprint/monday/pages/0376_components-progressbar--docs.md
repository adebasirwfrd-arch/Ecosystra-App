---
id: components-progressbar--docs
type: docs
title: "Components/ProgressBar"
name: "Docs"
importPath: "./src/pages/components/ProgressBars/ProgressBar.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-progressbar--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:43:47.871Z
---

ProgressBar

Progress bars show continuous progress through a process, such as a percentage value. They show how much progress is complete and how much remains.

Show code
Import
import { ProgressBar } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

allowExceedingMax	
If true, allows displaying percentage values higher than 100% when value exceeds max.
boolean
	
false
	Set boolean
animated	
If true, enables animation effects.
boolean
	
true
	Set boolean
aria-label	
The ARIA label for the progress bar.
string
	-	Set string
barStyle	
Determines the visual style of the progress bar.
ProgressBarStyle
	
primary
	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
fullWidth	
If true, makes the progress bar span the full container width.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
indicateProgress	
If true, displays the progress percentage.
boolean
	
false
	Set boolean
max	
The maximum value of the progress bar.
number
	
100
	Set number
min	
The minimum value of the progress bar.
number
	
0
	Set number
multi	

If true, enables multiple progress bars. Note: value, valueSecondary, and barStyle will not be used.

boolean
	
false
	Set boolean
multiValues	
An array of bar values and colors for multi-bar mode.
{ value?: number; color?: string; }[]
	[]	Set object
size	
The size of the progress bar.
ProgressBarSize
	
small
	Set object
value	
The current progress value.
number
	
0
	Set number
valueSecondary	
The secondary progress value.
number
	
0
	Set number
Usage
Give users an indication of how much of the task has been completed and how much is left.
🤓
Tip
If you need to lead a user through a progress, use the 
MultiStepIndicator
 instead.
Variants
Regular
30%
With label
Without label
Story Editor
<Flex direction="column" gap="large">
  <Flex
    direction="column"
    gap="small"
    align="start"
    style={{
      width: "400px",
    }}
  >
    <ProgressBar
      id="regular-linear-progress-bar"
      aria-label="Regular linear progress bar"
      indicateProgress
      value={30}
      size="large"
    />
    With label
  </Flex>
  <Flex
    direction="column"
    gap="small"
    align="start"
    style={{
      width: "400px",
    }}
  >
    <ProgressBar
      id="regular-linear-progress-bar-without-label"
      value={30}
      size="large"
    />
    Without label
  </Flex>
</Flex>
Copy
Format
Reset
With secondary value
50%
Story Editor
<div
  style={{
    width: "400px",
  }}
>
  <ProgressBar
    id="with-secondary-value-linear-progress-bar"
    aria-label="With secondary value linear progress bar"
    value={50}
    indicateProgress
    valueSecondary={65}
    size="large"
  />
</div>
Copy
Format
Reset
Multi progress bar
25%
Story Editor
() => {
  const multiValues = useMemo(
    () => [
      {
        value: 25,
        color: "var(--primary-color)",
      },
      {
        value: 75,
        color: "var(--warning-color)",
      },
      {
        value: 100,
        color: "var(--positive-color)",
      },
    ],
    []
  );
  return (
    <div
      style={{
        width: "600px",
      }}
    >
      <ProgressBar
        id="multi-progress-bar"
        aria-label="Multi progress bar"
        value={25}
        size="large"
        indicateProgress
        multi
        multiValues={multiValues}
      />
    </div>
  );
}
Copy
Format
Reset
Do’s and Don’ts
Items usage
Items
142/200
Do
Use a progress bar only process has start and finish point.
Storage
Drive 1
Drive 2
Drive 3
Don't
Don’t use an infinite scalable indicator.
Use cases and examples
Progress bar as a counter

The user can see in a clear way the number of items used in the account.

Loading files
Items
142/200
Story Editor
<div
  style={{
    width: 200,
  }}
>
  <Text
    type="text1"
    weight="bold"
    style={{
      marginBottom: "var(--space-48)",
    }}
  >
    Loading files
  </Text>
  <Flex
    justify="space-between"
    style={{
      marginBottom: "var(--space-4)",
    }}
  >
    <Flex gap="xs">
      <Text>Items</Text>
      <Icon
        icon={Info}
        style={{
          color: "var(--icon-color)",
        }}
      />
    </Flex>
    <Text>142/200</Text>
  </Flex>
  <ProgressBar
    id="progress-bar-as-a-counter"
    aria-label="Progress bar as a counter"
    value={71}
    size="large"
Copy
Format
Reset
Progress bar as loading indicator
Frame 697.jpg
2KB
Saving...
Story Editor
<Box
  border
  padding="medium"
  style={{
    width: 400,
  }}
>
  <Flex
    gap="small"
    style={{
      marginBottom: "var(--space-8)",
      height: 80,
    }}
  >
    <Box
      style={{
        flexShrink: 0,
        height: "100%",
      }}
    >
      <img
        src={Logo}
        alt="Frame 697.jpg"
        style={{
          height: "100%",
        }}
      />
    </Box>
    <Flex
      direction="column"
      align="stretch"
      justify="space-between"
      style={{
        flex: 1,
        height: "100%",
      }}
Copy
Format
Reset
Related components
Spinner
Displays information related to an element over it.
Back
Next
Steps
Steps display progress through a sequence of logical and numbered steps. They may also be used for navigation.
Skeleton
Skeleton loading componet used to indicate content and ui loading.
