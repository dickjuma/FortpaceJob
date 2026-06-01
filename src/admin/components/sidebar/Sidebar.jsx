import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { ROLE_CONFIG } from '../../config/roleConfig';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';

const Sidebar = () => {
  const {
    sidebarOpen,
    theme,
    toggleSidebar,
    closeSidebar,
    toggleTheme,
  } = useUIStore();

  const { user, logout } = useAuthStore();
  const location = useLocation();
  // Fallback to ADMIN config if user is null (for unprotected testing)
  const config = user ? ROLE_CONFIG[user.role] : ROLE_CONFIG['ADMIN'] || ROLE_CONFIG['super_admin'];

  const [openGroups, setOpenGroups] = React.useState({});
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (config) {
      const initialOpen = {};
      config.modules.forEach((module) => {
        if (module.children && location.pathname.startsWith(module.href)) {
          initialOpen[module.id] = true;
        }
      });
      setOpenGroups((prev) => ({ ...prev, ...initialOpen }));
    }
  }, [config, location.pathname]);

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!config) return null;

  return (
    <aside
      className={twMerge(clsx(
        'flex h-full flex-col bg-[#222222] border-r border-light-gray/10 text-light-gray transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-[min(300px,calc(100vw-1rem))] sm:w-[280px]'
      ))}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-success text-[#222222] rounded-full p-1 border border-light-gray/20 hover:scale-110 transition-transform z-10 hidden sm:block"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex h-[72px] shrink-0 items-center border-b border-white/10 px-5 transition-all">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success text-[#222222] shadow-lg shadow-[#14a800]/20">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <span className="animate-in fade-in text-xl font-black tracking-tight text-white duration-300">
              Forte<span className="text-success">Admin</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        {config.modules.map((module) => {
          const Icon = module.icon;

          if (module.children) {
            return (
              <SidebarGroup
                key={module.id}
                label={module.label}
                icon={Icon}
                items={module.children}
                isCollapsed={isCollapsed}
                isOpen={openGroups[module.id]}
                onToggle={() => toggleGroup(module.id)}
              />
            );
          }

          return (
            <SidebarItem
              key={module.id}
              label={module.label}
              path={module.href}
              icon={Icon}
              isCollapsed={isCollapsed}
              badge={module.badge}
            />
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          onClick={() => {
            closeSidebar();
            logout();
          }}
          className="group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-bold">Logout Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
