Tabs
Tabs allow users to navigate between related views of content while remaining in the context of the page.

import { Tabs, TabPanel, TabPanels, TabList, Tab, TabsContext } from "@vibe/core";

<TabsContext id="overview-tabs">
  <TabList id="overview-tab-list">
    <Tab id="overview-tab-first">
      First
    </Tab>
    <Tab id="overview-tab-second">
      Second
    </Tab>
    <Tab id="overview-tab-third">
      Third
    </Tab>
  </TabList>
  <TabPanels id="overview-tab-panels">
    <TabPanel id="overview-panel-first">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          height: '111px',
          width: '480px'
        }}
      >
        First slide
      </Box>
    </TabPanel>
    <TabPanel id="overview-panel-second">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          height: '111px',
          width: '480px'
        }}
      >
        Second slide
      </Box>
    </TabPanel>
    <TabPanel id="overview-panel-third">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          height: '111px',
          width: '480px'
        }}
      >
        Third slide
      </Box>
    </TabPanel>
  </TabPanels>
</TabsContext>

Usage
Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy.
Align navigation tabs and content tabs left (in left-to-right languages) and never center within a page or content area.
The first tab is selected by default. The default tab is most important use case of the page.
Stick to only one row of tabs.

Accessibility
Provide an id for the TabList and individual Tab components to enable proper accessibility associations and unique identification.
Ensure each Tab has clear, descriptive text content or appropriate icon with accessible name to indicate what content will be displayed when selected.
Use the tabPanelIds prop in TabList to establish proper relationships between tabs and their corresponding tab panels. Pass an array of TabPanel IDs in the same order as the tabs.
Provide unique id props for each TabPanel to enable the aria-controlsrelationships established by the tabs.
Variants
Default - compact tabs

<TabsContext id="default-tabs">
  <TabList id="default-tab-list">
    <Tab id="default-tab-first">First</Tab>
    <Tab id="default-tab-second">Second</Tab>
    <Tab id="default-tab-third">Third</Tab>
    <Tab id="default-tab-disabled" disabled>
      Disabled
    </Tab>
  </TabList>
  <TabPanels id="default-tab-panels">
    <TabPanel id="default-panel-first">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        First slide
      </Box>
    </TabPanel>
    <TabPanel id="default-panel-second">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        Second slide
      </Box>
    </TabPanel>
    <TabPanel id="default-panel-third">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        Third slide
      </Box>
    </TabPanel>
    <TabPanel id="default-panel-fourth">
      <Box
        backgroundColor="greyBackgroundColor"
        padding="medium"
        style={{
          width: "480px",
          height: "111px",
        }}
      >
        Fourth slide
      </Box>
    </TabPanel>
  </TabPanels>
</TabsContext>

