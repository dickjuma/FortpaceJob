import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  Building2
} from 'lucide-react';

const flatNavModules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
  { id: 'browse', label: 'Browse Freelancers', icon: Search, path: '/client/talent-search' },
  { id: 'post', label: 'Post a Project', icon: PlusCircle, path: '/client-services/create-job' },
  { id: 'projects', label: 'My Projects', icon: Briefcase, path: '/client-services/my-jobs' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/client/collaboration-hub' },
  { id: 'proposals', label: 'Proposals', icon: FileText, path: '/client/proposals' },
  { id: 'payments', label: 'Payments & Invoices', icon: CreditCard, path: '/client/financial-dashboard' },
  { id: 'favorites', label: 'Favorites', icon: Heart, path: '/client/shortlist' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/client/security-center' },
  { id: 'support', label: 'Support', icon: HelpCircle, path: '/client/support' }
];

export default function ClientSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col font-sans shrink-0 overflow-y-auto custom-scrollbar">
      {/* Brand & Workspace Selector */}
      <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-vivid-lavender rounded-lg flex items-center justify-center shadow-lg shadow-vivid-lavender/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">ForteSpace</h2>
            <div className="text-xs text-vivid-green font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-vivid-green"></div> Client Portal
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {flatNavModules.map((module) => (
          <NavLink 
            key={module.id}
            to={module.path}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'text-vivid-lavender bg-vivid-lavender/10 border border-vivid-lavender/20 shadow-inner' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <module.icon className={`w-5 h-5 ${isActive(module.path) ? 'text-vivid-lavender' : 'text-gray-400'}`} />
            {module.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 mb-3">
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </button>
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-vivid-lavender/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-dark-purple flex items-center justify-center text-white font-bold text-xs shrink-0 border border-vivid-lavender/30">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">John Doe</div>
            <div className="text-[10px] text-gray-500 truncate">Corporate Client</div>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-vivid-lavender shrink-0" />
        </div>
      </div>
    </aside>
  );
}
