/**
 * Tenant API Service
 */

import { apiClient } from '../api'
import { Tenant, TenantBranding, TenantSettings, TenantSecurity } from '../../features/tenant/types'

class TenantService {
  /**
   * Get all tenants for current user
   */
  async getTenants() {
    const response = await apiClient.get('/tenants')
    return response.data
  }

  /**
   * Get current tenant
   */
  async getCurrentTenant(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}`)
    return response.data
  }

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, data: Partial<Tenant>) {
    const response = await apiClient.put(`/tenants/${tenantId}`, data)
    return response.data
  }

  /**
   * Update branding
   */
  async updateBranding(tenantId: string, branding: Partial<TenantBranding>) {
    const response = await apiClient.put(`/tenants/${tenantId}/branding`, branding)
    return response.data
  }

  /**
   * Update settings
   */
  async updateSettings(tenantId: string, settings: Partial<TenantSettings>) {
    const response = await apiClient.put(`/tenants/${tenantId}/settings`, settings)
    return response.data
  }

  /**
   * Update security settings
   */
  async updateSecurity(tenantId: string, security: Partial<TenantSecurity>) {
    const response = await apiClient.put(`/tenants/${tenantId}/security`, security)
    return response.data
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(tenantId: string, params?: any) {
    const response = await apiClient.get(`/tenants/${tenantId}/audit`, params)
    return response.data
  }

  /**
   * Switch tenant
   */
  async switchTenant(tenantId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/switch`)
    return response.data
  }

  /**
   * Upload logo
   * TODO: Implement file upload in apiClient
   */
  async uploadLogo(tenantId: string, file: File) {
    // const response = await apiClient.upload(`/tenants/${tenantId}/logo`, file)
    // return response.data
    throw new Error('File upload not implemented yet')
  }

  /**
   * Delete logo
   */
  async deleteLogo(tenantId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/logo/delete`)
    return response.data
  }
}

export const tenantService = new TenantService()
