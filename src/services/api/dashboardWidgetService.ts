import { apiClient } from './client'

export interface DashboardWidgetConfig {
  id: string
  tenantId: string
  roleId: string
  widgetType: string
  widgetConfig: any
  positionX: number
  positionY: number
  width: number
  height: number
  isDefault: boolean
  isActive: boolean
}

const mapWidget = (item: any): DashboardWidgetConfig => ({
  id: item.id,
  tenantId: item.tenant_id ?? item.tenantId,
  roleId: item.role_id ?? item.roleId,
  widgetType: item.widget_type ?? item.widgetType,
  widgetConfig: item.widget_config ?? item.widgetConfig ?? {},
  positionX: item.position_x ?? item.positionX ?? 0,
  positionY: item.position_y ?? item.positionY ?? 0,
  width: item.width ?? 4,
  height: item.height ?? 2,
  isDefault: item.is_default ?? item.isDefault ?? false,
  isActive: item.is_active ?? item.isActive ?? true,
})

const toPayload = (data: Partial<DashboardWidgetConfig>) => ({
  role_id: data.roleId,
  widget_type: data.widgetType,
  widget_config: data.widgetConfig,
  position_x: data.positionX,
  position_y: data.positionY,
  width: data.width,
  height: data.height,
  is_default: data.isDefault,
  is_active: data.isActive,
})

class DashboardWidgetService {
  async getWidgets() {
    const response = await apiClient.get<{ data: any[] }>('/dashboard-widgets')
    return (response.data.data || []).map(mapWidget)
  }

  async getWidgetsByRole(roleId: string) {
    const response = await apiClient.get<{ data: any[] }>(`/dashboard-widgets/role/${roleId}`)
    return (response.data.data || []).map(mapWidget)
  }

  async createWidget(data: Partial<DashboardWidgetConfig>) {
    const response = await apiClient.post<{ data: any }>('/dashboard-widgets', toPayload(data))
    return mapWidget(response.data.data)
  }

  async updateWidget(id: string, data: Partial<DashboardWidgetConfig>) {
    const response = await apiClient.put<{ data: any }>(`/dashboard-widgets/${id}`, toPayload(data))
    return mapWidget(response.data.data)
  }

  async deleteWidget(id: string) {
    const response = await apiClient.delete(`/dashboard-widgets/${id}`)
    return response.data
  }

  async resetWidgets(roleId: string) {
    const response = await apiClient.post<{ data: any[] }>('/dashboard-widgets/reset', { role_id: roleId })
    return (response.data.data || []).map(mapWidget)
  }
}

export const dashboardWidgetService = new DashboardWidgetService()
