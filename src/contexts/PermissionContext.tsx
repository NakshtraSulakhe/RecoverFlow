import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { getAccessibleModules, hasModuleAccess } from '../config/navigation/moduleAccess'
import { isFeatureEnabled } from '../config/navigation/featureFlags'
import { hasFeatureAccess as hasSubscriptionFeature } from '../config/navigation/subscriptionFeatures'
import { ROLE_PERMISSIONS } from '../constants/features'

interface PermissionContextType {
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasFeatureAccess: (feature: string) => boolean
  hasModuleAccess: (moduleId: string) => boolean
  accessibleModules: string[]
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export const usePermission = () => {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}

interface PermissionProviderProps {
  children: React.ReactNode
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user, tenant } = useAuth()
  
  const userRole = user?.user_type || 'read_only'
  const subscriptionTier = tenant?.subscription_tier || 'starter'
  const userFeatureFlags = tenant?.feature_flags || {}

  // Get role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  
  // Get accessible modules for this role
  const accessibleModules = getAccessibleModules(userRole)

  const hasRole = (role: string): boolean => {
    return userRole === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(userRole)
  }

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.includes(userRole)
  }

  const hasPermission = (permission: string): boolean => {
    // Check if role has wildcard permission
    if (rolePermissions.includes('*')) return true
    return rolePermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (rolePermissions.includes('*')) return true
    return permissions.some((permission) => rolePermissions.includes(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (rolePermissions.includes('*')) return true
    return permissions.every((permission) => rolePermissions.includes(permission))
  }

  const hasFeatureAccess = (feature: string): boolean => {
    return isFeatureEnabled(feature, subscriptionTier, userFeatureFlags)
  }

  const checkModuleAccess = (moduleId: string): boolean => {
    return hasModuleAccess(userRole, moduleId)
  }

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
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}
