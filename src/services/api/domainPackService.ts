import { apiClient } from './client'

export interface DomainPack {
  id: string
  tenantId?: string
  industryCode?: string
  packCode: string
  packName: string
  description?: string
  isSystemPack: boolean
  isActive: boolean
  defaultModules?: string[]
  defaultBusinessUnits?: any[]
  defaultWorkflows?: any[]
  defaultRoles?: any[]
  defaultDashboard?: any[]
  defaultReports?: any[]
  defaultBusinessRules?: any[]
  defaultCommunicationTemplates?: any[]
  createdAt: string
  updatedAt?: string
}

const mapPack = (item: any): DomainPack => ({
  id: item.id,
  tenantId: item.tenant_id ?? item.tenantId,
  industryCode: item.industry_code ?? item.industryCode,
  packCode: item.pack_code ?? item.packCode,
  packName: item.pack_name ?? item.packName,
  description: item.description,
  isSystemPack: item.is_system_pack ?? item.isSystemPack ?? false,
  isActive: item.is_active ?? item.isActive ?? true,
  defaultModules: item.default_modules ?? item.defaultModules ?? [],
  defaultBusinessUnits: item.default_business_units ?? item.defaultBusinessUnits ?? [],
  defaultWorkflows: item.default_workflows ?? item.defaultWorkflows ?? [],
  defaultRoles: item.default_roles ?? item.defaultRoles ?? [],
  defaultDashboard: item.default_dashboard ?? item.defaultDashboard ?? [],
  defaultReports: item.default_reports ?? item.defaultReports ?? [],
  defaultBusinessRules: item.default_business_rules ?? item.defaultBusinessRules ?? [],
  defaultCommunicationTemplates: item.default_communication_templates ?? item.defaultCommunicationTemplates ?? [],
  createdAt: item.created_at ?? item.createdAt,
  updatedAt: item.updated_at ?? item.updatedAt,
})

class DomainPackService {
  async getDomainPacks() {
    const response = await apiClient.get<{ data: any[] }>('/domain-packs')
    return (response.data.data || []).map(mapPack)
  }

  async getDomainPack(id: string) {
    const response = await apiClient.get<{ data: any }>(`/domain-packs/${id}`)
    return mapPack(response.data.data)
  }

  async createDomainPack(data: Partial<DomainPack>) {
    const response = await apiClient.post<{ data: any }>('/domain-packs', data)
    return mapPack(response.data.data)
  }

  async updateDomainPack(id: string, data: Partial<DomainPack>) {
    const response = await apiClient.put<{ data: any }>(`/domain-packs/${id}`, data)
    return mapPack(response.data.data)
  }

  async deleteDomainPack(id: string) {
    const response = await apiClient.delete(`/domain-packs/${id}`)
    return response.data
  }

  async applyDomainPack(packId: string) {
    const response = await apiClient.post('/domain-packs/apply', { packId })
    return response.data
  }
}

export const domainPackService = new DomainPackService()
