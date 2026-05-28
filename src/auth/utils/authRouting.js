export const normalizeRole = (role) => String(role || '').toUpperCase();

export const isAdminRole = (role) => {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'SUPER_ADMIN';
};

export const getDashboardPathForRole = (role) => {
  const normalized = normalizeRole(role);

  if (isAdminRole(normalized)) return '/admin';
  if (normalized === 'CLIENT' || normalized === 'COMPANY') return '/client/dashboard';
  return '/freelancer/dashboard';
};

export const getPostVerificationPathForRole = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === 'CLIENT' || normalized === 'COMPANY') {
    return '/client/dashboard';
  }

  return '/auth/skills';
};
