import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/sidebar/Sidebar";
import {
  Search,
  Bell,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  LayoutGrid,
} from "lucide-react";

import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import Avatar from "../components/ui/Avatar";
import UserManagementModals from "../components/users/modals/UserManagementModals";
import apiClient from "../api/apiClient";

const AdminLayout = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar, theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isDarkMode = theme === 'dark';
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notificationsData } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      try {
        const json = await apiClient.get("/notifications");
        return json?.data || json || [];
      } catch {
        return [];
      }
    },
    refetchInterval: 30000, // fetch every 30s
  });

  const notifications = notificationsData || [];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className={`relative flex min-h-screen font-sans overflow-hidden ${isDarkMode ? "bg-zinc-900 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#222222]/80 backdrop-blur-sm transition-all sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar - Desktop & Mobile */}
<div
         className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out sm:relative sm:translate-x-0 ${
           sidebarOpen ? "translate-x-0" : "-translate-x-full"
         }`}
       >
        <Sidebar />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Modern Top Header */}
        <header
          className={`flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 transition-colors sm:px-6 xl:px-8 ${
            isDarkMode
              ? "border-white/10 bg-zinc-900/50 backdrop-blur-xl"
              : "border-zinc-200 bg-white/50 backdrop-blur-xl"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              onClick={toggleSidebar}
              className={`rounded-xl p-2 transition-colors sm:hidden ${
                isDarkMode
                  ? "text-zinc-400 hover:bg-white/10 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Menu size={24} />
            </button>

            <nav className="hidden min-w-0 items-center gap-2 text-sm md:flex">
              <Link to="/admin" className="text-zinc-500 transition-colors hover:text-success">
                <LayoutGrid size={16} />
              </Link>
              {pathSegments.map((segment, index) => {
                const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
                const isLast = index === pathSegments.length - 1;

                return (
                  <React.Fragment key={url}>
                    <ChevronRight size={14} className="text-zinc-400" />
                    <Link
                      to={url}
                      className={`truncate capitalize ${
                        isLast
                          ? "pointer-events-none font-bold text-success"
                          : "text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {segment.replace(/-/g, " ")}
                    </Link>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="relative hidden group md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-success"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`w-40 rounded-full border py-2 pl-10 pr-4 text-sm outline-none transition-all lg:w-56 xl:w-72 ${
                  isDarkMode
                    ? "border-white/10 bg-zinc-800 text-zinc-200 focus:border-success/50 focus:ring-1 focus:ring-success/50"
                    : "border-zinc-200 bg-white text-zinc-900 focus:border-success/50 focus:ring-1 focus:ring-success/50"
                }`}
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 lg:border-l lg:border-zinc-200 dark:lg:border-zinc-700 lg:pl-6">
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2 transition-colors ${
                  isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative rounded-full p-2 transition-colors ${
                    isDarkMode ? "text-zinc-400 hover:bg-white/10" : "text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success ring-2 ring-white dark:ring-zinc-900"></span>
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#222222] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-zinc-100 dark:border-white/10 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Notifications</h3>
                      <button className="text-xs text-success font-medium hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-zinc-50 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm ${notif.unread ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>{notif.title}</p>
                            {notif.unread && <span className="w-2 h-2 rounded-full bg-success"></span>}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10">
                      <button className="text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-success transition-colors">View All Notifications</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden items-center gap-3 border-l border-zinc-200 pl-2 dark:border-zinc-700 sm:flex lg:pl-4">
              <div className="text-right">
                <p className="mb-1 truncate text-[10px] font-medium leading-none text-zinc-500">
                  {user ? user.role : 'Development'}
                </p>
                <p className="truncate text-sm font-bold leading-none text-zinc-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : "Admin User"}
                </p>
              </div>
              <div className="relative shrink-0 cursor-pointer transition-transform hover:scale-105">
                <Avatar
                  src={user?.avatar}
                  name={user ? `${user.firstName} ${user.lastName}` : "Admin User"}
                  size="md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success dark:border-zinc-900" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar sm:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <UserManagementModals />
    </div>
  );
};

export default AdminLayout;
