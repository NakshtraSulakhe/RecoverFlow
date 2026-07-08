import { apiClient } from './client'

export interface IndustryTemplate {
  id: string
  industryCode: string
  industryName: string
  description?: string
  logoUrl?: string
  defaultBusinessUnits?: any[]
  defaultWorkflows?: any[]
  defaultModules?: string[]
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

const mapIndustry = (item: any): IndustryTemplate => ({
  id: item.id,
  industryCode: item.industry_code ?? item.industryCode,
  industryName: item.industry_name ?? item.industryName,
  description: item.description,
  logoUrl: item.logo_url ?? item.logoUrl,
  defaultBusinessUnits: item.default_business_units ?? item.defaultBusinessUnits ?? [],
  defaultWorkflows: item.default_workflows ?? item.defaultWorkflows ?? [],
  defaultModules: item.default_modules ?? item.defaultModules ?? [],
  isActive: item.is_active ?? item.isActive ?? true,
  createdAt: item.created_at ?? item.createdAt,
  updatedAt: item.updated_at ?? item.updatedAt,
})

class IndustryTemplateService {
  async getIndustryTemplates() {
    const response = await apiClient.get<{ data: any[] }>('/industry-templates')
    return (response.data.data || []).map(mapIndustry)
  }

  async getIndustryTemplate(code: string) {
    const response = await apiClient.get<{ data: any }>(`/industry-templates/${code}`)
    return mapIndustry(response.data.data)
  }
}

export const industryTemplateService = new IndustryTemplateService()
