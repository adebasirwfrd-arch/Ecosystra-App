---
id: components-slider--docs
type: docs
title: "Components/Slider"
name: "Docs"
importPath: "./src/pages/components/Slider/Slider.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-slider--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:46:02.780Z
---

Slider

Slider is a visual input component that reflects current state status in its appearance.

Show code
Import
import { Slider } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

argTypes	
-
	-	-
aria-label	
Define a string that labels the current element (Slider)
string
	-	

aria-labelledby	
ElementId of Node that have the text needed for labeling the current element (Slider)
string
	-	Set string
className	
Custom class name to be added to the component-root-node
string
	-	Set string
color	
Color Mode (primary/positive/negative) of the component (Slider)
SliderColor
	-	Set object
data-testid	
Unique TestId - can be used as Selector for integration tests and other needs (tracking, etc)
string
	-	Set string
decorators	
-
	-	-
defaultValue	
number | number[]
	
0
	Set object
disabled	

If set to true, Component (Slider) will be disabled

impossible to change value of component (Slider)
visual changes (opacity)
boolean
	
false
	Set boolean
id	
Attribute id to be added to the component-root-node
string
	-	

indicateSelection	
Show selected from Slider range value
boolean
	
false
	Set boolean
max	
Max range value of the component (Slider)
number
	
100
	Set number
min	
Min range value of the component (Slider)
number
	
0
	Set number
onChange	

Optional onChange callback (for outer trigger or Controlled mode)

required in Controlled Mode
(value: number | number[]) => void
	-	-
postfix	
Options for postfix/end/finishing element. Same as prefix element.
string | ReactElement<any, string | JSXElementConstructor<any>> | { icon: IconType; } | ((value: number, valueText: string) => void)
	-	Set object
prefix	

Options for initial/start/prefix element, it can be one of:

Any Component (react component, node, text, number etc.)
Or it can be an object of options for Icons component (see Icon components props)
Or it can be an object for Label (Icon, Heading - and other components)
Or it can be Render Props Function witch are getting value and valueText
string | ReactElement<any, string | JSXElementConstructor<any>> | { icon: IconType; } | ((value: number, valueText: string) => void)
	-	Set object
ranged	
If true switch slider to RRange mode (two Thumbs)
boolean
	
false
	Set boolean
selectionIndicatorWidth	
Width of SelectionIndicator (i.e. TextField)
string
	
"60px"
	Set string
showValue	
Always show value instead of Tooltip
boolean
	
false
	Set boolean
size	
Size small/medium/large of the component (Slider)
SliderSize
	
small
	Set object
step	

The granularity with which the slider can step through values. (A "discrete" slider.) The min prop serves as the origin for the valid values. We recommend (max - min) to be evenly divisible by the step.

number
	
1
	Set number
value	

Current/selected value of the range of the Component (Slider)

should be used in Controlled Mode only
in ranged mode should be an array of two numbers
number | number[]
	-	Set object
valueFormatter	
Function to format the value, e.g. add %. By default, returns ${value}%
(value: number) => string
	(value: number) => `${value}%`	-
valueLabelColor	
Color of the value when showValue is true
SliderLabelColor
	
primary
	Set object
valueLabelPosition	
Position of the value when showValue is true
SliderLabelPosition
	
top
	Set object
valueText	

Text/presentation of current/selected value

should be used in Controlled Mode only
string
	-	Set string
Usage
Slider adjustment makes immediate changes to its content without need of saving
Slider works best when the exact value does not matter for the user
Slider works best for adjusting volume, setting playback time within a music player, adjusting brightness.
If exact value is necessary use slider with label
🤓
Not what you were looking for?
If you need to visualize progress use 
MultiStepIndicator
 component instead
Variants
Sizes

Sizes small/medium/large are available.

Story Editor
<Flex gap="medium" flex="1">
  <Slider
    id="sizes-small"
    aria-label="Small slider"
    size="small"
    defaultValue={12}
  />
  <Slider
    id="sizes-medium"
    aria-label="Medium slider"
    size="medium"
    defaultValue={24}
  />
  <Slider
    id="sizes-large"
    aria-label="Large slider"
    size="large"
    defaultValue={35}
  />
</Flex>
Copy
Format
Reset
Ranged Slider

Slider can define range instead of single value

Story Editor
<Flex gap="medium" flex="1">
  <Slider
    id="ranged-small"
    aria-label="Small ranged slider"
    data-testid={"monday-ranged-slider-s"}
    size="small"
    ranged={true}
  />
  <Slider
    id="ranged-medium"
    aria-label="Medium ranged slider"
    data-testid={"monday-ranged-slider-m"}
    size="medium"
    ranged={true}
    defaultValue={[12, 55]}
  />
  <Slider
    id="ranged-large"
    aria-label="Large ranged slider"
    size="large"
    ranged={true}
    defaultValue={[25, 32]}
  />
</Flex>
Copy
Format
Reset
Colors

Color Modes primary/positive/negative are available.

Story Editor
<Flex gap="medium" flex="1">
  <Slider
    id="color-positive"
    aria-label="Positive color slider"
    color="positive"
    defaultValue={34}
    size="medium"
  />
  <Slider
    id="color-negative"
    aria-label="Negative color ranged slider"
    color="negative"
    ranged={true}
    defaultValue={[12, 55]}
    size="medium"
  />
  <Slider
    id="color-primary"
    aria-label="Primary color slider"
    color="primary"
    defaultValue={12}
    size="medium"
  />
</Flex>
Copy
Format
Reset
Disabled

Slider can be disabled.

Story Editor
<Flex gap="medium" flex="1">
  <Slider
    id="disabled-positive"
    aria-label="Disabled positive slider"
    disabled={true}
    defaultValue={24}
    color="positive"
    size="medium"
  />
  <Slider
    id="disabled-negative"
    aria-label="Disabled negative slider"
    disabled={true}
    color="negative"
    size="medium"
  />
  <Slider
    id="disabled-ranged"
    aria-label="Disabled ranged primary slider"
    disabled={true}
    ranged={true}
    defaultValue={[12, 55]}
    color="primary"
    size="medium"
  />
</Flex>
Copy
Format
Reset
With labels

Indicate selection at Label, Add Prefix and/or Postfix Icons or Labels

Vol
Story Editor
<Flex
  direction="column"
  gap="large"
  style={{
    width: "500px",
  }}
>
  <Slider
    id="labeled-simple"
    aria-label="Simple labeled slider"
    indicateSelection={true}
    defaultValue={12}
    size="small"
  />
  <Slider
    id="labeled-ranged"
    aria-label="Labeled ranged slider"
    indicateSelection={true}
    ranged={true}
    defaultValue={[12, 55]}
    size="small"
  />
  <Slider
    id="labeled-sound"
    aria-label="Sound slider with icon"
    // @ts-ignore
    prefix={{
      icon: Sound,
    }}
    indicateSelection={true}
    defaultValue={70}
    size="small"
  />
  <Slider
    id="labeled-video"
    aria-label="Video slider with icons"
Copy
Format
Reset
Always show Slider's value

Always show value of slider (instead of Tooltip).

12%
55%
89%
Story Editor
<Flex gap="medium" flex="1">
  <Slider
    id="show-value-small"
    aria-label="Small slider showing value"
    data-testid={"monday-slider-show-value-s"}
    showValue={true}
    defaultValue={12}
    size="small"
  />
  <Slider
    id="show-value-medium"
    aria-label="Medium slider showing value"
    data-testid={"monday-slider-show-value-m"}
    showValue={true}
    defaultValue={55}
    size="medium"
  />
  <Slider
    id="show-value-large"
    aria-label="Large slider showing value"
    data-testid={"monday-slider-show-value-l"}
    showValue={true}
    defaultValue={89}
    size="large"
  />
</Flex>
Copy
Format
Reset
Limit and Step

Limit and Step can be customized.

Step 10
Step 2, Max: 20
from 20%
62%
till 80%
Story Editor
<Flex
  direction="column"
  gap="large"
  style={{
    width: "500px",
  }}
>
  <Slider
    id="step-10"
    aria-label="Slider with step 10"
    prefix="Step 10"
    step={10}
    indicateSelection={true}
    defaultValue={10}
    size="small"
  />
  <Slider
    id="step-2-max-20"
    aria-label="Slider with step 2 max 20"
    prefix="Step 2, Max: 20"
    max={20}
    step={2}
    indicateSelection={true}
    defaultValue={4}
    size="medium"
  />
  <Slider
    id="percentage-range"
    aria-label="Percentage range slider from 20% to 80%"
    prefix="from 20%"
    postfix="till 80%"
    min={20}
    max={80}
    showValue={true}
    defaultValue={62}
    size="large"
Copy
Format
Reset
Customisation

Custom ID, custom data-testid and Custom Class. Add Custom Items as Prefix and Postfix of Slider.

Important! Please use customisation very careful, only if you really need it. Check twice with your Product/Designer.

Check Dev-Tools for Custom Classes
Custom value formatter
Long value formatter
Custom component
RenderProps: 50% (50)
Story Editor
<Flex
  direction="column"
  gap="large"
  style={{
    width: "500px",
  }}
>
  <Slider
    id="my-app-slider"
    data-testid={"my-app-slider"}
    className="my-custom-class"
    defaultValue={19}
    prefix="Check Dev-Tools for Custom Classes"
    size="medium"
  />
  <Slider
    id="custom-value-formatter"
    className="my-custom-formatter"
    defaultValue={3}
    min={1}
    max={10}
    indicateSelection={true}
    valueFormatter={(value: number) => `${value}GB`}
    prefix="Custom value formatter"
    size="medium"
  />
  <Slider
    id="custom-value-formatter"
    className="my-long-formatter"
    defaultValue={3}
    min={1}
    max={10}
    indicateSelection={true}
    selectionIndicatorWidth="120px"
    valueFormatter={(value: number) => `${value} meter/hour`}
    prefix="Long value formatter"
Copy
Format
Reset
Related components
ProgressBar
Progress bars show continuous progress through a process, such as a percentage value.
Off
On
Toggle
Allow users to turn an individual option on or off.
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
