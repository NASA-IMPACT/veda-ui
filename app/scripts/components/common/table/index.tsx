import React, { useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef, 
  Row,
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';
import { Sheet2JSONOpts } from 'xlsx';
import { PlaceHolderWrapper, TableWrapper, StyledTable } from './markup';
import useLoadFile from '$utils/use-load-file';

/* column pinning,  - no out of box style support, use position: sticky */
const pinnedColumns = ['Facility Id'];

interface TablecomponentProps {
  fileName: string;
  excelOption?: Sheet2JSONOpts;
}

export default function TableComponent({ fileName, excelOption }:TablecomponentProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const {data, dataLoading, dataError} = useLoadFile(fileName, excelOption);
  const dataLoaded = !dataLoading && !dataError;
  
  const columns: ColumnDef<object>[] = data.length? (Object.keys(data[0])).map(key => {
    return  {
      accessorKey: key,
      cell: info => info.getValue()
    };
  }) : [];

  const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel(), state: {
    columnPinning: {
      left: pinnedColumns,
      right: []
    },
    columnSizing: Object.keys(columns).reduce((acc, curr) => {acc[curr] = 300; return acc;}, {})
  }});
  
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 50,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;
  return (
    <>
    {dataLoading && <PlaceHolderWrapper><p>Loading Data...</p></PlaceHolderWrapper>}
    {dataError && <PlaceHolderWrapper> <p> Something went wrong while loading the data. Please try later. </p></PlaceHolderWrapper> }
    {dataLoaded &&
    <TableWrapper ref={tableContainerRef}>
      <StyledTable>
        <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan} className={header.column.getIsPinned()? 'fixed':''}>
                        {flexRender(
                              header.column.columnDef.header,
                              header.getContext())}
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
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<unknown>;
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
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
    </TableWrapper>}
    </>);
}

