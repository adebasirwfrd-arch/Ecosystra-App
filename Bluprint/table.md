This is guidance for every table on ecosystra app

import { Table, TableHeader, TableHeaderCell TableBody, TableRow, TableCell } from "@vibe/core";

Table
Tables are used to organize data, making it easier to understand.
<Table
  columns={[
    {
      id: 'sentOn',
      loadingStateType: 'medium-text',
      title: 'Sent on',
      width: 150
    },
    {
      id: 'subject',
      loadingStateType: 'long-text',
      title: 'Subject'
    },
    {
      id: 'sentBy',
      infoContent: 'This is the sender',
      loadingStateType: 'circle',
      title: 'Sent by',
      width: {
        max: 200,
        min: 120
      }
    },
    {
      id: 'status',
      infoContent: 'Info content for the status column',
      loadingStateType: 'medium-text',
      title: 'Status',
      width: 150
    },
    {
      id: 'emailsSent',
      loadingStateType: 'medium-text',
      title: 'Emails sent',
      width: 150
    }
  ]}
  emptyState={<h1 style={{textAlign: 'center'}}>Empty State</h1>}
  errorState={<h1 style={{textAlign: 'center'}}>Error State</h1>}
  id="overview-table"
>
  <TableHeader>
    <TableHeaderCell title="Sent on" />
    <TableHeaderCell title="Subject" />
    <TableHeaderCell title="Sent by" />
    <TableHeaderCell title="Status" />
    <TableHeaderCell title="Emails sent" />
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        2020-01-01
      </TableCell>
      <TableCell>
        Lorem ipsum dolor
      </TableCell>
      <TableCell>
        <TableAvatar text="John Doe" />
      </TableCell>
      <TableCell>
        <Label
          color="positive"
          text="Sent"
        />
      </TableCell>
      <TableCell>
        100
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        2023-03-03
      </TableCell>
      <TableCell>
        This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject
      </TableCell>
      <TableCell>
        <TableAvatar text="Some Person" />
      </TableCell>
      <TableCell>
        <Label
          color="positive"
          text="Sent"
        />
      </TableCell>
      <TableCell>
        999
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        2022-02-02
      </TableCell>
      <TableCell>
        This is the subject
      </TableCell>
      <TableCell>
        <TableAvatar text="Other Name" />
      </TableCell>
      <TableCell>
        <Label
          color="positive"
          text="Sent"
        />
      </TableCell>
      <TableCell>
        99
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

Props
Please see attached picture. analyze this complitely understand this this is the table requirement

Variants
Sizes
The table is available in 3 different row heights: small (32px) medium (40px) and large (48 px). Medium size is the default size.
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
        columns={columns}
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell
              key={index}
              title={headerCell.title}
              icon={headerCell.icon}
              infoContent={headerCell.infoContent}
            />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => (
            <TableRow key={rowItem.id}>
              <TableCell>{rowItem.sentOn}</TableCell>
              <TableCell>{rowItem.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table
        style={{
          width: "auto",
        }}
        size="medium"
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
        columns={columns}
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell
              key={index}
              title={headerCell.title}
              icon={headerCell.icon}
              infoContent={headerCell.infoContent}
            />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => (
            <TableRow key={rowItem.id}>
              <TableCell>{rowItem.sentOn}</TableCell>
              <TableCell>{rowItem.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table
        style={{
          width: "auto",
        }}
        size="large"
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
        columns={columns}
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell
              key={index}
              title={headerCell.title}
              icon={headerCell.icon}
              infoContent={headerCell.infoContent}
            />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => (
            <TableRow key={rowItem.id}>
              <TableCell>{rowItem.sentOn}</TableCell>
              <TableCell>{rowItem.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

Borders
The table is available with or without an outer border. When using a table inside another component (like a modal or dialog), remove the table's outer border for a cleaner look.
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
  ];
  const data = [
    {
      id: "1",
      sentOn: "2020-01-01",
      sentBy: "John Doe",
      subject: "Lorem ipsum dolor",
      status: "Sent",
      emailsSent: 100,
    },
    {
      id: "3",
      sentOn: "2023-03-03",
      sentBy: "Some Person",
      subject:
        "This is the subject This is the subject This is the subject This is the subject This is the subject This is the subject",
      status: "Sent",
      emailsSent: 999,
    },
    {
      id: "2",
      sentOn: "2022-02-02",
      sentBy: "Other Name",
      subject: "This is the subject",
      status: "Sent",
      emailsSent: 99,
    },
  ];
  return (
    <>
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
        columns={columns}
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell key={index} title={headerCell.title} />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => (
            <TableRow key={rowItem.id}>
              <TableCell>{rowItem.sentOn}</TableCell>
              <TableCell>{rowItem.subject}</TableCell>
              <TableCell>
                <TableAvatar text={rowItem.sentBy} />
              </TableCell>
              <TableCell>
                <Label text={rowItem.status} color="positive" />
              </TableCell>
              <TableCell>{rowItem.emailsSent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        columns={columns}
        withoutBorder
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell key={index} title={headerCell.title} />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => (
            <TableRow key={rowItem.id}>
              <TableCell>{rowItem.sentOn}</TableCell>
              <TableCell>{rowItem.subject}</TableCell>
              <TableCell>
                <TableAvatar text={rowItem.sentBy} />
              </TableCell>
              <TableCell>
                <Label text={rowItem.status} color="positive" />
              </TableCell>
              <TableCell>{rowItem.emailsSent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

Table header functionality
Sorting, Icons and Information added to selected columns
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
        {emailColumns.map((headerCell, index) => (
          <TableHeaderCell
            key={index}
            title={headerCell.title}
            icon={headerCell.icon}
            infoContent={headerCell.infoContent}
            onSortClicked={sortState => onSort(headerCell.id, sortState)}
            sortState={sorting[headerCell.id]}
          />
        ))}
      </TableHeader>
      <TableBody>
        {tableData.map(rowItem => (
          <TableRow key={rowItem.id}>
            <TableCell>{rowItem.sentOn}</TableCell>
            <TableCell>{rowItem.subject}</TableCell>
            <TableCell>
              <TableAvatar text={rowItem.sentBy} />
            </TableCell>
            <TableCell>
              <Label text={rowItem.status} color="positive" />
            </TableCell>
            <TableCell>{rowItem.emailsSent}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

Loading
Using skeleton
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
        </TableCell>
        <TableCell>
          <Label text={rowItem.status} color="positive" />
        </TableCell>
        <TableCell>{rowItem.emailsSent}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

Scroll
Table with both vertical and horizontal scroll
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
          <TableCell>
            <Label
              text={rowItem.priority}
              color={priorityColumnToLabelColor[rowItem.priority]}
            />
          </TableCell>
          <TableCell>{rowItem.subject}</TableCell>
          <TableCell>
            <TableAvatar text={rowItem.sentBy} />
          </TableCell>
          <TableCell>
            <Label
              text={rowItem.status}
              color={statusColumnToLabelColor[rowItem.status]}
            />
          </TableCell>
          <TableCell>{rowItem.emailsSent}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

Virtualized Scroll
This is an example of a table with 5000 rows

🤓
Tip
The row element returned by rowRenderer must accept a style prop. This is required for react-window to position rows correctly. If rows appear stacked or scrolling breaks, ensure your row component doesn't ignore or override the style prop.
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
          style={{
            textAlign: "center",
          }}
        >
          Empty State
        </h1>
      }
      columns={virtualizedScrollTableColumns}
      style={{
        height: 250,
      }}
    >
      <TableVirtualizedBody
        rowRenderer={Row}
        items={virtualizedScrollTableData}
        columns={virtualizedScrollTableColumns}
        headerRenderer={Header}
      />
    </Table>
  );
}

Sticky column
Use sticky column in your table when you want to keep specific column visible while the users scroll horizontally. (THIS IS MANDATORY TO IMPLEMENT EVERY TABLE ON ECOSYSTRA USING STICKY TABLE ON CPOLUMN TASK)

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
            <TableCell>
              <Label
                text={rowItem.status}
                color={statusColumnToLabelColor[rowItem.status]}
              />
            </TableCell>
            <TableCell>{rowItem.description}</TableCell>
            <TableCell>{rowItem.createdOn}</TableCell>
            <TableCell>{rowItem.emailsSent}</TableCell>
            <TableCell>{rowItem.owner}</TableCell>
            <TableCell>{rowItem.priority}</TableCell>
            <TableCell>{rowItem.category}</TableCell>
            <TableCell>{rowItem.dueDate}</TableCell>
            <TableCell>{rowItem.comments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

Highlighted row
Use a highlighted row to mark a single row of the table. A highlighted row allows adding additional information for the entire row, using a system trigger such as a side-panel or model.
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
          >
            <TableCell>{rowItem.sentOn}</TableCell>
            <TableCell>{rowItem.subject}</TableCell>
            <TableCell>
              <TableAvatar text={rowItem.sentBy} />
            </TableCell>
            <TableCell>
              <Label text={rowItem.status} color="positive" />
            </TableCell>
            <TableCell>{rowItem.emailsSent}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
