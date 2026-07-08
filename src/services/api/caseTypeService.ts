/**
 * Case Type API Service
 */

import { apiClient } from './client'

export interface CaseType {
  id: string
  tenantId: string
  caseTypeCode: string
  caseTypeName: string
  description?: string
  icon?: string
  color?: string
  workflowTemplateId?: string
  assignmentRuleId?: string
  priorityRuleId?: string
  defaultStatusId?: string
  requiredDocuments?: any
  communicationTemplates?: any
  slaConfig?: any
  customFields?: any
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

class CaseTypeService {
  async getCaseTypes() {
    const response = await apiClient.get<{ data: CaseType[] }>('/case-types')
    return response.data.data
  }

  async getCaseType(id: string) {
    const response = await apiClient.get<{ data: CaseType }>(`/case-types/${id}`)
    return response.data.data
  }

  async createCaseType(data: Partial<Omit<CaseType, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem'>>) {
    const response = await apiClient.post<{ data: CaseType }>('/case-types', data)
    return response.data.data
  }

  async updateCaseType(id: string, data: Partial<Omit<CaseType, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem' | 'caseTypeCode'>>) {
    const response = await apiClient.put<{ data: CaseType }>(`/case-types/${id}`, data)
    return response.data.data
  }

  async deleteCaseType(id: string) {
    const response = await apiClient.delete(`/case-types/${id}`)
    return response.data
  }
}

export const caseTypeService = new CaseTypeService()
