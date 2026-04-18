---
id: foundations-spacing--spacing
type: docs
title: "Foundations/Spacing"
name: "Spacing"
importPath: "./src/pages/foundations/spacing/Spacing.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=foundations-spacing--spacing&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:28.707Z
---

Spacing

A spacing scale is a foundational part of a design system, providing a set of consistent spacing values for margins, padding, and gaps. Clear spacing patterns enable designers and developers to build cohesive layouts while maintaining hierarchy and readability, and creating more intuitive user experiences.

The spacing scale

Our spacing scale is modular, which ensures flexibility, alignment, and balance across our platform. It includes both small increments for small components or detailed designs, and large increments for patterns or layouts.

Each spacing value has its own token. The tokens are used inside the components and should also be included between the components when building a layout.

Token name
Value
Description
space-2
2px
Use for small, compact components
space-4
4px
Use for small, compact components
space-8
8px
Use for small, compact components
space-12
12px
Use for medium, less dense components
space-16
16px
Use for larger components or dense layouts
space-20
20px
Use for larger pieces of UI, patterns, or dense layouts
space-24
24px
Use for larger pieces of UI, patterns, or layouts
space-32
32px
Use for patterns or layouts
space-40
40px
Use for patterns or layouts
space-48
48px
Use for patterns or layouts with increased spacing
space-64
64px
Use for layouts with increased spacing
space-80
80px
Use for layouts with increased spacing
Applying the spacing scale
Different use cases require different ranges of spacing to achieve the best outcomes. Here are a few guidelines to follow:
Stay consistent with paddings and sizes across similar UI patterns.
Group similar items together using similar spacing.
The distance between elements creates semantic meaning: elements that are placed close to one another are assumed to be related.
Use larger spacing around elements to emphasize their importance and draw more focus to them.
Code example
margin: var(--space-8);
margin: var(--space-8) var(--space-4);
margin: var(--space-32) 0 var(--space-16) 0;
margin-right: var(--space-12);
          
padding: var(--space-16);
padding: var(--space-20) var(--space-8);
padding: var(--space-32) var(--space-16) 0 var(--space-16);
Copy
Usage and examples
Spacing within components
Within components, smaller spacing is used to create a clear visual connection between small elements, while ensuring each one remains distinct and easily recognizable.
Use tokens from --space-2 to --space-16 for small, compact components.
Spacing within patterns
Within patterns, it is important to keep the spacing consistent. This helps to achieve familiar visual rhythm with clear relationships between components, allowing the user to navigate the product with ease.
Use tokens from --space-4 to --space-24 for small, compact patterns.
Spacing within layouts
Within page layouts, use spacing to create better hierarchy and readability, or draw the user’s attention to highly important areas.
Use tokens from --space-16 to --space-80 for page layout.
Story Editor
SpacingUsageExamples
Copy
Format
Reset
Flex spacing

Flex spacing is a form of spacing that creates equal distance between components. Vibe provides a flex component that utilizes the spacing scale to set consistent spacing between items.

For easier use, you can use our 
flex component
 to position sub-elements. This component works both horizontally and vertically, avoiding the need for a custom CSS file.

Do’s and Dont’s
Do
Use small-sized spacing to group related items together, so users can scan the content easily.
Don't
Don't use large-sized spacing between related items.
Do
Use the same spacing for similar items or patterns.
Don't
Don't use different spacing for similar items or patterns.
Do
Use larger spacing to emphasize key elements, such as headings and CTAs.
Don't
Don't use small spacing if you want to emphasize an element.
Up next
H1
H2
H3
Typography
Typography expresses hierarchy and brand presence.
Shadow
Shadows used to create the scenes of hierarchy and elevation withing the UI and layout.
Colors
Ensure accessible text, and distinguish UI elements and surfaces from one another.
