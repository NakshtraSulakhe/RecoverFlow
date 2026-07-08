import { apiClient } from './client'

export interface BusinessUnit {
  id: string
  tenantId: string
  businessUnitCode: string
  businessUnitName: string
  businessUnitType: string
  description?: string
  parentId?: string | null
  managerId?: string | null
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  isActive: boolean
  deletedAt?: string | null
  createdAt: string
  updatedAt?: string
}

const mapBusinessUnitFromApi = (item: any): BusinessUnit => ({
  id: item.id,
  tenantId: item.tenant_id ?? item.tenantId,
  businessUnitCode: item.business_unit_code ?? item.businessUnitCode ?? item.code ?? '',
  businessUnitName: item.business_unit_name ?? item.businessUnitName ?? item.name ?? '',
  businessUnitType: item.business_unit_type ?? item.businessUnitType ?? item.type ?? 'DEPARTMENT',
  description: item.description,
  parentId: item.parent_id ?? item.parentId ?? null,
  managerId: item.manager_id ?? item.managerId ?? null,
  address: item.address,
  city: item.city,
  state: item.state,
  country: item.country,
  postalCode: item.postal_code ?? item.postalCode ?? null,
  isActive: item.is_active ?? item.isActive ?? true,
  deletedAt: item.deleted_at ?? item.deletedAt ?? null,
  createdAt: item.created_at ?? item.createdAt,
  updatedAt: item.updated_at ?? item.updatedAt,
})

const flattenBusinessUnits = (items: any[]): BusinessUnit[] => {
  const flattened: BusinessUnit[] = []

  const visit = (nodes: any[]) => {
    nodes.forEach((node) => {
      flattened.push(mapBusinessUnitFromApi(node))
      if (Array.isArray(node.children) && node.children.length > 0) {
        visit(node.children)
      }
    })
  }

  visit(items)
  return flattened
}

const mapBusinessUnitToPayload = (data: Partial<BusinessUnit>) => ({
  business_unit_code: data.businessUnitCode,
  business_unit_name: data.businessUnitName,
  business_unit_type: data.businessUnitType,
  description: data.description,
  parent_id: data.parentId ?? null,
  manager_id: data.managerId ?? null,
  address: data.address,
  city: data.city,
  state: data.state,
  country: data.country,
  postal_code: data.postalCode,
  is_active: data.isActive,
})

class BusinessUnitService {
  async getBusinessUnits() {
    const response = await apiClient.get<{ data: any[] }>('/business-units')
    const payload = Array.isArray(response.data?.data) ? response.data.data : []
    return flattenBusinessUnits(payload)
  }

  async getBusinessUnit(id: string) {
    const response = await apiClient.get<{ data: any }>(`/business-units/${id}`)
    return mapBusinessUnitFromApi(response.data.data)
  }

  async createBusinessUnit(data: Partial<BusinessUnit>) {
    const response = await apiClient.post<{ data: any }>('/business-units', mapBusinessUnitToPayload(data))
    return mapBusinessUnitFromApi(response.data.data)
  }

  async updateBusinessUnit(id: string, data: Partial<BusinessUnit>) {
    const response = await apiClient.put<{ data: any }>(`/business-units/${id}`, mapBusinessUnitToPayload(data))
    return mapBusinessUnitFromApi(response.data.data)
  }

  async deleteBusinessUnit(id: string) {
    const response = await apiClient.delete(`/business-units/${id}`)
    return response.data
  }
}

export const businessUnitService = new BusinessUnitService()
