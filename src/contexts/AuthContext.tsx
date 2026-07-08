import React, { createContext, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { logout as logoutThunk } from '../redux/slices/authSlice'

type AuthContextValue = {
  user: any
  tenant: any
  user_type?: string
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  checkAuth: () => Promise<boolean>
  hasRole: (roles: string | string[]) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const useReduxAuthValue = (): AuthContextValue => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const tenantState = useAppSelector((state) => state.tenant)
  const tenant = (tenantState as any).currentTenant || (tenantState as any).tenant || {
    id: user?.tenantId,
    tenant_name: user?.tenantName,
    subscription_tier: user?.subscriptionTier,
    enabled_modules: user?.enabledModules,
  }
  const userType = user?.role || user?.user_type || 'read_only'

  const hasRole = (roles: string | string[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(userType)
  }

  const hasPermission = (permission: string) => {
    const permissions = user?.permissions || []
    return permissions.includes('*') || permissions.includes(permission)
  }

  return {
    user: user ? { ...user, user_type: userType } : null,
    tenant,
    user_type: userType,
    isAuthenticated,
    isLoading,
    logout: () => { void dispatch(logoutThunk()) },
    checkAuth: async () => isAuthenticated,
    hasRole,
    hasPermission,
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useReduxAuthValue()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const reduxValue = useReduxAuthValue()
  const contextValue = useContext(AuthContext)
  return contextValue || reduxValue
}

export default AuthContext

