/**
 * Subscription API Service
 */

import { apiClient } from '../api'
import { TenantSubscription } from '../../features/tenant/types'

class SubscriptionService {
  /**
   * Get tenant subscription
   */
  async getSubscription(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/subscription`)
    return response.data
  }

  /**
   * Update subscription
   */
  async updateSubscription(tenantId: string, data: Partial<TenantSubscription>) {
    const response = await apiClient.put(`/tenants/${tenantId}/subscription`, data)
    return response.data
  }

  /**
   * Get invoices
   */
  async getInvoices(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/subscription/invoices`)
    return response.data
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/subscription/payments`)
    return response.data
  }

  /**
   * Upgrade plan
   */
  async upgradePlan(tenantId: string, plan: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/subscription/upgrade`, { plan })
    return response.data
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(tenantId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/subscription/cancel`)
    return response.data
  }

  /**
   * Renew subscription
   */
  async renewSubscription(tenantId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/subscription/renew`)
    return response.data
  }
}

export const subscriptionService = new SubscriptionService()
