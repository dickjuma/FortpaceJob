import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle,
  Menu,
  Wallet,
  ArrowRightLeft
} from 'lucide-react';

export default function ClientHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      
      {/* Mobile Menu Toggle & Global Context */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-900">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Workspace:</span>
          <span className="text-sm text-indigo-600 font-bold">Global Operations Hub</span>
          <ArrowRightLeft className="w-3 h-3 text-gray-400 ml-2 cursor-pointer hover:text-gray-900" />
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
            placeholder="Search freelancers, projects, invoices, or help docs... (Cmd+K)"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-500 font-medium border border-gray-300 px-1.5 rounded bg-gray-200">⌘K</span>
          </div>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-5">
        
        {/* Quick Wallet Summary */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md cursor-pointer hover:bg-emerald-500/20 transition-colors">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-400/80 font-bold leading-none uppercase tracking-wider">Escrow Balance</span>
            <span className="text-sm font-bold text-emerald-400 leading-tight">$452,000.00</span>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        </button>
        
      </div>
    </header>
  );
}
