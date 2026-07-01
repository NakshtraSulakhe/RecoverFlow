/**
 * Feature Flag API Service
 */

import { apiClient } from '../api'
import { TenantFeatures } from '../../features/tenant/types'

class FeatureFlagService {
  /**
   * Get tenant feature flags
   */
  async getFeatures(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/features`)
    return response.data
  }

  /**
   * Update feature flags
   */
  async updateFeatures(tenantId: string, features: Partial<TenantFeatures>) {
    const response = await apiClient.put(`/tenants/${tenantId}/features`, features)
    return response.data
  }

  /**
   * Toggle single feature
   */
  async toggleFeature(tenantId: string, featureKey: string, enabled: boolean) {
    const response = await apiClient.patch(`/tenants/${tenantId}/features/${featureKey}`, { enabled })
    return response.data
  }

  /**
   * Update feature limit
   */
  async updateFeatureLimit(tenantId: string, featureKey: string, limit: number | undefined) {
    const response = await apiClient.patch(`/tenants/${tenantId}/features/${featureKey}/limit`, { limit })
    return response.data
  }
}

export const featureFlagService = new FeatureFlagService()
