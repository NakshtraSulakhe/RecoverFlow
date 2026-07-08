/**
 * Custom Field API Service
 */

import { apiClient } from './client'

export interface CustomField {
  id: string
  tenantId: string
  fieldCode: string
  fieldName: string
  description?: string
  fieldType: string
  isRequired: boolean
  fieldConfig?: any
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

class CustomFieldService {
  async getCustomFields() {
    const response = await apiClient.get<{ data: CustomField[] }>('/custom-fields')
    return response.data.data
  }

  async getCustomField(id: string) {
    const response = await apiClient.get<{ data: CustomField }>(`/custom-fields/${id}`)
    return response.data.data
  }

  async createCustomField(data: Partial<Omit<CustomField, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem'>>) {
    const response = await apiClient.post<{ data: CustomField }>('/custom-fields', data)
    return response.data.data
  }

  async updateCustomField(id: string, data: Partial<Omit<CustomField, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem' | 'fieldCode' | 'fieldType'>>) {
    const response = await apiClient.put<{ data: CustomField }>(`/custom-fields/${id}`, data)
    return response.data.data
  }

  async deleteCustomField(id: string) {
    const response = await apiClient.delete(`/custom-fields/${id}`)
    return response.data
  }
}

export const customFieldService = new CustomFieldService()
