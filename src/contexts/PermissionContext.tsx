import React, { createContext, useContext } from 'react';
import { useAppSelector } from '../redux/store';
import { getAccessibleModules, hasModuleAccess } from '../config/navigation/moduleAccess';
import { isFeatureEnabled } from '../config/navigation/featureFlags';

interface PermissionContextType {
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  accessibleModules: string[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermission = () => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error('usePermission must be used within PermissionProvider');
  }

  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);

  // Current user role
  const userRole = user?.role ?? 'viewer';

  // Permissions from Redux
  const permissions = user?.permissions ?? [];

  // Temporary defaults until backend returns subscription info
  const subscriptionTier = 'starter';
  const userFeatureFlags = {};

  // Accessible navigation modules
  const accessibleModules = getAccessibleModules(userRole);

  const hasRole = (role: string): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(userRole);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => role === userRole);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes('*') || permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return (
      permissions.includes('*') ||
      requiredPermissions.some((permission) => permissions.includes(permission))
    );
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return (
      permissions.includes('*') ||
      requiredPermissions.every((permission) => permissions.includes(permission))
    );
  };

  const hasFeatureAccess = (feature: string): boolean => {
    return isFeatureEnabled(feature, subscriptionTier, userFeatureFlags);
  };

  const checkModuleAccess = (moduleId: string): boolean => {
    return hasModuleAccess(userRole, moduleId);
  };

  const value: PermissionContextType = {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeatureAccess,
    hasModuleAccess: checkModuleAccess,
    accessibleModules,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};