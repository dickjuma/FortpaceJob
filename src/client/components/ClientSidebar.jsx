import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../common/authStore';
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
  Building2,
  Users,
  Video,
  User,
  X
} from 'lucide-react';

const flatNavModules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
  { id: 'profile', label: 'My Profile', icon: User, path: '/client/profile' },
  { id: 'intelligence', label: 'Recommendation Profile', icon: Settings, path: '/client/profile-intelligence' },
  { id: 'browse', label: 'Browse Freelancers', icon: Search, path: '/client/talent-search' },
  { id: 'post', label: 'Post a Project', icon: PlusCircle, path: '/client-services/create-job' },
  { id: 'projects', label: 'My Projects', icon: Briefcase, path: '/client-services/my-jobs' },
  { id: 'proposals', label: 'Proposals', icon: FileText, path: '/client/proposals' },
  { id: 'contracts', label: 'Contracts', icon: FileText, path: '/client/contracts' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/client/messages' },
  { id: 'team', label: 'Team Management', icon: Users, path: '/client/team' },
  { id: 'collaboration', label: 'Collaboration Hub', icon: Users, path: '/client/collaboration-hub' },
  { id: 'interviews', label: 'Video Interviews', icon: Video, path: '/client/interviews' },
  { id: 'invoices', label: 'Invoices', icon: FileText, path: '/client/invoices' },
  { id: 'wallet', label: 'Wallet', icon: CreditCard, path: '/client/wallet' },
  { id: 'payments', label: 'Payments Dashboard', icon: CreditCard, path: '/client/financial-dashboard' },
  { id: 'reviews', label: 'Reviews', icon: Heart, path: '/client/reviews' },
  { id: 'favorites', label: 'Favorites', icon: Heart, path: '/client/shortlist' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/client/security-center' },
  { id: 'support', label: 'Support', icon: HelpCircle, path: '/client/support' }
];

export default function ClientSidebar({ isMobileOpen = false, setIsMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'CL';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.companyName || user?.firstName || 'Client User';
  const roleDisplay = user?.role === 'CLIENT' ? 'Client Workspace' : (user?.role || 'Corporate Client');

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col font-sans overflow-y-auto custom-scrollbar transform transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64`}>
      {/* Brand & Workspace Selector */}
      <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center shadow-lg shadow-[#4C1D95]/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">ForteSpace</h2>
            <div className="text-xs text-success font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success"></div> Client Portal
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {flatNavModules.map((module) => (
          <NavLink
            key={module.id}
            to={module.path}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-success bg-success/10 border border-success/20 shadow-inner'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <module.icon className={`w-5 h-5 ${isActive(module.path) ? 'text-success' : 'text-gray-400'}`} />
            {module.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 mb-3"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </button>
        <div
          onClick={() => navigate('/client/profile')}
          className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-success/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white font-bold text-xs shrink-0 border border-success/30">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
            <div className="text-[10px] text-gray-500 truncate uppercase">{roleDisplay}</div>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-success shrink-0" />
        </div>
      </div>
    </aside>
  );
}

