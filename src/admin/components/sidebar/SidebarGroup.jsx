import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const SidebarGroup = React.memo(({
  label,
  icon: Icon,
  items,
  isCollapsed,
  isOpen,
  onToggle
}) => {
  const location = useLocation();
  const hasActiveChild = items.some(item => location.pathname === item.path);

  useEffect(() => {
    if (hasActiveChild && !isOpen && !isCollapsed) {
      onToggle();
    }
  }, [hasActiveChild, isCollapsed, isOpen, onToggle]);

  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={twMerge(clsx(
          "w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-200 group relative text-sm font-medium",
          (isOpen || hasActiveChild) && !isCollapsed 
            ? "text-white bg-white/5 font-bold" 
            : "text-light-gray/80 hover:bg-white/5 hover:text-white"
        ))}
      >
        <Icon 
          size={20} 
          className={twMerge(clsx(
            "shrink-0 transition-colors",
            (isOpen || hasActiveChild) ? "text-success" : "text-light-gray/60 group-hover:text-white"
          ))} 
        />
        
        {!isCollapsed && (
          <>
            <span className="truncate">{label}</span>
            <ChevronDown 
              size={14} 
              className={twMerge(clsx("ml-auto transition-transform duration-300", isOpen && "rotate-180"))} 
            />
          </>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
            {label}
          </div>
        )}
      </button>

      {isOpen && !isCollapsed && (
        <div className="space-y-1 animate-in slide-down duration-300">
          {items.map((item) => (
            <SidebarItem 
              key={item.path} 
              {...item} 
              icon={item.icon || Icon} 
              isCollapsed={false} 
              isSubItem={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default SidebarGroup;
