import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Bell, MessageSquare, Search, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../authStore';

const DashboardNavbar = ({ role = 'FREELANCER' }) => {
  const { user } = useAuthStore();
  const isFreelancer = role === 'FREELANCER';

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Left Side: Logo & Primary Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4C1D95] to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-[#4C1D95]/25 transition-all duration-300">
              F
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white hidden sm:block">Forte</span>
          </Link>

          <div className="hidden md:flex items-center">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-[#4C1D95] transition-colors" />
              </div>
              <input
                type="text"
                placeholder={isFreelancer ? "Find jobs & projects..." : "Find freelancers & services..."}
                className="block w-full sm:w-64 md:w-80 lg:w-96 pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full leading-5 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#4C1D95] focus:border-[#4C1D95] sm:text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Mode Switcher */}
          <Link
            to={isFreelancer ? '/client/dashboard' : '/freelancer/dashboard'}
            className="hidden lg:flex items-center text-sm font-semibold text-[#4C1D95] dark:text-[#4C1D95] hover:text-#22C55E] dark:hover:text-[#7bc67e] transition-colors px-3 py-2 rounded-lg hover:bg-[#4C1D95]/5 dark:hover:bg-[#4C1D95]/10"
          >
            Switch to {isFreelancer ? 'Buying' : 'Selling'}
          </Link>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden lg:block mx-2"></div>

          {/* Notifications & Messages */}
          <button className="relative p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C1D95]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
          </button>
          
          <button className="relative p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C1D95]">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#4C1D95] rounded-full border-2 border-white dark:border-zinc-950"></span>
          </button>

          {/* User Menu */}
          <div className="relative ml-2">
            <button className="flex items-center gap-2 focus:outline-none group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors hidden sm:block" />
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default DashboardNavbar;


