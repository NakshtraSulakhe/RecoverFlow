import { apiClient } from './client'

export interface WorkflowTemplate {
  id: string
  tenantId?: string
  templateCode: string
  templateName: string
  description?: string
  industryCode?: string
  isSystemTemplate: boolean
  isActive: boolean
  stages?: any[]
  transitions?: any[]
  slaConfig?: any
  createdAt: string
  updatedAt?: string
}

const mapTemplate = (item: any): WorkflowTemplate => ({
  id: item.id,
  tenantId: item.tenant_id ?? item.tenantId,
  templateCode: item.template_code ?? item.templateCode,
  templateName: item.template_name ?? item.templateName,
  description: item.description,
  industryCode: item.industry_code ?? item.industryCode,
  isSystemTemplate: item.is_system_template ?? item.isSystemTemplate ?? false,
  isActive: item.is_active ?? item.isActive ?? true,
  stages: item.stages ?? [],
  transitions: item.transitions ?? [],
  slaConfig: item.sla_config ?? item.slaConfig ?? {},
  createdAt: item.created_at ?? item.createdAt,
  updatedAt: item.updated_at ?? item.updatedAt,
})

class WorkflowTemplateService {
  async getWorkflowTemplates() {
    const response = await apiClient.get<{ data: any[] }>('/workflow-templates')
    return (response.data.data || []).map(mapTemplate)
  }

  async getWorkflowTemplate(id: string) {
    const response = await apiClient.get<{ data: any }>(`/workflow-templates/${id}`)
    return mapTemplate(response.data.data)
  }

  async createWorkflowTemplate(data: Partial<WorkflowTemplate>) {
    const response = await apiClient.post<{ data: any }>('/workflow-templates', data)
    return mapTemplate(response.data.data)
  }

  async updateWorkflowTemplate(id: string, data: Partial<WorkflowTemplate>) {
    const response = await apiClient.put<{ data: any }>(`/workflow-templates/${id}`, data)
    return mapTemplate(response.data.data)
  }

  async applyWorkflowTemplate(id: string) {
    const response = await apiClient.post(`/workflow-templates/${id}/apply`)
    return response.data
  }

  async deleteWorkflowTemplate(id: string) {
    const response = await apiClient.delete(`/workflow-templates/${id}`)
    return response.data
  }
}

export const workflowTemplateService = new WorkflowTemplateService()
