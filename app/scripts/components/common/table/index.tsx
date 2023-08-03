import React, { useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  Row
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';
import { Sheet2JSONOpts } from 'xlsx';
import {
  CollecticonArrowLoop,
  CollecticonArrowDown,
  CollecticonArrowUp
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { PlaceHolderWrapper, TableWrapper, StyledTable } from './markup';
import useLoadFile from '$utils/use-load-file';
interface TablecomponentProps {
  dataPath: string;
  excelOption?: Sheet2JSONOpts;
  columnToSort?: string[];
}

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
          {' '}
          <p>
            {' '}
            Something went wrong while loading the data. Please try later.{' '}
          </p>
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Button
                          onClick={header.column.getToggleSortingHandler()}
                          variation='base-text'
                        >
                          {(header.column.getIsSorted() as string) == 'asc' && (
                            <CollecticonArrowUp
                              meaningful={true}
                              title='Sorted in ascending order'
                            />
                          )}
                          {(header.column.getIsSorted() as string) ==
                            'desc' && (
                            <CollecticonArrowDown
                              meaningful={true}
                              title='Sorted in descending order'
                            />
                          )}
                          {!header.column.getIsSorted() && (
                            <CollecticonArrowLoop
                              meaningful={true}
                              title={`Sort the rows with this column's value`}
                            />
                          )}
                        </Button>
                      )}
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
