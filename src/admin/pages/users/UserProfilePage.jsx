import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, User, Briefcase, Building2, Shield, Settings, History, Lock, FileText, Star, Activity } from 'lucide-react';
import { fetchUserById } from '../../api/users/users.api';
import UserProfileHeader from '../../components/users/profile/UserProfileHeader';
import FreelancerProfilePanel from '../../components/users/profile/FreelancerProfilePanel';
import ClientProfilePanel from '../../components/users/profile/ClientProfilePanel';
import AdminProfilePanel from '../../components/users/profile/AdminProfilePanel';
import ProfileAuditTab from '../../components/users/profile/ProfileAuditTab';
import Skeleton from '../../components/ui/Skeleton';
import { cn } from '../../utils/cn';

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={cn(
      "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all",
      active 
        ? "border-[#14a800]/20 text-[#14a800] bg-[#14a800]/5/30" 
        : "border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-surface dark:hover:bg-zinc-800/50"
    )}
  >
    <Icon size={14} />
    {label}
  </button>
);

/**
 * Detailed comprehensive profile view for any platform user.
 */
const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-[280px] w-full rounded-[40px]" />
        <div className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-3xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <User size={40} />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">User Not Found</h1>
        <p className="text-zinc-500 mt-2 max-w-sm font-medium italic">The specified user ID could not be retrieved from the directory.</p>
        <button 
          onClick={() => navigate('/admin/users')}
          className="mt-8 px-6 py-3 bg-surface-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#14a800] transition-all active:scale-95 shadow-xl"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const getTabs = () => {
    const common = [{ id: 'overview', label: 'Overview', icon: User }];
    if (user.userGroup === 'freelancer') {
      return [
        ...common,
        { id: 'skills', label: 'Skills & Gigs', icon: Briefcase },
        { id: 'contracts', label: 'Contracts', icon: FileText },
        { id: 'finance', label: 'Earnings', icon: Lock },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'audit', label: 'Audit Trail', icon: History },
      ];
    }
    if (user.userGroup === 'client') {
      return [
        ...common,
        { id: 'jobs', label: 'Posted Jobs', icon: Briefcase },
        { id: 'contracts', label: 'Contracts', icon: FileText },
        { id: 'payments', label: 'Payment History', icon: History },
        { id: 'audit', label: 'Audit Trail', icon: History },
      ];
    }
    return [
      ...common,
      { id: 'permissions', label: 'Permissions', icon: Lock },
      { id: 'activity', label: 'Activity Log', icon: Activity },
      { id: 'audit', label: 'Audit Trail', icon: History },
    ];
  };

  const tabs = getTabs();

  const renderTabContent = () => {
    if (activeTab === 'audit') return <ProfileAuditTab user={user} />;
    
    switch (user.userGroup) {
      case 'freelancer': return <FreelancerProfilePanel user={user} activeTab={activeTab} />;
      case 'client': return <ClientProfilePanel user={user} activeTab={activeTab} />;
      case 'admin': return <AdminProfilePanel user={user} activeTab={activeTab} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#14a800] transition-colors"
      >
        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-[#14a800]/5 dark:group-hover:bg-[#14a800]/20 transition-colors">
          <ChevronLeft size={14} />
        </div>
        Back to Users List
      </button>

      {/* Profile Header */}
      <UserProfileHeader user={user} />

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <TabButton 
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.id}
            onClick={(id) => {
              setActiveTab(id);
              setSearchParams(id === 'overview' ? {} : { tab: id });
            }}
          />
        ))}
      </div>

      {/* Tab Area */}
      <div className="animate-in fade-in slide-up duration-500 fill-mode-both">
        {renderTabContent()}
      </div>
    </div>
  );
};



export default UserProfilePage;
