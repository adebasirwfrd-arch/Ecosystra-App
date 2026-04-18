---
id: changelog--docs
type: docs
title: "Changelog"
name: "Docs"
importPath: "./src/pages/changelog/changelog.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=changelog--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:03.032Z
---

Changelog

All notable changes to this project will be documented in this file. See Conventional Commits for commit guidelines.

4.0.1 (2026-04-16)
Bug Fixes
ColorPicker: add screen reader support for color announcements (#3346) (ed1bbb1)
4.0.0 (2026-03-18)
BREAKING CHANGES

This release contains breaking changes across components, APIs, and styling. Key highlights:

Enum removal: Removed all deprecated enum exports and static properties across 30+ components. Use string literals instead. Run npx @vibe/codemod --migration v4 to migrate automatically.
Dropdown: Complete API rewrite replacing the react-select-based implementation with a new custom component.
Dialog: Migrated from Popper.js to Floating UI (@floating-ui/react-dom). The modifiers prop is replaced by middleware.
AttentionBox: New component promoted from @vibe/core/next. Legacy props removed; type values renamed.
Icon: Props renamed — iconLabel → label, iconType → type, iconSize → size.
TipseenImage: Removed — use TipseenMedia with an <img> child instead.

For the full list of breaking changes and migration instructions, see the v4 migration guide.

3.88.0 (2026-03-11)
Bug Fixes
checkbox: safari keyboard navigation (#3328) (8614a7b)
Features
LinearProgressBar: add allowExceedingMax prop to support values… (#3255) (ce68c53)
3.87.0 (2026-02-27)
Features
bump version (#3286) (812acd8)
3.85.1 (2026-02-12)
Bug Fixes
DropdownBoxMode: add menuWrapperClassName (#3253) (c05a846)
3.85.0 (2026-02-09)
Bug Fixes
Dropdown: use vibe scroller (#3248) (aba1ad2)
Features
List: new component (#3240) (c9a15d6)
3.84.0 (2026-02-04)
Features
BaseList: new component (#3212) (8372ddd)
3.83.4 (2026-01-28)

Note: Version bump only for package @vibe/core

3.83.3 (2026-01-25)
Bug Fixes
Tipseen: hide button div when no buttons are displayed (#3242) (e48766e)
3.83.2 (2026-01-18)
Bug Fixes
Dropdown: : blur searchable dropdown select item (#3236) (5f62a8f)
3.83.1 (2026-01-04)

Note: Version bump only for package @vibe/core

3.83.0 (2026-01-04)
Features
Dropdown: enhance MultiSelectedValues and DropdownInput for better layout and responsiveness (#3230) (40f8791)
3.82.4 (2025-12-28)

Note: Version bump only for package @vibe/core

3.82.3 (2025-12-25)

Note: Version bump only for package @vibe/core

3.82.2 (2025-12-22)

Note: Version bump only for package @vibe/core

3.82.1 (2025-12-17)

Note: Version bump only for package @vibe/core

3.82.0 (2025-12-17)
Features
add new DatePicker component (#3139) (cfea5a9)
3.81.1 (2025-12-04)

Note: Version bump only for package @vibe/core

3.81.0 (2025-11-27)
Features
Dropdown: add minVisibleCount prop to MultiSelect (#3185) (e789214)
3.80.0 (2025-11-27)
Bug Fixes
Label: update text color (#3194) (822f3a7)
Features
Dropdown: add borderless prop (#3195) (0e1227d)
Dropdown: add boxMode for inline dropdown display (#3171) (c344822)
3.79.0 (2025-11-26)
Features
AlertBanner: add ariaLive to AlertBanner (#3182) (961faca)
3.78.0 (2025-11-25)
Features
EditableTypography: add onKeyDown event (#3190) (0b53625)
3.77.0 (2025-11-19)
Features
MenuItem: add right icon (#3183) (9e8b448)
3.76.1 (2025-11-19)
Bug Fixes
AttentionBox: change Text element type based on content type for… (#3186) (8964e33)
3.76.0 (2025-11-11)
Features
Dropdown: add support for ControlledPropUpdatedSelectedItem state change in combobox hooks (#3179) (14d7d56)
3.75.0 (2025-11-10)
Features
Enhance metadata generation to support @vibe/* imports (#3178) (70c5822)
3.74.0 (2025-11-06)
Bug Fixes
Tipseen: resolve invalid HTML structure and ref/id prop issues (#2799) (5f942d1)
Features
Dialog: add enableNestedDialogLayer prop (#3176) (a14a063)
3.73.0 (2025-11-03)
Bug Fixes
BaseListItem: fix overflow tooltip (#3151) (6440534)
Features
Chips: add "neutral" variant color (#3170) (b91490f)
3.72.0 (2025-10-30)
Bug Fixes
AttentionBox: increase specificity for the link component to be greater than the Link component native style (#3169) (1d57865)
Features
Dropdown: enhance MultiSelectedValues for single chip display (#3164) (3b9d502)
3.71.1 (2025-10-30)

Note: Version bump only for package @vibe/core

3.71.0 (2025-10-28)
Features
Modal: allow to block focus lock from stealing focus for other type of dialogs (#3143) (2f55f6f)
3.70.5 (2025-10-27)
Bug Fixes
Dropdown: smooth text to align all dropdowns (#3161) (a639943)
3.70.4 (2025-10-26)
Bug Fixes
itemToKey by value (#3158) (3811c78)
3.70.3 (2025-10-26)

Note: Version bump only for package @vibe/core

3.70.2 (2025-10-25)
Bug Fixes
Dialog: click outside handler should be on the wrapper - not content - of the Dialog (#3145) (b154daf)
3.70.1 (2025-10-19)

Note: Version bump only for package @vibe/core

3.70.0 (2025-10-16)
Bug Fixes
Dropdown: set index correctly (#3138) (205ad5a)
Features
ListItem: add tooltipProps prop (#3137) (41d4d26)
3.69.1 (2025-09-29)
Bug Fixes
Dropdown: fix types (#3131) (a207bb2)
DropdownNew: fix types (#3108) (8695e81)
3.69.0 (2025-09-28)
Features
Info: new component (#3095) (5bfa27f)
3.68.5 (2025-09-28)
Bug Fixes
AvatarGroup: fix counter styles (#3124) (5c80e0f)
3.68.4 (2025-09-21)
Bug Fixes
Dialog: add LayerProvider (#3122) (b56e7aa)
3.68.3 (2025-09-19)
Bug Fixes
use react-select v3.4.0 (#3119) (089e15d)
3.68.2 (2025-09-19)
Bug Fixes
Revert Dropdown use Select component as named export (#3117) (cc1d72a)
3.68.1 (2025-09-18)
Bug Fixes
Dropdown: use Select component as named export (#3116) (7059d31)
3.68.0 (2025-09-18)
Bug Fixes
DropdownNew: onInputChange return null instead of empty string (#3109) (bcd6ac0)
Features
DropdownNew: a11y improvements (#3114) (6b21abb)
Performance Improvements
Dialog: Return default when containerSelector is undefined (#3113) (9c7ba22)
3.67.0 (2025-09-17)
Features
Chips: add ariaHasPopup prop (#3111) (666bc76)
3.66.0 (2025-09-17)
Features
DropdownNew: enhance accessibility attributes for dropdown states (#3110) (b52e075)
3.65.1 (2025-09-14)
Bug Fixes
DropdownNew: Searchable controlled multi dropdown item selection (#3104) (d335161)
3.65.0 (2025-09-08)
Features
Combobox: add tooltipProps and ComboboxOption for enhanced tooltip customization (#3096) (3fa0d10)
3.64.0 (2025-09-07)
Features
AttentionBox: implement new AttentionBox component for better DX and improved UI (#2969) (ad3e2e1)
Dropdown: add loading state (#3090) (6101b24)
3.63.1 (2025-09-04)

Note: Version bump only for package @vibe/core

3.63.0 (2025-09-04)
Bug Fixes
Chips: warning color missing hover state (#3080) (f21b62b)
Features
add getVibeComponentAccessibility tool to retrieve a11y requirements (#3084) (45314fb)
Performance Improvements
replace lodash-es with es-toolkit compat (#3072) (14dd2bb)
3.62.0 (2025-08-27)
Bug Fixes
Dropdown: fix size and focus (#3071) (72425ad)
DropdownBase: update active state to include isOpen condition (#3070) (05eba9f)
dropdown: border (#3075) (81d904f)
Dropdown: padding on trigger actions (#3073) (56dfdf8)
Features
Tabs: add ariaControls (#3068) (1f1c084)
3.61.1 (2025-08-25)
Bug Fixes
tabs screen reader (#3066) (9e39770)
3.61.0 (2025-08-20)
Features
IME support for EditableHeading, EditableText (#3052) (7074f42)
Link: add style prop for inline styling (#3063) (48df2c5)
Tipseen: add onShow event (#3064) (d5954e7)
Reverts
"feat(Tipseen): add onShow event" (#3065) (2df6c8b)
3.60.0 (2025-08-14)
Features
Table: use custom scrollbar (#3032) (60962e6)
3.59.0 (2025-08-13)
Features
Toggle: add noSpacing prop to remove horizontal spacing (#3048) (e0c6732)
3.58.4 (2025-08-12)
Bug Fixes
Counter: fix usage of CSSTransition#addEndListener with nodeRef (#3047) (a73b8e9)
3.58.3 (2025-08-12)
Bug Fixes
Label: fix line kind when using content colors (#3041) (1eb0893)
3.58.2 (2025-08-07)
Bug Fixes
A11y-fixes for MenuButton, TextArea, TextField and Checkbox (#3036) (803c244)
3.58.1 (2025-08-05)
Bug Fixes
DatePicker: fix import path for defaultPhrases (#3034) (2797c34)
3.58.0 (2025-08-05)
Features
Tabs: add support for Home and End key navigation (#3031) (3e80d9c)
3.57.1 (2025-08-04)

Note: Version bump only for package @vibe/core

3.57.0 (2025-08-03)
Bug Fixes
add check for ResizeObserver support (#3025) (a2d14fb)
change progress bar transition duration (#3022) (200cba7)
DatePicker: add default value for onPickDate prop (#3024) (fbd01c2)
Features
DatePicker: be able to customize phrases for localization (#2983) (e21c3b6)
3.56.5 (2025-07-27)

Note: Version bump only for package @vibe/core

3.56.4 (2025-07-27)
Bug Fixes
BaseList: update background color to use secondary background token (#3012) (dd3f610)
3.56.3 (2025-07-24)
Bug Fixes
Dropdown: update default of showSelectedOptions to true (#3011) (cb07d75)
3.56.2 (2025-07-24)

Note: Version bump only for package @vibe/core

3.56.1 (2025-07-24)

Note: Version bump only for package @vibe/core

3.56.0 (2025-07-23)
Bug Fixes
Dropdown: stretch selected value (#3007) (b5899df)
Features
stylelint: add new stylelint rule for new spacing tokens system and update configuration (#2991) (b4a07cb)
3.55.6 (2025-07-23)

Note: Version bump only for package @vibe/core

3.55.5 (2025-07-23)

Note: Version bump only for package @vibe/core

3.55.4 (2025-07-22)
Bug Fixes
Dropdown: apply padding conditionally for closed dropdown (#3001) (62f2461)
3.55.3 (2025-07-22)

Note: Version bump only for package @vibe/core

3.55.2 (2025-07-21)
Bug Fixes
Dropdown: remove padding for closed dropdown (#2999) (48a1186)
3.55.1 (2025-07-21)
Bug Fixes
Table: fix loading state handling in TableVirtualizedBody (#2992) (8e2dff4)
3.55.0 (2025-07-20)
Bug Fixes
fix @vibe/core/tokens import ts error (#2948) (1f66197)
Features
Dropdown: New dropdown component (#2896) (95b08c9)
3.54.2 (2025-07-15)

Note: Version bump only for package @vibe/core

3.54.1 (2025-07-13)

Note: Version bump only for package @vibe/core

3.54.0 (2025-07-09)
Features
NumberField: add a new NumberField component (#2950) (e3693f7)
3.53.1 (2025-07-03)
Bug Fixes
icons: update DropdownChevronDown and DropdownChevronUp (#2965) (57d9704)
3.53.0 (2025-07-01)
Features
Dialog, Refable: add support for customizable wrapper element type in Dialog and Refable components (#2961) (b4d7729)
FieldLabel: add htmlFor prop and id support for improved accessibility (#2958) (7d18194)
3.52.2 (2025-06-18)
Bug Fixes
ButtonGroup: fix tooltips in fullWidth layout (#2931) (6a37195)
3.52.1 (2025-06-11)
Bug Fixes
metadata: include components withStaticPropsWithoutForwardRef (#2929) (9e5d351)
3.52.0 (2025-06-08)
Bug Fixes
Chips: fix hover state (#2924) (6eed661)
Features
tabs: added stretchedUnderline prop (#2923) (6f971ee)
3.51.3 (2025-06-01)

Note: Version bump only for package @vibe/core

3.51.2 (2025-05-29)
Bug Fixes
Tabs: add circular keyboard navigation (#2867) (29a98c2)
3.51.1 (2025-05-28)
Bug Fixes
TextField: display error text correctly (#2910) (c6ecb22)
3.51.0 (2025-05-26)
Features
Dropdown: add hover and active states to counter in MultiValueContainer (#2907) (7d5d137)
3.50.3 (2025-05-25)

Note: Version bump only for package @vibe/core

3.50.2 (2025-05-20)

Note: Version bump only for package @vibe/core

3.50.1 (2025-05-19)
Bug Fixes
Dialog: clear timeouts on component unmount (#2892) (a12c654)
enhance props handling by filtering unnecessary properties to shorten the json (#2890) (174ebd2)
metadata did not include components with static props because of docgen and typescript issues (#2889) (dc73328)
Table: make row hover state immediate, robust and more reliable (#2888) (fe41ed1)
3.50.0 (2025-05-15)
Features
Dropdown, Dialog, Tooltip: apply border color for components in darker themes (#2880) (c25630c)
3.49.0 (2025-05-13)
Features
Modal: add responsiveness for modal (#2737) (02ef204)
3.48.1 (2025-05-11)
Bug Fixes
Dropdown: Fix dropdown chip width issue (#2872) (c8c6b09)
3.48.0 (2025-05-08)
Bug Fixes
Dropdown: add support for rightRenderer in multi dropdown (#2870) (6a833c8)
Features
add observeReferenceResizeModifier for dynamic reference resizing (#2869) (5967c65)
Chips: add noMargin prop to remove default margin from chips (#2871) (ab92f6c)
3.47.0 (2025-05-05)
Features
ExpandCollapse: make icon position configurable (#2863) (7d24e77)
3.46.1 (2025-05-04)
Bug Fixes
Table: Memoized row for optimized row rendering (#2862) (261ca12)
3.46.0 (2025-05-04)
Features
MenuButton: allow passing multiple values to dialog ignore classes (#2859) (85f52f4)
3.45.0 (2025-04-29)
Bug Fixes
Dropdown: prevent the MultiValueContainer gaps from triggering open of menu (#2858) (cd97a59)
Features
Dropdown: add classname for multi value dialog (#2857) (79c0bd7)
3.44.3 (2025-04-29)
Bug Fixes
ColorPickerContent: add keyboard tab navigation support to ColorPickerContent's grid (#2856) (be22cc5)
3.44.2 (2025-04-28)
Bug Fixes
ColorPicker: fix icon alignment in color (#2855) (77c855b)
3.44.1 (2025-04-27)
Bug Fixes
Combobox: Hide option tooltip when scrolled (#2854) (a0d9f85)
MenuButton: fix tab focus when menu is closing (#2853) (4c74e15)
3.44.0 (2025-04-24)
Bug Fixes
Fix <ButtonGroup> border collapse issue (#2852) (f5eb915)
Features
BreadcrumbsBar: adding breadcrumb menu component (#2844) (c93f590)
Menu: accessibility improvements (#2848) (685f9b3)
3.43.1 (2025-04-23)
Bug Fixes
Combobox: update scrollRef type to MutableRefObject (#2850) (d5fe720)
docs: docgen can't handle ComponentType (#2851) (e50beb0)
3.43.0 (2025-04-23)
Bug Fixes
MenuItem: replace aria-current with aria-selected for menu items according to a11y guidelines (#2842) (9dc6565)
TextField: Don't display subTextContainer when no requiredErrorText (#2849) (08aadc5)
Features
add metadata for LLMs (#2833) (675f541)
3.42.0 (2025-04-10)
Bug Fixes
Tipseen: prevent double delay when using showDelay (#2839) (d53758b)
Features
Flex: introduced flex prop (#2753) (5972ab2)
TextWithHighlight: add tooltipProps for additional Tooltip cust… (#2840) (41781fd)
3.41.0 (2025-04-10)
Features
TextField: validationText can be a ReactNode (#2837) (3df905c)
3.40.0 (2025-04-09)
Bug Fixes
Dropdown: fix test env check (#2836) (823dcfe)
Features
add data-testid to Box (#2831) (778312c)
3.39.0 (2025-04-06)
Bug Fixes
EmptyState: description should always be text2 (#2832) (c476765)
Features
MenuTitle: be able to provide a ReactNode (#2835) (47448e8)
3.38.0 (2025-04-03)
Bug Fixes
Modal: update background color to use new token (#2830) (4cd31ee)
Features
add EmptyState component (#2790) (4b50947)
Text: add error color (#2827) (5fcd9ff)
3.37.0 (2025-03-30)
Features
Dropdown: use layer context for the dropdown in case used inside Dialog or Modal (#2824) (0beb840)
3.36.0 (2025-03-26)
Bug Fixes
Dropdown: use require for test envs only (#2807) (da66310)
MenuItem: remove 2nd tooltip (already has tooltip on the MenuItem wrapper) (#2820) (1f33f10)
Features
usePopover: add fallbackPlacements prop (#2819) (6f28a55)
3.35.0 (2025-03-25)
Features
add data-vibe attribute to components (#2783) (e3e2043)
3.34.2 (2025-03-24)

Note: Version bump only for package @vibe/core

3.34.1 (2025-03-23)

Note: Version bump only for package @vibe/core

3.34.0 (2025-03-20)
Features
Tipseen: add submitButtonIcon prop (#2809) (471979f)
3.33.0 (2025-03-19)
Features
Link: add color variants (#2794) (2051a60)
usePopover add offset prop (#2806) (3f8acd6)
3.32.0 (2025-03-13)
Bug Fixes
Table: fix virtualized table overflow (#2797) (8a1f7fc)
TextArea: remove border from disabled state (#2793) (7b02ffa)
Features
AvatarGroup: Add tabIndex prop for AvatarGroupCounter (#2795) (c3cc979)
3.31.2 (2025-03-11)
Bug Fixes
Button: change icon size in small variant to 16px (#2792) (9ef5648)
ColorPicker: make forceUseRawColorList and showColorNameTooltip compatible (#2789) (39592ae)
3.31.1 (2025-03-11)
Bug Fixes
Modal: closeButtonTheme fixed color (#2791) (977764a)
3.31.0 (2025-03-11)
Features
Spacing: add new spacing tokens (#2768) (a21f765)
3.30.0 (2025-03-05)
Features
types: allow dialogPaddingSize to accept inline string values (in addition to the enum) (#2786) (167b290)
types: export TableColumn type (#2787) (dbad506)
3.29.0 (2025-02-24)
Features
List: add role props (#2771) (a079690)
3.28.2 (2025-02-19)
Bug Fixes
Tipseen: setting width more than max-width in tooltip default width has no effect (#2770) (4dc7a38)
3.28.1 (2025-02-19)
Bug Fixes
VirtualizedList: sync scroll position to handle React 18 batching (#2769) (4eacea5)
3.28.0 (2025-02-17)
Features
Label: Add content colors (#2767) (6ff8036)
3.27.1 (2025-02-13)
Bug Fixes
Dialog: ensure event handlers are properly forwarded in DialogContentContainer (#2762) (8a9bfbd)
3.27.0 (2025-02-11)
Features
Combobox: add className for sticky header (#2759) (63094f7)
3.26.0 (2025-02-11)
Features
Combobox: add className for sticky header (#2759) (63094f7)
3.25.0 (2025-02-09)
Features
ModalFooter: allow tooltip for the modal footer's buttons (#2754) (9f45266)
3.24.2 (2025-02-09)
Bug Fixes
Combobox: color on sticky category in virtualized (#2757) (91a3bd9)
3.24.1 (2025-02-05)

Note: Version bump only for package @vibe/core

3.24.0 (2025-02-04)
Features
Tab: add tooltipProps prop (#2750) (3714938)
useIsOverflowing: allow width tolerance (#2752) (6102dd1)
3.23.0 (2025-02-03)
Features
Dropdown: allow ellipsis for component's placeholder (#2749) (66b1924)
3.22.1 (2025-02-03)
Bug Fixes
Slider: increase value label max-width to 64px (#2748) (1435c4d)
3.22.0 (2025-02-02)
Features
ButtonGroup: add blurOnMouseUp to ButtonGroup (#2743) (bfcb116)
3.21.0 (2025-01-30)
Features
Modal: allow disabling autoFocus (#2729) (abb15b2)
3.20.0 (2025-01-30)
Bug Fixes
Slider: margin on slider wrapper based on valueLabelPosition prop (#2741) (e2ae9f6)
Features
Search: add prop for hiding clear icon (#2742) (779db25)
3.19.0 (2025-01-27)
Features
MenuItem: allow observing submenu content resize when a re-render isn't triggered (#2713) (ef07e3c)
3.18.0 (2025-01-27)
Bug Fixes
MenuItem: fix disabled submenu arrow button (#2735) (f9ba468)
Features
Avatar: add xs size (#2732) (abfefda)
Slider: be able to change value label position and color (#2734) (c84db0a)
3.17.1 (2025-01-20)
Bug Fixes
MenuButton: return closeDialogOnContentClick prop (#2725) (515a648)
3.17.0 (2025-01-16)
Features
Modal: add full-view size for Modal (#2716) (ac85841)
3.16.0 (2025-01-13)
Bug Fixes
Icons: update icons (#2711) (be229ad)
Features
Dialog: allow observing content resize without a re-render triggered (#2706) (8ae3eeb)
3.15.1 (2025-01-12)

Note: Version bump only for package @vibe/core

3.15.0 (2025-01-07)
Bug Fixes
Modal: avoid breaking changes due to specificity (#2705) (393ecf8)
Features
Modal: wrap the overlay and modal inside a container, to allow portaling with layer provider to the container (#2703) (6f4b9d5)
3.14.0 (2025-01-06)
Bug Fixes
Dropdown: allow remove chips on mobile (#2704) (01ceab5)
EditableTypography: improve performance (#2701) (f7e5514)
Features
Modal: allow accepting custom arias, allow passing ReactNode to ModalHeader's title (#2702) (8201d7f)
3.13.0 (2025-01-06)
Bug Fixes
tooltip: fix text with line breaks (#2700) (5863c05)
Features
TransitionView: export component to be used publicly (#2699) (661be75)
3.12.3 (2025-01-01)
Bug Fixes
Modal: Esc should be scoped to the current top modal and not to close all modals (#2698) (8fa3253)
3.12.2 (2025-01-01)
Bug Fixes
Modal: RemoveScroll is overriding Modal's div's ref (#2697) (7f1772f)
3.12.1 (2025-01-01)
Bug Fixes
Dropdown: fix a11y props when searchable is false (#2689) (ca0a4ed)
EditableTypography: Enter and Esc click to end edit mode is bubbling to other places afterwards (#2696) (428ba51)
EditableTypography: Enter click to end edit mode is bubbling to other places afterwards (#2694) (c60db9f)
3.12.0 (2024-12-31)
Features
support multiline for EditableText (#2683) (8c4bf29)
3.11.0 (2024-12-31)
Features
EditableTypography: allow autoselect of text when going into edit mode (#2691) (941fab2)
3.10.3 (2024-12-30)
Bug Fixes
Table: menu not rendering on react 18 (#2684) (0ae670f)
3.10.2 (2024-12-30)
Bug Fixes
Tipseen: showDelay of 0 causes component to auto-close when mouse leave (#2687) (f8b59f6)
Performance Improvements
remove redundant overflow style manipulation (#2678) (5b57172)
3.10.1 (2024-12-29)
Bug Fixes
Button: ensure icons className is not added when children are non-renderable (#2685) (7758e29)
3.10.0 (2024-12-26)
Features
Tipseen: add event in Tipseen onClose prop (#2680) (a79f610)
3.9.3 (2024-12-24)
Bug Fixes
VirtualizedGrid: fix onItemsRendered params (#2674) (48d4711)
3.9.2 (2024-12-23)

Note: Version bump only for package @vibe/core

3.9.1 (2024-12-22)
Bug Fixes
List: fix error when ListItem is not HTMLElement (#2672) (e175d32)
3.9.0 (2024-12-19)
Bug Fixes
ModalBasicLayout: fix for logic of when to show modal footer shadow (#2665) (9d68962)
Features
TransitionView: remove previous slide before continuing to next slide, enhance animation (#2668) (0bd51df)
3.8.0 (2024-12-19)
Features
Modal: allow passing z-index to overlay and modal (#2662) (3d1aceb)
Tooltip: add dir prop (#2666) (5280307)
3.7.3 (2024-12-18)
Bug Fixes
Dropdown: fix menuRenderer type (#2661) (16b707b)
3.7.2 (2024-12-18)
Bug Fixes
next entry point pointed to a wrong path (#2660) (b1a0b2c)
3.7.1 (2024-12-17)
Bug Fixes
StatusTag remove log, sort stories alphabetically, modal docs fixes (#2659) (5b13f48)
3.7.0 (2024-12-17)
Features
Modal: export new Modal component to /next (#2641) (244c1cb)
3.6.2 (2024-12-17)
Bug Fixes
Dropdown: fix valueRenderer return type (#2642) (87afb2d)
3.6.1 (2024-12-16)
Bug Fixes
load inlinesvg with esm (#2656) (1ef3ab3)
3.6.0 (2024-12-15)
Bug Fixes
ButtonGroup: remove z-index from active button (#2649) (9f15af8)
Dropdown: when disabled chip has extra class (#2650) (3bf35bd)
Features
Tipseen: allow referenceWrapperClassName prop for component (#2652) (9d6fcc2)
3.5.1 (2024-12-12)
Bug Fixes
List: getting wrong tabIndex on initialization (#2648) (7aaaa73)
3.5.0 (2024-12-12)
Features
Tooltip: be able to change max width (#2643) (f39633b)
3.4.1 (2024-12-12)
Bug Fixes
List: fix ListTitle getting focus on initialization (#2638) (0986200)
3.4.0 (2024-12-09)
Bug Fixes
table: avoid unnecessary re-rendering if TableRowMenu doesn't exist (#2630) (e8d093e)
Features
Modal: modal improvements, add stories for main Modal and modal's layouts (#2627) (bead0ba)
Modal: use createPortal and LayerProvider in Modal (#2634) (b8f895b)
3.3.0 (2024-12-08)
Bug Fixes
Button: fix secondary disabled border color (#2622) (0df501d)
support vitest [prerelease] (#2625) (638b19f)
table: avoid unnecessary re-rendering of table rows (#2626) (c83a4c4)
Features
Modal: animation enhancements and general fixes and enhancements (#2620) (17a14fe)
TransitionView: fill parent if parent has definite height (#2629) (da5e3b3)
3.2.0 (2024-12-04)
Bug Fixes
table: fix scroll delay in header on virtualized table (#2619) (2230b03)
Features
TextField: add dir prop (#2624) (c0545d9)
3.1.0 (2024-12-03)
Bug Fixes
table: Reduce scroll delay in table (#2611) (0a37b1a)
Features
Modal: footers for new Modal component (#2553) (ba63288)
Modal: layouts for new Modal component (#2552) (97d81fa)
Modal: new Modal components building blocks (#2432) (43b6b42)
3.0.0 (2024-11-24)

We're excited to announce the release of Vibe v3! 🎉

See the complete changelog of v3 here. To migrate, follow the migration guide.

Bug Fixes
AvatarGroup: pass dialogContainerSelector from AvatarGroup to AvatarGroupCounter (#2602) (571e908)
icons: update icons (#2583) (0d6803c)
PushNotifications: fix icon (#2607) (5b831a4)
Switcher: revert icon change to older version (#2596) (202e5a6)
table: horizontal scroll on react 18 (#2594) (09c0dc8)
TextArea: don't show the help section if no help text or char co… (#2590) (162a77d)
TextArea: Error state not correctly set when maxlength is exceeded (#2588) (5a140e8)
TextField: when inputValue is undefined, length check fails (#2603) (ad98340)
TextSmall: fix icon (#2604) (9a7bad7)
TextSmall: fix icon (#2605) (34b439b)
TransitionView: handle parent without definite height (#2584) (356255e)
WhatsNew: update icon (#2592) (fbcb99f)
Features
AvatarGroupCounter: add option to render MenuButton on a container (#2591) (d286b28)
Dropdown: add inputValue and blurInputOnSelect properties to allow editing options (#2608) (074c12c)
PinFull: new icon (#2589) (1e34a3c)
Search: allow tracking Enter key press (#2600) (01a677a)
Switcher: update icon (#2597) (3c045b1)
Switcher: update icon (#2599) (cdac401)
TextArea: Character count and maxLength (#2574) (753edb8)
TextField: improved maxLength with exceeding limit UI (#2576) (291a843)
ThumbsDown: new icon (#2582) (5395753)
TransitionView: component to be used on wizard-related logics to render a step with animation between steps (#2557) (bbb6856)
useWizard: add hook for managing wizard logic for different use cases (#2450) (dc6e393)
2.149.0 (2024-11-24)
Features
Dropdown: add inputValue and blurInputOnSelect properties to allow editing options (#2608) (074c12c)
2.148.0 (2024-11-24)
Bug Fixes
PushNotifications: fix icon (#2607) (5b831a4)
TextSmall: fix icon (#2604) (9a7bad7)
TextSmall: fix icon (#2605) (34b439b)
Features
Search: allow tracking Enter key press (#2600) (01a677a)
2.147.1 (2024-11-21)
Bug Fixes
AvatarGroup: pass dialogContainerSelector from AvatarGroup to AvatarGroupCounter (#2602) (571e908)
TextField: when inputValue is undefined, length check fails (#2603) (ad98340)
2.147.0 (2024-11-20)
Features
Switcher: update icon (#2599) (cdac401)
2.146.0 (2024-11-19)
Bug Fixes
TextArea: Error state not correctly set when maxlength is exceeded (#2588) (5a140e8)
Features
Switcher: update icon (#2597) (3c045b1)
2.145.2 (2024-11-18)
Bug Fixes
Switcher: revert icon change to older version (#2596) (202e5a6)
2.145.1 (2024-11-18)
Bug Fixes
table: horizontal scroll on react 18 (#2594) (09c0dc8)
2.145.0 (2024-11-18)
Bug Fixes
TextArea: don't show the help section if no help text or char co… (#2590) (162a77d)
WhatsNew: update icon (#2592) (fbcb99f)
Features
AvatarGroupCounter: add option to render MenuButton on a container (#2591) (d286b28)
PinFull: new icon (#2589) (1e34a3c)
2.144.0 (2024-11-15)
Features
TextField: improved maxLength with exceeding limit UI (#2576) (291a843)
2.143.1 (2024-11-14)

Note: Version bump only for package monday-ui-react-core

2.143.0 (2024-11-14)
Bug Fixes
icons: update icons (#2583) (0d6803c)
TransitionView: handle parent without definite height (#2584) (356255e)
Features
TextArea: Character count and maxLength (#2574) (753edb8)
ThumbsDown: new icon (#2582) (5395753)
TransitionView: component to be used on wizard-related logics to render a step with animation between steps (#2557) (bbb6856)
useWizard: add hook for managing wizard logic for different use cases (#2450) (dc6e393)
2.142.1 (2024-11-06)
Bug Fixes
AvatarGroup: avatar shrinking in counter tooltip (#2575) (37befed)
2.142.0 (2024-10-31)
Features
Clipboard: new icon (#2570) (da71c1b)
Forward: new icon (#2569) (2034fd5)
2.141.0 (2024-10-30)
Bug Fixes
Table: scroll handlers and menu handlers, fix double scroll (#2564) (214350b)
Features
TableHeaderCell: allow passing title as component (#2563) (bd382b7)
2.140.0 (2024-10-29)
Features
add aria-label to VirtualizedList (#2558) (e1d5044)
AttentionBox: add prop for enter animation (#2566) (15b20b1)
2.139.4 (2024-10-21)
Bug Fixes
Combobox: restricted onclick on the disabled (#2491) (9965476)
Dropdown font broken (#2551) (bca2c68)
2.139.3 (2024-10-10)
Bug Fixes
fix icons tsx (#2487) (f53f259)
2.139.2 (2024-10-10)
Bug Fixes
Fix ellipsis clamp lines for SSR [prerelease] (#2484) (0f2c618)
2.139.1 (2024-10-10)

Note: Version bump only for package monday-ui-react-core

2.139.0 (2024-10-09)
Features
add inputAriaLabel to Dropdown component (#2466) (1cb3d1e)
2.138.1 (2024-10-08)
Bug Fixes
ColorPickerClearButton: button isn't clickable inside MenuItem (#2464) (d6bc515)
2.138.0 (2024-10-06)
Features
SSR support fixes (#2458) (562da71)
2.137.1 (2024-10-06)
Bug Fixes
keep current drop shadow with stroke on dark theme (#2451) (197fc6f)
2.137.0 (2024-10-01)
Features
Dropdown: add scroll handlers props (#2447) (0f1277a)
2.136.0 (2024-09-29)
Features
Toast: improve animation (#2391) (968c852)
2.135.1 (2024-09-29)

Note: Version bump only for package monday-ui-react-core

2.135.0 (2024-09-26)
Features
Key: add new icon (#2443) (0c7bdef)
2.134.2 (2024-09-25)
Bug Fixes
TextArea: Spread rest props to the native textarea tag (#2442) (f74d5bd)
2.134.1 (2024-09-16)
Bug Fixes
pass on attributes such as name, onBlur and maxLength to textarea element (#2435) (be0482d)
2.134.0 (2024-09-15)
Features
CloseMedium: add new icon (#2431) (6fefb43)
2.133.0 (2024-09-11)
Features
add aria-pressed prop to IconButton (#2428) (4587c6e)
2.132.0 (2024-09-09)
Bug Fixes
Dropdown: left icon shrinking with long text (#2416) (dab052d)
Toast: make type style stronger (#2408) (7faf565)
Features
Dropdown: Add A11y props to dropdown (#2407) (d53d2e2)
Dropdown: add option for divider in dropdown (#2422) (f5d1e5a)
Icon: add reply all icon (#2418) (031f65d)
2.131.2 (2024-08-28)
Bug Fixes
Combobox: render comboboxItems only when hasResults is true (#2380) (7ede2d0)
2.131.1 (2024-08-22)

Note: Version bump only for package monday-ui-react-core

2.131.0 (2024-08-19)
Bug Fixes
AvatarGroup: be able to use some tooltip props (#2370) (583e1fd)
Features
Chips: change chips spacing and size (#2356) (c455cc6)
2.130.2 (2024-08-12)
Bug Fixes
AvatarGroup: avatar in tipseen without image is wrong size (#2353) (3d0cfe6)
2.130.1 (2024-08-12)
Bug Fixes
menuButton: fix scale for disabled menu button (#2319) (c84a9ae)
targets for storybook (#2351) (e9d2a5c)
2.130.0 (2024-08-08)
Features
Breadcrumbs: be able to show only the icon (#2336) (d68c9c3)
combobox: Add render action to combobox (#2297) (a6d4adb)
MenuItem: Add all label capabilities to menu item (#2335) (d786e92)
2.129.0 (2024-08-07)
Bug Fixes
useSwitch: type guard to fix breaking change we accidentally introduced in previous version (#2330) (d07d907)
Features
Icon: update numbers icon (#2296) (847d2c8)
primary-surface-color: new color token (#2300) (780fdf7)
Tipseen: New paddings for tipseen (#2251) (a4d40a0)
2.128.0 (2024-08-01)
Bug Fixes
Add support for generic types in the TableVirtualizedBody component (#2292) (203ab3c)
DatePicker: Keyboard Navigation (#2241) (8108b06)
Features
icons: add Items Count icon (#2294) (da16f1e)
Menu: allow setting submenu position to left (#2281) (3fc94c2)
2.127.0 (2024-07-31)
Features
added placeholder to textarea (#2293) (a6d6b6b)
2.126.0 (2024-07-30)
Bug Fixes
Revert "use react-select version 4.3.1" (#2288) (b189494)
Features
add onClear prop to Search component (#2272) (8a5ca3c)
Search: Add onClear prop+testing+story for Search (#2276) (4366676)
2.125.0 (2024-07-25)
Bug Fixes
Dropdown: use same id to avoid breaking snapshots (#2274) (d8f40af)
Features
add filterValue prop to Combobox (#2267) (fbaf5a3)
add searchInputRef prop to Combobox (#2266) (defc65c)
2.124.1 (2024-07-25)
Bug Fixes
replace nanoid (#2268) (03f7b9a)
2.124.0 (2024-07-24)
Bug Fixes
dropdown: fix blur border color (#2257) (6e3d2de)
dropdown: Fix ellipsis not to working for simple text dropdown (#2255) (4094d73)
Dropdown: nanoid 4+ supports only ESM, we should still support CJS (#2265) (e86625c)
icon: Allow icon to be focusable when not clickable (#2217) (9788fac)
MenuButton: show hide menu bug (#2259) (6e7027c)
Features
textField: Add option for tooltip on icon (#2221) (cb27f3e)
2.123.3 (2024-07-23)
Bug Fixes
use NonceProvider for react-select to fix disappearing emotion stylesheet (#2253) (6bb52c8)
2.123.2 (2024-07-22)
Bug Fixes
fix style linter (#2254) (a15e32a)
2.123.1 (2024-07-21)
Bug Fixes
textWithHighlight: Fix linesToClamp not working properly (#2250) (17ac1ee)
2.123.0 (2024-07-21)
Bug Fixes
textWithHighlight: Fix ellipsis when no breaks in string (#2248) (e3f6bfb)
Features
Menu: add on focus to menu (#2246) (2e5820e)
Toggle: pass event as 2nd argument to allow working with react-hook-form (#2243) (c4f09e1)
2.122.0 (2024-07-18)
Features
Baseline: add new icon (#2245) (0bd7424)
2.121.0 (2024-07-18)
Features
add experimental stroke instead of box-shadow for dark themes (#2218) (3469767)
TextField: send native event if applicable in onChange (#2231) (35b1ea6)
2.120.0 (2024-07-14)
Bug Fixes
Combobox: spacings in categories (#2223) (1ffe75d)
Features
icons: Add Item Height Double Icon (#2227) (42b3f1f)
icons: Add Item Height Single Icon (#2228) (32dc7c2)
icons: Add Prompt icon (#2222) (eeff132)
2.119.0 (2024-07-10)
Bug Fixes
Table: hover cell background var should be declared inside the table selector and not on :root (#2219) (33b47ab)
Features
Combobox: add debounceRate prop (#2220) (a6053dd)
2.118.1 (2024-07-04)

Note: Version bump only for package monday-ui-react-core

2.118.0 (2024-07-03)
Features
Table: add Table menu capability for each row (#2197) (dfd551c)
2.117.0 (2024-07-02)
Bug Fixes
ExpandCollapse: component gets to 95% scale when active (#2201) (58b14a6)
Table: sticky cell is seen-through when hovered (#2198) (6ec1d61)
Features
AccordionItem: add option for onClick instead of onClickCapture (#2203) (983b012)
2.116.0 (2024-06-27)
Bug Fixes
ToastLink: hover color should inherit from link color (#2193) (7ab5710)
Features
Table: add sticky column capabilities (#2172) (a79a28e)
2.115.0 (2024-06-26)
Features
TextField: add a controlled variant (#2180) (67489b3)
2.114.0 (2024-06-26)
Features
react-select: use react-select version 4.3.1 (#2184) (c90b6dd)
TextArea: be able to disable resize (#2189) (9223c0a)
2.113.1 (2024-06-25)
Bug Fixes
Button: fix text placeholder dimensions in loading state (#2187) (3a9c983)
link: hover color should inherit from link color (#2183) (60d6166)
Dropdown: Dropdown multi size "small" style and behavior is broken (#2174) (91f02fb)
2.113.0 (2024-06-11)
Bug Fixes
useAfterFirstRender: hook is currently behaving the opposite than its purpose (#2168) (483bf9b)
Features
toggle: add small variant (#2167) (6491d27)
2.112.0 (2024-06-09)
Bug Fixes
Table: sync between body scroll and header scroll in virtualized state (#2162) (d47f8f9)
Features
icons: Add Heart icon (#2166) (896871b)
Modal: unmount when hidden (#2165) (d5ba05c)
Table: apply vibe component props in TableVirtualizedBody (#2163) (2a4238e)
2.111.1 (2024-06-03)
Bug Fixes
ResponsiveList: add static props for backwards (#2161) (209d6d4)
2.111.0 (2024-06-02)
Bug Fixes
colors: align dark orange to a11y requirments (#2155) (68901cc)
export next components types (#2158) (25505f7)
Features
AvatarGroup: add disabled state (#2126) (cf65f6b)
Box: add style prop (#2149) (87c987d)
export component types (#2153) (18b9f51)
2.110.0 (2024-05-28)
Bug Fixes
Checkbox storybook: story is using Link from storybook-blocks (#2137) (70fc17d)
Features
Ignore classes in useClickOutside hook (#2135) (ea42d2b)
2.109.1 (2024-05-26)
Bug Fixes
SplitButton storybook:
fix stories that use wrong prop (#2138) (5f9c0a4)
2.109.0 (2024-05-21)
Bug Fixes
Dropdown: migrate to TS continue (#2109) (a7a51ad)
TextArea: add background color and text for dark mode (#2130) (8d6a84c)
Features
label: add small variant (#2121) (2ca6562)
withLiveEdit: add actions for copy, format, and reset at the bottom of the live editor (#2123) (f384d7c)
2.108.3 (2024-05-16)
Bug Fixes
Dialog.tsx: getContainer causing react error 200 (#2124) (b018467)
2.108.2 (2024-05-16)
Bug Fixes
AlertBanner: replace Button & Icon with IconButton (#2120) (ee2d11c)
Storybook Docs: typo (#2119) (25ff8fb)
TabsContext: use onTabChange from child props (#2125) (11bbddf)
Typography: change tooltipProps type to Partial< TooltipProps > (#2118) (707c5c3)
Typography: make anchor style apply only to direct child (#2115) (337975b)
2.108.1 (2024-05-09)
Bug Fixes
TextWIthHighlight: escape regex (#2113) (a980976)
2.108.0 (2024-05-07)
Bug Fixes
add null protection for onPickDate callback (#2045) (#2102) (272ac89)
MenuItem: disabled item should not show its submenu (#2099) (8513ba9)
Features
add a11y props for search and combobox components (#2105) (b564e1b)
2.107.0 (2024-05-01)
Features
Search: adds hideRenderActionOnInput option (#2098) (fdc8c21)
2.106.1 (2024-05-01)

Note: Version bump only for package monday-ui-react-core

2.106.0 (2024-04-30)
Features
Button: add active-hover state to buttons (#2076) (9976fa0)
Dialog: add event args to dialog show methods (#2092) (352a48a)
2.105.1 (2024-04-24)
Bug Fixes
export Search from next (#2088) (a0d56d3)
2.105.0 (2024-04-24)
Bug Fixes
Dialog: prevent default for contextmenu event (#2087) (483c47f)
increase specificity (#2074) (f8e18cc)
Features
withLiveEdit: apply decorators from within self CSF module of a story (#2077) (6b1e520)
withLiveEdit: parse render attribute with ast instead of with regex for variety of cases (#2078) (57ad30d)
2.104.0 (2024-04-18)
Bug Fixes
ExpandCollapse: remove no-longer-needed css scale workaround (#2071) (f3a8144)
Features
migrate usages of LegacySearch to new Search (#2067) (3e8ac10)
Search: new Search component (#2064) (489a374)
Text: Add new 12px font size (Text3) (#2072) (cd4af2f)
2.103.1 (2024-04-15)
Bug Fixes
Dialog: add onContextMenu to dialog's show trigger (#2065) (663d056)
2.103.0 (2024-04-15)
Features
Dropdown and TextFeild accessibility improvements (#1898) (de99f06)
2.102.0 (2024-04-11)
Features
add autoFocus to CheckBox (#2059) (cd26e7c)
2.101.0 (2024-04-10)
Bug Fixes
DatePicker: added min width to buttons inside year picker (#2050) (7c35041)
Features
add autoFocus to RadioButton (#2057) (d40b49e)
2.100.1 (2024-04-07)
Bug Fixes
Label: changes selectors (#2051) (a504ce9)
2.100.0 (2024-04-03)
Features
Label: celebration animation (#2032) (1af527c)
Tooltip: Rich tooltip (#2040) (dc0c470)
2.99.0 (2024-03-25)
Features
IconButton: loading state (#2029) (a38dd2b)
2.98.4 (2024-03-25)

Note: Version bump only for package monday-ui-react-core

2.98.3 (2024-03-24)
Bug Fixes
MultiStepIndicator: nest divider style (#2036) (2faf7e4)
2.98.2 (2024-03-21)
Bug Fixes
all elements inside an app that consumes vibe had button with active state that turns to 0.95 scale on active pseudo state (#2031) (1b6e92a)
2.98.1 (2024-03-20)
Bug Fixes
MenuButton: call onMenuHide on all cases where menu is closed (#2027) (1c80b4c)
2.98.0 (2024-03-19)
Bug Fixes
EditableTypography: fix specificity issues when changing types a… (#2028) (bebcdbd)
Features
changed proptype from string/IconSubComponentProps to SubIcon (#2026) (f30ab8a)
2.97.2 (2024-03-19)
Bug Fixes
EditableTypography: fix specificity issues when changing types a… (#2028) (bebcdbd)
2.97.1 (2024-03-19)

Note: Version bump only for package monday-ui-react-core

2.97.0 (2024-03-18)
Features
Modal: make data-testid optional (#2024) (590c7ce)
2.96.1 (2024-03-18)
Bug Fixes
Combobox: clear selected option when query changes (#2020) (fe83d89)
2.96.0 (2024-03-13)
Features
Add inverted variant to Tipseen and Steps (#1995) (6e4bbb4)
Align vibe's colors to new a11y based colors (#2009) (6c6e156)
ModalFooterButtons: support disable buttons and remove secondary (#2016) (41d2a99)
2.95.0 (2024-03-12)
Features
AvatarGroupCounter: pass noAnimation prop (#2010) (048b163)
Table: new sort behavior (#1935) (32790f4)
2.94.0 (2024-03-05)
Bug Fixes
TableHeaderCell: change hover color (#1888) (c057a2e)
Features
Flex: new align's value - baseline (#1989) (224be04)
2.93.0 (2024-02-28)
Features
button: add inverted color to button (#1981) (9363000)
colors: add --primary-highlighted-color token (#1986) (1207a4a)
2.92.9 (2024-02-19)
Bug Fixes
EditableTypography: react to value prop change (#1971) (de17685)
Tipseen: add gap between title and close button (#1972) (b0ceea2)
2.92.8 (2024-02-18)
Bug Fixes
AlertBanner: fix children type (#1968) (cf4845d)
2.92.7 (2024-02-14)
Bug Fixes
fix build in release (#1965) (8177d9a)
2.92.6 (2024-02-14)
Bug Fixes
release (#1963) (1817e5a)
2.92.5 (2024-02-14)

Note: Version bump only for package monday-ui-react-core

2.92.4 (2024-02-14)
Bug Fixes
remove redundant class (c4bf0bb)
2.92.3 (2024-02-14)

Note: Version bump only for package monday-ui-react-core

2.92.2 (2024-02-13)

Note: Version bump only for package monday-ui-react-core

2.92.1 (2024-02-13)
Bug Fixes
fix rollup build (#1954) (3c17759)
2.92.0 (2024-02-12)
Features
core: prettier (34969a0)
2.91.1 (2024-02-12)

Note: Version bump only for package monday-ui-react-core

2.91.1 (2024-02-12)

Note: Version bump only for package monday-ui-react-core

Changelog
2.91.0 (2024-02-11)
Bug Fixes
#1939 fix(MenuItem): change condition of ariaLabel (@talkor)
New Features
#1940 feat(Badge): remove border on OUTSIDE alignment, remove translate on OUTSIDE alignment (@YossiSaadi)
#1938 feat(MenuItem): be able to provide a component to title (@talkor)
New Icons
#1941 Update icons - monday-ui-style 0.1.210 (@github-actions[bot])
2.90.3 (2024-02-07)
Bug Fixes
#1934 fix(TableVirtualizedBody): handle empty state when no items or items is an empty array (@YossiSaadi)
2.90.2 (2024-02-07)
Bug Fixes
#1933 fix(TextField): avoid failing to cleanup on unmount, avoid inputRef is undefined (@YossiSaadi)
2.90.1 (2024-02-07)
Bug Fixes
#1932 fix(EditableTypography): should call onChange with empty string when placeholder is used (@YossiSaadi)
2.90.0 (2024-02-06)
Bug Fixes
#1930 fix(MenuButton): fix component type (@talkor)
New Features
#1931 feat(EditableTypography): send onEditModeChange when entering edit mode (@YossiSaadi)
2.89.0 (2024-02-05)
Bug Fixes
#1927 fix(Dropdown): prevent shrink of ChildrenContent (@talkor)
#1922 fix(MenuButton): tooltip should only appear on trigger element hover, not on dialog hover (@YossiSaadi)
New Features
#1928 feat(Label): support ellipsis (@YossiSaadi)
2.88.0 (2024-02-05)
Bug Fixes
#1925 fix(Avatar): changed medium avatar size (@shaharzil)
New Features
#1921 feat(EditableText): show placeholder when empty (@talkor)
#1926 feat(Dropdown): add withReadOnlyStyle prop (@talkor)
#1924 feat(TextField): add withReadOnlyStyle prop (@talkor)
2.87.0 (2024-01-29)
New Features
#1869 feat!: add wrapping div (!), rename theme prop to themeConfig (@SergeyRoyt)
#1852 feat: add systemTheme prop - adds className to body (@SergeyRoyt)
2.86.2 (2024-01-29)
Bug Fixes
#1914 fix(MenuItem): tooltip should on all item and not only on title (@YossiSaadi)
2.86.1 (2024-01-29)
Bug Fixes
#1904 fix(MenuItem): split menu items does not open sub-menu when navigating directly between two split menus (@YuliaGold)
#1912 fix(MenuButton): fix dialog close behavior (@talkor)
Internal Changes
#1913 chore: add issue template form (@talkor)
2.86.0 (2024-01-25)
Bug Fixes
#1919 fix: fix animation for menu with editable typography (@shaharzil)
New Features
#1918 feat: add tel TextFieldTextType (@or-nuri-monday)
#1917 feat: add URL TextFieldTextType (@or-nuri-monday)
#1916 feat: add email TextFieldTextType (@or-nuri-monday)
2.85.0 (2024-01-25)
New Features
#1915 feat(TabList): add opt-out for default padding (@YossiSaadi)
2.84.1 (2024-01-21)
Bug Fixes
#1910 fix(EditableTypography): don't spread tooltipProps (@talkor)
2.84.0 (2024-01-21)
Bug Fixes
#1909 fix(TableVirtualized): support row height (@talkor)
New Features
#1908 feat(TableVirtualizedBody): pass onScroll event (@talkor)
#1907 feat: add tooltip props to components (@talkor)
Documentation
#1905 docs: Realated components fixes - editable text and menu button titles (@shaharzil)
Internal Changes
#1903 chore: add codeowners (@talkor)
New Icons
#1906 feat(Icons): add Translation icon (@talkor)
2.83.0 (2024-01-18)
New Features
#1901 feat: add tooltip props (@talkor)
Internal Changes
#1900 chore(chromatic): add a command to run chromatic locally (@YossiSaadi)
2.82.1 (2024-01-18)
Documentation
#1899 chore: update Playground addon (@YossiSaadi)
Internal Changes
#1895 chore: update Playground addon (@YossiSaadi)
2.82.0 (2024-01-16)
New Features
#1893 feat(AvatarBadge): add an icon prop (@talkor)
2.81.0 (2024-01-15)
New Features
#1890 feat(AttentionBoxLink): use link component (@talkor)
2.80.2 (2024-01-14)
Bug Fixes
#1891 fix(TableVirtualizedBody): take height of header into consideration (@talkor)
#1887 fix: replace primary-background-hover color in non-hover (@talkor)
#1882 fix(TableCellSkeleton): circle and rectangle loading types are broken (have width 0) (@YossiSaadi)
Documentation
#1892 docs: add virtualized grid description and component (@Suraj-Bhandarkar-S)
#1880 docs: fix typo in Label and and warning in OtherContributorsList (@Suraj-Bhandarkar-S)
#1884 docs: fix font weights in typography examples' mixin (@prathamnagpure)
Internal Changes
#1885 chore(EditableTypography): remove animation (@talkor)
2.80.1 (2024-01-09)
Bug Fixes
#1883 feat(EditableTypography): expose mode change event (@talkor)
2.80.0 (2024-01-08)
New Features
#1876 feat(EditableText): add isEditMode prop (@talkor)
Documentation
#1875 docs: change sidebar organization (@talkor)
2.79.2 (2024-01-07)
Bug Fixes
#1874 fix(MenuItemButton): fix type for kind (@YossiSaadi)
2.79.1 (2024-01-04)
Bug Fixes
#1866 fix(Label): change padding according to design (@talkor)
2.79.0 (2024-01-04)
Bug Fixes
#1833 fix: trigger scaling for menuButton only while clicking (@shaharzil)
New Features
#1867 feat(Label): add a disabled state to submenu button (@talkor)
#1871 feat(Table): add option to supply %, fr, px as width for table (@YossiSaadi)
#1861 feat(Table): add no border variant (@YossiSaadi)
#1826 feat: add a Finish button to Steps (@talkor)
Documentation
#1865 docs: fix
link in catalog (@neerajkumarc)
#1846 docs: RelatedComponents - table-description.tsx (@SergeyRoyt)
#1859 docs: remove unneeded callbacks (@talkor)
Internal Changes
#1860 test(DatePicker): make tests more deterministic (@talkor)
#1858 ci: check-pr-semantic-title.yml workflow (@SergeyRoyt)
2.78.0 (2023-12-26)
New Features
#1853 feat: leftRenderer prop (@SergeyRoyt)
Internal Changes
#1856 Fix Dropdown prop duplication (@SergeyRoyt)
#1855 Explanatory comment - Dropdown closeMenuOnScroll (@SergeyRoyt)
2.77.0 (2023-12-26)
New Features
#1847 feat: closeMenuOnScroll prop (@SergeyRoyt)
Documentation
#1851 docs: Related components: fix < Steps />, < Tipseen /> - make examples clickable (@PraveenShinde3)
2.76.0 (2023-12-25)
Bug Fixes
#1841 chore(playground-addon): support next components and add an initial code example (@shlomitc)
New Features
#1773 feat(Tooltip): add a max width prop (@talkor)
Internal Changes
#1848 monorepo-prerelease.yml - fix - run build in monorepo root (@SergeyRoyt)
2.75.0 (2023-12-24)
New Features
#1845 feat: add warning color LinearProgressBar (@rongabbay)
Documentation
#1840 docs(box): add box description on catalog page (@Dhoni77)
Internal Changes
#1844 infra: monorepo-prerelease.yml workflow (@SergeyRoyt)
2.74.4 (2023-12-21)
Bug Fixes
#1839 fix: change Box/Menu children types to ElementContent (@talkor)
2.74.3 (2023-12-21)
Internal Changes
#1842 type: change menu children type (@idoyana)
2.74.2 (2023-12-20)
Documentation
#1837 docs: add playground addon for vibe's storybook (@YossiSaadi)
2.74.1 (2023-12-20)
Bug Fixes
#1838 Split button alignment fix (@talkor)
2.74.0 (2023-12-20)
Bug Fixes
#1827 fix: Remove fucos for disabled button (@shaharzil)
New Features
#1836 feat(Box): add a scrollable prop (@talkor)
Documentation
#1830 docs(README): fix npm link (@Yaronglp)
#1835 docs: RelatedComponents - fix icons-description.jsx href (@SergeyRoyt)
#1834 fix: align options in Catalog with overview example (@neerajkumarc)
2.73.2 (2023-12-18)
Bug Fixes
#1829 fix: update Feedback and DoubleCheck icons after monday-ui-style update (@SergeyRoyt)
2.73.1 (2023-12-17)
Bug Fixes
#1821 fix: add background color to form components (@talkor)
#1814 fix(AttentionBox): fix layout and typography (@talkor)
Documentation
#1824 docs(Chips): remove colors which we don't want devs to use from docs (@YossiSaadi)
#1825 docs: virtualized-list-description - fix import (@SergeyRoyt)
#1819 docs(slider): add slider description on catalog page (@Dhoni77)
Internal Changes
#1822 chore: update monday-ui-style (@talkor)
2.73.0 (2023-12-14)
New Features
#1816 feat: Add Toast dark variation (@shaharzil)
#1791 style(Tooltip): Explicitly expose zIndex prop in component (@lukasz-dudzinski)
Documentation
#1820 docs: remove release section from readme (@shaharzil)
#1818 docs(icon): add icon description on catalog page (@Dhoni77)
2.72.0 (2023-12-13)
New Features
#1815 feat: add tipseenMediaClassName (@SergeyRoyt)
Documentation
#1806 docs(badge): add badge description on catelog page (@Hossein-Mirazimi)
#1811 docs(Dropdown): fix menuPosition & menuPlacement props in argsTable controls (@YossiSaadi)
Internal Changes
#1813 build(Rollup): fail build if circular dependency detected (@YossiSaadi)
#1812 chore(MenuItem): fix circular dependency with IconButton's import (@YossiSaadi)
2.71.0 (2023-12-11)
New Features
#1789 Yulia/extract add button and menu to mf/split menu item (@YuliaGold)
2.70.0 (2023-12-11)
New Features
#1793 Sergeyro/feature/menu button custom trigger (@SergeyRoyt)
2.69.4 (2023-12-10)
Bug Fixes
#1809 fix: export Table.sizes enum (@SergeyRoyt)
2.69.3 (2023-12-10)
Bug Fixes
#1808 fix(Table): table does not render empty state if children are empty array (@YossiSaadi)
Documentation
#1807 docs: useIsOverflowing.stories.js - remove maintenance warning (@SergeyRoyt)
#1804 docs: fix storybook's sidebar overflow (@talkor)
2.69.2 (2023-12-07)
Documentation
#1803 docs: fix broken docs links (@shaharzil)
2.69.1 (2023-12-06)
Bug Fixes
#1802 fix: changed toggle typography (@shaharzil)
2.69.0 (2023-12-06)
New Features
#1801 feat(EditableTypography): add onClick event (@YossiSaadi)
Documentation
#1800 Internal links fixes (@talkor)
#1797 docs: replace internal links with StorybookLink (@talkor)
2.68.0 (2023-12-05)
New Features
#1798 feat(Chips): allow label to accept custom Element (@YossiSaadi)
#1790 feat(Toast): add loading prop (@YossiSaadi)
Documentation
#1796 docs(Tipseen): fix floating variation story (@YossiSaadi)
#1795 fix: re-enable sidebar tags (@talkor)
#1763 docs: Storybook 7 migrate (@SergeyRoyt)
2.67.0 (2023-11-30)
New Features
#1758 Editable typography animation and a11y (@talkor)
2.66.0 (2023-11-29)
New Features
#1787 feat(Toggle): add data-testid prop (@talkor)
2.65.0 (2023-11-29)
Bug Fixes
#1785 fix: replace deprecated text-fixed-color tokens with identical color tokens (@SergeyRoyt)
New Features
#1788 Support className in TableRow (@uri-shmueli)
Documentation
#1784 docs: RelatedComponents - add component description example (@SergeyRoyt)
#1786 docs: RelatedComponents - fix description (@SergeyRoyt)
Internal Changes
#1775 infra: disable cron for update monday-ui-style version workflow (@SergeyRoyt)
2.64.2 (2023-11-28)
Bug Fixes
#1776 fix: Control - use --primary-color on focus-within instead of default color from react-select (@SergeyRoyt)
#1772 fix(ModalHeader): extract icon from Heading to allow tooltip to work (@talkor)
#1777 fix(Button): remove aria-pressed (@talkor)
#1771 fix: typography vertical overflow tolerance (@talkor)
Documentation
#1782 docs: RelatedComponents - add component (@SergeyRoyt)
#1783 docs: Catalog fix multi words search (@SergeyRoyt)
#1778 docs: change spacing of layout in stories (@talkor)
2.64.1 (2023-11-27)
Bug Fixes
#1774 fix(BreadcrumbItem): add hover style when using link variation (@talkor)
2.64.0 (2023-11-27)
Bug Fixes
#1759 EditableText/EditableHeading fixed and update docs (@talkor)
New Features
#1765
- Add row size variations (@kapusj)
2.63.3 (2023-11-26)
Bug Fixes
#1768 fix(Toast): description icon should be 20px (@YossiSaadi)
Documentation
#1769 docs(Table): Scroll story should have same length as other stories (@YossiSaadi)
Internal Changes
#1770 chore: supress console.error if container not found, add TODO (@SergeyRoyt)
New Icons
#1764 Update icons - monday-ui-style 0.1.203 (@github-actions[bot])
2.63.2 (2023-11-23)
Bug Fixes
#1760 fix(Button): include entire content for width placeholder (@talkor)
Internal Changes
#1762 test(Chromatic): wait for font loading before taking a snapshot (@talkor)
2.63.1 (2023-11-21)
Documentation
#1757 docs: Typography migration guide (@talkor)
2.63.0 (2023-11-20)
New Features
#1552 feat(TableRow): add highlighted styling for TableRow (@YossiSaadi)
2.62.0 (2023-11-19)
Bug Fixes
#1756 fix: disabled option - fix keyboard focused style (@SergeyRoyt)
New Features
#1745 Editable text (@talkor)
Documentation
#1754 docs: Fix overview links - scroll instead of openning new page (@SergeyRoyt)
#1750 docs: related components fix description (@SergeyRoyt)
#1737 docs: Components catalog (@SergeyRoyt)
#1751 docs: fix typo (@talkor)
2.61.0 (2023-11-15)
New Features
#1753 feat(Checkbox): add a tabIndex prop (@talkor)
Documentation
#1747 docs: rename Wizard to (@SergeyRoyt)
2.60.1 (2023-11-15)
Bug Fixes
#1752 fix(Button): fix loading behavior when button is type submit in a for… (@talkor)
Documentation
#1748 docs: rename stories names to be in pascal case (@SergeyRoyt)
2.60.0 (2023-11-14)
New Features
#1738 fix: inside overflow (@SergeyRoyt)
2.59.3 (2023-11-12)
Bug Fixes
#1739 fix(Button): differentiate different states of the button with a key (@talkor)
#1740 fix: remove Hacker theme from eligible for overrides (@SergeyRoyt)
2.59.2 (2023-11-12)
Bug Fixes
#1729 fix(MultiValueContainer): align items vertically (@talkor)
Documentation
#1741 docs: remove hacker theme from storybook (@SergeyRoyt)
2.59.1 (2023-11-09)
Documentation
#1735 docs: improve readme files on how to import css - mention storybook (@SergeyRoyt)
Internal Changes
#1726 feat: new EditableHeading with new typography (@talkor)
2.59.0 (2023-11-09)
New Features
#1718 feat: change < Icon /> and < Avatar /> sizes inside < Chips />, < Dropdown /> < ChildrenContent />, < ComboboxOption />, < ListItem />, < MenuItem /> (@SergeyRoyt)
2.58.0 (2023-11-07)
Bug Fixes
#1736 fix: add typograpghy mixin to the textField container to prevent avoid line-height overrides (@SergeyRoyt)
New Features
#1733 feat: add filterOption prop for custom filter (@SergeyRoyt)
2.57.2 (2023-11-07)
Bug Fixes
#1734 fix: Modified the styling of the icon (@Nirco96)
2.57.1 (2023-11-06)
Documentation
#1730 docs: ThemeProvider alpha tag instead of beta (@SergeyRoyt)
2.57.0 (2023-11-05)
New Features
#1526 feat: (@SergeyRoyt)
#1614 feat(Refable): add TypeScript support (@naorpeled)
Documentation
#1720 Update vibe-storybook-components to ^0.10.3 (@SergeyRoyt)
Internal Changes
#1721 chore: Replace Github contributors list to be from vibe-storybook-components (@SergeyRoyt)
#1724 chore: cleanup (@SergeyRoyt)
#1651 chore: fix lint warnings (@Dhoni77)
2.56.4 (2023-10-30)
Bug Fixes
#1715 fix(AttentionBox): fix title overflow behavior (@talkor)
Documentation
#1716 docs: extract AlertBanner template to stories file (@talkor)
2.56.3 (2023-10-29)
Bug Fixes
#1706 Fixes: #1673 BUG Tooltip not visible when more than one row ellipsis is applied to Text component (@viditagrawal56)
Internal Changes
#1717 chore: cleanup - lint issue (@SergeyRoyt)
2.56.2 (2023-10-29)
Bug Fixes
#1708 fix: multi single line - counter options display (@SergeyRoyt)
2.56.1 (2023-10-29)
Bug Fixes
#1714 fix: change moveBy and active state text color (@SergeyRoyt)
New Icons
#1709 Update icons - monday-ui-style 0.1.202 (@github-actions[bot])
2.56.0 (2023-10-29)
New Features
#1705 feat: fix for Vite (@SergeyRoyt)
Internal Changes
#1711 chore: replace mixins with exported mixins from monday-ui-style (@talkor)
2.55.1 (2023-10-26)
Bug Fixes
#1707 fix(Button): adjust loading state to initial button size (@talkor)
2.55.0 (2023-10-26)
New Features
#1703 feat: < Dialog /> should throw console.error if containerSelector is not found (@Kritik-J)
2.54.1 (2023-10-25)
Bug Fixes
#1704 fix: rename freshly added padding prop to removePadding (@SergeyRoyt)
Internal Changes
#1702 chore: cleanup demo styles (@SergeyRoyt)
2.54.0 (2023-10-24)
Bug Fixes
#1699 fix: < ComboBox / > - change stickyCategories to not be the default behavior (@Kritik-J)
New Features
#1700 feat: < TextField /> add red asterisks(*) when required=true (@HarshitVashisht11)
#1690 feat: < AvatarGroup /> - added new prop to remove padding (#1674) (@nabinbhatt)
Documentation
#1519 docs(Typography): new docs page for Typography (@hadasfa)
2.53.0 (2023-10-24)
New Features
#1701 export useElementsOverflowingIndex hook (@orrgottlieb)
Internal Changes
#1695 createStoryMetaSettingsDecorator.ts - TS migration, add ignoreControlsPropNamesArray (@SergeyRoyt)
2.52.1 (2023-10-22)
Bug Fixes
#1694 fix: controlled multi fix option remove (@SergeyRoyt)
2.52.0 (2023-10-22)
New Features
#1691 feat(EditableInput): expose inputType (@talkor)
Internal Changes
#1693 chore: fix < Tip /> imports to be from vibe-storybook-components (@SergeyRoyt)
2.51.2 (2023-10-22)
Bug Fixes
#1692 < Slider /> controlled state fix (@SergeyRoyt)
2.51.1 (2023-10-22)
Bug Fixes
#1678 fix: close button - replace  and with (@Kritik-J)
2.51.0 (2023-10-19)
New Features
#1687 Add mising data-testid, replace dataTestId (not breaking) (@SergeyRoyt)
#1683 feat: < Tipseen /> export hideShowTriggers (@SergeyRoyt)
Documentation
#1689 chore: add @deprecated comments where backwardCompatibilityForProperties is being used (@SergeyRoyt)
#1684 docs: fix contributors list to include all contributors (@SergeyRoyt)
Internal Changes
#1682 docs(AlertBanner): fix documentation (@talkor)
#1601 chore(deps-dev): bump postcss from 8.4.21 to 8.4.31 (@dependabot[bot])
New Icons
#1688 Update icons - monday-ui-style 0.1.201 (@github-actions[bot])
#1685 Update icons - monday-ui-style 0.1.200 (@github-actions[bot])
2.50.2 (2023-10-18)
Bug Fixes
#1680 fix(types): fix unknown path '/types' (@YossiSaadi)
Internal Changes
#1656 chore: < GridKeyboardNavigationContext /> - migrate to TS (@SergeyRoyt)
New Icons
#1677 Update icons - monday-ui-style 0.1.199 (@github-actions[bot])
2.50.1 (2023-10-18)
Bug Fixes
#1671 Update vibe-storybook-components version, @babel/core version (@SergeyRoyt)
2.50.0 (2023-10-18)
New Features
#1670 feat(types): export general types (@YossiSaadi)
Internal Changes
#1653 chore: resolve lint warnings - < Menu /> (@Kritik-J)
New Icons
#1669 Update icons - monday-ui-style 0.1.198 (@github-actions[bot])
2.49.1 (2023-10-16)
Internal Changes
#1666 Bug Fix: Closes #1661 Fixed the TS error while using size prop for (@viditagrawal56)
#1665 chore(deps-dev): bump @babel/traverse from 7.18.2 to 7.23.2 (@dependabot[bot])
2.49.0 (2023-10-16)
New Features
#1637 feat: add Toast warning variation (@talkor)
#1662 feat(AlertBanner): add warning variation (@talkor)
Documentation
#1559 docs: sidebar tags (@talkor)
Internal Changes
#1663 infra: add build-test in test-workflow.yml (@SergeyRoyt)
2.48.0 (2023-10-15)
Bug Fixes
#1657 fix: colorpicker indicator is dissapearing when color is selected (@sayyedarib)
New Features
#1654 feat: provide props for ariaLabel - < Toast />, < AlertBanner />, < Combobox /> Fixes: #1642 (@viditagrawal56)
2.47.3 (2023-10-15)
Bug Fixes
#1659 fix: - shouldn't be clickable when type = Indication (@SoumyadiptoPal)
Documentation
#1660 docs: fix description of text-color-fixed-light and text-color-fixed-dark (@SergeyRoyt)
2.47.2 (2023-10-15)
Bug Fixes
#1556 fix: Fix menu item label style (@talkor)
2.47.1 (2023-10-15)
Bug Fixes
#1623 fix: use color - text-color-fixed-light (@SergeyRoyt)
Internal Changes
#1628 docs: Replace tip alpha warning deprecated warning with vibe storybook components (@talkor)
2.47.0 (2023-10-12)
New Features
#1646 feat: provide props for ariaLabel - < AvatarGroupCounter />, < TableHeaderCell /> (@Kritik-J)
Documentation
#1627 docs: replace all tags with in stories (@evadrake89)
Internal Changes
#1652 Resolved lint warnings - < Slider />, < StepIndicator />, < Bar />, (@balajik)
#1640 chore: fix Github actions lint warnings - < Button /> (@Kritik-J)
#1643 chore: fix Github actions lint warnings - < ColorPicker /> (@Kritik-J)
#1639 docs: Text.stories cleanup (@SergeyRoyt)
#1636 chore: fix github actions lint warnings - (@Dhoni77)
#1635 chore: fix github actions lint warnings - < Checkbox /> tests (@Dhoni77)
#1634 chore: fix Github actions lint warnings - < AvatarGroup /> (@Kritik-J)
2.46.3 (2023-10-09)
Bug Fixes
#1624 fix: use color - text-color-fixed-light (@SergeyRoyt)
2.46.2 (2023-10-09)
Bug Fixes
#1619 fix: - added necessary stylings (@SoumyadiptoPal)
Documentation
#1621 docs: Usage guidelines - fix font #1577 (@SoumyadiptoPal)
#1600 docs: fix links (@Dhoni77)
#1618 docs: add npm version badge (@talkor)
#1616 chore: cleanup in stories controls (@SergeyRoyt)
#1599 docs: enable controls for some of the stories (@Dhoni77)
Internal Changes
#1626 chore: cleanup, update vibe-storybook-components to ^0.8.0 (@SergeyRoyt)
#1612 test: add editable heading interaction test (@jes14)
2.46.1 (2023-10-05)
Bug Fixes
#1615 fix: don't apply defaultIcon for case when icon=null (@SergeyRoyt)
2.46.0 (2023-10-04)
New Features
#1611 feat: - update default icon for Primary type to Info icon (@Kritik-J)
Internal Changes
#1613 chore: Update snapshots (@SergeyRoyt)
2.45.0 (2023-10-04)
New Features
#1595 feat: update label with VibeComponent (@jes14)
Documentation
#1504 docs: separate docs tokens from components tokens (@SergeyRoyt)
#1609 docs: Shortening texts - add space before the link (@Kritik-J)
#1608 docs: added a link to Combobox on the Menu page (@SarthakD15)
Internal Changes
#1610 infra: Fix workflows running twice (@SergeyRoyt)
#1603 infra: allow running chromatic workflow on pull_request (@SergeyRoyt)
2.44.1 (2023-10-04)
Bug Fixes
#1604 Revert "chore: enforce using npm" (@talkor)
2.44.0 (2023-10-03)
Bug Fixes
#1594 fix: remove default tabIndex = 0 (@Kritik-J)
#1582 fix: disabledReason?: boolean change type to string (@Franqsanz)
New Features
#1586 feat: closeButton - add hideTooltip and closeButtonAriaLabel prop (@Kritik-J)
#1585 feat: - add closeButtonAriaLabel as a prop (@Kritik-J)
Documentation
#1593 fix text in a few places (@Vijeth56)
#1591 docs: replace legacy links with the new ones (@jes14)
#1592 docs: Add space between tips and links (@anirudhsudhir)
Internal Changes
#1596 chore: enforce using npm (@talkor)
#1590 Sergeyro/chore/cleanup (@SergeyRoyt)
New Icons
#1597 Update icons - monday-ui-style 0.1.196 (@github-actions[bot])
2.43.0 (2023-10-02)
New Features
#1570 feat(useActiveDescendantListFocus): add option to ignoreDocumentFallback to prevent vibe from adding event listeners (@YossiSaadi)
Documentation
#1563 docs: story improvements - UsageGuidelines, add links (@SergeyRoyt)
Internal Changes
#1551 chore: set browserslist config to specific version to avoid breaking changes, update caniuse browserslist (@YossiSaadi)
2.42.0 (2023-10-02)
New Features
#1565 Replace Rubik with Noto Sans Hebrew (@SergeyRoyt)
Documentation
#1564 docs: component-name-decorator- text color = fixed-dark (@SergeyRoyt)
2.41.2 (2023-10-01)
Bug Fixes
#1561 fix(Label): apply preventDefault when calling onClick event (@talkor)
Documentation
#1558 useClickOutside event name argument documentation (@SergeyRoyt)
Internal Changes
#1562 chore(rollup): export sourcemap with build (@YossiSaadi)
2.41.1 (2023-09-27)
Bug Fixes
#1560 fix: remove preventDefault from useKeyboardButtonPressedFunc.ts (@SergeyRoyt)
Documentation
#1554 docs: - Dialog with tooltip story (@SergeyRoyt)
#1557 docs: add missing up next links (@talkor)
#1553 Infra/talko/flaky chromatic tests (@talkor)
2.41.0 (2023-09-21)
New Features
#1555 feat(Table): add vibe component props to all table-related components make components VibeComponent type - with forwardRef (@YossiSaadi)
2.40.0 (2023-09-20)
New Features
#1547 Feat/talko/label clickable (@talkor)
2.39.1 (2023-09-20)
Internal Changes
#1550 fix(TipseenMedia): fix import/export path (@YossiSaadi)
2.39.0 (2023-09-20)
New Features
#1548 feat(Tipseen): add TipseenMedia component to act as a container for tipseen medias (@YossiSaadi)
#1542 feat(Table): table leftovers (@YossiSaadi)
2.38.1 (2023-09-19)
Bug Fixes
#1549 fix: text overflow Tooltip issue - replace internal Tooltip logic with Text overflow Tooltip logic (@SergeyRoyt)
New Icons
#1544 Update icons - monday-ui-style 0.1.194 (@github-actions[bot])
2.38.0 (2023-09-14)
New Features
#1520 Added the ability for combobox categories to get classNames and inline color as props (@MBYOded)
2.37.1 (2023-09-14)
Bug Fixes
#1546 fix: children type change to ElementContent (@SergeyRoyt)
2.37.0 (2023-09-14)
New Features
#1545 Exposed the ability to control the search icon for combobox (@MBYOded)
2.36.3 (2023-09-13)
Bug Fixes
#1543 - disable animation when using menuPortalTarget - temp fix (@SergeyRoyt)
2.36.2 (2023-09-12)
Bug Fixes
#1541 fix(Table): export table-related components (@YossiSaadi)
#1540 fix(TipseenTitle): font size should be TEXT1 (16px) (@YossiSaadi)
2.36.1 (2023-09-10)
Bug Fixes
#1538 withoutIcon remove padding (@SergeyRoyt)
2.36.0 (2023-09-10)
New Features
#1537 feat(Tipseen): in floating variation do not show tip, make docs for variation clearer (@YossiSaadi)
Internal Changes
#1521 chore(browserslist): Use browserslist-config-monday on Vibe (@YossiSaadi)
2.35.0 (2023-09-07)
New Features
#1535 feat: add a11y arias props for List, ListItem, and Button (@YossiSaadi)
#1530 feat(Table): table leftovers phase 1 (@YossiSaadi)
2.34.1 (2023-09-07)
Bug Fixes
#1534 fix: Tooltip shouldn't cover the icon (@SergeyRoyt)
2.34.0 (2023-09-07)
New Features
#1524 feat(Text): remove paragraph prop (can be achieved with element="p") (@YossiSaadi)
Documentation
#1529 docs: Change name in the story (@SergeyRoyt)
New Icons
#1531 Update icons - monday-ui-style 0.1.189 (@github-actions[bot])
2.33.0 (2023-09-05)
Bug Fixes
#1511 fix(Dropdown): when used inside overflowed container with transform, consider container scroll (@YossiSaadi)
New Features
#1528 feat(Tipseen): add floating variation for Tipseen (@YossiSaadi)
Internal Changes
#1525 Revert "chore: fail chromatic action check in case has visual changes (#1392) (@YossiSaadi)
2.32.0 (2023-09-04)
New Features
#1523 feat(Tipseen): allow withoutDialog for component (@YossiSaadi)
2.31.4 (2023-09-04)
Bug Fixes
#1522 fix: type (@SergeyRoyt)
New Icons
#1518 Update icons - monday-ui-style 0.1.188 (@github-actions[bot])
2.31.3 (2023-08-31)
New Icons
#1516 Update icons - monday-ui-style 0.1.186 (@github-actions[bot])
2.31.2 (2023-08-30)
Bug Fixes
#1513 fix attention box icon color (@hadasfa)
Documentation
#1499 docs: story (@SergeyRoyt)
Internal Changes
#1487 Sergeyro/chore/replace theme prop (@SergeyRoyt)
New Icons
#1509 Update icons - monday-ui-style 0.1.184 (@github-actions[bot])
2.31.1 (2023-08-28)
Bug Fixes
#1512 fix: export (@SergeyRoyt)
2.31.0 (2023-08-28)
Bug Fixes
#1510 fix: type=date, revert calendar icon changes (@SergeyRoyt)
New Features
#1494 feat:
- new component (@giladar-monday)
2.30.1 (2023-08-27)
Documentation
#1495 Docs for text and heading (@hadasfa)
2.30.0 (2023-08-27)
New Features
#1503 feat: export components - , , (@SergeyRoyt)
2.29.1 (2023-08-27)
Bug Fixes
#1506 fix: keyboard focus only on list items (@SergeyRoyt)
#1505 fix: flickering (@SergeyRoyt)
Internal Changes
#1500 chore: Update stories plop (@SergeyRoyt)
2.29.0 (2023-08-24)
New Features
#1492 feat:
id generation (@SergeyRoyt)
Dependency Upgrades
#1501 update monday-ui-style (@SergeyRoyt)
2.28.3 (2023-08-23)
Bug Fixes
#1498 fix: pass textColor (@SergeyRoyt)
2.28.2 (2023-08-22)
Bug Fixes
#1497 fix: pass children to the menuRenderer (@SergeyRoyt)
Documentation
#1493 docs: Update Pull request template (@SergeyRoyt)
2.28.1 (2023-08-21)
Bug Fixes
#1491 fix: debounce recreation bug (@SergeyRoyt)
2.28.0 (2023-08-21)
New Features
#1488 feat: defaultFilter value (@SergeyRoyt)
2.27.0 (2023-08-21)
New Features
#1490 feat: , refForwarding (@SergeyRoyt)
#1486 feat: add configurable aria-describedby attribute to the link element (@LihiBechorMarkovitz)
2.26.0 (2023-08-17)
Bug Fixes
#1485 fix: id generation (@SergeyRoyt)
New Features
#1484 feat: , component props (@SergeyRoyt)
2.25.2 (2023-08-16)
Bug Fixes
#1481 fix: removing unneeded aria-label from TextField's error message (@LihiBechorMarkovitz)
2.25.1 (2023-08-16)
Dependency Upgrades
#1482 Upgrade monday-ui-style (@sahariko)
2.25.0 (2023-08-16)
Bug Fixes
#1479 Fix h6 size in legacy heading (@hadasfa)
New Features
#1475 Api changes/hadas/next (@hadasfa)
2.24.1 (2023-08-15)
Bug Fixes
#1477 add null check to List component for support undef children (@hadasfa)
2.24.0 (2023-08-15)
New Features
#1440 Heading API changes (@hadasfa)
Internal Changes
#1474 chore: Cleanup internal css variables (@SergeyRoyt)
2.23.1 (2023-08-14)
Bug Fixes
#1472 fix(Menu): focusIndexOnMount can focus on an unfocusable item (@YossiSaadi)
#1444 fix(SplitButton): make menu-opening a11y-compatible (@YossiSaadi)
Internal Changes
#1473 chore: Storybook config cleanup (@SergeyRoyt)
2.23.0 (2023-08-13)
New Features
#1439 feat: a11y improvements (@SergeyRoyt)
2.22.0 (2023-08-10)
New Features
#1442 Technical pattern from using dropdown in dialog and modals and support for popupsContainerSelector for displaying dropdown properly in modals (@hadasfa)
2.21.0 (2023-08-09)
Bug Fixes
#1468 fix: replace icon (@SergeyRoyt)
New Features
#1469 feat(Tipseen): allow tipseen title to have max 2 lines (@YossiSaadi)
#1465 feat: add event as a param to onChange callback (@SergeyRoyt)
2.20.1 (2023-08-08)
Bug Fixes
#1467 Fix specificity issues in label and in typography in general (@hadasfa)
2.20.0 (2023-08-08)
New Features
#1432 feat(Indicator): add new Indicator component to component library (@YossiSaadi)
Documentation
#1466 chore(storybook): upgrade storybook to 6.5.10+ to enable interaction testing on Chromatic (@YossiSaadi)
2.19.2 (2023-08-07)
Bug Fixes
#1464 fix version number as css selector (@hadasfa)
2.19.1 (2023-08-07)
Bug Fixes
#1463 Add version to class (@orrgottlieb)
#1434 fix(AttentionBox): general improvements + allow ellipsis for overflowin attention box (@YossiSaadi)
Internal Changes
#1392 chore: fail chromatic action check in case has visual changes (@YossiSaadi)
2.19.0 (2023-08-03)
Bug Fixes
#1459 fix: storybookComponents export - include styles (@SergeyRoyt)
New Features
#1452 feat(Modal): css changes, add new footer layout (@YossiSaadi)
2.18.1 (2023-08-03)
Bug Fixes
#1458 package.json fix types exports for icons and root (@SergeyRoyt)
2.18.0 (2023-08-03)
Bug Fixes
#1456 Change vibe version number manually (@hadasfa)
#1453 Fix letter spacing in legacy heading (temp until we will able to fix in monday ui style) (@hadasfa)
New Features
#1457 last manually change for update vibe version? (@hadasfa)
#1455 Update vibe version number manually (@hadasfa)
Documentation
#1454 docs: fix Shadows page usage and examples (@SergeyRoyt)
2.17.5 (2023-08-01)
Documentation
#1451 Sergeyro/fix/update vibe storybook components (@SergeyRoyt)
Internal Changes
#1450 chore: prevent from style injection to explode in server side rendering (@shlomitc)
2.17.4 (2023-08-01)
Bug Fixes
#1449 Fix/hadas/log fix (@hadasfa)
2.17.3 (2023-08-01)
Bug Fixes
#1447 Fix modal content bug: display ellipsis on modal content (@hadasfa)
2.17.2 (2023-08-01)
Documentation
#1445 docs: welcome page small fixes (@SergeyRoyt)
Internal Changes
#1446 chore: fix internal triggers for deployment (@shlomitc)
#1441 chore: expose types for vite and next-based projects (@shlomitc)
#1443 chore(data-testid): util function does not chain id if it is falsy (@YossiSaadi)
2.17.1 (2023-07-26)
Bug Fixes
#1438 fix: static props (@SergeyRoyt)
Documentation
#1433 docs(API_GUIDELINES): add export instructions for type and interface (@YossiSaadi)
2.17.0 (2023-07-25)
New Features
#1431 Chips: Add WARNING color (@benpinchas)
#1403 feat(MultiStepIndicator): add ts support (@YossiSaadi)
Internal Changes
#1425 PR #3 of replacing old token variants with mixins (@hadasfa)
#1430 Replace storybookComponents with vibe-storybook-components (@SergeyRoyt)
2.16.1 (2023-07-19)
Bug Fixes
#1428 fix heading margin breaking change (@hadasfa)
#1422 fix(Chips): change border color token, do not limit chip-with-border's height (@YossiSaadi)
2.16.0 (2023-07-18)
Bug Fixes
#1421 fix(DatePicker): do not set vertical alignment to be baseline (defaults to middle) (@YossiSaadi)
New Features
#1400 Convert text and title usages with mixins (@hadasfa)
Internal Changes
#1412 Fix vibe typography instances 2 (@hadasfa)
New Icons
#1426 Update icons - monday-ui-style 0.1.173 (@github-actions[bot])
2.15.5 (2023-07-13)
Bug Fixes
#1419 improve useState to only called once in useIsOverflowing (@doronbrikman)
Documentation
#1420 docs(DatePicker): set default selected days for stories (@YossiSaadi)
#1408 docs: change usage of Yonatan in stories to Yossi (@YossiSaadi)
2.15.4 (2023-07-12)
New Icons
#1417 Update icons - monday-ui-style 0.1.172 (@github-actions[bot])
#1415 Update icons - monday-ui-style 0.1.171 (@github-actions[bot])
2.15.3 (2023-07-12)
Bug Fixes
#1416 Bug: Combobox component ts issues (@hadasfa)
Documentation
#1414 docs: change colors descriptions (@SergeyRoyt)
2.15.2 (2023-07-12)
Bug Fixes
#1409 fix: InteractionsTest - fix types (@SergeyRoyt)
Documentation
#1407 docs(useSwitch): add story page for hook (@YossiSaadi)
Internal Changes
#1406 test(useSwitch): add tests for hook (@YossiSaadi)
New Icons
#1413 Update icons - monday-ui-style 0.1.170 (@github-actions[bot])
2.15.1 (2023-07-11)
Bug Fixes
#1404 Combobox: expose actual type instead a no argument on hover callback. (@m-binygal)
Documentation
#1402 docs: fix storybook light theme name (@SergeyRoyt)
Internal Changes
#1396 Revert "refactor: support aria a11y in Tooltip component" (@SergeyRoyt)
2.15.0 (2023-07-09)
Bug Fixes
#1395 Accordion: fix vibe props are not recognized. (@m-binygal)
New Features
#1391 refactor: support aria a11y in Tooltip component (@YGlaubach)
Internal Changes
#1390 chore: enable source maps in tsconfig (@YossiSaadi)
2.14.1 (2023-07-05)
Bug Fixes
#1388 Refactor modal heading (@YGlaubach)
#1385 fix: remove Chips.sizes (@SergeyRoyt)
Documentation
#1387 Update browserslist in docs (@SergeyRoyt)
2.14.0 (2023-07-04)
New Features
#1384 feat: support ariaExpanded in (@YGlaubach)
2.13.1 (2023-07-02)
Bug Fixes
#1382 fix: MultiStepIndicator - fix divider to not squeeze bullets (@shlomitc)
Documentation
#1380 docs: Combobox - add example for the creation button (@shlomitc)
2.13.0 (2023-06-29)
New Features
#1375 AccordionItem: add support for custom header. (@m-binygal)
2.12.1 (2023-06-28)
Bug Fixes
#1369 fix: icons, interactionsTests, testIds types exports (@SergeyRoyt)
2.12.0 (2023-06-26)
New Features
#1372 feat: Publish (@SergeyRoyt)
#1359 New title component and some docs fixes and tests (@hadasfa)
2.11.1 (2023-06-25)
Bug Fixes
#1370 fix: tags styles overrides (@SergeyRoyt)
2.11.0 (2023-06-25)
Bug Fixes
#1368 fix: in published-ts-components.js (@SergeyRoyt)
#1367 Remove redundant tipseen max-width property (@ofirmonday)
2.10.2 (2023-06-21)
Documentation
#1360 Add docs best practices to contribution md (@hadasfa)
New Icons
#1361 Update icons - monday-ui-style 0.1.162 (@github-actions[bot])
2.10.1 (2023-06-21)
Bug Fixes
#1362 Fix bug on Tipseen in dark mode (@hadasfa)
2.10.0 (2023-06-15)
New Features
#1354 TS export components with static props - fix TS2532 (@SergeyRoyt)
#1356 feat: components - data-testid attributes (@SergeyRoyt)
New Icons
#1355 Update monday-ui-style to 0.1.160 (@github-actions[bot])
prerelease (2023-06-12)
New Features
#1323 Add tokens.css in Vibe 2.0 (@SergeyRoyt)
Documentation
#1353 Fix dialog overview story + add come prop comments (@hadasfa)
prerelease (2023-06-07)
New Features
#1352 added compact mode to MultiStepIndicator component (@rami-monday)
2.7.0 (2023-06-07)
New Features
#1342 Support dialog context menu hide trigger (@hadasfa)
2.6.0 (2023-06-07)
New Features
#1338 feat: font-weight redesign + small padding fixes (@SergeyRoyt)
Documentation
#1344 Readme updates for easier contribution (@hadasfa)
#1348 chore: < Dialog > add an example for basic controlled component (@shlomitc)
#1351 docs: Rename version 2 migration file (@SergeyRoyt)
#1345 docs: Vibe 2 migration guide (@SergeyRoyt)
2.5.2 (2023-06-06)
Bug Fixes
#1350 fix: revert changes to margin-block-start (@SergeyRoyt)
2.5.1 (2023-06-06)
Bug Fixes
#1343 fix: multi on option delete callback (@SergeyRoyt)
Internal Changes
#1347 fix: AutoSizer TS issues (@SergeyRoyt)
2.5.0 (2023-06-05)
Bug Fixes
#1337 fix: dependencies array (@SergeyRoyt)
New Features
#1334 feat: custom header title (@SergeyRoyt)
2.4.2 (2023-06-02)
Bug Fixes
#1340 fix: multi fix override with css variables (@SergeyRoyt)
2.4.1 (2023-05-31)
Bug Fixes
#1336 fix: - override the styles by using dedicates CSS variables to prevent CSS order issue (@SergeyRoyt)
2.4.0 (2023-05-30)
Bug Fixes
#1331 Hotfix for not throw an error on dialog when disable scroll is false (@hadasfa)
New Features
#1125 Optimize style injection (@orrgottlieb)
Documentation
#1328 Fix chips with background with the same color story (@hadasfa)
2.3.1 (2023-05-28)
Bug Fixes
#1324 fix: - galleryHeaderDot increase specificity (@SergeyRoyt)
2.3.0 (2023-05-28)
New Features
#1303 Add support on close button theme for tipseen (V2) (@hadasfa)
2.2.0 (2023-05-24)
Bug Fixes
#1313 Fix Menu Button TS issues (@hadasfa)
Internal Changes
#1302 Internal: run test-workflow on pull_request - for public forks (@SergeyRoyt)
2.1.0 (2023-05-22)
New Features
#1283 Feature/sergeyro/button brand color (@SergeyRoyt)
2.0.1 (2023-05-22)
New Icons
#1298 Upgrade icons (@github-actions[bot])
2.0.0 (2023-05-16)
Breaking Changes 🔴
#1254 CSS Modules migration (@SergeyRoyt)
All components were migrated to CSS Modules, replacing the global CSS.
Each component now expected a data-testid attribute set on the root element, allowing easier selection for testing (refer to this guide)
1.125.2 (2023-05-16)
Bug Fixes
#1276 internal: , - remove default props (@SergeyRoyt)
Internal Changes
#1275 Internal: release process - using package_version variables - test (@SergeyRoyt)
1.125.1 (2023-05-16)
Bug Fixes
#1264 Fix hooks exports (@SergeyRoyt)
Documentation
#1273 docs: Colors foundation - warning colors after negative colors (@SergeyRoyt)
Internal Changes
#1274 Internal: Publish storybook on workflow_dispatch (@SergeyRoyt)
1.125.0 (2023-05-16)
New Features
#1262 add wrapper class name to loader (@hadasfa)
Internal Changes
#1271 Release: breaking changes support (@SergeyRoyt)
#1270 Release v1 workflow (@SergeyRoyt)
#1269 npm publish with deprecated tag (@SergeyRoyt)
#1267 Release deprecated workflow (@SergeyRoyt)
1.124.4 (2023-05-15)
Bug Fixes
#1265 Docs and craft updates in components (@hadasfa)
1.124.3 (2023-05-11)
Bug Fixes
#1263 Passed onKeyPress, onBlur, onFocus props in EditableHeader to EditableInput (@udidoron)
#1122 Basic dialog docs (only basic variants and examples) (@hadasfa)
Documentation
#1258 fix: - fix name not displayed in the docs (@shlomitc)
#1256 chore: fix typography docs to map to the exact typography css vars (@shlomitc)
#1255 chore: , - update stories to show absolute urls to files and fix Avatar story to use AvatarGroup (@shlomitc)
1.124.2 (2023-05-08)
Bug Fixes
#1257 Fix testIds export path (@SergeyRoyt)
1.124.1 (2023-05-04)
Bug Fixes
#1252 feat: - ref forwarding (@SergeyRoyt)
1.124.0 (2023-05-04)
New Features
#1251 Publish-storybook on release completed (@SergeyRoyt)
1.123.0 (2023-05-04)
Bug Fixes
#1248 chore: expose entry in types for non-ts components (@shlomitc)
New Features
#1240 Css modules/sergeyro/attention box warning color + icons color + heading style fix (@SergeyRoyt)
#1250 feat: - allow to pass custom width (@shlomitc)
Documentation
#1247 Create API_GUIDELINES.MD (@shlomitc)
Internal Changes
#1249 change install to npm ci (@orrgottlieb)
1.122.2 (2023-05-02)
Bug Fixes
#1244 Dropdown: customOnOptionRemove as a callback, not as a replacement for inner logic (@SergeyRoyt)
1.122.1 (2023-04-30)
Bug Fixes
#1220 MenuItem id (@SergeyRoyt)
1.122.0 (2023-04-24)
New Features
#1235 EditableHeading - add data-testid (@SergeyRoyt)
Internal Changes
#1162 Bump webpack from 5.73.0 to 5.76.0 (@dependabot[bot])
#1120 Bump loader-utils and typescript-plugin-css-modules (@dependabot[bot])
1.121.1 (2023-04-20)
Bug Fixes
#1229 Fix margin between link and is related icon (@hadasfa)
1.121.0 (2023-04-20)
New Features
#1228 Add icon class name to icon button (@hadasfa)
1.120.0 (2023-04-20)
New Features
#1227 change background-color to background in order to allow gradient vari… (@orrgottlieb)
1.119.0 (2023-04-19)
New Features
#1219 Support scrollable class name for virtualized grid (@hadasfa)
Internal Changes
#1208 refactor: ColorPicker TS Migration (@shlomitc)
1.118.0 (2023-04-18)
New Features
#1216 Support custom renderer in Chip component (@hadasfa)
1.117.0 (2023-04-18)
New Features
#1217 Add number type and onWheel prop to text field (@or-nuri-monday)
Internal Changes
#1214 Css modules comment (@SergeyRoyt)
1.116.3 (2023-04-16)
Bug Fixes
#1212 Heading: replace padding changes with useIsOverflowing ignoreHeightOverflow prop (@SergeyRoyt)
1.116.2 (2023-04-13)
Bug Fixes
#1206 Fix bug on split button loading state (@hadasfa)
New Icons
#1207 Upgrade icons (@github-actions[bot])
1.116.1 (2023-04-10)
Bug Fixes
#1205 fix expand collapse border bug (@hadasfa)
1.116.0 (2023-04-09)
Bug Fixes
#1201 Fix hide border bug in expand collapse (@hadasfa)
New Features
#1202 Support menu button controlled active state (@hadasfa)
1.115.1 (2023-04-04)
Bug Fixes
#1200 Fix text field and search disabled appearance (@hadasfa)
1.115.0 (2023-04-03)
New Features
#1199 TS-migration: Combobox (@SergeyRoyt)
1.114.0 (2023-04-03)
Bug Fixes
#1197 Fix/sergeyro/sentry errors (EditableInput, VirtualizedList) (@SergeyRoyt)
New Features
#1187 Vibe: mock modular classnames - rollup, special entrypoint (@SergeyRoyt)
1.113.1 (2023-03-29)
Bug Fixes
#1188 Fix/sergeyro/heading overflow (@SergeyRoyt)
1.113.0 (2023-03-29)
New Features
#1196 Feature/sergeyro/buttons tab index props (@SergeyRoyt)
1.112.0 (2023-03-28)
New Features
#1194 Dropdown add className props (@SergeyRoyt)
#1193 Chips border (@orrgottlieb)
1.111.0 (2023-03-28)
New Features
#1192 Tooltip & Tipseen: arrowClassName (@SergeyRoyt)
#1191 Toggle add toggleSelectedClassName (@SergeyRoyt)
#1190 Add titleClassName props to customize TipseenTitle (@SergeyRoyt)
1.110.0 (2023-03-26)
Bug Fixes
#1186 fix interactions test location (@orrgottlieb)
New Features
#1183 change the build of css modules to calculate the hash according to co… (@orrgottlieb)
#1179 Support class name for search wrapper in combobox (@hadasfa)
Documentation
#1184 Yael photo update (@SergeyRoyt)
1.109.0 (2023-03-23)
New Features
#1180 ModalHeader: JsxElement in description (@SergeyRoyt)
1.108.0 (2023-03-21)
New Features
#1177 add editable heading class name for inner heading (@hadasfa)
1.107.2 (2023-03-21)
Bug Fixes
#1176 Add classname prop to Expandable (@orrgottlieb)
1.107.1 (2023-03-21)
Bug Fixes
#1175 Feature/sergeyro/modal close button aria label default value (@SergeyRoyt)
#1174 Support on attention box renderer and link (@hadasfa)
1.107.0 (2023-03-20)
New Features
#1172 MenuItem: add iconWrapperClassName prop (@SergeyRoyt)
1.106.1 (2023-03-19)
Bug Fixes
#1168 Revert css modules part 1 migration (@hadasfa)
1.106.0 (2023-03-16)
New Features
#1165 Dummy change for checking release process (@hadasfa)
1.105.0 (2023-03-14)
New Features
#1160 Feature/sergeyro/link add text classname prop (@SergeyRoyt)
1.104.1 (2023-03-13)
Bug Fixes
#1159 Fix dropdown bug when passing a damaged value (@hadasfa)
1.104.0 (2023-03-13)
New Features
#1158 TextField story & fix story in Chips (@orrgottlieb)
1.103.2 (2023-03-12)
Bug Fixes
#1134 Feature/sergeyro/css modules prerelease 1 (@SergeyRoyt)
1.103.1 (2023-03-12)
Bug Fixes
#1157 export list item avatar (@hadasfa)
1.103.0 (2023-03-12)
Bug Fixes
#1155 Fix combobox bug: trigger onclick event with the wrong option when categories and options not sorted (@hadasfa)
New Features
#1130 Feature/sergeyro/dropdown readonly (@SergeyRoyt)
Internal Changes
#1154 Fix back prerelease flow (@SergeyRoyt)
1.102.1 (2023-03-08)
Bug Fixes
#1153 Fix Heading sizes type issue (@orrgottlieb)
1.102.0 (2023-03-08)
Bug Fixes
#1129 set no animation on chip as default (@hadasfa)
New Features
#1151 Feature/sergeyro/tab remove inner css overrides - new prop (@SergeyRoyt)
#1128 Skeleton types + aria pressed + switch (@hadasfa)
#1127 Feature/sergeyro/chips elipsis tooltip (@SergeyRoyt)
Internal Changes
#1152 Rename prerelease flow (@SergeyRoyt)
#1133 Fix getStyle if no such style (@SergeyRoyt)
1.101.1 (2023-03-02)
Bug Fixes
#1146 skeleton animation use transform (@doronbrikman)
1.101.0 (2023-03-01)
New Features
#1124 Dialog, Tooltip addKeyboardHideShowTriggersByDefault prop (@SergeyRoyt)
Internal Changes
#1142 Use .nvmrc and npm ci in CI (@sahariko)
1.100.3 (2023-02-27)
Bug Fixes
#1141 Fix invalid hook referemce (@orrgottlieb)
1.100.2 (2023-02-27)
Bug Fixes
#1140 Fix storybook build (@orrgottlieb)
1.100.1 (2023-02-27)
Bug Fixes
#1139 Fix exported function (@orrgottlieb)
1.100.0 (2023-02-27)
New Features
#1138 add more docs (@orrgottlieb)
1.97.1 (2023-02-19)
Bug Fixes
#1115 Feature/sergeyro/modal fix rerendering issues (@SergeyRoyt)
1.97.0 (2023-02-16)
Bug Fixes
#1118 Fix modal components exposion (@SergeyRoyt)
New Features
#1086 Add disabled param to editable input component (@or-nuri-monday)
#1108 Docs/hadas/modal improvements (@hadasfa)
Documentation
#1106 Feature/sergeyro/steps story clickable example (@SergeyRoyt)
#1109 TextField stories - change icon in overview + fix a few typos (@SergeyRoyt)
#1113 Fix responsive dos and dont's by change min width and fix tipseen story (@hadasfa)
1.96.0 (2023-02-13)
Bug Fixes
#1105 Set chips clickable behavior as default instead of extra prop for backward support and clearer API (@hadasfa)
New Features
#1103 Tooltip.hideShowTriggers - static property (@SergeyRoyt)
Documentation
#1099 Feature/sergeyro/remove storybook styles overrides (@SergeyRoyt)
1.95.3 (2023-02-08)
Bug Fixes
#1100 Fix modal zIndex breaking change (@SergeyRoyt)
Documentation
#1097 Add founding designers to welcome page (@hadasfa)
1.95.2 (2023-02-07)
Bug Fixes
#1098 Fix modal title font family (@orrgottlieb)
1.95.1 (2023-02-06)
Bug Fixes
#1096 Feature/sergeyro/fix modal z index prop (@SergeyRoyt)
1.95.0 (2023-02-06)
New Features
#1087 Counter: counterClassName added (@SergeyRoyt)
1.94.1 (2023-02-06)
Bug Fixes
#1095 fix: Search component onChange callback type (@itaymndy)
1.94.0 (2023-02-06)
New Features
#1092 Add support for combobox optionClassName & combobox dark mode fixes (@hadasfa)
1.93.0 (2023-02-06)
Bug Fixes
#1093 feat(ListItemIcon): export icon size (@shiraWeiss)
New Features
#1094 Modal: Add zIndex prop (@SergeyRoyt)
Documentation
#1091 Fix docs (@orrgottlieb)
1.92.0 (2023-02-04)
New Features
#1090 update Figtree and Poppins (@orrgottlieb)
1.91.0 (2023-02-01)
New Features
#1082 Add support for "without margin" prop in Divider component (@hadasfa)
1.90.0 (2023-01-30)
New Features
#1084 Feature/sergeyro/label class name props (@SergeyRoyt)
1.89.0 (2023-01-30)
New Features
#1080 Skeleton - wrapperClassName and fullWidth props added (@SergeyRoyt)
1.88.1 (2023-01-29)
Bug Fixes
#1079 Update Dropdown.jsx (@orrgottlieb)
1.88.0 (2023-01-29)
New Features
#1070 add class names to marker and description of radiobutton (@hadasfa)
#1078 AccordionItem and ExpandAble preparation for css modules transition (@orrgottlieb)
1.87.0 (2023-01-26)
Bug Fixes
#1075 Tipseen: snapshot tests & fix bug on onDismiss and onSubmit overrides (@hadasfa)
New Features
#1077 Feature/sergeyro/avatar classname props (@SergeyRoyt)
Documentation
#1074 Docs/hadas/responsive list docs (@hadasfa)
Internal Changes
#1076 small tipseen test fix (@hadasfa)
1.86.3 (2023-01-25)
Bug Fixes
#1072 Fix tipssen hide close button (@hadasfa)
1.86.2 (2023-01-23)
Bug Fixes
#1056 Feature/sergeyro/fix chips dropdown alignment (@SergeyRoyt)
1.86.1 (2023-01-22)
Bug Fixes
#1055 Feature/sergeyro/fix clickable chips breaking changes (@SergeyRoyt)
1.86.0 (2023-01-22)
New Features
#1071 Expose Vibe components and related TS types (@hadasfa)
1.85.0 (2023-01-18)
New Features
#1067 Checkbox: checkbox and label className props (@SergeyRoyt)
1.84.4 (2023-01-18)
Bug Fixes
#1069 fix center loader (@hadasfa)
1.84.3 (2023-01-18)
Bug Fixes
#1068 Fix/hadas/center loader (@hadasfa)
1.84.2 (2023-01-17)
Bug Fixes
#1064 fix dropdown with modal/dialog state (support scroll inside dropdown) (@hadasfa)
1.84.1 (2023-01-16)
Bug Fixes
#1066 move lodash-es from devDependencies to dependencies (@eran-cohen)
1.84.0 (2023-01-16)
Bug Fixes
#1065 fix inject location (@orrgottlieb)
New Features
#1051 Tipseen TS-migration (@SergeyRoyt)
Dependency Upgrades
#1063 Use lodash-es instead of lodash - to align our dependency and better support esm (@mentaman)
Documentation
#1060 AvatarGroup: teams use case fix (@SergeyRoyt)
1.83.3 (2023-01-13)
Bug Fixes
#1062 fix link to build (@orrgottlieb)
1.83.2 (2023-01-12)
Bug Fixes
#1061 Fix all icons (@orrgottlieb)
1.83.1 (2023-01-12)
Bug Fixes
#1059 fix mapping (@orrgottlieb)
1.83.0 (2023-01-12)
New Features
#1058 added name prop to textField (@etaylib)
1.82.0 (2023-01-12)
Bug Fixes
#1057 fix css build issue :( (@orrgottlieb)
New Features
#1049 Feature/sergeyro/unify icon sizes list menu (@SergeyRoyt)
Documentation
#1054 Change welcome page to display current team (@hadasfa)
#1053 Revert "Fix storybook menu colors (#1050)" (@SergeyRoyt)
#1052 Clickable chips redesign story (@SergeyRoyt)
#1050 Fix storybook menu colors (@SergeyRoyt)
1.81.0 (2022-12-28)
New Features
#1048 Feature/sergeyro/icon button tooltipProps (@SergeyRoyt)
1.80.1 (2022-12-27)
Bug Fixes
#1047 Increase Tipseen styles specificity to override Tooltip styles (@SergeyRoyt)
1.80.0 (2022-12-27)
New Features
#1045 Feature/sergeyro/more of dialog container selectors (@SergeyRoyt)
Internal Changes
#1013 Feature/sergeyro/ts migration menu (@SergeyRoyt)
#995 Dialog, DialogContent, MenuButton: TS-migration (@SergeyRoyt)
1.79.2 (2022-12-25)
Bug Fixes
#1043 Revert "Heading Weights" (@hadasfa)
1.79.1 (2022-12-22)
Bug Fixes
#1042 Revert "TS-migration: Tipseen + some constants usage refactoring (#998)" (@SergeyRoyt)
1.79.0 (2022-12-21)
Bug Fixes
#1040 Fix TabList undefined error (@MosheZemah)
New Features
#1041 Heading Weights (@orrgottlieb)
1.78.2 (2022-12-19)
Bug Fixes
#1037 Same behaviour for active button ,active split button and active icon button (@hadasfa)
1.78.1 (2022-12-19)
Bug Fixes
#1038 export date picker as part of esm (@hadasfa)
1.78.0 (2022-12-19)
Bug Fixes
#1039 Import react to prevent cypress tests (in docs team e.g.) from failing (@SergeyRoyt)
New Features
#1018 Feature/sergeyro/chips hovered state + clickable (@SergeyRoyt)
Documentation
#1036 Accessability story navigation fix (@SergeyRoyt)
Internal Changes
#1032 Icon: follow create component best practices. (@m-binygal)
#998 TS-migration: Tipseen + some constants usage refactoring (@SergeyRoyt)
1.77.0 (2022-12-14)
Bug Fixes
#1028 Fix AvatarGroup tooltip keyboard navigation: fix checkWithoutModifierInEvent (@SergeyRoyt)
#1031 Fix interactions-utils imports in RadioButton (@SergeyRoyt)
New Features
#1034 MenuButton: allow to specify position of an icon (@arutkowski00)
#1035 Feature/sergeyro/export test infra (@SergeyRoyt)
Documentation
#1033 Test readme markdown fixes (@SergeyRoyt)
#1026 Add interactions basic readme file (@hadasfa)
1.76.0 (2022-12-04)
Bug Fixes
#1029 close while scrolling with in dialog/modal mode (@hadasfa)
#996 RadioButton: add disabled-text-color (@SergeyRoyt)
#1027 Remove indicator hover state when dropdown is disabled (@SergeyRoyt)
#1010 Feature/sergeyro/dropdown disabled color fix (@SergeyRoyt)
New Features
#1025 Export interactions 2 (@hadasfa)
1.75.2 (2022-11-30)
Dependency Upgrades
#1024 Import optimizations (@orrgottlieb)
1.75.1 (2022-11-29)
Dependency Upgrades
#1023 remove docgen on production build (@orrgottlieb)
1.75.0 (2022-11-29)
New Features
#1022 Revert "Interactions tests exports (#1004)" (@orrgottlieb)
1.74.2 (2022-11-29)
Bug Fixes
#1021 revert changes (@orrgottlieb)
1.74.1 (2022-11-29)
Dependency Upgrades
#1020 remove not needed packages (@orrgottlieb)
1.74.0 (2022-11-29)
New Features
#1019 remove docogen from build (@orrgottlieb)
#1004 Interactions tests exports (@hadasfa)
1.73.13 (2022-11-29)
Bug Fixes
#1016 Hot fix after external PR (@SergeyRoyt)
1.73.12 (2022-11-29)
Bug Fixes
#1007 Fix ability to display dropdown menu inside dialog or modal (@hadasfa)
Internal Changes
#986 TS-Migration: Reduced amount of ts-ignore (@khitrind)
1.73.11 (2022-11-28)
New Icons
#1015 Upgrade icons (@github-actions[bot])
1.73.10 (2022-11-28)
Bug Fixes
#999 Support all edge cases for multi select drop with counter (hidden chips in dropdown with defined width edge case) (@hadasfa)
1.73.9 (2022-11-28)
Bug Fixes
#1014 fix letter spacing in non h1 headers (@orrgottlieb)
1.73.8 (2022-11-27)
Bug Fixes
#1012 Heading font (@orrgottlieb)
1.73.7 (2022-11-27)
Bug Fixes
#1011 Heading component main font (@orrgottlieb)
1.73.6 (2022-11-27)
Bug Fixes
#1009 Fix editable heading bug (@orrgottlieb)
1.73.5 (2022-11-27)
Bug Fixes
#1008 Fix attention box icon bug (@orrgottlieb)
1.73.4 (2022-11-27)
Bug Fixes
#1003 align usages (@orrgottlieb)
Internal Changes
#1006 TS-migration: Flex (@SergeyRoyt)
#1005 Feature/sergeyro/split button improve tests (@SergeyRoyt)
New Icons
#1002 Upgrade icons (@github-actions[bot])
1.73.3 (2022-11-22)
Bug Fixes
#1001 Fix: Revert splitButton default props to old-fashioned defaultProps (@SergeyRoyt)
1.73.2 (2022-11-22)
Bug Fixes
#1000 SplitButton temp fix - secondary button no click event (@SergeyRoyt)
1.73.1 (2022-11-22)
Bug Fixes
#994 Display avatar/icon in single value and in options for multi and single (@hadasfa)
1.73.0 (2022-11-20)
New Features
#973 Feature/sergeyro/export storybook components (@SergeyRoyt)
1.72.0 (2022-11-20)
New Features
#993 support tab index for text field (@etaylib)
New Icons
#992 Upgrade icons (@github-actions[bot])
1.71.3 (2022-11-20)
Internal Changes
#931 AvatarGroup Typescript migration (@SergeyRoyt)
#984 TS-migration: EditableInput (@SergeyRoyt)
#964 ExpandCollapse: TS-migration (@SergeyRoyt)
#981 TS-migration: VirtualizedList (@SergeyRoyt)
#989 Install style-inject explicitly (@sahariko)
#988 Rollup (@sahariko)
New Icons
#990 Bump monday-ui-styles version to "0.1.144": team icon (@3dyonic)
1.71.2 (2022-11-16)
Bug Fixes
#985 Check if contributorsJson is an array before filtering (@SergeyRoyt)
Internal Changes
#954 Skeleton: TS-migration (@SergeyRoyt)
#959 TS-migration: Steps (@SergeyRoyt)
#980 TS-migration: VirtualizedGrid (@SergeyRoyt)
#960 Modal: TS-migration (@SergeyRoyt)
#947 SplitButton: Typescript migration (@SergeyRoyt)
#961 Toast: TS-migration (@SergeyRoyt)
#978 TS-migration: LinearProgressBar, Bar (@SergeyRoyt)
New Icons
#987 Upgrade icons (@github-actions[bot])
1.71.1 (2022-11-13)
New Icons
#979 Upgrade icons (@github-actions[bot])
1.71.0 (2022-11-13)
New Features
#983 dropdown component tooltip (@liorswM)
1.70.2 (2022-11-10)
Bug Fixes
#982 Fix tooltip-arrow color to adapt to the theme (@SergeyRoyt)
1.70.1 (2022-11-09)
Bug Fixes
#974 ComboboxItems: add categories to calculations. (@m-binygal)
Documentation
#975 Fix storybook box overview code (@SergeyRoyt)
Internal Changes
#976 add source maps (@orrgottlieb)
1.70.0 (2022-11-02)
New Features
#970 tipseen tip prop (@liorswM)
1.69.3 (2022-11-02)
Bug Fixes
#969 fix accordion publish (@hadasfa)
1.69.2 (2022-11-02)
Bug Fixes
#968 Fix bug: scroll inside dropdown in overflow mode (@hadasfa)
Internal Changes
#967 Box: ts-migration (@SergeyRoyt)
#966 Fix DatePicker tests + refactor (@SergeyRoyt)
#965 Accordion: ts-migration - refactoring (@SergeyRoyt)
#963 Migrate Accordion to TypeScript (@aayushbisen)
1.69.1 (2022-10-26)
Bug Fixes
#962 add support for import css files (@neilmon)
Internal Changes
#956 TS fixes: add SubIcon and Element types + remove default props (@hadasfa)
1.69.0 (2022-10-25)
New Features
#875 Neil/date picker (@neilmon)
Documentation
#932 Add docs about change publish component files for every ts migration update (@hadasfa)
Internal Changes
#949 Slider and all sub-components: TS-migration (@SergeyRoyt)
#958 Tab: TS-migration (@SergeyRoyt)
#951 TextField: TS migration (@SergeyRoyt)
#955 Toggle: TS-migration (@SergeyRoyt)
#957 Fix dialog container after external contribution (@hadasfa)
#933 refactor: migrate DialogContentContainer to typescript (@vishal-codes)
1.68.3 (2022-10-23)
Bug Fixes
#952 For "getElementColor" function return, add missing ')'. (@3dyonic)
#943 fix: onClose can be undefined when hidding the modal (@gaspoute)
Internal Changes
#945 BreadcrumbsBar Typescript migration (@SergeyRoyt)
#935 Heading Typescript migration (@SergeyRoyt)
#938 List Typescript migration (@SergeyRoyt)
#941 AlertBanner: Typescript migration (@SergeyRoyt)
#934 Plop Typescript migration (@SergeyRoyt)
#862 Loader Typescript migration (@SergeyRoyt)
#950 fix button group after migration (@hadasfa)
#948 refactor(ButtonGroup): migrate ButtonGroup to TypeScript (@aayushbisen)
#937 Ts/hadas/tooltip (@hadasfa)
#946 Search Typescript migration (@SergeyRoyt)
1.68.2 (2022-10-18)
Bug Fixes
#939 Fix attention box migration to ts (@hadasfa)
1.68.1 (2022-10-18)
Bug Fixes
#944 Revert release version (@eran-cohen)
#942 fix attentionBox snapshot (@eran-cohen)
#940 added some docs to modal component (@eran-cohen)
#928 modal css fixes (@eran-cohen)
Dependency Upgrades
#901 upgrade deps (@orrgottlieb)
Internal Changes
#925 refactor: migrate AttentionBox to typescript (@SumeetHaryani)
#930 Fixes in chips migration to ts (@hadasfa)
#926 Chips Typescript Migration (@manastelavane)
#929 move IconButton to ts components list (@eran-cohen)
#924 refactor: migrate IconButton to typescript (@SumeetHaryani)
#921 refactor: migrate Avatar to typescript (@SumeetHaryani)
#913 Convert label to typescript (@bautistaaa)
#914 Migrate hiddentext to ts (@bautistaaa)
#916 refactor: migrate Divider in typescript (@aayushbisen)
#918 Migrated Radio Button to typescript (@Suman94310)
#917 refactor(Banner): Migrated from JS to TS (@suvnshr)
#915 feat: migrate FormattedNumber to ts (@indremak)
#907 Migrate Counter component to TS. (@a11rew)
#906 migrate Link component to TypeScript (@ercusz)
#897 convert helpers/utils to typescript (@orrgottlieb)
New Icons
#902 Upgrade icons (@github-actions[bot])
1.68.0 (2022-10-02)
New Features
#884 Feature/sergeyro/font change (@SergeyRoyt)
1.67.1 (2022-09-29)
Bug Fixes
#890 fix css issue (@orrgottlieb)
1.67.0 (2022-09-28)
New Features
#696 Modal (@eran-cohen)
New Icons
#888 Upgrade icons (@github-actions[bot])
1.66.1 (2022-09-22)
Bug Fixes
#887 fix import path from absolute to relative. (@3dyonic)
#886 Tooltip: increase specifity of monday-style-arrow-${theme} classes (@SergeyRoyt)
1.66.0 (2022-09-21)
New Features
#882 Feature/refactor components motion keyframes (@3dyonic)
1.65.0 (2022-09-21)
New Features
#883 fix externals issue (@orrgottlieb)
1.64.2 (2022-09-20)
Bug Fixes
#879 Fix flex grow loading state size. (@3dyonic)
1.64.1 (2022-09-20)
Bug Fixes
#880 Fix Virtualized list items (@MosheZemah)
1.64.0 (2022-09-20)
Bug Fixes
#876 Fix for virtualized list items (@MosheZemah)
New Features
#873 add on hover to list item (@liatmaor)
Documentation
#872 add readme for typescript migration process (@hadasfa)
Internal Changes
#869 Hooks ts (@orrgottlieb)
New Icons
#877 Upgrade icons (@github-actions[bot])
1.63.1 (2022-09-15)
Bug Fixes
#874 fix icon types import (@eran-cohen)
Internal Changes
#870 Feature/sergeyro/ts infra css modules (@SergeyRoyt)
New Icons
#871 Upgrade icons (@github-actions[bot])
1.63.0 (2022-09-14)
New Features
#857 Convert icon component and related code to js (@hadasfa)
Internal Changes
#858 Css modules typescript infra via 'typescript-plugin-css-modules' + eslint ts specification (@SergeyRoyt)
1.62.1 (2022-09-11)
Bug Fixes
#866 Fixing Chips import by changing to relative import (@yardenli)
1.62.0 (2022-09-11)
Bug Fixes
#859 Feature/sergeyro/menu button icon size unify (@SergeyRoyt)
New Features
#864 Chip colors in dropdown with multi support (@yardenli)
Internal Changes
#860 Feature/sergeyro/build react icons typescript (@SergeyRoyt)
1.61.0 (2022-09-07)
New Features
#861 Fix menu button ref (@hadasfa)
1.60.0 (2022-09-06)
New Features
#856 feat(checkbox): add ability to render component without label (@niksa-monday)
Internal Changes
#794 Convert button component to typescript & project configurations (@hadasfa)
1.59.1 (2022-09-04)
Bug Fixes
#854 add support for menus inside a container which using transform function (@hadasfa)
1.59.0 (2022-09-02)
Bug Fixes
#839 Feature/sergeyro/accordion collapse icon not clickable (@SergeyRoyt)
New Features
#852 Add Horizontal virtualized list (@MosheZemah)
Internal Changes
#845 Feature/sergeyro/disable styleint rule for global pseudo class (@SergeyRoyt)
1.58.1 (2022-08-31)
Bug Fixes
#849 Fix close on scroll in inside scroll state (@hadasfa)
1.58.0 (2022-08-31)
Bug Fixes
#840 Fix avatar group dependencies without effect behivour (@hadasfa)
New Features
#848 Support new dropdown state for displaying menu inside scrollable dialog (@hadasfa)
#847 Export content color (@or-nuri-monday)
#832 Feature/sergeyro/chips close button aria label (@SergeyRoyt)
1.57.0 (2022-08-24)
New Features
#838 Add color: var(--disabled-text-color) to disabled checkbox label (@3dyonic)
#828 AttentionBox - close icon button instead of icon (@SergeyRoyt)
#836 BreadcrumbContent: link and button roles are added (@SergeyRoyt)
#829 Feature/sergeyro/dropdown item tooltip (@SergeyRoyt)
#835 Feature/sergeyro/loader a11y attributes (@SergeyRoyt)
#831 IconButton: add showTooltip prop (@SergeyRoyt)
1.56.0 (2022-08-21)
Bug Fixes
#833 add support on pass class name to reference in tooltip (@hadasfa)
#827 Update h1 example to Poppins (@3dyonic)
#817 Add missing prop bind: marginBottom in Box story (@3dyonic)
New Features
#811 Update easing tokens (@3dyonic)
Internal Changes
#821 Test-utils ELEMENT_TYPES extended (@SergeyRoyt)
1.55.0 (2022-08-14)
Bug Fixes
#818 Fix icon button size (@hadasfa)
#815 Avatar: prevent default (scroll) on click via space (@SergeyRoyt)
#813 fix focus indicator to inset (@orrgottlieb)
#810 remove console.log (@hadasfa)
New Features
#816 Add Cursor not-allowed to disabled checkbox (@3dyonic)
Internal Changes
#814 Fix useKeyEvent imports (@SergeyRoyt)
1.54.0 (2022-08-03)
Bug Fixes
#807 Fix typo in color menuColorsExample.png (@3dyonic)
New Features
#796 Use motion tokens on SliderBase.scss (@3dyonic)
#797 Use motion tokens on SplitButton.scss (@3dyonic)
#798 Use motion tokens on Steps.scss (@3dyonic)
#802 Use motion tokens on TextField.scss (@3dyonic)
#803 Use motion tokens on Toggle.scss (@3dyonic)
#804 Use motion tokens on Toast.scss (@3dyonic)
#805 Use motion tokens on TabPanels.scss (@3dyonic)
#786 Use motion tokens on Label.scss (@3dyonic)
#801 Use motion tokens on Tab.scss (@3dyonic)
#795 Use motion tokens on RadioButton.scss (@3dyonic)
#790 Use motion tokens on LinearProgressBar.scss (@3dyonic)
#806 Use motion tokens on Skeleton.scss (@3dyonic)
Internal Changes
#809 fix issue for externals (@orrgottlieb)
1.53.0 (2022-08-01)
Bug Fixes
#800 Fix h1 style gaps in Editable heading edit mode. (@3dyonic)
New Features
#782 Use motion tokens on Chips.module.scss (@3dyonic)
#789 Use motion tokens on StepIndicator.scss (@3dyonic)
#779 Use motion tokens on Button.scss (@3dyonic)
#784 Feature/yonatanari/motion tokens counter (@3dyonic)
#785 Use motion tokens on Dropdown.scss and dropdown/menu.scss (@3dyonic)
#788 Use motion tokens on MenuButton.scss (@3dyonic)
#781 Use motion tokens on Checkbox.scss (@3dyonic)
#778 Use motion tokens on ExpandCollapse.scss (@3dyonic)
#772 New disabled-text-color tokens, component disabled update. (@3dyonic)
1.52.3 (2022-08-01)
Bug Fixes
#799 allow disable label animation on radio button (@hadasfa)
Internal Changes
#793 Tipseen: fix styleint errors (@SergeyRoyt)
1.52.2 (2022-07-28)
Bug Fixes
#771 Tipseen: css modules (@SergeyRoyt)
1.52.1 (2022-07-27)
Bug Fixes
#791 removed hooks alias usage (@eran-cohen)
1.52.0 (2022-07-27)
New Features
#780 Remove aliases (@eran-cohen)
Internal Changes
#776 add exports to package.json + build icons esm file (@eran-cohen)
1.51.1 (2022-07-27)
Bug Fixes
#736 scroll combobox fix (@mentaman)
1.51.0 (2022-07-26)
Bug Fixes
#787 add validation (@orrgottlieb)
New Features
#759 Allow defaultVisualFocusItemIndex on use useActiveDescendantListFocus and combobox (@hadasfa)
1.50.2 (2022-07-24)
Bug Fixes
#777 Bug/hadas/attention box close (@hadasfa)
1.50.1 (2022-07-24)
Bug Fixes
#775 Fix button group css specificity (@hadasfa)
New Icons
#773 Upgrade icons (@github-actions[bot])
1.50.0 (2022-07-20)
New Features
#770 Manually update monday-ui-style version to 0.1.132 (@SergeyRoyt)
1.49.0 (2022-07-20)
Bug Fixes
#763 Add test for list without props. (@samitc)
New Features
#750 Feature/yonatanari/change logo href (@3dyonic)
#765 Enable brandFont prop for heading within editable heading. (@3dyonic)
1.48.3 (2022-07-20)
New Icons
#768 Upgrade icons (@github-actions[bot])
1.48.2 (2022-07-20)
Bug Fixes
#767 Box: added to published-components (@SergeyRoyt)
1.48.1 (2022-07-20)
New Icons
#764 Upgrade icons (@github-actions[bot])
1.48.0 (2022-07-19)
New Features
#758 Add Poppins font-family to h1 heading (@3dyonic)
New Icons
#762 Upgrade icons (@github-actions[bot])
1.47.0 (2022-07-19)
New Features
#753 Navigate in list with keyboard. (@samitc)
#687 Feature/yonatanari/box component (@3dyonic)
#752 Feature/yonatan ari/storybook repsoinsive tweaks (@3dyonic)
Documentation
#712 Feature/yonatanari/motion page (@3dyonic)
1.46.0 (2022-07-13)
New Features
#749 Support set use active descendant list visual focus from outside (@hadasfa)
1.45.0 (2022-07-13)
New Features
#748 Clickable: ariaExpanded prop added (@SergeyRoyt)
1.44.1 (2022-07-12)
Bug Fixes
#746 adding property box-sizing to RadioButton (@rami-monday)
1.44.0 (2022-07-10)
New Features
#744 Icon button fix and link alignment (@orrgottlieb)
1.43.0 (2022-07-10)
New Features
#743 Feat: Add prop set the tabindex for RadioButton.jsx rendered children (@DorShakedMonday)
1.42.0 (2022-07-07)
New Features
#742 Mute Notification Icon (@orrgottlieb)
#737 Feature/yonatanari/wellcome page responsive without media (@3dyonic)
New Icons
#740 Upgrade icons (@github-actions[bot])
1.41.2 (2022-07-06)
Bug Fixes
#739 Few fixes for supporting useActiveDescendantListFocus in menus (@hadasfa)
1.41.1 (2022-07-05)
Bug Fixes
#735 IconButton: added wrapperClassName prop (@SergeyRoyt)
1.41.0 (2022-07-03)
New Features
#706 Feature/sergeyro/avatar group a11y (@SergeyRoyt)
1.40.1 (2022-07-03)
Bug Fixes
#733 AvatarGroup component export (@SergeyRoyt)
1.40.0 (2022-07-03)
Bug Fixes
#723 Add css module support for chips component (@SergeyRoyt)
New Features
#732 adding leftIcon and leftAvatar to dropdown chips (@maxiozer)
1.39.1 (2022-06-30)
Bug Fixes
#731 fix clickable PropType and inset focus for heading compoennt (@orrgottlieb)
1.39.0 (2022-06-30)
New Features
#730 dropdown with mandatory default values (@maxiozer)
1.38.1 (2022-06-29)
Bug Fixes
#729 add max length as a prop (@mayaAssayag)
1.38.0 (2022-06-29)
New Features
#727 Butotn inset focus style (@orrgottlieb)
1.37.0 (2022-06-28)
New Features
#725 Clickable: ariaHasPopup prop (@SergeyRoyt)
1.36.5 (2022-06-28)
New Icons
#722 Upgrade icons (@github-actions[bot])
1.36.4 (2022-06-28)
Bug Fixes
#724 fix medium 2 min width to 1280 (@liatmaor)
1.36.3 (2022-06-27)
Bug Fixes
#720 Fix/yonatanari/fix disabled text color issues (@3dyonic)
Internal Changes
#719 feat(storybook): memory stats for stories (@niksa-monday)
#718 feat(storybook): enable storybook performance addon (@niksa-monday)
1.36.2 (2022-06-27)
Internal Changes
#713 Jest snapshot css modules (@eran-cohen)
New Icons
#717 Upgrade icons (@github-actions[bot])
1.36.1 (2022-06-23)
Bug Fixes
#709 Avatar custom size by classname (@SergeyRoyt)
Internal Changes
#708 Feature/sergeyro/plop component fix (@SergeyRoyt)
1.36.0 (2022-06-19)
Bug Fixes
#705 fix button tooltip hidden when stop hovering + tipseen useless wrapper (@hadasfa)
New Features
#694 Feature/sergeyro/avatar group (@SergeyRoyt)
1.35.1 (2022-06-15)
Bug Fixes
#699 Fix: Add prop to preserve radio button on select behaviour with children (@DorShakedMonday)
1.35.0 (2022-06-14)
New Features
#698 Feature/yonatanari/add shadow xs example (@3dyonic)
#697
Update version "monday-ui-style": "0.1.118", (@3dyonic)
1.34.0 (2022-06-08)
New Features
#690 feat/Chris/ make Avatar initials text styling customisable (@ChristopherMichaelNowak)
1.33.1 (2022-06-08)
Internal Changes
#692 update version of storybook (@orrgottlieb)
New Icons
#691 Upgrade icons (@github-actions[bot])
1.33.0 (2022-06-07)
New Features
#686 Storybook/sergeyro/expand loader (@SergeyRoyt)
Internal Changes
#689 Feature/sergeyro/hooks plop improve (@SergeyRoyt)
1.32.0 (2022-05-26)
New Features
#683 EditableHeading -Add option to pass argument to onStartEditing, input class name prop,… (@mayaAssayag)
New Icons
#684 Upgrade icons (@github-actions[bot])
1.31.3 (2022-05-25)
Bug Fixes
#677 fix: fix issue with ButtonIcon inline issue (@orrgottlieb)
Documentation
#681 fix: Remove Tip box (@abaum-augu)
New Icons
#682 Upgrade icons (@github-actions[bot])
1.31.2 (2022-05-24)
Bug Fixes
#680 Change attention box default padding (@hadasfa)
Dependency Upgrades
#660 # Update sass to version "sass": "^1.51.0", (@3dyonic)
1.31.1 (2022-05-22)
Bug Fixes
#679 Patch/yonatanari/disabled states correction (@3dyonic)
New Icons
#678 Upgrade icons (@github-actions[bot])
1.31.0 (2022-05-19)
New Features
#659 Storybook/sergey/use set focus hook (@SergeyRoyt)
1.30.0 (2022-05-19)
New Features
#676 # Update "monday-ui-style" to "0.1.111" (@3dyonic)
Dependency Upgrades
#669 upgrade patch versions (@orrgottlieb)
1.29.0 (2022-05-15)
Bug Fixes
#667 [Snyk] Upgrade react-window from 1.8.6 to 1.8.7 (@snyk-bot)
New Features
#668 hide the dialog/tooltip when the reference is hidden (@orrgottlieb)
1.28.2 (2022-05-10)
Bug Fixes
#663 fix use previous export (@hadasfa)
1.28.1 (2022-05-10)
Bug Fixes
#662 Fix bug: remove "add new" button from not found empty state in combobox as default (@hadasfa)
Documentation
#657 Storybook: usePrevios hook (@SergeyRoyt)
1.28.0 (2022-05-01)
New Features
#584 Use media query (@orrgottlieb)
1.27.1 (2022-04-28)
Bug Fixes
#654 Fix export of a11y list hook (@hadasfa)
1.27.0 (2022-04-28)
Bug Fixes
#653 Fix usage on useMergedRef in checkbox (@hadasfa)
New Features
#636 A11y/combobox nav refactor and expose list focus and keyboard navigation hook (@hadasfa)
1.26.7 (2022-04-26)
New Icons
#652 Upgrade icons (@github-actions[bot])
1.26.6 (2022-04-24)
New Icons
#650 Upgrade icons (@github-actions[bot])
1.26.5 (2022-04-24)
Bug Fixes
#649 fix commit (@orrgottlieb)
1.26.4 (2022-04-20)
New Icons
#647 Upgrade icons (@github-actions[bot])
1.26.3 (2022-04-19)
Bug Fixes
#648 Undo "component" absolute path because it increase bundle size (@hadasfa)
1.26.2 (2022-04-18)
Bug Fixes
#643 remove set style hardcoded for icon button (not needed and not used u… (@hadasfa)
1.26.1 (2022-04-18)
Bug Fixes
#641 Fix bug: support press shift while click on checkbox on firefox browsers (@hadasfa)
1.26.0 (2022-04-17)
Bug Fixes
#635 Add flag for undo a null check which cause weird behavior (combobox) (@hadasfa)
New Features
#633 Fix minor craft bugs (button disabled cursor and chip close button appearance) & stories & add data test id prop to chip, button, icon button (@hadasfa)
1.25.0 (2022-04-13)
Bug Fixes
#632 Support on disabled tabIndex (@NofarRG)
#630 fix icon size for small button (@liatmaor)
New Features
#625 add support on virtualized list items inside list component (@hadasfa)
Documentation
#619 fix virtualized list story (@hadasfa)
#622 Feature/yonatanari/wellcome page updates (@3dyonic)
1.24.0 (2022-04-07)
Bug Fixes
#623 # 💄 Change Icon Button Small variant shape size to 24px. (@3dyonic)
New Features
#629 feat: adding a flag to ColorPicker for showing color name tooltips (@shanibenaderetmonday)
1.23.2 (2022-04-05)
Bug Fixes
#628 Scrollintoview (@orrgottlieb)
1.23.1 (2022-04-05)
Bug Fixes
#627 Scroll into view not exsiting (@orrgottlieb)
Documentation
#624 Analytics (@orrgottlieb)
1.23.0 (2022-04-05)
Bug Fixes
#615 Interaction tests for combobox & add data test ids by prop to clickable, search, textfield, combobox (@hadasfa)
New Features
#621 Combobox max options without scroll (@MosheZemah)
Documentation
#620 docs(accordion): improve storybook (sub-items, props, etc.) (@niksa-monday)
#618 test(accordion): add interaction tests for multi-active mode (@niksa-monday)
#617 feat(accordion): add data-testid, improve ids, add interaction tests (@niksa-monday)
#614 color picker testids fix (@laviomri)
1.22.0 (2022-03-30)
Bug Fixes
#609 Fix clickable tests (add interaction tests for focus and few behaviour tests) (@hadasfa)
#606 fix(interaction): minor selector typo issue (@niksa-monday)
New Features
#616 Avatar custom background color (@MosheZemah)
#601 Fix/omri/fix grid keyboard nav story (@laviomri)
Documentation
#610 test(slider): add Thumb drag interaction tests (@niksa-monday)
#612 menu interaction tests (@laviomri)
#607 Color picker interaction tests (@laviomri)
#611 test(Slider): add interaction tests for ranged mode (@niksa-monday)
#596 # ay11 Foundation page Corrections: Update image sizes, add up next section (@3dyonic)
#608 test(Slider): add interaction tests for Slider component (@niksa-monday)
#605 Interaction tests alignments (@laviomri)
#602 Increase default width of left panel (@laviomri)
#603 storybook initials (@orrgottlieb)
#600 fix-typos-in-avatar-story-classnames (@laviomri)
1.21.5 (2022-03-22)
Bug Fixes
#597 Bug/hadas/change combobox msg class (too common) (@hadasfa)
1.21.4 (2022-03-21)
Bug Fixes
#595 Add aria-label to Flex (@Naama-Weber-Monday)
1.21.3 (2022-03-20)
Bug Fixes
#594 fix dark mode issue, sticky issue and add categories story (@hadasfa)
Documentation
#588 feature/omri/multi-interaction-tests-per-story (@laviomri)
1.21.2 (2022-03-17)
Bug Fixes
#586 Fix menu grid item focus after keyboard nav (@hadasfa)
Dependency Upgrades
#592 Move deps to devDependencies (@sahariko)
Documentation
#591 Button prop-types proofreading (@sahariko)
1.21.1 (2022-03-16)
Bug Fixes
#589 Fix combobox spacing issues (@hadasfa)
1.21.0 (2022-03-16)
Bug Fixes
#587 Fix radiobutton check issue (@MosheZemah)
#583 Fix issue with combobox story (@MosheZemah)
#581 Fix issue with hovering combobox hover (@MosheZemah)
New Features
#574 Add virtualized list support to combobox (@hadasfa)
#580 Clear filter on combobox selection (@MosheZemah)
Documentation
#579 PR: Documentation ,Ay11 foundation page (@3dyonic)
Internal Changes
#585 Add menu tests (@MosheZemah)
#582 Interaction tests (@MosheZemah)
1.20.0 (2022-03-10)
New Features
#578 Feature/hadas/checkbox ref (@hadasfa)
Documentation
#562 Add dropdown groups to storybook and change dropdown groups style (@ronachmany-monday)
1.19.3 (2022-03-09)
New Icons
#576 Upgrade icons (@github-actions[bot])
#575 Upgrade icons (@github-actions[bot])
1.19.2 (2022-03-08)
Bug Fixes
#571 Add all icons tests (@MosheZemah)
New Icons
#573 Upgrade icons (@github-actions[bot])
1.19.1 (2022-03-01)
New Icons
#569 Upgrade icons (@github-actions[bot])
1.19.0 (2022-03-01)
New Features
#561 Added menuPlacement prop to Dropdown component (@udidoron)
1.18.4 (2022-03-01)
Bug Fixes
#567 Fix editable heading cursor on disabled (@MosheZemah)
1.18.3 (2022-03-01)
Bug Fixes
#566 Fix editable heading editing while disabled (@MosheZemah)
1.18.2 (2022-02-28)
Bug Fixes
#565 Editable heading callback on blur ignore (@MosheZemah)
1.18.1 (2022-02-28)
Bug Fixes
#564 Allow stop editing for EditableHeading (@MosheZemah)
1.18.0 (2022-02-28)
New Features
#563 Add color prop to Heading and Editable Heading (@MosheZemah)
1.17.2 (2022-02-28)
New Icons
#558 Upgrade monday ui style (@github-actions[bot])
1.17.1 (2022-02-27)
Bug Fixes
#537 Fix tabs list bug - visible focus displayed when clicking out side and then clicking on one tab (@hadasfa)
1.17.0 (2022-02-25)
New Features
#557 Support Heading highlight text (@MosheZemah)
Documentation
#555 Fix stories (@hadasfa)
1.16.0 (2022-02-24)
New Features
#556 Expose use is overflowing hook (@hadasfa)
1.15.0 (2022-02-24)
New Features
#554 Add support on avatar in chip component (@roniCohen123)
1.14.2 (2022-02-23)
New Icons
#553 Upgrade icons (@github-actions[bot])
1.14.1 (2022-02-23)
New Icons
#552 Upgrade icons (@github-actions[bot])
1.14.0 (2022-02-22)
Bug Fixes
#536 combobox disable no result on loading (@roniCohen123)
New Features
#551 Support passing tooltip content to menu item by tooltipContent prop (@etaylib)
1.13.12 (2022-02-20)
New Icons
#549 Update color keys (@github-actions[bot])
1.13.11 (2022-02-20)
Bug Fixes
#548 Fix toggle on change params (@hadasfa)
1.13.10 (2022-02-20)
Bug Fixes
#545 Better support for useDocumentEventListeners on Menu components (@laviomri)
1.13.9 (2022-02-17)
Bug Fixes
#546 Displaying focus properly in toggle component (@hadasfa)
New Icons
#547 Update colors in basic, night themes (@github-actions[bot])
1.13.8 (2022-02-17)
Bug Fixes
#544 Fix bug on toggle cannot be affected by click when in controlled mode (@hadasfa)
1.13.7 (2022-02-16)
Bug Fixes
#543 remove react aria dependecies (@orrgottlieb)
1.13.6 (2022-02-16)
Bug Fixes
#542 remove react button (@orrgottlieb)
1.13.5 (2022-02-16)
Bug Fixes
#541 Set version (@orrgottlieb)
1.13.4 (2022-02-16)
Bug Fixes
#540 Fix font load (@MosheZemah)
1.13.3 (2022-02-16)
Bug Fixes
#539 Flex types (@orrgottlieb)
1.13.2 (2022-02-16)
Bug Fixes
#538 Element type issues (@orrgottlieb)
1.13.1 (2022-02-15)
Bug Fixes
#535 Fix combobox drawer width (@hadasfa)
1.13.0 (2022-02-15)
Bug Fixes
#530 tooltip: removing border from tooltip arrow + adding themes to storybook (@etaylib)
#534 Add chips colors story fixes (@MosheZemah)
New Features
#506 Menu grid item (@laviomri)
#532 Dropdown - add isOptionSelected prop (@ronachmany-monday)
#533 Add chips colors story (@MosheZemah)
#528 add divider to combo box categories (@SagiL96)
1.12.0 (2022-02-13)
New Features
#529 Add virtualized list ref (@MosheZemah)
1.11.2 (2022-02-13)
Dependency Upgrades
#527 Upgrade monday-ui-style (@github-actions[bot])
1.11.1 (2022-02-13)
Bug Fixes
#523 Fix icon button and drop down stories (@hadasfa)
#498 fix: lint fixes (@orrgottlieb)
Dependency Upgrades
#525 Change design system Hebrew font to rubik (@hadasfa)
1.11.0 (2022-02-08)
New Features
#521 Replace typography source to monday-ui-style font variables (@hadasfa)
New Icons
#522 Upgrade icons (@github-actions[bot])
1.10.4 (2022-02-08)
Bug Fixes
#520 Revert " Add typography variables" (@hadasfa)
1.10.3 (2022-02-07)
Bug Fixes
#518 When click on checkbox with shift pressed, shift key is not true in the manual all checkbox events (even if it was true in the original event) (@hadasfa)
1.10.2 (2022-02-07)
Bug Fixes
#517 Tabs focus issue (@orrgottlieb)
Dependency Upgrades
#482 Add typography variables (@hadasfa)
Internal Changes
#482 Add typography variables (@hadasfa)
1.10.1 (2022-02-06)
Bug Fixes
#514 fix support on checkbox click while shift is pressed on firefox browser (@hadasfa)
1.10.0 (2022-02-06)
Bug Fixes
#516 feat: move dependencies to correct area (@orrgottlieb)
New Features
#513 Allow non-monday colors picker (@laviomri)
#512 Disabling activeIndex after a non-keyboard interaction (@laviomri)
#509 ColorPicker - white selected icon, even not on multi selection (@laviomri)
Documentation
#515 Fix OpenGraph description typo (@laviomri)
1.9.0 (2022-02-02)
Bug Fixes
#510 Dropdown with multi - placeholder show condition fix (@yardenli)
#508 Fix selection feedback not showing for single item selection of ColorPicker (@laviomri)
New Features
#502 Menu enhancements (@laviomri)
Documentation
#505 Fix combobox docs (@hadasfa)
Internal Changes
#511 fix/yarden/dropdown-multi-lint-and-tests-fixes (@yardenli)
1.8.4 (2022-02-01)
New Icons
#507 Upgrade icons (@github-actions[bot])
1.8.3 (2022-01-31)
New Icons
#504 Upgrade icons (@github-actions[bot])
1.8.2 (2022-01-31)
Bug Fixes
#503 Fix drop down counter in multi state with single line (@hadasfa)
1.8.1 (2022-01-30)
Bug Fixes
#499 Support placeholder in drop down with multi state (@hadasfa)
#500 Fixed menu item hover (@laviomri)
New Icons
#501 Upgrade icons (@github-actions[bot])
1.8.0 (2022-01-27)
Bug Fixes
#495 fix close when click outside in drop down and display correct options when delete (@hadasfa)
#496 feature/yarden/dropdown-max-height (@yardenli)
#487 fix(slider): change broken padding for slider prefix (@niksa-monday)
#477 Keyboard nav context improvements (@laviomri)
New Features
#493 Disabled indexes for keyboard nav (@laviomri)
#488 Skipping disabled components while navigating (@laviomri)
#479 support ref passing for dropdown (@etaylib)
#480 Added focusItemIndexOnMount to useGridKeyboardNavigation (@laviomri)
Dependency Upgrades
#484 Upgrade icons (@github-actions[bot])
Documentation
#489 Story for ColorPicker shape prop (@laviomri)
#486 added missing proptype + added as action (@laviomri)
Internal Changes
#492 Menu item small refactor (@laviomri)
New Icons
#490 Upgrade icons (@github-actions[bot])
1.7.0 (2022-01-24)
New Features
#472 add option renderer to combobox (@roniCohen123)
#464 Keyboard nav for ColorPicker (@laviomri)
Documentation
#476 Minor fixes in split button story (@hadasfa)
1.6.3 (2022-01-23)
Bug Fixes
#467 support keep open mode for dropdown (@etaylib)
#475 Fix/orr/menu item css fix (@orrgottlieb)
1.6.2 (2022-01-23)
New Icons
#474 Upgrade icons (@github-actions[bot])
1.6.1 (2022-01-23)
Bug Fixes
#473 Use resetAfterIndices (@or-nuri-monday)
1.6.0 (2022-01-23)
Bug Fixes
#469 Focus on editing editable header (@laviomri)
New Features
#470 feat: added 'onInputChange' property to Dropdown (@udidoron)
Internal Changes
#471 feat: fix lint and absolute paths (@orrgottlieb)
1.5.0 (2022-01-20)
Bug Fixes
#468 Feature/ornu/virtualizedgrid/Fix rows and columns calculations (@or-nuri-monday)
New Features
#462 Added GridKeyboardNavigationContext (@laviomri)
#461 Added useGridKeyboardNavigation (@laviomri)
1.4.0 (2022-01-20)
Bug Fixes
#466 Call resetAfterIndices instead of resetAfterIndex (@or-nuri-monday)
#463 AttentionBox with icon on compact mode support & Docs fixes in attention box and typography (@hadasfa)
New Features
#424 feat(slider): create new component - Slider (@niksa-monday)
#465 feat: export and align hooks exposure (@orrgottlieb)
#456 Feature/hadas/flex (@hadasfa)
Documentation
#458 Added optional mapping from action to input props (@laviomri)
1.3.3 (2022-01-18)
Bug Fixes
#460 Fix tabs rendering non active tabs (@MosheZemah)
1.3.2 (2022-01-17)
New Icons
#459 Upgrade icons (@github-actions[bot])
1.3.1 (2022-01-13)
Bug Fixes
#457 fix: Loader issues (@orrgottlieb)
1.3.0 (2022-01-13)
New Features
#443 Adding VirtualizedGrid component (@or-nuri-monday)
Dependency Upgrades
#455 Fix/eslint (@orrgottlieb)
1.2.6 (2022-01-12)
New Icons
#454 Upgrade icons (@github-actions[bot])
1.2.5 (2022-01-12)
Bug Fixes
#453 Fix icon button export (@hadasfa)
#452 Fix dialog hideTriggerIgnoreClass prop type to accept array (@MosheZemah)
1.2.4 (2022-01-11)
Bug Fixes
#450 editable clickable test fix (@ronachmany-monday)
#448 icon button export (@ronachmany-monday)
Documentation
#445 Storybook actions (@laviomri)
New Icons
#449 Upgrade icons (@github-actions[bot])
1.2.3 (2022-01-10)
Bug Fixes
#444 use button to clickable (@ronachmany-monday)
Documentation
#440 Fix stories errors and typos (@hadasfa)
1.2.2 (2022-01-10)
Bug Fixes
#442 fix: Props passing bug in tabs panel (@orrgottlieb)
Documentation
#439 Fixed code example of 'Menu with 2-depth sub menu' (@laviomri)
#438 fix links story controls, add leanylabs as contributors and add few description to props (@hadasfa)
#437 random story fixes (@orrgottlieb)
1.2.1 (2022-01-06)
Bug Fixes
#436 check that element is there (@amirbardugo)
1.2.0 (2022-01-05)
New Features
#430 Create an ESM entry (@sahariko)
Dependency Upgrades
#431 Infra/orr/update deps (@orrgottlieb)
Documentation
#425 New components docs (tabs sub components and hidden text component) (@hadasfa)
New Icons
#434 feat: LearnMore icon (@orrgottlieb)
1.1.0 (2022-01-05)
Bug Fixes
#426 Bugfix : scroll menu if needed (@amirbardugo)
New Features
#432 Enhance use key event (@MosheZemah)
1.0.4 (2022-01-04)
Bug Fixes
#423 Add support on consistent API for all the library components for class name and disabled props (@hadasfa)
1.0.3 (2021-12-30)
Bug Fixes
#420 Fix virtualized list scrollbar visible issue (@MosheZemah)
1.0.2 (2021-12-29)
Bug Fixes
#404 added support for date and date time for input (@etaylib)
1.0.1 (2021-12-29)
Bug Fixes
#417 Change className props to consistent naming (@hadasfa)
#416 Tree-shake the library (@sahariko)
Documentation
#418 Update PULL_REQUEST_TEMPLATE.md (@sahariko)
1.0.0 (2021-12-27)
Breaking Changes
#340 Vibe Design System release
#340 Node Sass as a bunlder
#340 New Documentation
#340 More Hooks
#340 className props unification
#340 Upgrade Storybook
#340 Chromatic Integration
0.14.4 (2021-12-15)
Bug Fixes
#389 added classname to the virtualized list where scrollbars appears (@etaylib)
0.14.3 (2021-12-15)
Bug Fixes
#391 quick fix in the index of color utils (@hadasfa)
#390 Fix bugs on allow multiple on click (@hadasfa)
0.14.2 (2021-12-14)
Bug Fixes
#388 Fix bug on color utils (@hadasfa)
0.14.1 (2021-12-14)
Bug Fixes
#387 export color utils as default object (for fixing error while trying to create new version) (@hadasfa)
0.14.0 (2021-12-14)
Bug Fixes
#386 set default color to tabs titles (@hadasfa)
#384 fix accordion item type check (@hadasfa)
New Features
#385 expose colors-utils (@ofersh-monday)
0.13.1 (2021-12-12)
New Icons
#382 Update damaged icons (@yardenli)
#381 added new icons (@etaylib)
0.13.0 (2021-12-06)
Bug Fixes
#376 added indexes for other idGetter usages (@etaylib)
New Features
#377 add modifiers support to tipseen and tooltip (@hadasfa)
Internal Changes
#378 Fix <Dropdown> test driver (@sahariko)
0.12.1 (2021-12-05)
Bug Fixes
#374 Fix <Dropdown> multi-value bug (@sahariko)
#375 passing index to getter in virtualized list (@etaylib)
0.12.0 (2021-12-05)
New Features
#354 Multiselect component (@sahariko)
New Icons
#373 feat: icons (@orrgottlieb)
0.11.0 (2021-12-01)
Bug Fixes
#370 fix package lock (@hadasfa)
New Features
#369 add MenuButton onClick prop (@shalomscott)
#367 add MenuButton props to control dialog hide/show trigger ignore class (@shalomscott)
New Icons
#368 Update icons (@darbentov)
0.10.1 (2021-12-01)
Bug Fixes
#366 pass event to onclick (@etaylib)
New Icons
#365 Upgrade icons (@github-actions[bot])
0.10.0 (2021-11-30)
New Features
#361 support onclick without navigation (@etaylib)
New Icons
#363 Upgrade icons (@github-actions[bot])
0.9.7 (2021-11-28)
New Icons
#360 Upgrade icons (@github-actions[bot])
0.9.6 (2021-11-28)
Bug Fixes
#358 fix: export Icon component (@orrgottlieb)
0.9.5 (2021-11-24)
New Icons
#357 Upgrade icons (@github-actions[bot])
0.9.4 (2021-11-21)
Bug Fixes
#348 add aria label support for checkbox (@hadasfa)
Documentation
#325 docs : improve documentation for extra styles in (@Muskan777)
0.9.3 (2021-11-18)
Bug Fixes
#350 Fix heading ellipsis issue with 1 line (@MosheZemah)
0.9.2 (2021-11-18)
Bug Fixes
#349 Prevent editable heading from being empty (@MosheZemah)
#346 Rename ButtonContstants file to ButtonConstants file (@KarelVerschraegen)
#344 fix: safari useReszieObserver (@orrgottlieb)
Documentation
#345 Fix typo in useForceUpdate (@KarelVerschraegen)
New Icons
#347 Upgrade icons (@github-actions[bot])
0.9.1 (2021-11-17)
Bug Fixes
#341 fix: callback on mount when should show on mount (@orrgottlieb)
0.9.0 (2021-11-17)
Bug Fixes
#339 amitha/fix/combobox-disable-active-scroll-without-categories (@amit-hanoch)
#328 Add support on className to Checkbox&AttentionBox instead of componentClassName (@hadasfa)
New Features
#335 Tooltip add show/hide events (@ronachmany-monday)
Internal Changes
#310 stylelint rules (@mentaman)
#309 change fixed eslint to error (@mentaman)
0.8.4 (2021-11-15)
Bug Fixes
#333 amitha/fix/text-field-focus-animation-in-dialog (@amit-hanoch)
#332 Combobox: fix the space between the search box to the first option (@amit-hanoch)
0.8.3 (2021-11-14)
Bug Fixes
#331 successIconSize property to determine function success icon size (@yardenli)
0.8.2 (2021-11-14)
Bug Fixes
#330 Fix button initial loading state (@MosheZemah)
0.8.1 (2021-11-11)
Bug Fixes
#327 editable input focus in animation frame (@barcohen2)
0.8.0 (2021-11-07)
New Features
#321 Adding tooltip content option to combobox item (@samitc)
#323 Add support in tipseen component for: submitButtonText & submitButtonOnClick & dismissButtonText & dismissButtonOnClick & hideWhenReferenceHidden (@hadasfa)
0.7.3 (2021-11-04)
Bug Fixes
#322 amitha/feature/dialog-is-reference-hidden (@amit-hanoch)
0.7.2 (2021-11-03)
Bug Fixes
#319 Fix typo (@MosheZemah)
#318 Combobox sticky categories and search width (@MosheZemah)
Documentation
#317 Plop/hadas/tests (@hadasfa)
New Icons
#320 Upgrade icons (@github-actions[bot])
0.7.1 (2021-11-01)
Bug Fixes
#313 Added onClick callback support for AccordionItem (@adirhaz1z)
0.7.0 (2021-11-01)
New Features
#315 add autoFocus to dropdown (@ronachmany-monday)
#314 amitha/feature/combobox-no-results (@amit-hanoch)
0.6.0 (2021-10-31)
Bug Fixes
#312 fix bug on tipseen "isCloseButtonHidden" prop (@hadasfa)
New Features
#308 add support on menu button "tooltip content" and "class name" props and tipseen "move by" (@hadasfa)
#306 amitha/feature/attention-box-close-icon (@amit-hanoch)
0.5.4 (2021-10-27)
Bug Fixes
#304 fix: clean lint erros and remove not needed component (@orrgottlieb)
0.5.3 (2021-10-26)
Bug Fixes
#303 opacity and padding fix (@ronachmany-monday)
Internal Changes
#302 Bump patch version for dependency upgrades (@sahariko)
0.5.2 (2021-10-26)
New Icons
#301 Upgrade icons (@github-actions[bot])
0.5.1 (2021-10-25)
Bug Fixes
#300 fix master tests (@hadasfa)
0.5.0 (2021-10-25)
New Features
#291 Add support for accordion component (@adirhaz1z)
0.4.1 (2021-10-25)
Bug Fixes
#299 amitha/feature/combobox-prevent-scroll (@amit-hanoch)
Internal Changes
#298 Push tags on release script and update CONTRIBUTING.md (@sahariko)
0.4.0 (2021-10-24)
Bug Fixes
#296 fix tests (@MosheZemah)
New Features
#287 Feature: when the prop title is undefined do not draw the monday style attention box component title container (@pedaars)
#266 Feature: add support on "withoutIcon" prop to attention box component (@pedaars)
#294 feat: on option leave/enter combobox (@orrgottlieb)
#293 Feat/orr/custom icon preproccessor (@orrgottlieb)
Internal Changes
#297 Fix release and add tagging (@sahariko)
#295 fix tests (@MosheZemah)
#282 Refactor versioning process (@sahariko)
