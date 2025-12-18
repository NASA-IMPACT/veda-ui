import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  SortDirection
} from '@tanstack/react-table';
import { Icon } from '@trussworks/react-uswds';
import { Table } from '@devseed-ui/typography';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

const meta: Meta = {
  title: 'Library Components/Content Blocks/Table',
  parameters: {
    layout: 'padded'
  }
};

export default meta;

// Styled components from the actual table component
const TableWrapper = styled.div`
  display: flex;
  max-width: 100%;
  max-height: 400px;
  overflow: auto;
`;

const StyledTable = styled(Table)`
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 2px solid ${themeVal('color.base-200')};
    background: ${themeVal('color.surface')};
    box-shadow: 0 0 0 1px ${themeVal('color.base-200a')};

    th {
      vertical-align: middle;
    }

    .th-inner {
      display: flex;
      min-width: 8rem;
      gap: 0.5rem;
      align-items: center;
    }
  }
`;

const SortableLink = styled.a`
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  transition: opacity 0.16s ease-in-out;

  &,
  &:visited {
    color: inherit;
    text-decoration: none;
  }

  &:hover {
    opacity: 0.8;
  }

  svg {
    flex-shrink: 0;
  }
`;

interface SortableThProps {
  children: React.ReactNode;
  isSortable: boolean;
  sortDirection: false | SortDirection;
  onSortClick: ((event: unknown) => void) | undefined;
}

function SortableTh(props: SortableThProps) {
  const { children, isSortable, sortDirection, onSortClick } = props;

  return (
    <div className='th-inner'>
      {isSortable ? (
        <SortableLink
          href='#'
          onClick={(e) => {
            e.preventDefault();
            onSortClick?.(e);
          }}
        >
          <span>{children}</span>
          {sortDirection === 'asc' && (
            <Icon.ArrowUpward size={3} aria-label='Sorted in ascending order' />
          )}
          {sortDirection === 'desc' && (
            <Icon.ArrowDownward
              size={3}
              aria-label='Sorted in descending order'
            />
          )}
          {!sortDirection && (
            <Icon.UnfoldMore
              size={3}
              aria-label={`Sort the rows with this column's value`}
            />
          )}
        </SortableLink>
      ) : (
        children
      )}
    </div>
  );
}

// Sample data
const sampleData = [
  { name: 'Alice Johnson', age: 28, city: 'New York', score: 95 },
  { name: 'Bob Smith', age: 34, city: 'San Francisco', score: 87 },
  { name: 'Carol White', age: 22, city: 'Chicago', score: 92 },
  { name: 'David Brown', age: 45, city: 'Boston', score: 78 },
  { name: 'Eve Davis', age: 31, city: 'Seattle', score: 88 },
  { name: 'Frank Miller', age: 29, city: 'Austin', score: 91 },
  { name: 'Grace Lee', age: 26, city: 'Denver', score: 94 },
  { name: 'Henry Wilson', age: 38, city: 'Portland', score: 82 }
];

interface SimpleTableProps {
  data: typeof sampleData;
  sortableColumns: string[];
}

function SimpleTable({ data, sortableColumns }: SimpleTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<typeof sampleData[0]>[] = React.useMemo(
    () =>
      Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        enableSorting: sortableColumns.includes(key)
      })),
    [data, sortableColumns]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <SortableTh
                    isSortable={header.column.getCanSort()}
                    sortDirection={header.column.getIsSorted()}
                    onSortClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </SortableTh>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}

export const SortableColumns: StoryObj = {
  render: () => (
    <div>
      <h3>Table with Sortable Columns</h3>
      <p>
        Click on column headers (name, age, score) to sort. Notice the sort
        icons:
      </p>
      <ul>
        <li>
          <strong>Unsorted</strong>: UnfoldMore icon (↕)
        </li>
        <li>
          <strong>Ascending</strong>: ArrowUpward icon (↑)
        </li>
        <li>
          <strong>Descending</strong>: ArrowDownward icon (↓)
        </li>
      </ul>
      <SimpleTable
        data={sampleData}
        sortableColumns={['name', 'age', 'score']}
      />
    </div>
  )
};

export const AllColumnsSortable: StoryObj = {
  render: () => (
    <div>
      <h3>All Columns Sortable</h3>
      <p>All columns are sortable in this example.</p>
      <SimpleTable
        data={sampleData}
        sortableColumns={['name', 'age', 'city', 'score']}
      />
    </div>
  )
};

export const NoSortableColumns: StoryObj = {
  render: () => (
    <div>
      <h3>No Sortable Columns</h3>
      <p>No columns are sortable - no sort icons should appear.</p>
      <SimpleTable data={sampleData} sortableColumns={[]} />
    </div>
  )
};
