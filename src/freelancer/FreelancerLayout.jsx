import React, { useState } from 'react';
import { Menu, Search, Bell, MessageSquare, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FreelancerSidebar from './components/FreelancerSidebar';
import { FreelancerProvider, useFreelancer } from './context/FreelancerContext';
import { cn } from '../admin/utils/cn';

// Inner layout component that consumes context
function FreelancerLayoutInner({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { accountType, switchAccountType, isOfflineProvider, toggleOfflineProvider } = useFreelancer();
  const [showSimulator, setShowSimulator] = useState(false);

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
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-navy hover:bg-light-gray rounded-md transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 bg-light-gray border border-transparent rounded-full text-sm text-text-primary outline-none focus:border-border focus:bg-white transition-all placeholder:text-text-secondary"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/freelancer/messages" className="p-2 text-text-secondary hover:text-navy hover:bg-light-gray rounded-full transition-colors relative">
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
            </Link>
            <button className="p-2 text-text-secondary hover:text-navy hover:bg-light-gray rounded-full transition-colors">
              <Bell size={20} />
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
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'INDIVIDUAL' ? "bg-navy text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  👤 Individual Freelancer
                </button>
                <button 
                  onClick={() => switchAccountType('SME')}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'SME' ? "bg-navy text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  🏢 SME
                </button>
                <button 
                  onClick={() => switchAccountType('AGENCY')}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'AGENCY' ? "bg-navy text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  🤝 Agency
                </button>
                <button 
                  onClick={() => switchAccountType('CORPORATE')}
                  className={cn("w-full text-left px-3 py-2 rounded-md text-sm font-bold transition-colors", accountType === 'CORPORATE' ? "bg-navy text-white" : "hover:bg-light-gray text-text-primary")}
                >
                  🏛️ Corporate Team
                </button>
                <div className="h-px bg-border my-2"></div>
                <button 
                  onClick={() => toggleOfflineProvider()}
                  className={cn("w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-bold transition-colors", isOfflineProvider ? "bg-accent-purple/10 text-accent-purple" : "hover:bg-light-gray text-text-primary")}
                >
                  <span>📍 Offline Services</span>
                  <div className={cn("w-8 h-4 rounded-full transition-colors relative", isOfflineProvider ? "bg-accent-purple" : "bg-border")}>
                    <div className={cn("absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform", isOfflineProvider ? "tranzinc-x-4" : "")}></div>
                  </div>
                </button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowSimulator(!showSimulator)}
            className="w-12 h-12 bg-accent-purple text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent-purple/90 transition-transform hover:scale-105"
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
    <FreelancerProvider>
      <FreelancerLayoutInner>
        {children}
      </FreelancerLayoutInner>
    </FreelancerProvider>
  );
}
