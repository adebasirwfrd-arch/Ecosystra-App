---
id: contributing--docs
type: docs
title: "Contributing"
name: "Docs"
importPath: "./src/pages/contributing/contributing.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=contributing--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:06.640Z
---

Contribution Guide

Hi there! We're really excited that you're interested in contributing to Vibe. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

Issue reporting

For new features, suggestions, or general questions, please make sure to create a discussion first.

If you found a bug, please create an issue.

Development Setup

Storybook is used as the project's development environment. You can use it to preview your changes and test components in isolation. To start working locally, run the following command in the root directory:

yarn install
yarn storybook
Copy
Testing

There are several layers of testing, such as unit/component tests, integration, a11y, and end-to-end tests. Every new feature or bug fix should be covered by tests, depending on the type of change.

Please make sure to run tests before submitting your PR:

yarn test
Copy

If snapshot tests fail, and you are sure that the changes are intentional, update them by running:

yarn test:update
Copy
Linting and formatting

We use Prettier for code formatting. Please, make sure to use it in your editor to keep the codebase consistent.

Please make sure to run linting and formatting before submitting your PR:

yarn lint
Copy
Commits

The project is using Conventional Commits to standardize the commit messages, and release new versions automatically according to Semantic Versioning.

Please make sure to follow the convention for creating Pull Requests and commits.

Creating a Pull Request

When creating a PR, please make sure to:

Create a PR title based on the Conventional Commits format
Add a description of the changes you're making, including the motivation for these changes, and any additional context
Link to any related issues or discussions
Make sure that all checks are passed

After submitting your PR, the maintainers will review your changes and provide feedback. If everything is good, your PR will be merged.

We really appreciate your contribution to Vibe! 🚀
