import React, { useState, useMemo, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeft, X, Plus, Zap, Gift, LogOut } from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useFreelancer } from '../context/FreelancerContext';
import { useAuthStore } from '../../platform/common/authStore';
import { useFreelancerWallet } from '../services/freelancerHooks';
import { getFreelancerNavSections } from '../config/freelancerNavigation';

export default function FreelancerSidebar({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) {
  const { accountType, isOfflineProvider } = useFreelancer();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: walletData } = useFreelancerWallet();
  const availableBalance = walletData?.availableBalance || walletData?.available || 0;

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (key) => {
    if (isCollapsed) return; // Prevent dropdown toggle when collapsed
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navSections = useMemo(
    () => getFreelancerNavSections(accountType, isOfflineProvider),
    [accountType, isOfflineProvider],
  );

  useEffect(() => {
    setOpenDropdowns((prev) => {
      const next = { ...prev };

      navSections.forEach((section) => {
        if (!(section.key in next)) {
          next[section.key] = section.key === 'dashboard';
        }
      });

      Object.keys(next).forEach((key) => {
        if (!navSections.some((section) => section.key === key)) {
          delete next[key];
        }
      });

      return next;
    });
  }, [navSections]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#222222]/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 h-screen bg-white border-r border-border z-50 flex flex-col transition-all duration-300 shadow-sm",
        isMobileOpen ? "tranzinc-x-0" : "-tranzinc-x-full lg:tranzinc-x-0",
        isCollapsed ? "w-20" : "w-72"
      )}>

        {/* Header Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0 bg-white">
          <Link to="/freelancer" className={cn("flex items-center gap-2 overflow-hidden transition-all duration-300", isCollapsed ? "w-8" : "w-auto")}>
            <div className="w-8 h-8 bg-[#222222] rounded-lg flex items-center justify-center font-black text-white shadow-sm shrink-0">
              F
            </div>
            {!isCollapsed && <span className="font-black text-lg tracking-tight text-[#222222] whitespace-nowrap">Forte Space</span>}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-md transition-colors"
            >
              {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Top Profile Area */}
        <div className={cn(
          "p-4 border-b border-border transition-all duration-300 overflow-hidden",
          isCollapsed ? "px-2" : "px-4"
        )}>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 mx-auto">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-text-primary truncate">{user?.firstName || 'User'} {user?.lastName || ''}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-sm uppercase tracking-wider truncate">
                    {accountType} PRO
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">Wallet Balance</span>
                <span className="font-bold text-text-primary">KES {availableBalance.toLocaleString()}</span>
              </div>
              <Link to="/freelancer/gigs/create" className="w-full flex items-center justify-center gap-2 bg-[#4C1D95] hover:bg-[#22C55E] text-white py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                <Plus size={16} /> Create Service
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 space-y-6">
          {navSections.map(section => {
            const isOpen = openDropdowns[section.key] || isCollapsed; // Keep open structure if collapsed to render links as icons

            return (
              <div key={section.key} className="space-y-1">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleDropdown(section.key)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-light-gray/50 transition-colors group"
                  >
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{section.title}</span>
                    <ChevronDown size={14} className={cn("text-text-secondary transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>
                )}

                {/* Optional collapsed section divider/icon */}
                {isCollapsed && (
                  <div className="flex justify-center mb-2 mt-4 relative group">
                    <div className="w-8 h-[1px] bg-border my-2" />
                  </div>
                )}

                {(isOpen || isCollapsed) && (
                  <div className={cn("space-y-0.5", isCollapsed ? "px-3" : "px-2 pl-4")}>
                    {section.links.map(link => {
                      const LinkIcon = link.icon;
                      return (
                        <NavLink
                          key={link.name}
                          to={link.path}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 py-2 rounded-lg transition-all relative group",
                            isCollapsed ? "justify-center px-0" : "px-3",
                            isActive ? "bg-success/10 text-success font-bold" : "text-text-secondary hover:text-[#222222] hover:bg-light-gray font-medium"
                          )}
                        >
                          {({ isActive }) => (
                            <>
                              <LinkIcon size={isCollapsed ? 20 : 18} className={cn("shrink-0 transition-colors", isActive ? "text-success" : "text-text-secondary group-hover:text-[#222222]")} />

                              {!isCollapsed && (
                                <span className="text-sm truncate">{link.name}</span>
                              )}

                              {/* Tooltip for collapsed mode */}
                              {isCollapsed && (
                                <div className="absolute left-full ml-3 px-2 py-1 bg-[#222222] text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                  {link.name}
                                </div>
                              )}

                              {/* Active indicator bar */}
                              {isActive && !isCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-success rounded-r-full" />
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border bg-white space-y-1 shrink-0">
          <NavLink
            to="/freelancer/upgrade"
            className={({ isActive }) => cn(
              "flex items-center gap-3 py-2 rounded-lg transition-all relative group",
              isCollapsed ? "justify-center px-0" : "px-3",
              isActive ? "bg-warning/10 text-warning font-bold" : "text-text-secondary hover:text-warning hover:bg-warning/5 font-medium"
            )}
          >
            <Zap size={isCollapsed ? 20 : 18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm">Upgrade Plan</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#222222] text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Upgrade Plan
              </div>
            )}
          </NavLink>
          <NavLink
            to="/freelancer/referrals"
            className={({ isActive }) => cn(
              "flex items-center gap-3 py-2 rounded-lg transition-all relative group",
              isCollapsed ? "justify-center px-0" : "px-3",
              isActive ? "bg-success/10 text-success font-bold" : "text-text-secondary hover:text-[#222222] hover:bg-light-gray font-medium"
            )}
          >
            <Gift size={isCollapsed ? 20 : 18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm">Referral Program</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#222222] text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Referral Program
              </div>
            )}
          </NavLink>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/auth/login', { replace: true });
            }}
            className={cn(
              "w-full flex items-center gap-3 py-2 rounded-lg transition-all relative group text-text-secondary hover:text-[#e63946] hover:bg-[#e63946]/5 font-medium",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
          >
            <LogOut size={isCollapsed ? 20 : 18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm">Log out</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-[#222222] text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Log out
              </div>
            )}
          </button>
        </div>

      </aside>
    </>
  );
}

