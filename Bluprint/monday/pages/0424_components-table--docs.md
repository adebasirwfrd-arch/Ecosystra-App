---
id: components-table--docs
type: docs
title: "Components/Table"
name: "Docs"
importPath: "./src/pages/components/Table/Table.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-table--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:46:49.371Z
---

Table

Tables are used to organize data, making it easier to understand.

Sent on
Subject
Sent by
Status
Emails sent
2020-01-01
Lorem ipsum dolor
JD
Sent
100
2023-03-03
This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
SP
Sent
999
2022-02-02
This is the subject
ON
Sent
99
Show code
Import
import { Table, TableHeader, TableHeaderCell TableBody, TableRow, TableCell } from "@vibe/core";
Copy
Props
TableTableHeaderTableHeaderCellTableBodyTableRowTableCellTableVirtualizedBody
Name	Description	Default	
Control

children	
The child components inside the table, such as <TableHeader /> and <TableBody />.
ReactElement<TableHeaderProps, string | JSXElementConstructor<any>> | ReactElement<TableBodyProps, string | JSXElementConstructor<...>> | (ReactElement<...> | ReactElement<...>)[]
	-	-
className	
A CSS class name to apply to the component.
string
	-	Set string
columns*	
Defines the columns of the table.
TableColumn[]
	-	Set object
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
dataState	
State of the data being displayed (loading or error).
{ isLoading?: boolean; isError?: boolean; }
	-	Set object
emptyState*	
React element displayed when there is no data.
ReactElement<any, string | JSXElementConstructor<any>>
	-	-
errorState*	
React element displayed when there is an error state.
ReactElement<any, string | JSXElementConstructor<any>>
	-	-
id	
An HTML id attribute for the component.
string
	-	Set string
size	
The row size of the table.
RowSizes
	
medium
	Set object
style	
Custom styles for the table.
CSSProperties
	-	Set object
withoutBorder	
If true, removes the table's outer border.
boolean
	-	Set boolean
Variants
Sizes

The table is available in 3 different row heights: small (32px) medium (40px) and large (48 px). Medium size is the default size.

Sent on
Subject
2020-01-01
Lorem ipsum dolor
2022-02-02
This is the subject
Sent on
Subject
2020-01-01
Lorem ipsum dolor
2022-02-02
This is the subject
Sent on
Subject
2020-01-01
Lorem ipsum dolor
2022-02-02
This is the subject
Story Editor
() => {
  const columns: TableColumn[] = [
    {
      id: "sentOn",
      title: "Sent on",
      loadingStateType: "medium-text",
    },
    {
      id: "subject",
      title: "Subject",
      loadingStateType: "long-text",
    },
  ];
  const data = [
    {
      id: 1,
      sentOn: "2020-01-01",
      subject: "Lorem ipsum dolor",
    },
    {
      id: 2,
      sentOn: "2022-02-02",
      subject: "This is the subject",
    },
  ];
  return (
    <>
      <Table
        id="sizes-small-table"
        style={{
          width: "auto",
        }}
        size="small"
        errorState={
          <h1
            style={{
Copy
Format
Reset
Borders

The table is available with or without an outer border. When using a table inside another component (like a modal or dialog), remove the table's outer border for a cleaner look.

Sent on
Subject
Sent by
Status
Emails sent
2020-01-01
Lorem ipsum dolor
JD
Sent
100
2023-03-03
This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
SP
Sent
999
2022-02-02
This is the subject
ON
Sent
99
Sent on
Subject
Sent by
Status
Emails sent
2020-01-01
Lorem ipsum dolor
JD
Sent
100
2023-03-03
This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
SP
Sent
999
2022-02-02
This is the subject
ON
Sent
99
Story Editor
() => {
  const columns: TableColumn[] = [
    {
      id: "sentOn",
      title: "Sent on",
      width: 150,
      loadingStateType: "medium-text",
    },
    {
      id: "subject",
      title: "Subject",
      loadingStateType: "long-text",
    },
    {
      id: "sentBy",
      title: "Sent by",
      width: {
        min: 120,
        max: 200,
      },
      infoContent: "This is the sender",
      loadingStateType: "circle",
    },
    {
      id: "status",
      title: "Status",
      width: 150,
      infoContent: "Info content for the status column",
      loadingStateType: "medium-text",
    },
    {
      id: "emailsSent",
      title: "Emails sent",
      width: 150,
      loadingStateType: "medium-text",
    },
Copy
Format
Reset
Table header functionality

Sorting, Icons and Information added to selected columns

Sent on
Subject
Sent by
Status
Emails sent
2020-01-01
Lorem ipsum dolor
JD
Sent
100
2022-02-02
This is the subject
ON
Sent
99
2023-03-03
This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
SP
Sent
999
Story Editor
() => {
  const [tableData, setTableData] = useState(emailTableData);
  const [sorting, setSorting] = useState<{
    [key: string]: "asc" | "desc" | "none";
  }>({});
  const onSort = (columnId: string, sortState: "asc" | "desc" | "none") => {
    setSorting({
      [columnId]: sortState,
    });
    setTableData(
      sort(columnId as keyof (typeof tableData)[number], sortState, tableData)
    );
  };
  return (
    <Table
      errorState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Error State
        </h1>
      }
      emptyState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Empty State
        </h1>
      }
      columns={emailColumns}
    >
      <TableHeader>
Copy
Format
Reset
Loading

Using skeleton

Sent on
Subject
Sent by
Status
Emails sent
Story Editor
<Table
  dataState={{
    isLoading: true,
  }}
  errorState={
    <h1
      style={{
        textAlign: "center",
      }}
    >
      Error State
    </h1>
  }
  emptyState={
    <h1
      style={{
        textAlign: "center",
      }}
    >
      Empty State
    </h1>
  }
  columns={emailColumns}
>
  <TableHeader>
    {emailColumns.map((headerCell, index) => (
      <TableHeaderCell key={index} title={headerCell.title} />
    ))}
  </TableHeader>
  <TableBody>
    {emailTableData.map(rowItem => (
      <TableRow key={rowItem.id}>
        <TableCell>{rowItem.sentOn}</TableCell>
        <TableCell>{rowItem.subject}</TableCell>
        <TableCell>
          <TableAvatar text={rowItem.sentBy} />
Copy
Format
Reset
Scroll

Table with both vertical and horizontal scroll

Sent on
Priority
Subject
Sent by
Status
Emails sent
2020-01-01
Urgent
Lorem ipsum dolor
JD
In progress
100
2020-02-02
High
Dolor sit amet
JD
In progress
50
2020-03-03
Normal
Consectetur adipiscing elit
PS
Queued
0
2020-04-04
Low
Sed do eiusmod tempor incididunt
SJ
Failed
200
2020-05-05
Urgent
Ut labore et dolore magna aliqua
DB
Sent
150
2020-06-06
High
Et harum quidem rerum facilis est et expedita distinctio
MJ
Sent
75
Story Editor
<div
  style={{
    height: 220,
    width: "100%",
  }}
>
  <Table
    errorState={
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Error State
      </h1>
    }
    emptyState={
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Empty State
      </h1>
    }
    columns={scrollTableColumns}
  >
    <TableHeader>
      {scrollTableColumns.map((headerCell, index) => (
        <TableHeaderCell key={index} title={headerCell.title} />
      ))}
    </TableHeader>
    <TableBody>
      {scrollTableData.map(rowItem => (
        <TableRow key={rowItem.id}>
          <TableCell>{rowItem.sentOn}</TableCell>
Copy
Format
Reset
Virtualized Scroll

This is an example of a table with 5000 rows

🤓
Tip

The row element returned by rowRenderer must accept a style prop. This is required for react-window to position rows correctly. If rows appear stacked or scrolling breaks, ensure your row component doesn't ignore or override the style prop.

ID
Name
Email
Column 1
Column 2
Column 3
Column 4
Column 5
Column 6
Column 7
Column 8
Column 9
Column 10
0
User0
user0@example.com
Value 0-1
Value 0-2
Value 0-3
Value 0-4
Value 0-5
Value 0-6
Value 0-7
Value 0-8
Value 0-9
Value 0-10
1
User1
user1@example.com
Value 1-1
Value 1-2
Value 1-3
Value 1-4
Value 1-5
Value 1-6
Value 1-7
Value 1-8
Value 1-9
Value 1-10
2
User2
user2@example.com
Value 2-1
Value 2-2
Value 2-3
Value 2-4
Value 2-5
Value 2-6
Value 2-7
Value 2-8
Value 2-9
Value 2-10
3
User3
user3@example.com
Value 3-1
Value 3-2
Value 3-3
Value 3-4
Value 3-5
Value 3-6
Value 3-7
Value 3-8
Value 3-9
Value 3-10
4
User4
user4@example.com
Value 4-1
Value 4-2
Value 4-3
Value 4-4
Value 4-5
Value 4-6
Value 4-7
Value 4-8
Value 4-9
Value 4-10
5
User5
user5@example.com
Value 5-1
Value 5-2
Value 5-3
Value 5-4
Value 5-5
Value 5-6
Value 5-7
Value 5-8
Value 5-9
Value 5-10
6
User6
user6@example.com
Value 6-1
Value 6-2
Value 6-3
Value 6-4
Value 6-5
Value 6-6
Value 6-7
Value 6-8
Value 6-9
Value 6-10
Story Editor
() => {
  const Row = (data: (typeof virtualizedScrollTableData)[number]) => {
    return (
      <TableRow>
        {virtualizedScrollTableColumns.map(column => {
          return (
            <TableCell sticky={column.id === "id"} key={column.id}>
              {data[column.id as keyof typeof data]}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };
  const Header = React.useCallback((columns: TableColumn[]) => {
    return (
      <TableHeader>
        {columns.map((cell, index) => (
          <TableHeaderCell sticky={index === 0} key={index} {...cell} />
        ))}
      </TableHeader>
    );
  }, []);
  return (
    <Table
      errorState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Error State
        </h1>
      }
      emptyState={
        <h1
Copy
Format
Reset
Sticky column

Use sticky column in your table when you want to keep specific column visible while the users scroll horizontally.

Project name
Status
Description
Created on
Emails sent
Owner
Priority
Category
Due Date
Comments
Limited time offer
In progress
This is description 1
2024-07-03
100
John Doe
High
Marketing
2024-08-15
This project needs to be prioritized due to upcoming deadline.
Action required
In progress
This is description 2
2024-07-08
150
Jane Smith
Medium
Sales
2024-08-20
Waiting for client feedback.
Cancellation request
Done
This is description 3
2024-07-12
300
Mark Johnson
Low
Support
2024-07-25
Completed without issues.
Limited time offer
Stuck
This is description 4
2024-08-06
50
Lucy Brown
High
Marketing
2024-09-01
Blocked by vendor issues.
Cancellation request
Done
This is description 5
2024-09-05
400
Alan Turing
Low
Support
2024-09-10
Resolved, no further action required.
Story Editor
() => {
  return (
    <Table
      errorState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Error State
        </h1>
      }
      emptyState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Empty State
        </h1>
      }
      columns={stickyColumns}
    >
      <TableHeader>
        {stickyColumns.map((headerCell, index) => (
          <TableHeaderCell
            sticky={index === 0}
            key={index}
            title={headerCell.title}
          />
        ))}
      </TableHeader>
      <TableBody>
        {stickyTableData.map(rowItem => (
          <TableRow key={rowItem.id}>
            <TableCell sticky>{rowItem.projectName}</TableCell>
Copy
Format
Reset
Highlighted row

Use a highlighted row to mark a single row of the table. A highlighted row allows adding additional information for the entire row, using a system trigger such as a side-panel or model.

Sent on
Subject
Sent by
Status
Emails sent
2020-01-01
Lorem ipsum dolor
JD
Sent
100
2022-02-02
This is the subject
ON
Sent
99
2023-03-03
This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
SP
Sent
999
Story Editor
() => {
  const shouldRowBeHighlighted = (rowItem: (typeof emailTableData)[number]) => {
    return rowItem.id === "2";
  };
  return (
    <Table
      errorState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Error State
        </h1>
      }
      emptyState={
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Empty State
        </h1>
      }
      columns={emailColumns}
    >
      <TableHeader>
        {emailColumns.map((headerCell, index) => (
          <TableHeaderCell key={index} title={headerCell.title} />
        ))}
      </TableHeader>
      <TableBody>
        {emailTableData.map(rowItem => (
          <TableRow
            key={rowItem.id}
            highlighted={shouldRowBeHighlighted(rowItem)}
Copy
Format
Reset
Do’s and Don’ts
Sent on
Subject
Status
Apr 22
Limited time offer: AP Process
In progress
Apr 22
Action required: Update your AP
Queued
Apr 22
Limited time offer: AP Process
Sent
Do
If there’s a need to insert an icon, use for all columns.
Sent on
Subject
Status
Apr 22
Limited time offer: AP Process
In progress
Apr 22
Action required: Update your AP
Queued
Apr 22
Limited time offer: AP Process
Sent
Don't
Don't use icons if not applied to all columns titles.
Sent on
Subject
Emails sent
2020-01-01
Lorem ipsum dolor
100
2022-02-02
This is the subject
99
2023-03-03
This is another subject
999
Do
If there’s a need, remove only the outer border.
Sent on
Subject
Emails sent
2020-01-01
Lorem ipsum dolor
100
2022-02-02
This is the subject
99
2023-03-03
This is another subject
999
Don't
Don't remove border between the rows.
Related components
New
Label
Offers content classification.
IconButton
When you want to have a button with just an Icon
Skeleton
Skeleton loading componet used to indicate content and ui loading.
