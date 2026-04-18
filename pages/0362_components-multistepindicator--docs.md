---
id: components-multistepindicator--docs
type: docs
title: "Components/MultiStepIndicator"
name: "Docs"
importPath: "./src/pages/components/MultiStepIndicator/MultiStepIndicator.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-multistepindicator--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:43:21.382Z
---

MultiStepIndicator

Tabular navigation component that helps users visualize and interact with a multi-step process.

fulfilled
Everything you can do with Monday
Subtitle
2
pending
Everything you can do with Monday
Subtitle
3
pending
Everything you can do with Monday
Subtitle
Show code
Import
import { MultiStepIndicator } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dividerComponentClassName	
Class name applied to the divider between steps.
string
	-	Set string
fulfilledStepIcon	
The icon used for fulfilled steps.
SubIcon
	-	Set object
fulfilledStepIconType	
The type of the fulfilled step icon.
"font"
"svg"
	
svg
	
font
svg

id	
An HTML id attribute for the component.
string
	-	

isFulfilledStepDisplayNumber	
If true, displays the step number instead of the fulfilled step icon.
boolean
	
false
	Set boolean
onClick	
Callback fired when a step is clicked.
(stepNumber: number) => void
	-	-
size	
The size of the multi-step indicator.
MultiStepSize
	-	Set object
stepComponentClassName	
Class name applied to each step component.
string
	-	Set string
steps	
The list of steps in the multi-step indicator.
Step[]
	[]	
RAW
steps : [
0 : {...} 4 keys
1 : {...} 4 keys
2 : {...} 4 keys
]

textPlacement	
The placement of the step text.
TextPlacement
	
horizontal
	Set object
type	
The visual style of the multi-step indicator.
MultiStepType
	
primary
	Set object
Usage
Use wizard to break a larger goal into manageable steps.
If a workflow needs more than 6 steps, consider how you might simplify it or break it up into multiple tasks.
Always position the wizard at the top of the multi-step process so that the user has a common reference point as they move between steps.
🤓
Not what you were looking for?
In order to navigate between content without a linear progress, use the 
Tabs
 or 
Button group
 component.
Variants
Placements

Placements

Vertical
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Horizontal
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Story Editor
() => {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "FULFILLED",
        status: "fulfilled",
        titleText: "Fulfilled title",
        subtitleText: "Fulfilled subtitle",
      },
      {
        key: "ACTIVE",
        status: "active",
        titleText: "Active title",
        subtitleText: "Active subtitle",
      },
      {
        key: "PENDING",
        status: "pending",
        titleText: "Pending title",
        subtitleText: "Pending subtitle",
      },
    ],
    []
  );
  return (
    <div>
      Vertical
      <MultiStepIndicator
        id="placements-vertical"
        textPlacement="vertical"
        steps={steps}
      />
      Horizontal
      <MultiStepIndicator id="placements-horizontal" steps={steps} />
    </div>
  );
Copy
Format
Reset
Types

There are 4 types: Primary, success, danger, dark.

Primary
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Success
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Danger
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Dark
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Story Editor
() => {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "FULFILLED",
        status: "fulfilled",
        titleText: "Fulfilled title",
        subtitleText: "Fulfilled subtitle",
      },
      {
        key: "ACTIVE",
        status: "active",
        titleText: "Active title",
        subtitleText: "Active subtitle",
      },
      {
        key: "PENDING",
        status: "pending",
        titleText: "Pending title",
        subtitleText: "Pending subtitle",
      },
    ],
    []
  );
  return (
    <div>
      Primary
      <MultiStepIndicator id="types-primary" steps={steps} type="primary" />
      Success
      <MultiStepIndicator id="types-success" steps={steps} type="success" />
      Danger
      <MultiStepIndicator id="types-danger" steps={steps} type="danger" />
      Dark
      <MultiStepIndicator
        id="types-dark"
        aria-label="Dark type multi-step indicator"
Copy
Format
Reset
Sizes

Compact is a smaller version of the Regular Wizard Stepper, and is suitable for smaller containers. In case you need to display more content, use the Regular size. As of now, vertical placement is not supported.

Regular
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending
Pending subtitle
Compact
fulfilled
Fulfilled title
2
active
Active title
3
pending
Pending
Story Editor
() => {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "FULFILLED",
        status: "fulfilled",
        titleText: "Fulfilled title",
        subtitleText: "Fulfilled subtitle",
      },
      {
        key: "ACTIVE",
        status: "active",
        titleText: "Active title",
        subtitleText: "Active subtitle",
      },
      {
        key: "PENDING",
        status: "pending",
        titleText: "Pending",
        subtitleText: "Pending subtitle",
      },
    ],
    []
  );
  return (
    <div>
      Regular
      <MultiStepIndicator id="sizes-regular" steps={steps} size="regular" />
      Compact
      <MultiStepIndicator id="sizes-compact" steps={steps} size="compact" />
    </div>
  );
}
Copy
Format
Reset
Fulfilled Icons
Default (check)
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Number instead of icon
1
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Custom
fulfilled
Fulfilled title
Fulfilled subtitle
2
active
Active title
Active subtitle
3
pending
Pending title
Pending subtitle
Story Editor
() => {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "FULFILLED",
        status: "fulfilled",
        titleText: "Fulfilled title",
        subtitleText: "Fulfilled subtitle",
      },
      {
        key: "ACTIVE",
        status: "active",
        titleText: "Active title",
        subtitleText: "Active subtitle",
      },
      {
        key: "PENDING",
        status: "pending",
        titleText: "Pending title",
        subtitleText: "Pending subtitle",
      },
    ],
    []
  );
  return (
    <div>
      Default (check)
      <MultiStepIndicator id="icons-default" steps={steps} />
      Number instead of icon
      <MultiStepIndicator
        id="icons-numbers"
        steps={steps}
        isFulfilledStepDisplayNumber={true}
      />
      Custom
      <MultiStepIndicator
Copy
Format
Reset
Transition Animation

State transition automatic example

1
pending
First step title
First subtitle
2
pending
Second step title
Second subtitle
3
pending
Third step title
Third subtitle
Story Editor
() => {
  const initialSteps = useMemo<Step[]>(
    () => [
      {
        key: "PENDING",
        status: "pending",
        titleText: "First step title",
        subtitleText: "First subtitle",
      },
      {
        key: "PENDING-2",
        status: "pending",
        titleText: "Second step title",
        subtitleText: "Second subtitle",
      },
      {
        key: "PENDING-3",
        status: "pending",
        titleText: "Third step title",
        subtitleText: "Third subtitle",
      },
    ],
    []
  );
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  useEffect(() => {
    const getNextStepsState = (currentSteps: Step[]): Step[] => {
      const currentStepIndex = currentSteps.findIndex(
        step => step.status !== "fulfilled"
      );
      if (currentStepIndex === -1) {
        return initialSteps;
      }
      const newSteps = [...currentSteps];
      const stepToUpdate = newSteps[currentStepIndex];
      if (stepToUpdate.status === "pending") {
Copy
Format
Reset
Do’s and Don’ts
fulfilled
Plan options
Choose plan
2
pending
Seats
Number of users
3
pending
Paying method
How to pay
Do
Be consistent with the information you include under each step. If you’re using a subtitle on one step, use for all steps.
fulfilled
Plan options
2
pending
Seats
Number of users
3
pending
Paying method
How to pay
Don't
Don’t place subheader on one step only.
fulfilled
Plan
2
pending
Seats
3
pending
Method
Do
While using the wizard component, keep the default spacing between the wizard steps, even if the wizard width is smaller than the page width.
fulfilled
Plan
2
pending
Seats
3
pending
Method
Don't
Do not override the spacing between the wizard steps according to the page width.
Use cases and examples
Multi step wizard
fulfilled
Step 1
Learn how to use monday CRM
2
pending
Step 2
Integrate your email
3
pending
Step 3
Import your data
Story Editor
() => {
  const steps: Step[] = useMemo(
    () => [
      {
        key: "FULFILLED",
        status: "fulfilled",
        titleText: "Step 1",
        subtitleText: "Learn how to use monday CRM",
      },
      {
        key: "PENDING",
        status: "pending",
        titleText: "Step 2",
        subtitleText: "Integrate your email",
      },
      {
        key: "PENDING-3",
        status: "pending",
        titleText: "Step 3",
        subtitleText: "Import your data",
      },
    ],
    []
  );
  return (
    <MultiStepIndicator
      id="multi-step-wizard"
      steps={steps}
      textPlacement="vertical"
    />
  );
}
Copy
Format
Reset
Related components
Tab
Tab
Tab
Tabs
Allow users to navigate between related views of content.
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
Back
Next
Steps
Steps display progress through a sequence of logical and numbered steps. They may also be used for navigation.
