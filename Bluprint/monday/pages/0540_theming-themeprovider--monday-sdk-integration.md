---
id: theming-themeprovider--monday-sdk-integration
type: story
title: "Theming/ThemeProvider"
name: "monday.com SDK integration"
importPath: "./src/pages/components/ThemeProvider/ThemeProvider.stories.tsx"
iframeUrl: https://vibe.monday.com/iframe.html?id=theming-themeprovider--monday-sdk-integration&viewMode=story
extractedWith: #storybook-root
scrapedAt: 2026-04-17T16:50:27.695Z
---

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
