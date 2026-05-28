// @ts-nocheck
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { Toaster } from 'react-hot-toast';

const AppShell = () => {
  const { 
    sidebarOpen, 
    theme,
    toggleSidebar 
  } = useUIStore();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) toggleSidebar();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      theme === 'dark' ? "bg-surface-dark text-zinc-100" : "bg-surface text-zinc-900"
    )}>
      <Toaster position="top-right" />

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-surface-dark/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 custom-scrollbar scroll-smooth">
            <div className="max-w-[1600px] mx-auto animate-in slide-up duration-500">
               <Outlet />
            </div>
          </main>
          
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
