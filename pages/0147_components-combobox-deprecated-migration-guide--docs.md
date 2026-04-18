---
id: components-combobox-deprecated-migration-guide--docs
type: docs
title: "Components/Combobox [Deprecated]/Migration Guide"
name: "Docs"
importPath: "./src/pages/components/Combobox/combobox-migration-guide.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-combobox-deprecated-migration-guide--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:35:59.861Z
---

Combobox Migration Guide
Overview
Why Migrate? ✨
Migration Steps 🚀
Breaking Changes 🚨
Complete Migration Examples
FAQ ❓
Help 🙏
Overview

The Combobox component is deprecated in favor of the new Dropdown's box mode. The box mode provides the same always-visible list functionality with significant improvements in accessibility, performance, and developer experience.

Why Migrate? ✨
Enhanced Accessibility
Proper ARIA attributes and keyboard navigation
Screen reader optimized with clear announcements
Improved focus management and visual indicators
Better form integration with proper label associations
Better Performance
Smaller bundle size through optimized implementation
Improved rendering for large datasets
Automatic virtualization for performance optimization
Better memory usage with optimized re-renders
Enhanced TypeScript Support
Full generic type support with <Item> type parameter
Better type safety for options and callbacks
Comprehensive prop type definitions
IntelliSense improvements for better developer experience
Improved Form Integration
Built-in label, helper text, and error state support
Better validation and required field handling
Proper form field structure and semantics
Native form integration without additional wrappers
Enhanced Features
Sticky group headers with stickyGroupTitle
Custom filtering with filterOption prop
Richer option structures with start/end elements
Better tooltip integration with tooltipProps
Migration Steps 🚀
Quick Migration Example
- import { Combobox } from "@vibe/core";
+ import { Dropdown } from "@vibe/core";

- <Combobox
- placeholder="Search options"
- options={[
-     { id: "1", label: "Option 1" },
-     { id: "2", label: "Option 2" }
- ]}
- onClick={(option) => console.log(option)}
- />

* <Dropdown
* searchable
* boxMode
* placeholder="Search options"
* options={[
*     { value: "1", label: "Option 1" },
*     { value: "2", label: "Option 2" }
* ]}
* onChange={(option) => console.log(option)}
* ariaLabel="Select an option"
* />
1. Update Import Path
- import { Combobox } from "@vibe/core";
+ import { Dropdown } from "@vibe/core";
2. Enable Box Mode and Search

Box mode requires searchable={true} and boxMode={true}:

- <Combobox options={options} />
+ <Dropdown options={options} searchable boxMode />
3. Update Option Data Structure
- const options = [
-   { id: "1", label: "Option 1" },
-   { id: "2", label: "Option 2" }
- ];
+ const options = [
+   { value: "1", label: "Option 1" },
+   { value: "2", label: "Option 2" }
+ ];
4. Update Categories to Groups
- const categories = {
-   cat1: { id: "cat1", label: "Category 1" },
-   cat2: { id: "cat2", label: "Category 2" }
- };
- const options = [
-   { id: "1", label: "Option 1", categoryId: "cat1" },
-   { id: "2", label: "Option 2", categoryId: "cat2" }
- ];
+ const options = [
+   {
+     label: "Category 1",
+     options: [
+       { value: "1", label: "Option 1" }
+     ]
+   },
+   {
+     label: "Category 2",
+     options: [
+       { value: "2", label: "Option 2" }
+     ]
+   }
+ ];
5. Update Callbacks
- <Combobox
-   onClick={(option) => handleSelect(option)}
-   onFilterChanged={(value) => handleSearch(value)}
- />
+ <Dropdown
+   onChange={(option) => handleSelect(option)}
+   onInputChange={(value) => handleSearch(value)}
+ />
Breaking Changes 🚨
Removed Props

These props are no longer available in the new Dropdown box mode:

onOptionHover - Not needed in new implementation
onOptionLeave - Not needed in new implementation
shouldScrollToSelectedItem - Handled automatically
renderOnlyVisibleOptions - Automatic virtualization built-in
searchIcon - Handled automatically
onAddNew - Use menuRenderer for custom "add new" functionality
addNewLabel - Use menuRenderer for custom "add new" functionality
noResultsRenderer - Use noOptionsMessage prop instead (accepts ReactNode)
searchWrapperClassName - Style via main className prop
optionClassName - Use optionRenderer for custom option styling
stickyCategoryClassName - Style via CSS
disableFilter - Simply don't use the searchable prop
optionLineHeight - Handled automatically by the component
Changed Props

These props have been renamed or changed behavior:

id → id - Update structure from {id, label} to {value, label} for options
onClick → onChange - Renamed for consistency with form inputs
onFilterChanged → onInputChange - Renamed for consistency
categories → options (grouped) - Categories become nested group structure
filter → filterOption - Custom filtering with different signature
filterValue → inputValue - For controlled search input
defaultFilter → defaultInputValue - For uncontrolled default search value
clearFilterOnSelection → clearInputOnChange - Renamed for consistency
noResultsMessage → noOptionsMessage - Renamed and accepts ReactNode
optionsListHeight → menuHeight - Renamed for consistency
stickyCategories → stickyGroupTitle - Renamed to match new terminology
withCategoriesDivider → withGroupDivider - Renamed to match new terminology
searchInputAriaLabel → inputAriaLabel - Renamed for consistency
maxOptionsWithoutScroll → maxMenuHeight - Different approach to limiting height
Required New Props

You must add these props to enable box mode:

searchable - Required: Set to true to enable search functionality
boxMode - Required: Set to true to display as always-visible box
New Props (Optional)

These new props provide enhanced functionality:

label - Built-in label support for form integration
helperText - Built-in helper text support
error - Built-in error state support
required - Built-in required field indicator
ariaLabel - Proper accessibility label for the dropdown
tooltipProps - Enhanced tooltip integration
dir - Text direction support (ltr/rtl)
Option Data Structure Changes

The most important breaking change is the option data structure:

- // Combobox: uses "id" property
- const options = [
-   { id: "1", label: "Option 1" },
-   { id: "2", label: "Option 2" }
- ];
+ // Dropdown: uses "value" property
+ const options = [
+   { value: "1", label: "Option 1" },
+   { value: "2", label: "Option 2" }
+ ];
Categories to Groups

Category structure has changed from a flat map to nested groups:

- // Combobox: separate categories object
- const categories = {
-   cat1: { id: "cat1", label: "Category 1" }
- };
- const options = [
-   { id: "1", label: "Option 1", categoryId: "cat1" }
- ];
+ // Dropdown: nested group structure
+ const options = [
+   {
+     label: "Category 1",
+     options: [
+       { value: "1", label: "Option 1" }
+     ]
+   }
+ ];
Complete Migration Examples
Basic Combobox to Box Mode
- <Combobox
-   id="basic-combobox"
-   placeholder="Search people"
-   options={[
-     { id: "1", label: "John Doe" },
-     { id: "2", label: "Jane Smith" }
-   ]}
-   onClick={(option) => setSelected(option)}
-   searchInputAriaLabel="Search for people"
- />
+ <Dropdown
+   id="basic-dropdown"
+   searchable
+   boxMode
+   placeholder="Search people"
+   options={[
+     { value: "1", label: "John Doe" },
+     { value: "2", label: "Jane Smith" }
+   ]}
+   onChange={(option) => setSelected(option)}
+   ariaLabel="Search for people"
+ />
Combobox with Categories to Grouped Dropdown
- const categories = {
-   suggested: { id: "suggested", label: "Suggested" },
-   all: { id: "all", label: "All People" }
- };
-
- <Combobox
-   placeholder="Select person"
-   categories={categories}
-   options={[
-     { id: "1", label: "John", categoryId: "suggested" },
-     { id: "2", label: "Jane", categoryId: "suggested" },
-     { id: "3", label: "Bob", categoryId: "all" }
-   ]}
-   stickyCategories
-   withCategoriesDivider
-   onClick={(option) => setSelected(option)}
- />
+ <Dropdown
+   searchable
+   boxMode
+   placeholder="Select person"
+   options={[
+     {
+       label: "Suggested",
+       options: [
+         { value: "1", label: "John" },
+         { value: "2", label: "Jane" }
+       ]
+     },
+     {
+       label: "All People",
+       options: [
+         { value: "3", label: "Bob" }
+       ]
+     }
+   ]}
+   stickyGroupTitle
+   withGroupDivider
+   onChange={(option) => setSelected(option)}
+   ariaLabel="Select person"
+ />
Combobox with Icons to Dropdown with Elements
- <Combobox
-   placeholder="Select option"
-   options={[
-     {
-       id: "1",
-       label: "Email",
-       leftRenderer: () => <Email />
-     },
-     {
-       id: "2",
-       label: "Send",
-       leftRenderer: () => <Send />
-     }
-   ]}
-   onClick={(option) => setSelected(option)}
- />
+ <Dropdown
+   searchable
+   boxMode
+   placeholder="Select option"
+   options={[
+     {
+       value: "1",
+       label: "Email",
+       startElement: { type: "icon", value: Email }
+     },
+     {
+       value: "2",
+       label: "Send",
+       startElement: { type: "icon", value: Send }
+     }
+   ]}
+   onChange={(option) => setSelected(option)}
+   ariaLabel="Select option"
+ />
Combobox with Custom Filter
- <Combobox
-   options={options}
-   filter={(filterValue, options) => {
-     return options.filter(opt =>
-       opt.label.toLowerCase().includes(filterValue.toLowerCase())
-     );
-   }}
-   onClick={(option) => setSelected(option)}
- />
+ <Dropdown
+   searchable
+   boxMode
+   options={options}
+   filterOption={(option, inputValue) => {
+     return option.label.toLowerCase().includes(inputValue.toLowerCase());
+   }}
+   onChange={(option) => setSelected(option)}
+   ariaLabel="Select option"
+ />
Combobox with "Add New" Functionality
- <Combobox
-   options={options}
-   onAddNew={(value) => {
-     const newOption = { id: Date.now(), label: value };
-     setOptions([...options, newOption]);
-   }}
-   addNewLabel={(value) => `Add "${value}"`}
-   onClick={(option) => setSelected(option)}
- />
+ <Dropdown
+   searchable
+   boxMode
+   options={options}
+   onChange={(option) => setSelected(option)}
+   menuRenderer={({ children, filteredOptions }) => (
+     <>
+       {children}
+       {filteredOptions.length === 0 && inputValue && (
+         <Button onClick={() => {
+           const newOption = { value: Date.now(), label: inputValue };
+           setOptions([...options, newOption]);
+         }}>
+           Add "{inputValue}"
+         </Button>
+       )}
+     </>
+   )}
+   ariaLabel="Select or create option"
+ />
Form Integration Example

One of the biggest improvements is built-in form field support:

- <div>
-   <label htmlFor="person-combobox">Select Person</label>
-   <Combobox
-     id="person-combobox"
-     options={options}
-     onClick={(option) => setSelected(option)}
-   />
-   <span className="helper-text">Choose a person to assign</span>
-   {error && <span className="error">{error}</span>}
- </div>
+ <Dropdown
+   id="person-dropdown"
+   searchable
+   boxMode
+   label="Select Person"
+   helperText="Choose a person to assign"
+   error={error}
+   required
+   options={options}
+   onChange={(option) => setSelected(option)}
+   ariaLabel="Select person"
+ />
FAQ ❓

Q: When should I migrate to Dropdown box mode? A: We recommend migrating when updating your codebase or when you need the enhanced accessibility and performance features. The new implementation is production-ready.

Q: Will Combobox be removed? A: Yes, Combobox will be removed in Vibe 4. We'll provide ample notice and migration support.

Q: Can I use both Combobox and Dropdown box mode during migration? A: Yes, you can use both during the migration period. Migrate components incrementally at your own pace.

Q: What if I have a large number of Combobox instances? A: Start with new features and gradually migrate existing ones. The migration is straightforward and can be done incrementally.

Q: Are there any features missing from Dropdown box mode? A: Dropdown box mode covers all major use cases. If you're using advanced Combobox features, check the prop migration reference or reach out for help.

Help 🙏

If you have any questions, feedback, or need help with migration, please don't hesitate to reach out:

GitHub Issues: Report issues
GitHub Discussions: Ask questions
