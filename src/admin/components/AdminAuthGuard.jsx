import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function GuardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#14a800] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-zinc-500">Verifying admin session…</p>
      </div>
    </div>
  );
}

export default function AdminAuthGuard() {
  const location = useLocation();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [status, setStatus] = useState(isAuthenticated ? 'ok' : 'loading');

  useEffect(() => {
    if (isAuthenticated) {
      setStatus('ok');
      return;
    }

    let active = true;
    checkAuth().then((ok) => {
      if (active) setStatus(ok ? 'ok' : 'denied');
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, checkAuth]);

  if (status === 'loading') return <GuardLoading />;
  if (status === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
