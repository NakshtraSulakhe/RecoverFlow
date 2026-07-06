import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { CircularProgress, Box } from '@mui/material';
import { isPlatformRole, isTenantRole, getRoleDashboardPath } from '../../utils/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  layout?: 'platform' | 'tenant' | 'any';
  allowPasswordChange?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
  layout = 'any',
  allowPasswordChange = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: '#09090b' }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (user.mustChangePassword && !allowPasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (layout === 'platform' && !isPlatformRole(user.role)) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  if (layout === 'tenant' && isPlatformRole(user.role)) {
    return <Navigate to="/platform/dashboard" replace />;
  }

  if (layout === 'tenant' && !isTenantRole(user.role) && !isPlatformRole(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermissions.length > 0 &&
    !user.permissions.includes('*') &&
    !requiredPermissions.every((permission) => user.permissions.includes(permission))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
