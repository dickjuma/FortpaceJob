// @ts-nocheck
import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Sun, 
  Moon,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { cn } from '../../utils/cn';
import Avatar from '../ui/Avatar';

const Sidebar: React.FC = () => {
  const { 
    sidebarOpen, 
    sidebarCollapsed, 
    theme,
    toggleSidebar, 
    collapseSidebar,
    toggleTheme 
  } = useUIStore();
  
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const config = user ? ROLE_CONFIG[user.role] : null;

  if (!config) return null;

  const sidebarWidth = sidebarCollapsed ? 'w-[72px]' : 'w-[260px]';

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-surface dark:bg-surface-dark border-r border-surface-border dark:border-surface-dark-border transition-all duration-300 ease-in-out",
      sidebarWidth,
      sidebarOpen ? "tranzinc-x-0" : "-tranzinc-x-full lg:tranzinc-x-0"
    )}>
      {/* Header: Logo */}
      <div className="h-16 flex items-center px-5 shrink-0">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#2bb75c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#2bb75c]/25/20">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight animate-in fade-in duration-300">
              Forte<span className="text-[#2bb75c]">Admin</span>
            </span>
          )}
        </Link>
        {sidebarOpen && (
           <button onClick={toggleSidebar} className="ml-auto lg:hidden text-zinc-400 p-2">
             <X size={20} />
           </button>
        )}
      </div>

      {/* Admin Identity */}
      <div className={cn(
        "px-4 py-6 border-b border-surface-border dark:border-surface-dark-border",
        sidebarCollapsed && "flex justify-center"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl bg-surface-secondary dark:bg-surface-dark-secondary border border-surface-border dark:border-surface-dark-border transition-all",
          sidebarCollapsed ? "w-11 h-11 p-0 justify-center overflow-hidden" : ""
        )}>
          <Avatar 
            src={user?.avatar} 
            name={`${user?.firstName} ${user?.lastName}`} 
            size={sidebarCollapsed ? "sm" : "md"}
          />
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1 animate-in fade-in duration-300">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate">
                {config.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1 custom-scrollbar">
        {config.modules.map((module) => {
          const Icon = module.icon;
          const isActive = location.pathname === module.href;
          
          return (
            <NavLink
              key={module.id}
              to={module.href}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 no-underline",
                isActive 
                  ? "bg-[#2bb75c]/5 dark:bg-[#2bb75c]/20 text-[#2bb75c] dark:text-[#2bb75c] font-bold" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <Icon size={20} className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-[#2bb75c] dark:text-[#2bb75c]" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )} />
              
              {!sidebarCollapsed && (
                <span className="text-sm truncate animate-in fade-in duration-300">{module.label}</span>
              )}

              {module.badge && !sidebarCollapsed && (
                <span className="ml-auto bg-[#2bb75c]/10 dark:bg-[#2bb75c]/40 text-[#2bb75c] dark:text-[#2bb75c] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {module.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface-dark text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                  {module.label}
                </div>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#2bb75c] rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-surface-border dark:border-surface-dark-border space-y-1">
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 px-3 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group relative",
            sidebarCollapsed && "justify-center"
          )}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {!sidebarCollapsed && <span className="text-sm font-medium">Appearance</span>}
          
          {sidebarCollapsed && (
             <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface-dark text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
               {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
             </div>
          )}
        </button>

        <button
          onClick={() => collapseSidebar()}
          className={cn(
            "w-full hidden lg:flex items-center gap-3 px-3 h-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group relative",
            sidebarCollapsed && "justify-center"
          )}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!sidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 h-10 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group relative",
            sidebarCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="text-sm font-bold">Logout Session</span>}
          
          {sidebarCollapsed && (
             <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface-dark text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
               Logout Session
             </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

