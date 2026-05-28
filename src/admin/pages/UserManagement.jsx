import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  ShieldCheck, 
  UserX, 
  Flag, 
  ArrowUpDown,
  Download
} from "lucide-react";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "FREELANCER", status: "VERIFIED", joined: "2024-01-12", kyc: "APPROVED" },
  { id: "2", name: "Sarah Smith", email: "sarah@techcorp.com", role: "CLIENT", status: "SUSPENDED", joined: "2024-02-05", kyc: "PENDING" },
  { id: "3", name: "Modern Design LLC", email: "contact@moderndesign.com", role: "AGENCY", status: "VERIFIED", joined: "2023-11-20", kyc: "APPROVED" },
  { id: "4", name: "Mike Johnson", email: "mike@dev.io", role: "FREELANCER", status: "FLAGGED", joined: "2024-03-01", kyc: "REJECTED" },
  { id: "5", name: "Alpha Systems", email: "admin@alpha.com", role: "CLIENT", status: "VERIFIED", joined: "2024-02-15", kyc: "APPROVED" },
];

const UserManagement = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-zinc-500 mt-1 font-medium">Audit, verify, and moderate platform members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-navy dark:bg-white text-white dark:text-navy px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-lg">
            <UserPlus size={18} />
            Invite Admin
          </button>
          <button className="flex items-center gap-2 bg-white dark:bg-white/5 text-zinc-700 dark:text-white border border-zinc-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-white/10 transition-all">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-navy p-4 rounded-[24px] border border-zinc-200 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-accent-purple transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, email, or ID..." 
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-transparent focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 rounded-xl text-sm outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
            <Filter size={18} />
            Role
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
            <ArrowUpDown size={18} />
            Joined
          </button>
        </div>
      </div>

      {/* Modern Users Table */}
      <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm relative">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-5">User Details</th>
                <th className="px-6 py-5">Account Type</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">KYC Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center font-bold text-accent-purple">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{user.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                      user.status === 'VERIFIED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                      user.status === 'SUSPENDED' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' : 
                      'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'VERIFIED' ? 'bg-emerald-500' : 
                        user.status === 'SUSPENDED' ? 'bg-rose-500' : 
                        'bg-amber-500'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.kyc === 'APPROVED' ? 'bg-emerald-500' : 
                        user.kyc === 'PENDING' ? 'bg-amber-500' : 
                        'bg-rose-500'
                      }`}></div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{user.kyc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all" title="Verify Account">
                        <ShieldCheck size={18} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all" title="Flag User">
                        <Flag size={18} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all" title="Suspend User">
                        <UserX size={18} />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between relative z-10">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Showing 5 of 12,482 users</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-zinc-200 dark:border-white/10 bg-white dark:bg-navy rounded-xl text-xs font-bold text-zinc-400 dark:text-zinc-600 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 border border-zinc-200 dark:border-white/10 bg-white dark:bg-navy rounded-xl text-xs font-bold text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
