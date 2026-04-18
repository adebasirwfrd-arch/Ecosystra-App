---
id: components-steps--docs
type: docs
title: "Components/Steps"
name: "Docs"
importPath: "./src/pages/components/Steps/Steps.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-steps--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:46:37.053Z
---

Steps

Steps display progress through a sequence of logical and numbered steps. They may also be used for navigation.

Back
Next
Show code
Import
import { Steps } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

activeStepIndex	
The index of the currently active step.
number
	
0
	Set number
areButtonsIconsHidden	
If true, hides the icons in the navigation buttons.
boolean
	
false
	Set boolean
areNavigationButtonsHidden	
If true, hides the navigation buttons.
boolean
	
false
	Set boolean
backButtonProps	
Props applied to the back button.
Partial<ButtonProps>
	{ }	Set object
className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The color theme of the steps component.
StepsColor
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
finishButtonProps	
Props applied to the finish button.
Partial<ButtonProps>
	{ }	Set object
id	
An HTML id attribute for the component.
string
	-	Set string
isContentOnTop	
If true, the content is displayed above the step navigation.
boolean
	
false
	Set boolean
nextButtonProps	
Props applied to the next button.
Partial<ButtonProps>
	{ }	Set object
onChangeActiveStep	
Callback fired when the active step changes.
(e: MouseEvent<Element, MouseEvent>, stepIndex: number) => void
	-	-
onFinish	
Callback fired when the finish button is clicked.
(e: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>) => void
	-	-
steps	
The list of steps in the steps component.
ReactElement<any, string | JSXElementConstructor<any>>[]
	[]	
RAW
steps : [
0 : {...} 6 keys
1 : {...} 6 keys
2 : {...} 6 keys
3 : {...} 6 keys
4 : {...} 6 keys
]

type	
The visual style of the steps component.
StepsType
	
gallery
	Set object
Usage
The stepper shows users where they are in the process, and can be used to navigate through the process by selecting steps.
If a task needs more than six steps, consider simplifying the process or breaking it up into multiple tasks.
Variants
Types

Steps with a number view or gallery view.

Back
3 \ 5
Next
Back
Next
Story Editor
<Flex direction="column" gap="medium">
  <Steps id="types-numbers" type="numbers" steps={steps5} activeStepIndex={2} />
  <Steps id="types-default" steps={steps5} activeStepIndex={2} />
  <div
    style={{
      padding: "15px 103px 20px",
    }}
  >
    <Steps
      id="types-no-nav"
      steps={steps5}
      activeStepIndex={2}
      areNavigationButtonsHidden
    />
  </div>
</Flex>
Copy
Format
Reset
On primary
Back
3 \ 5
Next
Back
Next
Story Editor
<Flex
  direction="column"
  gap="medium"
  style={{
    padding: "var(--sb-spacing-small)",
    backgroundColor: "var(--sb-primary-color)",
  }}
>
  <Steps
    id="primary-numbers"
    steps={steps5}
    activeStepIndex={2}
    color="on-primary-color"
    type="numbers"
  />
  <Steps
    id="primary-default"
    steps={steps5}
    activeStepIndex={2}
    color="on-primary-color"
  />
  <div
    style={{
      padding: "15px 103px 20px",
    }}
  >
    <Steps
      id="primary-no-nav"
      steps={steps5}
      activeStepIndex={2}
      color="on-primary-color"
      areNavigationButtonsHidden
    />
  </div>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
Back
3 \ 6
Next
Do
Use steps with numbers type for use cases of steps with more than 5 steps.
Back
Next
Don't
Don't use the gallery type steps component for more than 5 steps.
Use cases and examples
Navigable Steps

Navigable steps with proper code example.

Back
Next
Story Editor
() => {
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const stepPrev = useCallback(() => {
    setActiveStepIndex(prevState => prevState - 1);
  }, []);
  const stepNext = useCallback(() => {
    setActiveStepIndex(prevState => prevState + 1);
  }, []);
  const onChangeActiveStep = useCallback(
    (_e: any, stepIndex: React.SetStateAction<number>) => {
      setActiveStepIndex(stepIndex);
    },
    []
  );
  return (
    <div>
      <Steps
        id="navigable-steps"
        steps={steps5}
        isContentOnTop
        activeStepIndex={activeStepIndex}
        onChangeActiveStep={onChangeActiveStep}
        backButtonProps={{
          onClick: stepPrev,
        }}
        nextButtonProps={{
          onClick: stepNext,
        }}
      />
    </div>
  );
}
Copy
Format
Reset
Steps inside a tipseen

Our Tipseen component includes support for steps as content.

Story Editor
() => {
  const steps = [
    <div>Message number 1</div>,
    <div>Message number 2</div>,
    <div>Message number 3</div>,
    <div>Message number 4</div>,
    <div>Message number 5</div>,
  ];
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const stepPrev = useCallback(() => {
    setActiveStepIndex(prevState => prevState - 1);
  }, []);
  const stepNext = useCallback(() => {
    setActiveStepIndex(prevState => prevState + 1);
  }, []);
  const onChangeActiveStep = useCallback(
    (_e: any, stepIndex: React.SetStateAction<number>) => {
      setActiveStepIndex(stepIndex);
    },
    []
  );
  return (
    <Tipseen
      id="tipseen-with-steps"
      position="right"
      modifiers={modifiers}
      animationType="opacity-and-slide"
      content={
        <TipseenWizard
          id="tipseen-wizard"
          title="This is a title"
          steps={steps}
          onChangeActiveStep={onChangeActiveStep}
          activeStepIndex={activeStepIndex}
          backButtonProps={{
            size: "small",
Copy
Format
Reset
Related components
1
active
1st
2
pending
2nd
3
pending
3rd
MultiStepIndicator
Shows information related to a component when a user hovers over it.
Workspace
Board
Group
Breadcrumbs
Helps users to keep track and maintain awareness of their location.
Tab
Tab
Tab
Tabs
Allow users to navigate between related views of content.
