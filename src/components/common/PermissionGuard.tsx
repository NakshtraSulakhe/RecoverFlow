import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PermissionGuardProps {
  children: React.ReactNode;
  module: string;
  action?: string;
  fallbackPath?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  module,
  action = 'view',
  fallbackPath = '/app/dashboard',
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkPermission();
  }, [module, action]);

  const checkPermission = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/auth/check-permission?module=${module}&action=${action}`);
      const data = await response.json();
      setHasPermission(data.success && data.data?.hasPermission || false);
    } catch (error) {
      console.error('Failed to check permission:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Checking permissions...
        </Typography>
      </Box>
    );
  }

  if (!hasPermission) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RequirePermissionProps {
  module: string;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  module,
  action = 'view',
  fallback = null,
  children,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, [module, action]);

  const checkPermission = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/auth/check-permission?module=${module}&action=${action}`);
      const data = await response.json();
      setHasPermission(data.success && data.data?.hasPermission || false);
    } catch (error) {
      console.error('Failed to check permission:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
