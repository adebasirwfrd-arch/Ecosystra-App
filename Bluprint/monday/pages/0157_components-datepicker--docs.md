---
id: components-datepicker--docs
type: docs
title: "Components/DatePicker"
name: "Docs"
importPath: "./src/pages/components/DatePicker/DatePicker.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=components-datepicker--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:36:19.829Z
---

DatePicker

A simple and reusable Datepicker component

May
2023
Su	Mo	Tu	We	Th	Fr	Sa

30
	
1
	
2
	
3
	
4
	
5
	
6


7
	
8
	
9
	
10
	
11
	
12
	
13


14
	
15
	
16
	
17
	
18
	
19
	
20


21
	
22
	
23
	
24
	
25
	
26
	
27


28
	
29
	
30
	
31
	
1
	
2
	
3


4
	
5
	
6
	
7
	
8
	
9
	
10
Show code
Import
import { DatePicker } from "@vibe/core";
Copy
Props
Name	Description	Default	
Control

className	
A CSS class name to apply to the component.
string
	-	Set string
data-testid	
A unique identifier for testing purposes.
string
	-	Set string
date*	
Date
	-	Set object
dayClassName	
string
	-	Set string
dialogContainerSelector	
string
	-	Set string
dropdownsClassName	
string
	-	Set string
endDate	
Date
	-	Set object
firstDayOfWeek	
0
2
1
4
3
5
6
	
0
	
Choose option...
0
1
2
3
4
5
6

id	
An HTML id attribute for the component.
string
	-	Set string
intent	
Intent
	
to
	Set object
isDateDisabled	
(date: Date) => boolean
	-	-
locale	
Locale
	-	Set object
mode	
"single"
"range"
	
single
	
single
range

monthSelectionAriaLabel	
string
	
"Month"
	Set string
nextButtonAriaLabel	
string
	
"Next"
	Set string
onDateChange*	
((date: Date) => void) | ((range: DatePickerRange) => void)
	-	-
prevButtonAriaLabel	
string
	
"Previous"
	Set string
selectedDayClassName	
string
	-	Set string
showWeekNumber	
boolean
	-	Set boolean
yearSelectionAriaLabel	
string
	
"Year"
	Set string
Usage
When picking a single or range of dates is required
Displaying past, present and future dates
Variants
Single day

Allows users to select a single date

May
2023
Su	Mo	Tu	We	Th	Fr	Sa

30
	
1
	
2
	
3
	
4
	
5
	
6


7
	
8
	
9
	
10
	
11
	
12
	
13


14
	
15
	
16
	
17
	
18
	
19
	
20


21
	
22
	
23
	
24
	
25
	
26
	
27


28
	
29
	
30
	
31
	
1
	
2
	
3


4
	
5
	
6
	
7
	
8
	
9
	
10
Story Editor
() => {
  const [date, setDate] = useState(new Date("2023-05-01"));
  return (
    <DialogContentContainer>
      <DatePicker id="single-day-picker" date={date} onDateChange={setDate} />
    </DialogContentContainer>
  );
}
Copy
Format
Reset
Date range

Allows users to select a date range

May
2023
Su	Mo	Tu	We	Th	Fr	Sa

30
	
1
	
2
	
3
	
4
	
5
	
6


7
	
8
	
9
	
10
	
11
	
12
	
13


14
	
15
	
16
	
17
	
18
	
19
	
20


21
	
22
	
23
	
24
	
25
	
26
	
27


28
	
29
	
30
	
31
	
1
	
2
	
3


4
	
5
	
6
	
7
	
8
	
9
	
10
Story Editor
() => {
  const [date, setDate] = useState({
    start: new Date("2023-05-01"),
    end: new Date("2023-05-03"),
  });
  return (
    <DialogContentContainer>
      <DatePicker
        id="date-range-picker"
        mode="range"
        date={date.start}
        endDate={date.end}
        onDateChange={range =>
          setDate({
            start: range.date,
            end: range.endDate,
          })
        }
      />
    </DialogContentContainer>
  );
}
Copy
Format
Reset
Related components
TextField
Allows users take actions with a single click.
Placeholder text here
Dropdown
Dropdown present a list of options from which a user can select one or several.
A content section within an elevated dialog content container
DialogContentContainer
An Elevation container, use to elevate content section
