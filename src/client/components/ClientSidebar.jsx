import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../platform/common/authStore';
import {
  Building2,
  ChevronDown,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import {
  CLIENT_NAVIGATION,
  formatClientAccountType,
  getClientAccountType,
  isBusinessClient,
  isNavItemActive,
} from '../config/clientNavigation';

const ProfileCompletionWidget = () => {
  const [completion, setCompletion] = React.useState(0);
  
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('forte_access_token');
    if (!token) return;

    fetch('http://localhost:5000/api/profilesystem/profile/onboarding/status', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data?.completionPercentage !== undefined) {
          setCompletion(data.completionPercentage);
        } else if (data?.data?.completionPercentage !== undefined) {
          setCompletion(data.data.completionPercentage);
        } else if (data?.status?.completionPercentage !== undefined) {
          setCompletion(data.status.completionPercentage);
        }
      })
      .catch(err => console.error("Failed to fetch profile completion:", err));
  }, []);

  return (
    <div className="mb-4 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-gray-700">Profile Completion</span>
        <span className="text-xs font-black text-success">{Math.round(completion)}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-success rounded-full transition-all duration-700 ease-out"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
};

function SidebarSection({ module, isCollapsed, isOpen, onToggle, pathname, navigate }) {
  const Icon = module.icon;
  const active = module.children?.some((item) => isNavItemActive(item, pathname));

  if (!module.children) return null;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => {
          onToggle();
          if (module.href) {
            navigate(module.href);
          }
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
        aria-expanded={isOpen}
      >
        <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-success' : 'text-gray-400'}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{module.label}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && !isCollapsed && (
        <div className="space-y-0.5 border-l border-gray-100 pl-3">
          {module.children.map((item) => {
            const ItemIcon = item.icon || Icon;

            return (
              <NavLink
                key={item.id || item.path}
                to={item.path}
                end
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-success/10 font-bold text-success'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ItemIcon className={`h-4 w-4 ${item.badge ? 'text-gray-400' : ''}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-[#4C1D95]/10 px-1.5 py-0.5 text-[10px] font-black text-[#4C1D95]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ClientSidebar({ isMobileOpen = false, setIsMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const accountType = getClientAccountType(user);
  const isBusiness = isBusinessClient(user);
  const navModules = React.useMemo(
    () => (isBusiness ? CLIENT_NAVIGATION.business : CLIENT_NAVIGATION.individual),
    [isBusiness],
  );
  const [openGroups, setOpenGroups] = React.useState({});

  React.useEffect(() => {
    const next = {};
    navModules.forEach((module) => {
      if (module.children?.some((item) => isNavItemActive(item, location.pathname))) {
        next[module.id] = true;
      }
    });

    setOpenGroups((prev) => ({ ...prev, ...next }));
  }, [navModules, location.pathname]);

  const isActive = (path) => isNavItemActive({ path }, location.pathname);

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
  const roleDisplay = formatClientAccountType(accountType);

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col font-sans overflow-y-auto custom-scrollbar transform transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64`}>
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success shadow-lg shadow-[#4C1D95]/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900">ForteSpace</h2>
              <div className="flex items-center gap-1 text-xs font-medium text-success">
                <div className="h-1.5 w-1.5 rounded-full bg-success"></div>
                Client Portal
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6 custom-scrollbar">
        {navModules.map((module) => {
          if (!module.children) {
            const itemActive = isActive(module.path);

            return (
              <NavLink
                key={module.id}
                to={module.path}
                end
                onClick={() => setIsMobileOpen?.(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border border-success/20 bg-success/10 text-success shadow-inner'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <module.icon className={`h-5 w-5 ${itemActive ? 'text-success' : 'text-gray-400'}`} />
                <span className="truncate">{module.label}</span>
              </NavLink>
            );
          }

          return (
            <SidebarSection
              key={module.id}
              module={module}
              isCollapsed={false}
              isOpen={openGroups[module.id]}
              pathname={location.pathname}
              navigate={navigate}
              onToggle={() => setOpenGroups((prev) => ({ ...prev, [module.id]: !prev[module.id] }))}
            />
          );
        })}
      </nav>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <ProfileCompletionWidget />
        <button
          type="button"
          onClick={handleLogout}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 text-gray-400" />
          Logout
        </button>
        <button
          type="button"
          onClick={() => navigate('/client/profile')}
          className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left transition-colors hover:border-success/50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-success/30 bg-success text-xs font-bold text-white">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-gray-900">{displayName}</div>
            <div className="truncate text-[10px] font-semibold uppercase text-gray-500">{roleDisplay}</div>
          </div>
          <Settings className="h-4 w-4 shrink-0 text-gray-400 hover:text-success" />
        </button>
      </div>
    </aside>
  );
}
