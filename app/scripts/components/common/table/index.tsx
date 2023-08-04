import React, { useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  Row,
  SortDirection
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';
import { Sheet2JSONOpts } from 'xlsx';
import {
  CollecticonSortAsc,
  CollecticonSortDesc,
  CollecticonSortNone
} from '@devseed-ui/collecticons';
import { Table } from '@devseed-ui/typography';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import useLoadFile from '$utils/use-load-file';

export interface ExcelOption {
  sheetNumber?: number;
  parseOption?: Sheet2JSONOpts;
}

interface TablecomponentProps {
  dataPath: string;
  excelOption?: ExcelOption;
  columnToSort?: string[];
}

export const tableHeight = '400';

const PlaceHolderWrapper = styled.div`
  display: flex;
  height: ${tableHeight}px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  display: flex;
  max-width: 100%;
  max-height: ${tableHeight}px;
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

    button {
      flex: 0 0 auto;
    }
  }
`;

export default function TableComponent({
  dataPath,
  excelOption,
  columnToSort
}: TablecomponentProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, dataLoading, dataError } = useLoadFile(dataPath, excelOption);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const dataLoaded = !dataLoading && !dataError;

  const columns: ColumnDef<object>[] = data.length
    ? Object.keys(data[0]).map((key) => {
        return {
          accessorKey: key,
          enableSorting: columnToSort?.includes(key) ? true : false
        };
      })
    : [];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 50
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <>
      {dataLoading && (
        <PlaceHolderWrapper>
          <p>Loading Data...</p>
        </PlaceHolderWrapper>
      )}
      {dataError && (
        <PlaceHolderWrapper>
          <p>Something went wrong while loading the data. Please try later. </p>
        </PlaceHolderWrapper>
      )}
      {dataLoaded && (
        <TableWrapper ref={tableContainerRef}>
          <StyledTable>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
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
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<unknown>;
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      )}
    </>
  );
}

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
            <CollecticonSortAsc
              meaningful={true}
              title='Sorted in ascending order'
            />
          )}
          {sortDirection === 'desc' && (
            <CollecticonSortDesc
              meaningful={true}
              title='Sorted in descending order'
            />
          )}
          {!sortDirection && (
            <CollecticonSortNone
              meaningful={true}
              title={`Sort the rows with this column's value`}
            />
          )}
        </SortableLink>
      ) : (
        children
      )}
    </div>
  );
}
