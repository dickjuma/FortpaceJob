import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const SidebarItem = React.memo(({ 
  label, 
  path, 
  icon: Icon, 
  isCollapsed, 
  isSubItem = false,
  badge,
  onClick 
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => twMerge(clsx(
        "group relative flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-200 no-underline text-sm font-medium",
        isActive 
          ? "bg-accent-purple/10 text-accent-purple" 
          : "text-light-gray/80 hover:bg-white/5 hover:text-white",
        isSubItem && "ml-4 h-9 text-xs"
      ))}
    >
      <Icon size={isSubItem ? 16 : 20} className={twMerge(clsx(
        "shrink-0 transition-colors",
        isActive ? "text-accent-purple" : "text-light-gray/60 group-hover:text-white"
      ))} />
      
      {!isCollapsed && (
        <span className="truncate animate-in fade-in duration-300">{label}</span>
      )}

      {badge && !isCollapsed && (
        <span className="ml-auto bg-accent-purple/20 text-accent-purple text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-navy text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
          {label}
        </div>
      )}

      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-1 bg-accent-purple rounded-r-full" />
      )}
    </NavLink>
  );
});

export default SidebarItem;
