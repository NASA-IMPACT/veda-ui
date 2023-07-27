import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { read, utils } from "xlsx";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';

import { TableWrapper, StyledTable } from './markup';

const testExcelFile = '/public/2021_data_summary_spreadsheets/ghgp_data_by_year.xlsx';
/* column pinning,  - no out of box style support, use position: sticky */
const pinnedColumns = ['Facility Id'];

export default function TableComponent() {
  const [data, setData] = useState<unknown[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    (async() => {
    const f = await (await fetch(testExcelFile)).arrayBuffer();
    const wb = read(f); // parse the array buffer
    const ws = wb.Sheets[wb.SheetNames[0]]; // get the first sheet
    const data = utils.sheet_to_json(ws,{ range: 3 }); // generate objects
    setData(data);
  })();},[]);

  const columns: ColumnDef<unknown>[] = data.length? Object.keys(data[0]).map(key => {
    return  {
      accessorKey: key,
      cell: info => info.getValue(),
      header: () => (<React.Fragment><span>{key}</span></React.Fragment>),
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
              const row = rows[virtualRow.index] as Row<Person>;
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
    </TableWrapper>);
}

