import React, { Suspense, lazy } from 'react';
import { useAuthStore } from '../store/authStore';
import Skeleton from '../components/ui/Skeleton';
import { ShieldAlert } from 'lucide-react';

// Lazy load role-specific dashboards
const SuperAdminDashboard = lazy(() => import('../components/role-views/SuperAdminDashboard'));
const FinanceAdminDashboard = lazy(() => import('../components/role-views/FinanceAdminDashboard'));
const CustomerCareDashboard = lazy(() => import('../components/role-views/CustomerCareDashboard'));
const ModerationDashboard = lazy(() => import('../components/role-views/ModerationDashboard'));
const FraudSecurityDashboard = lazy(() => import('../components/role-views/FraudSecurityDashboard'));
const ChatSupportDashboard = lazy(() => import('../components/role-views/ChatSupportDashboard'));

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuthStore();

  if (authLoading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-64 h-4" />
          </div>
          <Skeleton className="w-32 h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin': return <SuperAdminDashboard />;
      case 'finance_admin': return <FinanceAdminDashboard />;
      case 'customer_care': return <CustomerCareDashboard />;
      case 'moderation_admin': return <ModerationDashboard />;
      case 'fraud_security_admin': return <FraudSecurityDashboard />;
      case 'chat_support_admin': return <ChatSupportDashboard />;
      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
              <ShieldAlert size={40} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Access Restricted</h1>
            <p className="text-zinc-500 mt-2 max-w-sm font-medium">Your current role profile is not configured for dashboard access.</p>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Skeleton variant="card" className="w-1/2 h-1/2" /></div>}>
      <div className="animate-in fade-in duration-700">
        {renderDashboard()}
      </div>
    </Suspense>
  );
};

export default DashboardPage;
