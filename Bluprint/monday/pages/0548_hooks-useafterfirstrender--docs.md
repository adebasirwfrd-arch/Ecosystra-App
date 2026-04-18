---
id: hooks-useafterfirstrender--docs
type: docs
title: "Hooks/useAfterFirstRender"
name: "Docs"
importPath: "./src/pages/hooks/useAfterFirstRender/useAfterFirstRender.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=hooks-useafterfirstrender--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:42.540Z
---

useAfterFirstRender

Use this hook to track whether the page has been rendered at least once.

This is the first render!

Rerender count: 0

Rerender component
Story Editor
() => {
  const isAfterFirstRender = useAfterFirstRender();
  const [renderCount, setRenderCount] = useState(0);
  const handleRerender = () => {
    setRenderCount(prevCount => prevCount + 1);
  };
  return (
    <>
      <Heading type="h3" weight="normal">
        {isAfterFirstRender.current
          ? "It is after the first render!"
          : "This is the first render!"}
      </Heading>
      <p>Rerender count: {renderCount}</p>
      <Button onClick={handleRerender}>Rerender component</Button>
    </>
  );
}
Copy
Format
Reset
Import
import { useAfterFirstRender } from "@vibe/core";
Copy
Returns
boolean - Whether the first render happened or not.
Usage
Use this hook when you want to wait for the page to load at least once before doing something.
