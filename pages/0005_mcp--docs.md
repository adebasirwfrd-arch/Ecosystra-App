---
id: mcp--docs
type: docs
title: "MCP"
name: "Docs"
importPath: "./src/pages/mcp/mcp.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=mcp--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:30:59.451Z
---

MCP Server

The Vibe MCP server enables AI assistants to interact intelligently with the Vibe Design System. Whether you're building components, migrating code, or exploring design tokens, MCP provides the context your AI needs to help you work more efficiently.

Overview

Model Context Protocol is an open standard that enables AI assistants to securely connect to external data sources and tools. The Vibe MCP server provides powerful tools that give AI assistants comprehensive access to the Vibe ecosystem.

Available Tools
Component Discovery
get-vibe-component-metadata - Get comprehensive metadata for any Vibe component
list-vibe-public-components - Browse all available public components in the Vibe ecosystem
get-vibe-component-accessibility - Get accessibility requirements and guidelines for Vibe components
Code Examples
get-vibe-component-examples - Access React implementation examples and best practices
Design System Resources
list-vibe-icons - Explore the complete Vibe icon library with smart filtering
list-vibe-tokens - Access design tokens for consistent styling
Migration Assistant
v4-migration - Advanced project analysis for Vibe 3 → Vibe 4 migration
v3-migration - Advanced project analysis for Vibe 2 → Vibe 3 migration
dropdown-migration - Tool for migrating from old Dropdown to new Dropdown
Tool Reference
get-vibe-component-metadata

Use cases:

Understand component APIs
Discover available props
Check component compatibility
list-vibe-public-components

Use cases:

Explore available components
Find alternatives to custom solutions
Discover new component releases
Component ecosystem overview
get-vibe-component-examples

Perfect for:

Learning component patterns
Understanding proper usage
Copy-paste ready code snippets
Implementation guidance
list-vibe-icons

Features:

270+ available icons
Category filtering (Basic, Platform, View)
Text search across names and tags
Usage examples included
React component imports
list-vibe-tokens

Includes:

Color tokens (all themes)
Spacing and layout tokens
Border radius values
Motion and timing tokens
v4-migration

This tool analyzes your entire project and provides:

Comprehensive project scanning - Identifies all Vibe component usage
Breaking change detection - Highlights components that need updates for Vibe 4
Migration command generation - Provides ready-to-run codemod commands
Detailed migration report - Complete analysis with recommendations
🤓
Migration Made Easy

The migration tool follows the official Vibe 4 migration guide and generates precise codemod commands to automate most of the migration process.

v3-migration

This tool analyzes your entire project and provides:

Comprehensive project scanning - Identifies all Vibe component usage
Breaking change detection - Highlights components that need updates
Migration command generation - Provides ready-to-run codemod commands
Detailed migration report - Complete analysis with recommendations
🤓
Migration Made Easy

The migration tool follows the official Vibe 3 migration guide and generates precise codemod commands to automate most of the migration process.

dropdown-migration

Specialized migration assistant for upgrading from the old Dropdown component to the new Dropdown available in @vibe/core.

Key capabilities:

Import path analysis - Identifies old @vibe/core Dropdown imports that need updating
Option structure detection - Finds { id, text } patterns that need conversion to { value, label }
Breaking changes identification - Detects usage of removed props and changed behaviors
Comprehensive project scanning - Analyzes entire codebase for Dropdown-related code patterns
Detailed migration recommendations - Provides step-by-step guidance with specific file locations
Installation
For Cursor Users

Or manually add to your ~/.cursor/mcp.json:

{
  "mcpServers": {
    "vibe": {
      "command": "npx",
      "args": ["-y", "@vibe/mcp"]
    }
  }
}
Copy
For VSCode Users

Click this link to auto-configure, or manually add to your .vscode/mcp.json:

{
  "servers": {
    "vibe": {
      "command": "npx",
      "args": ["-y", "@vibe/mcp"]
    }
  }
}
Copy
Usage Examples
Component Development

Ask your AI assistant: "I need a button that shows a loading state"

The MCP will:

Find Button component metadata
Show loading prop usage examples
Provide accessibility guidelines
Icon Discovery

Ask your AI assistant: "Find icons related to calendar or scheduling"

The MCP will:

Search icon library with "calendar" query
Return matching icons with usage examples
Include import statements and props
Design Token Usage

Ask your AI assistant: "What spacing tokens are available for margins?"

The MCP will:

Filter tokens by "spacing" category
Show all margin-related design tokens
Provide CSS custom property usage
Migration to v4

Ask your AI assistant: "Help me migrate this React project from Vibe 3 to Vibe 4"

The MCP will:

Analyze entire project structure
Identify breaking changes and deprecated component usage
Generate specific codemod commands
Provide step-by-step recommendations
Migration to v3

Ask your AI assistant: "Help me migrate this React project from Vibe 2 to Vibe 3"

The MCP will:

Analyze entire project structure
Identify deprecated component usage
Generate specific migration commands
Provide step-by-step recommendations
Dropdown Migration

Ask your AI assistant: "Help me migrate my Dropdown components to the new version"

The MCP will:

Scan for all Dropdown imports and usage patterns
Detect removed props and changed behaviors
Provide detailed migration steps with file-specific recommendations
Benefits
Faster development - Skip documentation lookup with instant access to component APIs
Accurate guidance - Get precise, up-to-date information directly from the source
Seamless migration - Automate complex migration tasks with intelligent analysis
Design consistency - Ensure proper design token usage across your application
Contributing

The Vibe MCP server repository is open source and welcomes contributions!

Ways to contribute:

Report bugs or issues
Suggest new tools or features
Improve documentation
Submit pull requests for new features
