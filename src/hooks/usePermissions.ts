import { useState, useEffect } from 'react';

interface PermissionCheck {
  hasPermission: boolean;
  loading: boolean;
}

export const usePermission = (module: string, action: string): PermissionCheck => {
  const [hasPermission, setHasPermission] = useState(false);
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

  return { hasPermission, loading };
};

interface MultiplePermissions {
  [key: string]: boolean;
}

export const usePermissions = (
  checks: Array<{ module: string; action: string }>
): { permissions: MultiplePermissions; loading: boolean } => {
  const [permissions, setPermissions] = useState<MultiplePermissions>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAllPermissions();
  }, [checks]);

  const checkAllPermissions = async () => {
    setLoading(true);
    const results: MultiplePermissions = {};

    try {
      const promises = checks.map(async ({ module, action }) => {
        const key = `${module}.${action}`;
        try {
          const response = await fetch(`/api/v1/auth/check-permission?module=${module}&action=${action}`);
          const data = await response.json();
          results[key] = data.success && data.data?.hasPermission || false;
        } catch (error) {
          console.error(`Failed to check permission for ${key}:`, error);
          results[key] = false;
        }
      });

      await Promise.all(promises);
      setPermissions(results);
    } catch (error) {
      console.error('Failed to check permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return { permissions, loading };
};

export const canPerformAction = (
  permissions: MultiplePermissions,
  module: string,
  action: string
): boolean => {
  return permissions[`${module}.${action}`] || false;
};
