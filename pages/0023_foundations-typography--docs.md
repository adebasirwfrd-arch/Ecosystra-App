---
id: foundations-typography--docs
type: docs
title: "Foundations/Typography"
name: "Docs"
importPath: "./src/pages/foundations/typography/typography.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=foundations-typography--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:34.227Z
---

Typography

Like in other UI in mondays interface, typography works by principle of accessibility before aesthetics. Therefore, the text should be readable and help the user understand what’s important by well contrasted size and colors hierarchy.

Fonts

We are using two fonts for our UI hierarchy: Poppins and Figtree. We are using Poppins font for our main titles (heading), and Figtree for text, labels and paragraphs. We don't import the font within our CSS in order to give full control of the fonts which you wish to bring to your client, the following code snippet is what we recommend in order to include our recommended fonts.

<link
  href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  rel="stylesheet"
/>
Copy

More ever this is how we are building our css variable for our main font families

--font-family: Figtree, Roboto, Noto Sans Hebrew, Noto Kufi Arabic, Noto Sans JP, sans-serif;
--title-font-family: Poppins, Roboto, Noto Sans Hebrew, Noto Kufi Arabic, Noto Sans JP, sans-serif;
Copy
🤓
How to use the fonts?
Figtree and Poppins are both Google Fonts. Click
here
to download Figtree, and click
here
to download Poppins.
Type styles

We use two key type styles: heading and text

H1 - 32px

Name	SASS

H1 bold
	@include vibe-heading(h1, bold);

H1 medium
	@include vibe-heading(h1, medium);

H1 normal
	@include vibe-heading(h1, normal);

H1 light
	@include vibe-heading(h1, light);

H2 - 24px

Name	SASS

H2 bold
	@include vibe-heading(h2, bold);

H2 medium
	@include vibe-heading(h2, medium);

H2 normal
	@include vibe-heading(h2, normal);

H2 light
	@include vibe-heading(h2, light);

H3 - 18px

Name	SASS

H3 bold
	@include vibe-heading(h3, bold);

H3 medium
	@include vibe-heading(h3, medium);

H3 normal
	@include vibe-heading(h3, normal);

H3 light
	@include vibe-heading(h3, light);

Text1 - 16px

Name	SASS

Text1 bold
	@include vibe-text(text1, bold);

Text1 medium
	@include vibe-text(text1, medium);

Text1 normal
	@include vibe-text(text1, normal);

Text2 - 14px

Name	SASS

Text2 bold
	@include vibe-text(text2, bold);

Text2 medium
	@include vibe-text(text2, medium);

Text2 normal
	@include vibe-text(text2, normal);

Text3 - 12px

Name	SASS

Text3 medium
	@include vibe-text(text3, medium);

Text3 normal
	@include vibe-text(text3, normal);
Text colors
primary-text-color
Use for default text color
secondary-text-color
Use when you need text with lesser importance
secondary-text-on-secondary-color
Use when you need text with lesser importance (on secondary background color)
text-color-on-inverted
Inverted text color (opposite of primary text color)
text-color-on-primary
Use for text on primary color
disabled-text-color
Use as text in disabled components
placeholder-color
Use for placeholder text in inputs fields
link-color
Use only for links
Usage and examples
Avoid using text size smaller than 14px.
Don't underline words. For typographic emphasis use bold text.
Don't use 2 different sizes of text in the same line.
Related components
lorem ipsum dolor sit amet
Text
The text component serves as a wrapper for applying typography styles to the text it contains.
Hello world
Heading
Heading components are used to title any page sections or sub-sections in top-level page sections.
Hello world
EditableHeading
An extension of Heading component, it allows built in editing capabilities.
