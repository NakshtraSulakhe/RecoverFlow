/**
 * Tenant Context Provider
 * Global tenant state management
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Tenant, TenantSettings, TenantFeatures, TenantBranding } from '../types'

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
  error: string | null
  currentBranch: string | null
  currentDepartment: string | null
  setTenant: (tenant: Tenant) => void
  setCurrentBranch: (branchId: string | null) => void
  setCurrentDepartment: (departmentId: string | null) => void
  updateSettings: (settings: Partial<TenantSettings>) => void
  updateBranding: (branding: Partial<TenantBranding>) => void
  isFeatureEnabled: (feature: keyof TenantFeatures) => boolean
  getFeatureLimit: (feature: keyof TenantFeatures) => number | null
  checkLimit: (metric: keyof Tenant['usage']) => boolean
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: React.ReactNode
  initialTenant?: Tenant | null
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children, initialTenant = null }) => {
  const [tenant, setTenantState] = useState<Tenant | null>(initialTenant)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentBranch, setCurrentBranch] = useState<string | null>(null)
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null)

  const setTenant = useCallback((newTenant: Tenant) => {
    setTenantState(newTenant)
    setCurrentBranch(null)
    setCurrentDepartment(null)
  }, [])

  const updateSettings = useCallback((settings: Partial<TenantSettings>) => {
    if (tenant) {
      setTenantState({
        ...tenant,
        settings: {
          ...tenant.settings,
          ...settings,
        },
      })
    }
  }, [tenant])

  const updateBranding = useCallback((branding: Partial<TenantBranding>) => {
    if (tenant) {
      setTenantState({
        ...tenant,
        branding: {
          ...tenant.branding,
          ...branding,
        },
      })
    }
  }, [tenant])

  const isFeatureEnabled = useCallback((feature: keyof TenantFeatures): boolean => {
    if (!tenant) return false
    return tenant.features[feature]?.enabled || false
  }, [tenant])

  const getFeatureLimit = useCallback((feature: keyof TenantFeatures): number | null => {
    if (!tenant) return null
    return tenant.features[feature]?.limit || null
  }, [tenant])

  const checkLimit = useCallback((metric: keyof Tenant['usage']): boolean => {
    if (!tenant) return false
    
    const usage = tenant.usage[metric]
    if (!usage) return true
    
    if (usage.limit === -1) return true // unlimited
    return usage.used < usage.limit
  }, [tenant])

  const refreshTenant = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // This would typically call an API
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err: any) {
      setError(err.message || 'Failed to refresh tenant data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: TenantContextType = {
    tenant,
    isLoading,
    error,
    currentBranch,
    currentDepartment,
    setTenant,
    setCurrentBranch,
    setCurrentDepartment,
    updateSettings,
    updateBranding,
    isFeatureEnabled,
    getFeatureLimit,
    checkLimit,
    refreshTenant,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}
