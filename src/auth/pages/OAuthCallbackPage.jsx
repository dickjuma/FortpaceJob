import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '../../common/services/api';
import { useAuthStore } from '../../common/authStore';
import { getDashboardPathForRole } from '../utils/authRouting';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [status, setStatus] = useState('Connecting your account...');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const finishLogin = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const oauthError = searchParams.get('oauthError');
        const returnTo = searchParams.get('returnTo');

        if (oauthError) {
          throw new Error(oauthError);
        }

        if (!accessToken && !refreshToken) {
          setStatus('Loading your profile from secure cookies...');
        } else {
          setStatus('Loading your profile...');
        }

        const meResponse = await authAPI.getMe();
        const data = meResponse?.user || meResponse;
        const user = data?.user || data;
        const requiresEmailVerification = data?.requiresEmailVerification || meResponse?.requiresEmailVerification;
        const requiresLoginVerification = data?.requiresLoginVerification || meResponse?.requiresLoginVerification;

        if (requiresEmailVerification) {
          sessionStorage.setItem('pendingVerificationEmail', user?.email || '');
          sessionStorage.setItem('pendingVerificationRole', user?.role || '');
          navigate('/auth/verify-email', {
            state: { email: user?.email, role: user?.role, returnTo },
            replace: true,
          });
          return;
        }

        if (requiresLoginVerification) {
          sessionStorage.setItem('pendingLoginVerificationEmail', user?.email || '');
          navigate('/auth/verify-login', {
            state: { userId: user?.id, email: user?.email, returnTo },
            replace: true,
          });
          return;
        }

        if (cancelled) return;

        if (accessToken || refreshToken) {
          setAuth(user, accessToken || null, refreshToken || null);
        } else {
          setAuth(user, null, null);
        }
        const safeReturnTo = returnTo && returnTo.startsWith('/') ? returnTo : '';
        navigate(safeReturnTo || getDashboardPathForRole(user?.role), { replace: true });
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Social sign-in failed.');
        setStatus('');
      }
    };

    finishLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-zinc-200 text-center">
        {!error ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#4C1D95] mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Finishing sign in</h1>
            <p className="text-zinc-500">{status}</p>
          </>
        ) : (
          <>
            <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sign in could not be completed</h1>
            <p className="text-zinc-600 mb-6">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/auth/login', { replace: true })}
              className="inline-flex items-center justify-center rounded-xl bg-[#4C1D95] px-5 py-3 font-semibold text-white hover:bg-[#22C55E] transition-colors"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}


