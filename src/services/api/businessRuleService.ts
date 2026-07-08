import { apiClient } from './client'

export interface BusinessRule {
  id: string
  tenantId: string
  ruleCode: string
  ruleName: string
  ruleType: string
  description?: string
  conditions?: any
  actions?: any
  priority?: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

const mapRule = (item: any): BusinessRule => ({
  id: item.id,
  tenantId: item.tenant_id ?? item.tenantId,
  ruleCode: item.rule_code ?? item.ruleCode,
  ruleName: item.rule_name ?? item.ruleName,
  ruleType: item.rule_type ?? item.ruleType,
  description: item.description,
  conditions: item.conditions ?? {},
  actions: item.actions ?? [],
  priority: item.priority ?? 0,
  isActive: item.is_active ?? item.isActive ?? true,
  createdAt: item.created_at ?? item.createdAt,
  updatedAt: item.updated_at ?? item.updatedAt,
})

const toPayload = (data: Partial<BusinessRule>) => ({
  rule_code: data.ruleCode,
  rule_name: data.ruleName,
  rule_type: data.ruleType,
  description: data.description,
  conditions: data.conditions ?? {},
  actions: data.actions ?? [],
  priority: data.priority,
  is_active: data.isActive,
})

class BusinessRuleService {
  async getBusinessRules() {
    const response = await apiClient.get<{ data: any[] }>('/business-rules')
    return (response.data.data || []).map(mapRule)
  }

  async getBusinessRule(id: string) {
    const response = await apiClient.get<{ data: any }>(`/business-rules/${id}`)
    return mapRule(response.data.data)
  }

  async createBusinessRule(data: Partial<BusinessRule>) {
    const response = await apiClient.post<{ data: any }>('/business-rules', toPayload(data))
    return mapRule(response.data.data)
  }

  async updateBusinessRule(id: string, data: Partial<BusinessRule>) {
    const response = await apiClient.put<{ data: any }>(`/business-rules/${id}`, toPayload(data))
    return mapRule(response.data.data)
  }

  async deleteBusinessRule(id: string) {
    const response = await apiClient.delete(`/business-rules/${id}`)
    return response.data
  }
}

export const businessRuleService = new BusinessRuleService()
