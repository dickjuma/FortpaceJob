// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  selectable?: boolean;
  onRowSelect?: (rows: T[]) => void;
  selectedRows?: T[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  loading,
  onSort,
  sortConfig,
  selectable,
  onRowSelect,
  selectedRows = [],
  pagination,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onSort(key, direction);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onRowSelect) return;
    if (e.target.checked) {
      onRowSelect(data);
    } else {
      onRowSelect([]);
    }
  };

  const handleSelectRow = (row) => {
    if (!onRowSelect) return;
    const isSelected = selectedRows.some((r) => r.id === row.id);
    if (isSelected) {
      onRowSelect(selectedRows.filter((r) => r.id !== row.id));
    } else {
      onRowSelect([...selectedRows, row]);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-gray text-sm text-text-secondary uppercase tracking-wider border-b border-border">
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-accent-red focus:ring-accent-red"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={twMerge(
                    clsx(
                      'px-6 py-4 font-semibold',
                      col.sortable && 'cursor-pointer hover:bg-gray-200 transition-colors'
                    )
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="text-navy">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center text-text-secondary">
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-accent-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-8 text-center text-text-secondary">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'transition-colors hover:bg-gray-50',
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  )}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-accent-red focus:ring-accent-red"
                        checked={selectedRows.some((r) => r.id === row.id)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-text-primary">
                      {col.render
                        ? col.render((row as any)[col.key], row)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-white">
          <div className="text-sm text-text-secondary">
            Showing <span className="font-medium text-navy">{(pagination.page - 1) * pagination.pageSize + 1}</span> to <span className="font-medium text-navy">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span> of <span className="font-medium text-navy">{pagination.total}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="px-3 py-1 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-light-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="px-3 py-1 border border-border rounded-md text-sm font-medium text-text-primary hover:bg-light-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
