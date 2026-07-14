import React from 'react';
import { EmptyState } from './EmptyState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
}

/** Generic data table — every module's "Recent Events" / list widget renders
 *  through this so header styling, row hover, and empty state stay uniform. */
export function DataTable<T>({ columns, rows, keyField, emptyLabel = 'No records to show.', onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState message={emptyLabel} />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-[13px] border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] text-[#64748B] font-medium border-b border-[#E2E8F0]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2.5 font-medium text-[11px] uppercase tracking-wide whitespace-nowrap"
                style={{ width: col.width, textAlign: col.align ?? 'left' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {rows.map((row) => (
            <tr
              key={keyField(row)}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-[#F8FAFC] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[#334155]" style={{ textAlign: col.align ?? 'left' }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
