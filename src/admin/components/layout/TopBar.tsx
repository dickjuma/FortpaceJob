// @ts-nocheck
import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Command,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { cn } from '../../utils/cn';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const TopBar: React.FC = () => {
  const { toggleSidebar, toggleCommandPalette } = useUIStore();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const config = user ? ROLE_CONFIG[user.role] : null;

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-surface-border dark:border-surface-dark-border bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">Admin</span>
          <ChevronRight size={14} className="text-zinc-300" />
          <span className="text-zinc-900 dark:text-white font-bold">Dashboard</span>
        </nav>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Command Search Bar */}
        <button 
          onClick={toggleCommandPalette}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
        >
          <Search size={16} className="group-hover:text-[#14a800] transition-colors" />
          <span className="text-xs">Quick Search...</span>
          <div className="flex items-center gap-1 ml-4 px-1.5 py-0.5 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-[10px] font-bold">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>

        {/* Global Notifications */}
        <button className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></span>
          )}
        </button>

        {/* User Dropdown Profile */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-surface-border dark:border-surface-dark-border group cursor-pointer relative">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
              {user?.firstName}
            </p>
            {config && (
              <Badge variant="default" size="sm" className={cn("mt-0.5 normal-case", config.bgColor)}>
                {config.label}
              </Badge>
            )}
          </div>
          <Avatar 
            src={user?.avatar} 
            name={`${user?.firstName} ${user?.lastName}`} 
            status="success" 
          />

          {/* Minimal Dropdown Simulation on Hover/Click */}
          <div className="absolute top-full right-0 mt-2 w-56 bg-surface dark:bg-surface-dark border border-surface-border dark:border-surface-dark-border rounded-2xl shadow-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 overflow-hidden">
             <div className="p-3 border-b border-surface-border dark:border-surface-dark-border mb-1">
               <p className="text-xs font-bold text-zinc-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
             </div>
             <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
               <User size={14} /> Profile Settings
             </button>
             <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
               <HelpCircle size={14} /> System Help
             </button>
             <div className="my-1 border-t border-surface-border dark:border-surface-dark-border"></div>
             <button 
               onClick={logout}
               className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
             >
               <LogOut size={14} /> Logout Session
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
