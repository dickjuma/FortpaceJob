import React, { useState } from 'react';
import { Menu, Search, Bell, MessageSquare, Settings2, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FreelancerSidebar from './components/FreelancerSidebar';
import { FreelancerProvider, useFreelancer } from './context/FreelancerContext';
import { FREELANCER_WORK_MODES } from '../platform/common/constants/accountTypes';
import { SocketProvider } from '../platform/common/context/SocketContext';
import { getToken } from '../platform/common/services/api';
import { cn } from '../admin/utils/cn';
import useChatStore from '../platform/store/chatStore';
import { useNotificationSocket } from '../platform/common/hooks/useNotificationSocket';

// Inner layout component that consumes context
function FreelancerLayoutInner({ children }) {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const { accountType, switchAccountType, workMode, setWorkMode } = useFreelancer();
  const [showSimulator, setShowSimulator] = useState(false);
  const unreadCount = useChatStore((s) => s.unreadNotificationCount);

  // Bridge SocketContext socket → chatStore notifications + toast
  useNotificationSocket();

  return (
    <div className="flex h-screen overflow-hidden bg-light-gray font-sans text-text-primary">
      
      {/* Sidebar */}
      <FreelancerSidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Minimal Top Bar */}
        <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-md transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <form
              className="hidden md:flex relative group"
              onSubmit={(e) => {
                e.preventDefault();
                const q = headerSearch.trim();
                navigate(q ? `/freelancer/jobs?q=${encodeURIComponent(q)}` : '/freelancer/jobs');
              }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 bg-light-gray border border-transparent rounded-full text-sm text-text-primary outline-none focus:border-border focus:bg-white transition-all placeholder:text-text-secondary"
              />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/freelancer/messages" className="p-2 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-full transition-colors relative">
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#e63946] rounded-full"></span>
            </Link>
            <Link
              to="/freelancer/bookings"
              className="p-2 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-full transition-colors relative hidden sm:inline-flex"
              title="Video calls and bookings"
            >
              <Video size={20} />
            </Link>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

            {/* Profile Avatar */}
            <Link to="/freelancer/profile" className="flex items-center gap-2 p-1 hover:bg-light-gray rounded-full transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover border border-border" 
              />
            </Link>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
        
        {/* GLOBAL DEMO SIMULATOR (To be removed in production) */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showSimulator && (
            <div className="bg-white border border-border shadow-2xl rounded-xl p-4 w-64 animate-in slide-in-from-bottom-4">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Backend Simulator</p>
              <div className="space-y-2">
                <button 
                  onClick={() => switchAccountType('INDIVIDUAL')}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'INDIVIDUAL' ? "bg-[#222222] text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  👤 Individual Freelancer
                </button>
                <button 
                  onClick={() => switchAccountType('BUSINESS')}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'BUSINESS' ? "bg-[#222222] text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  🏢 Business
                </button>
                <div className="h-px bg-border my-2"></div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1 mb-1">Work mode</p>
                {FREELANCER_WORK_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setWorkMode(mode.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors',
                      workMode === mode.id ? 'bg-success/10 text-success' : 'hover:bg-light-gray text-text-primary'
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowSimulator(!showSimulator)}
            className="w-12 h-12 bg-success text-white rounded-full shadow-lg flex items-center justify-center hover:bg-success/90 transition-transform hover:scale-105"
            title="Toggle Account Type Simulator"
          >
            <Settings2 size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}

// Wrap the entire layout in the provider so all child pages have access to the context
export default function FreelancerLayout({ children }) {
  return (
    <SocketProvider token={getToken()}>
      <FreelancerProvider>
        <FreelancerLayoutInner>{children}</FreelancerLayoutInner>
      </FreelancerProvider>
    </SocketProvider>
  );
}
