import React, { useState, useMemo } from 'react';
import { EmptyState } from './EmptyState';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

export function DataTable<T>({ columns, rows, keyField, emptyLabel = 'No records to show.', onRowClick, pageSize = 10 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    
    const column = columns.find(c => c.key === sortConfig.key);
    if (!column || (!column.sortable && !column.sortValue)) return rows;

    return [...rows].sort((a, b) => {
      let aVal = column.sortValue ? column.sortValue(a) : (a as any)[sortConfig.key];
      let bVal = column.sortValue ? column.sortValue(b) : (b as any)[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig, columns]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (rows.length === 0) {
    return <EmptyState message={emptyLabel} />;
  }

  return (
    <div className="flex flex-col w-full h-full border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="w-full overflow-x-auto perimo-scrollbar">
        <table className="w-full text-left text-[13px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] font-medium border-b border-[#E2E8F0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap", col.sortable && "cursor-pointer select-none hover:bg-[#F1F5F9] transition-colors")}
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={cn("flex items-center gap-1.5", col.align === 'right' && "justify-end", col.align === 'center' && "justify-center")}>
                    {col.header}
                    {col.sortable && (
                      <span className="text-[#94A3B8]">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedRows.map((row) => (
              <tr
                key={keyField(row)}
                onClick={() => onRowClick?.(row)}
                className={cn("group hover:bg-[#F1F5F9] transition-colors", onRowClick ? "cursor-pointer active:bg-[#E2E8F0]" : "")}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-[#334155] align-middle" style={{ textAlign: col.align ?? 'left' }}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="text-[12px] font-medium text-[#64748B]">
            Showing <span className="font-bold text-[#0F172A]">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-bold text-[#0F172A]">{Math.min(currentPage * pageSize, rows.length)}</span> of <span className="font-bold text-[#0F172A]">{rows.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-[13px] font-semibold text-[#0F172A]">
              {currentPage} / {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
