import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import useUserManagementStore from '../../../store/userManagementStore';

/**
 * Responsive pagination bar for data tables.
 */
const TablePagination = ({ section, totalCount }) => {
  const { pagination, setPage, setLimit } = useUserManagementStore();
  const { page, limit } = pagination[section];

  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 bg-white dark:bg-surface-dark border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-up duration-500 fill-mode-both">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-bold text-zinc-900 dark:text-white">{start}–{end}</span> of <span className="font-bold text-zinc-900 dark:text-white">{totalCount}</span> users
        </p>
        <select 
          value={limit}
          onChange={(e) => setLimit(section, Number(e.target.value))}
          className="bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer hover:border-[#4C1D95]/20 transition-colors"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPage(section, 1)}
          disabled={page === 1}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => setPage(section, page - 1)}
          disabled={page === 1}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2 border-x border-zinc-200 dark:border-zinc-700">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(section, pageNum)}
                className={cn(
                  "h-9 w-9 rounded-xl text-sm font-black transition-all",
                  isActive 
                    ? "bg-[#4C1D95] text-white shadow-lg shadow-[#4C1D95]/25/30 scale-105" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <span className="px-2 text-zinc-300 dark:text-zinc-600 text-xs font-bold">...</span>
          )}
        </div>

        <button
          onClick={() => setPage(section, page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => setPage(section, totalPages)}
          disabled={page === totalPages}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;


