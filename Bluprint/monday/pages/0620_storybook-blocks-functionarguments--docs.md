---
id: storybook-blocks-functionarguments--docs
type: docs
title: "Storybook Blocks/FunctionArguments"
name: "Docs"
importPath: "../storybook-blocks/src/components/function-arguments/__stories__/function-arguments.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=storybook-blocks-functionarguments--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:52:56.141Z
---

FunctionArguments
Overview

The FunctionArgument component is used to display details of function arguments in a react component. It allows you to provide the name, type, and description of the argument. Additionally, you can specify whether the argument is required and provide a default value if applicable.

argumenttype - Description of the argument
callback(event: Event) => void* - Callback function to execute when the event is fired.
countnumber* - The number of items to process. Defaults to: 0
Show code
Props
Name	Description	Default	
Control

children	
object
	-	
RAW
children : {
$$typeof : Symbol(react.element)
type : ({children:n,name:o,type:d,description:a,default:c,required:l})=>e.jsxs("li",{className:r.argument,children:[o&&e.jsx("code",{className:r["argument-name"],children:o}),e.jsx("code",{className:r["argument-type"],children:d}),l&&e.jsx("span",{className:r.required,children:"*"}),a&&e.jsxs(e.Fragment,{children:[" - ",a]}),c&&e.jsxs(e.Fragment,{children:[" ","Defaults to: ",e.jsx("code",{children:c})]}),n&&e.jsx("ul",{children:n})]})
key : null
ref : null
props : {...} 4 keys
_owner : null
}
