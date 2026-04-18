---
id: getting-started--docs
type: docs
title: "Getting Started"
name: "Docs"
importPath: "./src/pages/getting-started/getting-started.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=getting-started--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:30:53.837Z
---

Getting Started
@vibe/core

Vibe Design System's Core Component Library in React

Usage

Components are imported from the library's root entry:

import { Button } from "@vibe/core";
Copy
Global CSS Setup

Vibe components require box-sizing: border-box to be applied globally. Add the following to your root stylesheet:

*,
*::before,
*::after {
  box-sizing: border-box;
}
Copy
Font installation

We don't import fonts ourselves, we work best with the following fonts - Poppins, Figtree and Roboto, we recommend adding the following link import to your application

<link
  href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  rel="stylesheet"
/>
Copy
Theming

Theming is supported using CSS variables - for more info on theming please read the theme guidelines file.

Experimental SSR (Server Side Rendering)

Components are using style injection on the client side (into element) This is not usable on the server side. In order to get the required styles on the server side, you should initialize

globalThis.injectedStyles = {};
Copy

in order to have each server side render component css inserted into the injectedStyles object each component will insert its css string under a unique key. Then you can join all the values into one string and add it under a <style> element

Experimental Component Metadata for LLMs

You can access component metadata (props, descriptions, etc.) via the /meta export path:

import metadata from "@vibe/core/meta";
Copy

Note: This feature is experimental and currently intended for internal Vibe LLM efforts. The structure and content of the metadata object are subject to change without notice in future versions. We cannot guarantee stability for this feature, yet.
