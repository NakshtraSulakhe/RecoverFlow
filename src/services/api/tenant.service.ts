import { apiClient } from './client';
import { ApiResponse, Tenant, PaginationParams, FilterParams } from './types';

export const tenantService = {
  async createTenant(data: Partial<Tenant>) {
    const response = await apiClient.post<ApiResponse<Tenant>>('/tenants', data);
    return response.data;
  },

  async getAllTenants(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Tenant[]>>('/tenants', { params } as any);
    return response.data;
  },

  async getTenantById(id: string) {
    const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return response.data;
  },

  async updateTenant(id: string, data: Partial<Tenant>) {
    const response = await apiClient.put<ApiResponse<Tenant>>(`/tenants/${id}`, data);
    return response.data;
  },

  async deleteTenant(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/tenants/${id}`);
    return response.data;
  },
};
