// @ts-nocheck
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const TopNav = () => {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
      <div className="flex-1 flex items-center">
        {/* Optional Search Bar */}
        <div className="max-w-md w-full relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-light-gray placeholder-text-secondary focus:outline-none focus:bg-white focus:border-[#2bb75c] focus:ring-1 focus:ring-[#2bb75c] sm:text-sm transition-colors"
            placeholder="Search users, jobs, messages..."
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <button className="relative p-2 text-text-secondary hover:bg-light-gray rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2bb75c]">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[#2bb75c] ring-2 ring-white" />
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-border cursor-pointer hover:bg-light-gray p-1 pr-3 rounded-full transition-colors">
          <Avatar 
            name="Admin User" 
            size="sm" 
            status="online"
            src="https://ui-avatars.com/api/?name=Admin+User&background=14a800&color=fff"
          />
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-[#222222] leading-none">Admin User</p>
            <p className="text-text-secondary text-xs mt-1">Superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

