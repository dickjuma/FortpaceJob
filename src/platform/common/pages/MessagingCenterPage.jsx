import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../authStore';
import { getDashboardPathForRole } from '../../auth/utils/authRouting';

/**
 * Public /messages route — redirects to role-specific real inbox.
 */
export default function MessagingCenterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true, state: { from: '/messages' } });
      return;
    }

    const role = String(user?.role || '').toUpperCase();
    if (role === 'CLIENT') {
      navigate('/client/messages', { replace: true });
      return;
    }
    if (role === 'FREELANCER') {
      navigate('/freelancer/messages', { replace: true });
      return;
    }
    if (role.includes('ADMIN')) {
      navigate('/admin/marketplace/chat', { replace: true });
      return;
    }

    navigate(getDashboardPathForRole(user?.role), { replace: true });
  }, [isAuthenticated, navigate, user?.role]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Loader2 className="w-8 h-8 animate-spin text-[#4C1D95]" />
    </div>
  );
}


