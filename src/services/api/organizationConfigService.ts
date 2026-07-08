/**
 * Organization Configuration API Service
 */

import { apiClient } from './client'

export interface OrganizationConfig {
  id: string
  tenantId: string
  logoUrl?: string
  businessName?: string
  industryCode?: string
  country?: string
  timezone?: string
  currency?: string
  businessHours?: any
  workingDays?: string[]
  holidayCalendar?: any[]
  approvalHierarchy?: any[]
  slaConfig?: any
  defaultLanguage?: string
  organizationSetupCompleted?: boolean
  setupCurrentStep?: number
  appliedDomainPackId?: string
  appliedWorkflowTemplateId?: string
  createdAt: string
  updatedAt?: string
}

class OrganizationConfigService {
  async getConfiguration() {
    const response = await apiClient.get<{ data: OrganizationConfig }>('/organization-config')
    return response.data.data
  }

  async updateConfiguration(data: Partial<Omit<OrganizationConfig, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) {
    const response = await apiClient.put<{ data: OrganizationConfig }>('/organization-config', data)
    return response.data.data
  }

  async completeSetup() {
    const response = await apiClient.post('/organization-config/complete-setup')
    return response.data
  }
}

export const organizationConfigService = new OrganizationConfigService()
