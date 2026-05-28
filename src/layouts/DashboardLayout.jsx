import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Bell, MessageSquare, 
  Menu, X, Settings, Briefcase, FileText, 
  DollarSign, Star, TrendingUp, ShieldCheck, Zap
} from 'lucide-react';

// This would typically come from your auth context/store
const MOCK_USER_ROLE = 'client'; // 'client' or 'freelancer'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const freelancerNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/freelancer/dashboard' },
    { name: 'Discover Jobs', icon: Search, path: '/freelancer/jobs' },
    { name: 'My Proposals', icon: FileText, path: '/freelancer/proposals' },
    { name: 'Contracts', icon: Briefcase, path: '/freelancer/contracts' },
    { name: 'Earnings', icon: DollarSign, path: '/freelancer/earnings' },
    { name: 'Reviews', icon: Star, path: '/freelancer/reviews' },
    { name: 'Ranking', icon: TrendingUp, path: '/freelancer/ranking' },
    { name: 'Trust Score', icon: ShieldCheck, path: '/freelancer/trust' },
  ];

  const clientNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
    { name: 'Hire Freelancers', icon: Search, path: '/client/hire' },
    { name: 'Active Contracts', icon: Briefcase, path: '/client/contracts' },
    { name: 'Marketplace Insights', icon: TrendingUp, path: '/client/insights' },
    { name: 'Saved Talent', icon: Star, path: '/client/saved' },
    { name: 'Payments', icon: DollarSign, path: '/client/payments' },
  ];

  const navigation = MOCK_USER_ROLE === 'client' ? clientNav : freelancerNav;

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark text-zinc-900 dark:text-zinc-50 flex overflow-hidden">
      
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-white dark:bg-surface-dark border-r border-zinc-200 dark:border-zinc-800 z-20 transition-all duration-300"
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className={`flex items-center gap-2 overflow-hidden ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tight whitespace-nowrap">Forte</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          {navigation.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <a 
                key={item.name} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold' 
                    : 'text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white font-medium'
                }`}
                title={!sidebarOpen ? item.name : ""}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
                {sidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
                
                {/* Notification indicator logic could go here */}
                {sidebarOpen && item.name === 'Messages' && (
                  <span className="ml-auto w-5 h-5 flex items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full">3</span>
                )}
              </a>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <a href="/settings" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-zinc-500 hover:bg-surface dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white font-medium`}>
            <Settings className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </a>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:flex p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div className="hidden sm:flex items-center relative max-w-md w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search command palette (Cmd + K)"
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-surface-dark border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-zinc-800 rounded-xl outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {MOCK_USER_ROLE === 'client' && (
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                Post Job
              </button>
            )}
            
            <button className="relative p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
            </button>

            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
              </button>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-800 flex items-center justify-center overflow-hidden relative">
                <span className="text-sm font-bold">JD</span>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-zinc-800" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface dark:bg-surface-dark p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-dark/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-white dark:bg-surface-dark flex flex-col"
              onClick={e => e.stopPropagation()}
            >
               <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                  <span className="text-xl font-bold">Forte</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navigation.map(item => (
                  <a key={item.name} href={item.path} className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-600 dark:text-zinc-300 font-medium hover:bg-surface dark:hover:bg-zinc-800/50">
                    <item.icon className="w-5 h-5" /> {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
