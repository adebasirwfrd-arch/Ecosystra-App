---
id: migration-guide--docs
type: docs
title: "Migration Guide"
name: "Docs"
importPath: "./src/pages/migration-guide/vibe-4-migration-guide.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=migration-guide--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:04.896Z
---

Vibe 4 Migration Guide


What's New ✨
Migration Steps 🚀
Breaking Changes 🚨
Components
Hooks
CSS and Design Tokens
FAQ ❓
Help 🙏

Vibe 4 is a major update to the Vibe design system, built for React 19 compatibility. It also delivers a leaner bundle, modern APIs, and stronger type safety. Legacy components, deprecated enums, and outdated dependencies have been removed in favor of simpler, more consistent alternatives.

Older versions migrations
From v2 to v3 see Vibe 3 migration guide
From v1 to v2 see Vibe 2 migration guide
What's New ✨
React 19 support

Vibe 4 is fully compatible with React 19.

If your app is upgrading to React 19, you must upgrade to Vibe 4 — Vibe 3 is not compatible with React 19.

New component implementations

Several components have been completely rewritten with new APIs:

Dropdown - New custom implementation replacing the old react-select-based Dropdown
Modal - New component with layout-based API (ModalBasicLayout, ModalMediaLayout, etc.)
AttentionBox - New implementation with simplified props
DatePicker - New implementation using native Date objects and date-fns instead of moment
Dialog/Tooltip/Tipseen - Now powered by Floating UI (replacing Popper.js)
Smaller bundle

Several internal runtime dependencies have been removed resulting in a significantly smaller bundle.

No more enums or static properties

All deprecated enum exports (e.g. ButtonType, DialogPositionEnum) and static property accessors (e.g. Button.sizes.LARGE) have been removed in favor of string literals, which are type-safe, tree-shakeable, and provide the same IntelliSense experience.

Standard ARIA props

Custom camelCase ARIA props (ariaLabel, ariaHidden, etc.) have been replaced with the standard HTML aria-* attributes that React natively supports, eliminating an unnecessary abstraction layer.

Migration Steps 🚀
With AI (recommended)
Install the Vibe MCP

To migrate faster and easier using AI, make sure you have the Vibe MCP server installed.

Ask your AI assistant:

Help me migrate this project from Vibe 3 to Vibe 4 using the Vibe MCP v4 migration tool
Copy

This will scan your codebase, identify the breaking changes, run the codemods automatically, and will fix all the issues.

Review the changes and test your application thoroughly.

Run your code formatter to clean up any formatting changes from the codemod (optional).

Manually

If you prefer to migrate manually, follow these steps:

Update @vibe/core:

yarn add @vibe/core@^4.0.0
Copy

Run the automated migration codemod:

npx @vibe/codemod -m v4
Copy

The codemod handles enum-to-string-literal conversions, ARIA prop renames, Icon prop renames, and several component-specific migrations. For more options, see the @vibe/codemod docs.

Follow the Breaking Changes section below and apply any remaining manual changes.

Review the changes and test your application thoroughly.

Run your code formatter to clean up any formatting changes from the codemod (optional).

Breaking Changes 🚨

The following changes are complementary to the migration codemod and may require manual intervention. If you prefer to migrate entirely by hand (without @vibe/codemod), refer to the Complete Vibe 4 changelog.

Components

AttentionBox

The component has been completely rewritten with a new API. Legacy AttentionBox removed, new implementation (previously at @vibe/core/next) promoted to @vibe/core
AttentionBoxLink component removed, use the link prop instead
Type values changed: "success" → "positive", "danger" → "negative", "dark" → "neutral"
entryAnimation prop → animate
withoutIcon / withIconWithoutHeader props removed — use icon={false}

Clickable

ariaHasPopup now accepts boolean only (was boolean | string)
tabIndex now accepts number only (was string | number)

DatePicker

The legacy DatePicker (based on react-dates and moment.js) has been replaced with a completely new component (previously at @vibe/core/next) with a different visual design, and promoted to @vibe/core
date prop now uses native Date objects instead of moment.Moment
onPickDate prop renamed to onDateChange
range boolean prop replaced with mode: "single" | "range"
moment no longer required as a peer dependency

Dialog

The legacy class-based Dialog (Popper.js) has been replaced with a new functional Dialog (Floating UI)
The modifiers prop (Popper.js) has been removed — use middleware prop (Floating UI) instead
addKeyboardHideShowTriggersByDefault now defaults to true — set it explicitly to false if you relied on the previous default

Dropdown

The old react-select-based Dropdown has been removed. The new custom Dropdown (previously at @vibe/core/next) is now the default with a completely different API. See the Dropdown Migration Guide for full details

Combobox

The Combobox component is marked as deprecated and will be removed in a future version. Use Dropdown with box mode instead

Icon

size prop now applies to type="src" icons (previously only affected type="svg")

MenuButton

MenuButton now passes focusItemIndexOnMount={0} to its Menu children by default, so the first menu item is focused when the menu opens

MenuItem

The children prop now accepts only a single MenuChild, not MenuChild[] (passing an array was already a runtime error in v3)

Modal

The legacy Modal has been removed and replaced with a completely new Modal component with a different API (previously at @vibe/core/next) and promoted to @vibe/core See the Modal documentation for the full API

Steps

The finish button now renders by default on the last step

Tipseen

The modifiers prop (Popper.js) has been removed — use middleware instead (same as Dialog)

Tooltip

The modifiers prop (Popper.js) has been removed — use middleware instead (same as Dialog)

Toggle

The duplicate data-testid="toggle" has been removed from the internal visual div — the test ID is now only on the <input> element. Update any test selectors that targeted the visual div.

VirtualizedGrid

itemRenderer return type corrected to ReactElement — if TypeScript reports errors, ensure your renderer explicitly returns ReactElement
Hooks
useMergeRefs removed from @vibe/core — use the react-merge-refs package instead
useListenFocusTriggers removed from @vibe/core — inline the logic using useEventListener
useActiveDescendantListFocus — onItemClickCallback and createOnItemClickCallback return values removed, use onItemClick directly
useKeyEvent — callback type changed from GenericEventCallback to KeyboardEventCallback (native KeyboardEvent)
CSS and Design Tokens

Spacing Tokens

The deprecated semantic spacing CSS custom properties have been removed. Replace with numeric tokens:

Removed Token	Replacement
--spacing-xs	--space-4
--spacing-small	--space-8
--spacing-medium	--space-16
--spacing-large	--space-24
--spacing-xl	--space-32
--spacing-xxl	--space-48
--spacing-xxxl	--space-64

Auto-fix available: Run npx stylelint --fix "**/*.scss" with the @vibe/style/use-new-spacing-tokens rule enabled.

Input Padding

padding-inline-start reduced from 16px to 8px across TextField, BaseInput, TextArea, and Dropdown Trigger.

Input Placeholder Color

Inputs now use var(--placeholder-color) instead of var(--secondary-text-color).

FAQ ❓

What is the best way to migrate to Vibe 4?

Follow the Migration Steps above. It is highly recommended to use the Vibe MCP to handle all the changes.

I was using enums like Button.sizes.LARGE — what do I use now?

Use string literals: "large". They are fully type-safe and provide the same IntelliSense autocomplete in your IDE. Run npx @vibe/codemod -m enums to migrate automatically.

I was importing components from @vibe/core/next — what changed?

Most components from @vibe/core/next (AttentionBox, Dropdown, DatePicker, Dialog, Modal) have been promoted to @vibe/core. Update your imports to use @vibe/core directly and follow the API changes (if any).

Is Vibe 4 compatible with React 19?

Yes. Vibe 4 is fully compatible with React 19. Note that Vibe 3 is not compatible with React 19, so if you are upgrading to React 19, you must upgrade to Vibe 4.

What if I don't want to migrate to Vibe 4?

You can continue using Vibe 3 with React 16–18, but it will only receive critical bug fixes. New features, improvements, and React 19 support are only available in Vibe 4.

The migration script failed — what should I do?

Run the script in the root of your project on a clean git branch. If issues persist, please report an issue with the error message and your environment details.

Help 🙏

If you have any questions, feedback, or need help, please don't hesitate to reach out. You can provide feedback or report issues in the Vibe repository on GitHub.
