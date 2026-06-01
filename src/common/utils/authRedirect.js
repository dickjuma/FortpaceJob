import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export const buildReturnToPath = (location) => {
  if (!location) return '';
  const pathname = location.pathname || '';
  const search = location.search || '';
  const hash = location.hash || '';
  return `${pathname}${search}${hash}`;
};

export const resolveAuthReturnTo = (location) => {
  const state = location?.state || {};
  return (
    state.returnTo ||
    state.from ||
    ''
  );
};

export function useAuthRedirect(defaultPath = '/auth/login') {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const requireAuth = (action, options = {}) => {
    if (isAuthenticated) {
      if (typeof action === 'function') {
        return action();
      }
      return true;
    }

    navigate(options.fallbackPath || defaultPath, {
      state: {
        from: buildReturnToPath(location),
        returnTo: options.returnTo || buildReturnToPath(location),
        intent: options.intent || 'continue',
        ...options.state,
      },
    });
    return false;
  };

  return {
    isAuthenticated,
    requireAuth,
    returnTo: buildReturnToPath(location),
  };
}
