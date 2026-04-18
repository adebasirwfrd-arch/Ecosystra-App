---
id: hooks-usewizard--docs
type: docs
title: "Hooks/useWizard"
name: "Docs"
importPath: "./src/pages/hooks/useWizard/useWizard.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-usewizard--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:51:56.514Z
---

useWizard

A custom hook for managing multi-step wizards. It provides state and functions to navigate between steps, along with directionality information.

Active Step: 0
Back
Next
Story Editor
() => {
  const { activeStep, next, back, isFirstStep } = useWizard({
    stepCount: 5,
    onFinish: () => alert("Wizard Completed!"),
  });
  return (
    <>
      <Heading weight="medium" type="h3">
        Active Step: {activeStep}
      </Heading>
      <Flex gap="small">
        <Button kind="tertiary" onClick={back} disabled={isFirstStep}>
          Back
        </Button>
        <Button onClick={next}>Next</Button>
      </Flex>
    </>
  );
}
Copy
Format
Reset
Variants
With Initial Step

Start the wizard from a custom initial step using the initialStep parameter.

Active Step: 2
Back
Next
Story Editor
() => {
  const { activeStep, next, back, isFirstStep } = useWizard({
    initialStep: 2,
    stepCount: 5,
  });
  return (
    <>
      <Heading weight="medium" type="h3">
        Active Step: {activeStep}
      </Heading>
      <Flex gap="small">
        <Button kind="tertiary" onClick={back} disabled={isFirstStep}>
          Back
        </Button>
        <Button onClick={next}>Next</Button>
      </Flex>
    </>
  );
}
Copy
Format
Reset
With Steps component
Step 1
Back
Next
Story Editor
() => {
  const { activeStep, next, back, goToStep, isFirstStep } = useWizard({
    stepCount: 5,
  });
  const stepsContent = [
    <div>Step 1</div>,
    <div>Step 2</div>,
    <div>Step 3</div>,
    <div>Step 4</div>,
    <div>Step 5</div>,
  ];
  return (
    <>
      <Steps
        className={styles.stepper}
        areNavigationButtonsHidden
        isContentOnTop
        steps={stepsContent}
        activeStepIndex={activeStep}
        onChangeActiveStep={(_e, stepIndex) => goToStep(stepIndex)}
      />
      <Flex gap="small">
        <Button kind="tertiary" onClick={back} disabled={isFirstStep}>
          Back
        </Button>
        <Button onClick={next}>Next</Button>
      </Flex>
    </>
  );
}
Copy
Format
Reset
Arguments
optionsObject
initialStepnumber - The starting step of the wizard. Defaults to 0.
stepCountnumber - Total number of steps in the wizard.
onStepChange(newStep: number, oldStep: number) => void - Callback invoked when the active step changes.
onFinish() => void - Callback invoked when the wizard completes.
Returns
resultObject
activeStepnumber - The current active step.
direction"forward" | "backward" - The direction of the last step change.
next() => void - Function to proceed to the next step.
back() => void - Function to go back to the previous step.
goToStep(newStep: number) => void - Function to navigate to a specific step.
isFirstStepboolean - Indicates if the current step is the first step.
isLastStepboolean - Indicates if the current step is the last step.
