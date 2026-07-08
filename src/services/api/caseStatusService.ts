/**
 * Case Status API Service
 */

import { apiClient } from './client'

export interface CaseStatus {
  id: string
  tenantId: string
  statusCode: string
  statusName: string
  description?: string
  color?: string
  icon?: string
  orderIndex?: number
  category?: string
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

class CaseStatusService {
  async getCaseStatuses() {
    const response = await apiClient.get<{ data: CaseStatus[] }>('/case-statuses')
    return response.data.data
  }

  async getCaseStatus(id: string) {
    const response = await apiClient.get<{ data: CaseStatus }>(`/case-statuses/${id}`)
    return response.data.data
  }

  async createCaseStatus(data: Partial<Omit<CaseStatus, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem'>>) {
    const response = await apiClient.post<{ data: CaseStatus }>('/case-statuses', data)
    return response.data.data
  }

  async updateCaseStatus(id: string, data: Partial<Omit<CaseStatus, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem' | 'statusCode'>>) {
    const response = await apiClient.put<{ data: CaseStatus }>(`/case-statuses/${id}`, data)
    return response.data.data
  }

  async deleteCaseStatus(id: string) {
    const response = await apiClient.delete(`/case-statuses/${id}`)
    return response.data
  }
}

export const caseStatusService = new CaseStatusService()
