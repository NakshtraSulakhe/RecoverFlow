/**
 * Communication Template API Service
 */

import { apiClient } from './client'

export interface CommunicationTemplate {
  id: string
  tenantId: string
  templateCode: string
  templateName: string
  description?: string
  channel: string
  subject?: string
  content: string
  templateVariables?: any
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

class CommunicationTemplateService {
  async getCommunicationTemplates() {
    const response = await apiClient.get<{ data: CommunicationTemplate[] }>('/communication-templates')
    return response.data.data
  }

  async getCommunicationTemplate(id: string) {
    const response = await apiClient.get<{ data: CommunicationTemplate }>(`/communication-templates/${id}`)
    return response.data.data
  }

  async createCommunicationTemplate(data: Partial<Omit<CommunicationTemplate, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem'>>) {
    const response = await apiClient.post<{ data: CommunicationTemplate }>('/communication-templates', data)
    return response.data.data
  }

  async updateCommunicationTemplate(id: string, data: Partial<Omit<CommunicationTemplate, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem' | 'templateCode' | 'channel'>>) {
    const response = await apiClient.put<{ data: CommunicationTemplate }>(`/communication-templates/${id}`, data)
    return response.data.data
  }

  async deleteCommunicationTemplate(id: string) {
    const response = await apiClient.delete(`/communication-templates/${id}`)
    return response.data
  }
}

export const communicationTemplateService = new CommunicationTemplateService()
