---
id: theming-themeprovider--docs
type: docs
title: "Theming/ThemeProvider"
name: "Docs"
importPath: "./src/pages/components/ThemeProvider/ThemeProvider.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=theming-themeprovider--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:50:13.026Z
---

ThemeProvider

This component helps to customize the colors of library's components by overriding a specific css variables with a values provided within themeConfig object. There are 2 levels of theming: system theme and product theme. System theme is a one of a 3 predefined themes: light(.light-app-theme), dark(.dark-app-theme) and black(.black-app-theme). Product theme is a custom theme that can be provided by a user, there you can specify the values of specific color tokens for each of the system themes.

Themed
Show code
Import
import { ThemeProvider } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

children*	
The children to be rendered with the applied theme.
ReactElement<any, string | JSXElementConstructor<any>>
	-	Set object
className	
Class name applied to the wrapping div.
string
	-	Set string
systemTheme	

The system theme to apply to the body element on mount, if there is no system theme class name on the body already.

SystemTheme
	-	Set object
themeClassSpecifier	

A string added to the theme name selector to make it more specific, in case themeConfig.name collides with another class name.

string
	-	Set string
themeConfig	

The theme configuration to apply. It consists of a name (a unique CSS class name added to the children) and an object of color overrides for each system theme.

Theme
	-	
RAW
themeConfig : {
name : "overview-theme"
colors : {...} 3 keys
}
Usage
Control themes in your application by setting theme classes (e.g. .light-app-theme) on your body and render everything else inside it. Or use systemTheme prop to make ThemeProvider set the theme class on the body for you.
In most common case ThemeProvider should be rendered only once on the root level of the application - below the body.
ThemeProvider is populating theme name className to the new added div container which wraps the children.
🤓
Dev tip
Use ThemeProvider.systemThemes and ThemeProvider.colors enums to unleash the power of auto-completion
Variants

There are 3 system themes light, dark and black, and in each you can redefine the values of the following color tokens:

Colors eligible for theming
primary-color
Use to emphasise main ui components
primary-hover-color
Use only as a hover on primary color
primary-selected-color
Use to indicate selected state of primary items
primary-selected-hover-color
Use to indicate hover state on a primary-selected-color items
primary-selected-on-secondary-color
Use to indicate selected state of primary items on secondary background color
text-color-on-primary
Use for text on primary color
brand-color
brand-hover-color
brand-selected-color
brand-selected-hover-color
text-color-on-brand
Show code
Use cases and examples
Theming scope

Only components wrapped with ThemeProvider will be affected by the themeConfig.

Themed
Not themed
Show code
Folded theming

If component is wrapped with multiple ThemeProviders, the most nested one will override the values of the outer one, but if the nested ThemeProvider doesn't provide a value for a specific color token, the outer ThemeProvider will be used.

Themed
Show code
Product theming

These are theme-definitions, which are used in monday.com products.

No theme selected
Themed
Themed branded
Show code
Custom class selector

If you need to apply some of the tokens overrides only on elements under specific class you can declare theme like that:

Themed
Themed by custom class
Show code
With systemTheme

In case there is not system theme defined on body tag (or on any other element upper in DOM hierarchy), you can pass it as a prop to ThemeProvider. It will set the systemTheme on body tag and will apply the corresponding theme.

Themed
Show code
Integration with monday.com SDK in external applications
When developing an external application for monday.com (iframe). You can use ThemeProvider in combination with the 
monday.com SDK
, to apply monday.com system and product themes to your application. This will allow your application to be consistent with the monday.com UI.
import { ThemeProvider } from "@vibe/core";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

const useGetContext = () => {
  const [context, setContext] = useState({});
  
  useEffect(() => {
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);
  
  return context;
};

const AppWrapper = () => {
  const context = useGetContext();

  return (
    <ThemeProvider themeConfig={context.themeConfig} systemTheme={context.theme}>
      <App />
    </ThemeProvider>
  );
};
Copy
Show code
Do’s and Don’ts
Hover me
Do
Pay attention and override all semantically close tokens, if needed.
Hover me
Don't
Don’t override only specific tokens to avoid inconsistent appearance
