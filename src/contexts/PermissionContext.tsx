import React, { createContext, useContext } from 'react'
import { useAppSelector } from '../hooks/useRedux'

interface PermissionContextType {
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasFeatureAccess: (feature: string) => boolean
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
  const user = useAppSelector((state: any) => state.auth.user)

  // Mock permissions - in real app, this would come from API or Redux
  const userRoles = user?.role ? [user.role] : []
  const userPermissions: string[] = [] // Would be populated from user data

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role)
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => userRoles.includes(role))
  }

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => userRoles.includes(role))
  }

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => userPermissions.includes(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => userPermissions.includes(permission))
  }

  const hasFeatureAccess = (_feature: string): boolean => {
    // Mock feature access check
    // In real app, this would check tenant features and user permissions
    return true
  }

  const value: PermissionContextType = {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasFeatureAccess,
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}
