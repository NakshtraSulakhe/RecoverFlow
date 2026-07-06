import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams } from './types';

export interface Module {
  id: string;
  module_code: string;
  module_name: string;
  category: string;
  description?: string;
  icon?: string;
  route?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  is_core_module: boolean;
  is_add_on: boolean;
  requires_subscription_tier?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantModuleWithInherited extends Module {
  has_assignment: boolean;
  tenant_enabled: boolean;
  is_custom: boolean;
  overrides_subscription: boolean;
}

export const moduleService = {
  async getAllModules(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Module[]>>('/modules', { params });
    return response.data;
  },

  async getModuleById(id: string) {
    const response = await apiClient.get<ApiResponse<Module>>(`/v1/modules/${id}`);
    return response.data;
  },

  async createModule(data: Partial<Module>) {
    const response = await apiClient.post<ApiResponse<Module>>('/modules', data);
    return response.data;
  },

  async updateModule(id: string, data: Partial<Module>) {
    const response = await apiClient.put<ApiResponse<Module>>(`/v1/modules/${id}`, data);
    return response.data;
  },

  async deleteModule(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/v1/modules/${id}`);
    return response.data;
  },

  async getTenantModules(tenantId: string) {
    const response = await apiClient.get<ApiResponse<any[]>>(`/v1/tenant-modules/tenant/${tenantId}`);
    return response.data;
  },

  async getTenantModulesWithInherited(tenantId: string) {
    const response = await apiClient.get<ApiResponse<TenantModuleWithInherited[]>>(`/v1/tenant-modules/tenant/${tenantId}/with-inherited`);
    return response.data;
  },

  async updateTenantModule(tenantId: string, moduleId: string, data: {
    is_enabled: boolean;
    is_custom: boolean;
    overrides_subscription: boolean;
  }) {
    const response = await apiClient.put<ApiResponse<any>>(
      `/v1/tenant-modules/tenant/${tenantId}/module/${moduleId}`,
      data
    );
    return response.data;
  },

  async enableTenantModule(tenantId: string, moduleId: string) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/v1/tenant-modules/tenant/${tenantId}/module/${moduleId}/enable`
    );
    return response.data;
  },

  async disableTenantModule(tenantId: string, moduleId: string) {
    const response = await apiClient.post<ApiResponse<any>>(
      `/v1/tenant-modules/tenant/${tenantId}/module/${moduleId}/disable`
    );
    return response.data;
  },
};
