// @ts-nocheck
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore as useAdminAuthStore } from '../store/authStore';
import { useAuthStore as useCommonAuthStore } from '../../common/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ADMIN_ROLES = new Set([
  'ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'SUPPORT_ADMIN',
  'OPERATIONS_ADMIN', 'FINANCIAL_ADMIN', 'MODERATION_ADMIN', 
  'FRAUD_SECURITY_ADMIN', 'CHAT_SUPPORT_ADMIN',
]);

const ROLE_HIERARCHY = {
  ADMIN: 100, SUPER_ADMIN: 100, SUPPORT: 50, MODERATOR: 75,
  OPERATIONS_ADMIN: 60, FINANCIAL_ADMIN: 60, MODERATION_ADMIN: 75,
  FRAUD_SECURITY_ADMIN: 75, CHAT_SUPPORT_ADMIN: 50,
  FREELANCER: 10, CLIENT: 5,
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [...ADMIN_ROLES],
  redirectTo = '/auth/login',
}) => {
  const { isAuthenticated, user, isLoading } = useAdminAuthStore();
  const commonAuth = useCommonAuthStore();
  const location = useLocation();

  // Check both admin and common auth stores
  const hasAuth = isAuthenticated || commonAuth.isAuthenticated;
  const currentUser = user || commonAuth.user;

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C1D95]"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!hasAuth) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role
  const userRole = String(currentUser?.role || '').toUpperCase();
  
  // Normalize role check - allow parent roles
  const hasPermission = allowedRoles.some(role => {
    const normalized = String(role).toUpperCase();
    if (userRole === normalized) return true;
    
    // Check if user role has sufficient hierarchy
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[normalized] || 0;
    
    return userLevel >= requiredLevel;
  }) || ADMIN_ROLES.has(userRole);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;