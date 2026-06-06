import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

function DataTable({ columns, data, loading = false, emptyMessage = "No data found", onRowClick, pagination }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="row" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-6 px-6 custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-surface-border dark:border-surface-dark-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "py-4 text-left text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors",
                    column.sortable && "cursor-pointer hover:text-zinc-900 dark:hover:text-white"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 dark:divide-surface-dark-border/50">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  "group transition-all hover:bg-surface/50 dark:hover:bg-surface-dark/30",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="py-4 text-right">
                  <button className="p-1 text-zinc-300 group-hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-6 flex items-center justify-between border-t border-surface-border dark:border-surface-dark-border pt-6">
          <p className="text-xs font-bold text-zinc-500">
            Page <span className="text-zinc-900 dark:text-white">{pagination.currentPage}</span> of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
