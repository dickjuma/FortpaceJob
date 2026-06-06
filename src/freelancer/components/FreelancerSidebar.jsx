import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Search, Briefcase, UserCircle, MessageSquare, BarChart2,
  ChevronDown, Bell, Wallet, LayoutDashboard, FileText, ShoppingCart, Calendar,
  DollarSign, Star, Receipt, Layers, PlusSquare, Heart, Send,
  Users, FolderKanban, Building2, Building, Shield, ShieldCheck, Folder, Upload, Share2,
  Download, BadgeCheck, Lock, Blocks, Palette, HelpCircle, Ticket,
  MessageCircle, GraduationCap, Zap, Gift, LogOut, PanelLeftClose, PanelLeft, Plus,
  MapPin, CalendarCheck, Compass, Map, Video, ArrowUpRight, Smartphone, Globe, Bookmark
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import { useFreelancer } from '../context/FreelancerContext';
import { useAuthStore } from '../../common/authStore';
import { useFreelancerWallet } from '../services/freelancerHooks';

export default function FreelancerSidebar({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) {
  const { accountType, isOfflineProvider } = useFreelancer();
  const { user, logout } = useAuthStore();
  const { data: walletData } = useFreelancerWallet();
  const availableBalance = walletData?.availableBalance || walletData?.available || 0;

  // Track open dropdowns (desktop & mobile)
  const [openDropdowns, setOpenDropdowns] = useState({
    main: true,
    business: false,
    marketplace: false,
    account: false,
    support: false,
    offline: true,
  });

  const toggleDropdown = (key) => {
    if (isCollapsed) return; // Prevent dropdown toggle when collapsed
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getNavSections = () => {
    const sections = [
      {
        key: 'main',
        title: 'MAIN',
        icon: LayoutDashboard,
        links: [
          { name: 'Dashboard', path: '/freelancer/dashboard', icon: LayoutDashboard },
          { name: 'Find Work', path: '/freelancer/jobs', icon: Search },
          { name: 'Work History', path: '/freelancer/my-jobs', icon: Briefcase },
          { name: 'Orders', path: '/freelancer/orders', icon: ShoppingCart },
          { name: 'Contracts', path: '/freelancer/contracts', icon: FileText },
          { name: 'Disputes', path: '/freelancer/disputes', icon: Shield },
          { name: 'Messages', path: '/freelancer/messages', icon: MessageSquare },
          { name: 'Calendar', path: '/freelancer/calendar', icon: Calendar },
        ]
      },
      {
        key: 'business',
        title: 'BUSINESS',
        icon: Briefcase,
        links: [
          { name: 'Wallet', path: '/freelancer/wallet', icon: Wallet },
          { name: 'Escrow', path: '/freelancer/escrow', icon: ShieldCheck },
          { name: 'Withdrawals', path: '/freelancer/withdrawal', icon: ArrowUpRight },
          { name: 'Payment Setup', path: '/freelancer/payment-setup', icon: Smartphone },
          { name: 'Earnings', path: '/freelancer/earnings', icon: DollarSign },
          { name: 'Analytics', path: '/freelancer/analytics', icon: BarChart2 },
          { name: 'Reviews', path: '/freelancer/reviews', icon: Star },
          { name: 'Invoices', path: '/freelancer/tax-invoices', icon: Receipt },
        ]
      },
      {
        key: 'marketplace',
        title: 'MARKETPLACE',
        icon: Layers,
        links: [
          { name: 'My Services', path: '/freelancer/gigs', icon: Layers },
          { name: 'Create Service', path: '/freelancer/gigs/create', icon: PlusSquare },
          { name: 'Portfolio', path: '/freelancer/portfolio', icon: Upload },
          { name: 'Saved Jobs', path: '/freelancer/saved-jobs', icon: Heart },
          { name: 'Proposals', path: '/freelancer/proposals', icon: Send },
          { name: 'Remote Jobs', path: '/freelancer/remote-jobs', icon: Globe },
          { name: 'Hybrid Jobs', path: '/freelancer/hybrid-jobs', icon: MapPin },
          { name: 'Global Search', path: '/freelancer/global-search-results', icon: Search },
          { name: 'Bookmarks', path: '/freelancer/global-bookmarks', icon: Bookmark },
        ]
      },
      {
        key: 'account',
        title: 'ACCOUNT',
        icon: UserCircle,
        links: [
          { name: 'My Profile', path: '/freelancer/profile', icon: UserCircle },
          { name: 'Verification', path: '/freelancer/verification-center', icon: BadgeCheck },
          { name: 'Notification Settings', path: '/freelancer/notifications', icon: Bell },
          { name: 'Privacy & Security', path: '/freelancer/security', icon: Lock },
          { name: 'API Integrations', path: '/freelancer/api', icon: Blocks },
          { name: 'Appearance Settings', path: '/freelancer/appearance', icon: Palette },
        ]
      },
      {
        key: 'support',
        title: 'SUPPORT',
        icon: HelpCircle,
        links: [
          { name: 'Help Center', path: '/freelancer/help', icon: HelpCircle },
          { name: 'Support Tickets', path: '/freelancer/tickets', icon: Ticket },
          { name: 'Community', path: '/freelancer/community-forum', icon: MessageCircle },
          { name: 'Tutorials', path: '/freelancer/tutorials', icon: GraduationCap },
        ]
      }
    ];

    if (isOfflineProvider) {
      sections.push({
        key: 'offline',
        title: 'LOCAL & OFFLINE',
        icon: MapPin,
        links: [
          { name: 'Nearby Jobs', path: '/freelancer/nearby-jobs', icon: MapPin },
        ]
      });
    }

    return sections;
  };

  const navSections = getNavSections();

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
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-text-secondary hover:text-[#222222] hover:bg-light-gray rounded-md transition-colors"
          >
            {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
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
              <Link to="/freelancer/gigs/create" className="w-full flex items-center justify-center gap-2 bg-[#2bb75c] hover:bg-[#1d8d38] text-white py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
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
                                <div className="absolute left-0 top-1/2 -tranzinc-y-1/2 w-1 h-5 bg-success rounded-r-full" />
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
            onClick={logout}
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

