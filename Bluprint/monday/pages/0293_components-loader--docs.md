---
id: components-loader--docs
type: docs
title: "Components/Loader"
name: "Docs"
importPath: "./src/pages/components/Loader/Loader.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-loader--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:40:52.504Z
---

Loader

Circular loader indicates to user waiting state.

Show code
Import
import { Loader } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
color	
The color of the loader.
LoaderColors
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
hasBackground	
If true, a background circle is displayed behind the loader.
boolean
	
false
	Set boolean
id	
An HTML id attribute for the component.
string
	-	Set string
size	
The size of the loader, either a predefined size or a custom number.
LoaderSize
	-	Set object
wrapperClassName	
Class name applied to the wrapper element.
string
	-	Set string
Usage
Use this loader to load small parts of the system, not the whole pages.
Use sizes of loader in context to its position. The bigger the loading area gets, the bigger loader should be used.
Always place loader in context to the loading content.
🤓
Tip
While loading content consider using 
Skeleton loading
Variants
Size variants
Xs
Small
Medium
Large
Story Editor
<Flex align="start" gap={60}>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Xs
    </Text>
    <Loader id="loader-xs" size="xs" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Small
    </Text>
    <Loader id="loader-small" size="small" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Medium
    </Text>
    <Loader id="loader-medium" size="medium" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Large
    </Text>
    <Loader id="loader-large" size="large" />
  </Flex>
</Flex>
Copy
Format
Reset
Color variants
Primary
Secondary
Dark
OnPrimary
Story Editor
<Flex direction="row" gap={60}>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Primary
    </Text>
    <Loader id="loader-primary" size="medium" color="primary" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Secondary
    </Text>
    <Loader id="loader-secondary" size="medium" color="secondary" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Dark
    </Text>
    <Loader id="loader-dark" size="medium" color="dark" />
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      OnPrimary
    </Text>
    <Flex direction="row">
      <div
        style={{
          background: "var(--sb-primary-text-color)",
          padding: "var(--space-4)",
        }}
      >
        <Loader id="loader-on-primary" size="medium" color="onPrimary" />
      </div>
      <div
        style={{
          background: "var(--sb-negative-color)",
          padding: "var(--space-4)",
Copy
Format
Reset
Custom colors

If there is a need for color customization, css color attribute of a parent component can be used.

Story Editor
<div
  style={{
    color: "var(--color-dark-red)",
  }}
>
  <Loader id="loader-custom-color" size="medium" />
</div>
Copy
Format
Reset
Visual variants
Casual
With background
Story Editor
<Flex direction="row" gap="large">
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      Casual
    </Text>
    <div>
      <Loader id="loader-casual" size="medium" />
    </div>
  </Flex>
  <Flex direction="column" gap="small">
    <Text type="text1" weight="medium">
      With background
    </Text>
    <div>
      <Loader id="loader-with-background" size="medium" hasBackground />
    </div>
  </Flex>
</Flex>
Copy
Format
Reset
Do’s and Don’ts
H1 heading component
Do
Place loader in context to the loading content and keep its size proportional to the content.
H1 heading component
Don't
Don’t leave the size visually unmaintained.
Use cases and examples
Loader in text field

Use loader in search field while filtering results.

Story Editor
<DialogContentContainer>
  <Search loading placeholder="Board name" />
</DialogContentContainer>
Copy
Format
Reset
Loader in button

Indicate the loading status in button if content or an action is loading.

Click here for loading
Story Editor
() => {
  const [loading, setLoading] = useState(false);
  const onClick = useCallback(() => {
    setLoading(true);
  }, [setLoading]);
  return (
    <Button loading={loading} onClick={onClick}>
      Click here for loading
    </Button>
  );
}
Copy
Format
Reset
Related components
Skeleton
Skeleton loading componet used to indicate content and ui loading.
ProgressBar
Progress bars show continuous progress through a process, such as a percentage value.
Get started
Button
Allow users take actions with a single click.
