// @ts-nocheck
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../../common/authStore';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Briefcase,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  Heart,
  FileText,
  Users2
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['Dashboard', 'Jobs', 'Settings']);

  const toggleMenu = (name) => {
    setExpandedMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
      badge: 3,
    },
    {
      name: 'Jobs',
      icon: Briefcase,
      children: [
        { name: 'My Jobs', path: '/admin/jobs/my-jobs' },
        { name: 'Post a Job', path: '/admin/jobs/post' },
      ]
    },
    {
      name: 'Team',
      icon: Users2,
      path: '/admin/team',
    },
    {
      name: 'Favorites',
      icon: Heart,
      path: '/admin/favorites',
    },
    {
      name: 'Articles',
      icon: FileText,
      path: '/admin/articles',
    },
    {
      name: 'Settings',
      icon: Settings,
      children: [
        { name: 'Profile', path: '/admin/settings/profile' },
        { name: 'Password', path: '/admin/settings/password' },
        { name: 'Account', path: '/admin/settings/account' },
      ]
    },
    {
      name: 'FAQ',
      icon: HelpCircle,
      path: '/admin/faq',
    }
  ];

  return (
    <aside 
      className={twMerge(clsx(
        "bg-[#222222] text-light-gray flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      ))}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-success text-[#222222] rounded-full p-1 border border-light-gray/20 hover:scale-110 transition-transform z-10"
      >
        <ChevronLeft className={twMerge(clsx("w-4 h-4 transition-transform", isCollapsed && "rotate-180"))} />
      </button>

      <div className={twMerge(clsx(
        "p-6 flex items-center border-b border-light-gray/10",
        isCollapsed ? "justify-center px-4" : "justify-between"
      ))}>
        {!isCollapsed && <h1 className="text-2xl font-bold text-success tracking-tight">ForteSpace</h1>}
        {isCollapsed && <span className="text-2xl font-bold text-success">F.</span>}
      </div>

      <div className={twMerge(clsx(
        "p-6 border-b border-light-gray/10 flex items-center",
        isCollapsed ? "justify-center" : "space-x-4"
      ))}>
        <Avatar 
          name={user?.firstName ? `${user.firstName} ${user.lastName}` : "Admin User"}
          size={isCollapsed ? "sm" : "md"}
        />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-semibold truncate w-32">{user?.firstName ? `${user.firstName} ${user.lastName}` : "Admin User"}</span>
            <span className="text-xs text-light-gray/60">{user?.role || "Administrator"}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <>
                  <button 
                    onClick={() => !isCollapsed && toggleMenu(item.name)}
                    className={twMerge(clsx(
                      "w-full flex items-center justify-between p-3 rounded-lg transition-colors group",
                      "hover:bg-light-gray/10 text-light-gray/80 hover:text-white",
                      isCollapsed && "justify-center"
                    ))}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 group-hover:text-[#e63946] transition-colors" />
                      {!isCollapsed && <span className="font-medium">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={twMerge(clsx(
                        "w-4 h-4 transition-transform",
                        expandedMenus.includes(item.name) && "rotate-180"
                      ))} />
                    )}
                  </button>
                  
                  {!isCollapsed && expandedMenus.includes(item.name) && (
                    <ul className="mt-1 ml-11 space-y-1">
                      {item.children.map(child => (
                        <li key={child.name}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) => twMerge(clsx(
                              "block py-2 px-3 rounded-lg text-sm transition-colors",
                              isActive 
                                ? "text-[#e63946] font-medium bg-light-gray/5" 
                                : "text-light-gray/60 hover:text-white hover:bg-light-gray/10"
                            ))}
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => twMerge(clsx(
                    "flex items-center justify-between p-3 rounded-lg transition-all group",
                    isActive 
                      ? "bg-[#e63946] text-white font-medium shadow-lg shadow-[#e63946]/20" 
                      : "text-light-gray/80 hover:bg-light-gray/10 hover:text-white",
                    isCollapsed && "justify-center"
                  ))}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={twMerge(clsx(
                      "w-5 h-5 transition-colors",
                      !item.isActive && "group-hover:text-[#e63946]" 
                    ))} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="bg-success text-[#222222] text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
