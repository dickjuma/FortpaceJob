import React, { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { 
  MoreVertical, 
  Eye, 
  AlertTriangle, 
  UserX, 
  Search,
  Filter,
  Download,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';

const UserRiskTable = ({ data, isLoading, onAction }) => {
  const columns = useMemo(
    () => [
      {
        header: 'User',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div 
            className="flex items-center gap-3 cursor-pointer group/user"
            onClick={() => onAction('profile', row.original)}
          >
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-zinc-400 text-xs shadow-inner group-hover/user:border-[#4C1D95]/20 transition-colors">
              {row.original.avatar ? (
                <img
                  src={row.original.avatar}
                  alt={`${row.original.name} avatar`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                row.original.name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none mb-1 group-hover/user:text-[#4C1D95] transition-colors">{row.original.name}</p>
              <p className="text-[10px] font-['DM_Mono'] text-zinc-500 uppercase tracking-tighter">{row.original.id}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ getValue }) => (
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
            getValue() === 'Client' ? "bg-[#4C1D95]/10 text-[#4C1D95]" : "bg-success/10 text-success"
          )}>
            {getValue()}
          </span>
        ),
      },
      {
        header: 'Trust Score',
        accessorKey: 'trustScore',
        cell: ({ getValue }) => {
          const score = getValue();
          return (
            <div className="w-32 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className={cn(
                  score <= 40 ? "text-red-500" : score <= 70 ? "text-amber-500" : "text-success"
                )}>{score}</span>
                <span className="text-zinc-600">100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    score <= 40 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : 
                    score <= 70 ? "bg-amber-500" : "bg-success"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: 'Risk Level',
        accessorKey: 'riskLevel',
        cell: ({ getValue }) => (
          <span className={cn(
            "text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter",
            getValue() === 'RED' ? "bg-red-500 text-white" :
            getValue() === 'YELLOW' ? "bg-amber-500 text-white" : "bg-success text-white"
          )}>
            {getValue()}
          </span>
        ),
      },
      {
        header: 'Violations',
        accessorKey: 'violations',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
             <span className={cn(
               "text-sm font-['DM_Mono'] font-bold",
               getValue() > 10 ? "text-red-500" : getValue() > 0 ? "text-amber-500" : "text-zinc-500"
             )}>{getValue()}</span>
             {getValue() > 0 && <AlertTriangle size={12} className="text-amber-500 opacity-50" />}
          </div>
        ),
      },
      {
        header: 'Last Activity',
        accessorKey: 'lastActivity',
        cell: ({ getValue }) => (
          <span className="text-[11px] font-medium text-zinc-500">{getValue()}</span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <span className={cn(
            "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase",
            getValue() === 'Active' ? "text-success" :
            getValue() === 'Flagged' ? "text-amber-500" : "text-red-500"
          )}>
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              getValue() === 'Active' ? "bg-success" :
              getValue() === 'Flagged' ? "bg-amber-500" : "bg-red-500"
            )} />
            {getValue()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <button 
              onClick={() => onAction('profile', row.original)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" 
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => onAction('flag', row.original)}
              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all" 
              title="Warn User"
            >
              <AlertTriangle size={16} />
            </button>
            <button 
              onClick={() => onAction('flag', row.original)}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" 
              title="Suspend"
            >
              <UserX size={16} />
            </button>
            <button 
              onClick={() => onAction('logs', row.original)}
              className="p-2 text-zinc-400 hover:text-[#4C1D95] hover:bg-[#4C1D95]/10 rounded-lg transition-all" 
              title="View User Activity"
            >
              <Activity size={16} />
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all">
              <MoreVertical size={16} />
            </button>
          </div>
        ),
      },
    ],
    [onAction]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-[#060c18] rounded-xl border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* Table Toolbar */}
      <div className="p-6 border-b border-zinc-800 bg-[#080e1a] flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search user ID, name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-[#0a0f1e] border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#4C1D95]/20 transition-all"
            />
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0f1e] border border-zinc-800 rounded-lg text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-all">
               <Filter size={14} />
               Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0f1e] border border-zinc-800 rounded-lg text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-all">
               <Download size={14} />
               Export
            </button>
            <div className="h-8 w-px bg-zinc-800 mx-1" />
            <button className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-lg shadow-lg shadow-red-500/20 transition-all">
               Bulk Action
            </button>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-[#080e1a] border-b border-zinc-800">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-zinc-800/50 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-[#0a0f1e] transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-zinc-800 bg-[#080e1a] flex items-center justify-between">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} of {data.length} high-risk profiles
         </p>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-zinc-800 bg-[#0a0f1e] rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">Previous</button>
            <button className="px-4 py-2 border border-zinc-800 bg-[#0a0f1e] rounded-lg text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">Next</button>
         </div>
      </div>

    </div>
  );
};

export default UserRiskTable;


