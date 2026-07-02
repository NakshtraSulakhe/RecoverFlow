import { apiClient } from './client';
import { ApiResponse, Tenant, PaginationParams, FilterParams } from './types';

export interface TenantStats {
  users: number;
  customers: number;
  loans: number;
  cases: number;
}

export const tenantService = {
  async createTenant(data: Partial<Tenant>) {
    const response = await apiClient.post<ApiResponse<Tenant>>('/v1/tenants', data);
    return response.data;
  },

  async getAllTenants(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Tenant[]>>('/v1/tenants', { params } as any);
    return response.data;
  },

  async getTenantById(id: string) {
    const response = await apiClient.get<ApiResponse<Tenant>>(`/v1/tenants/${id}`);
    return response.data;
  },

  async updateTenant(id: string, data: Partial<Tenant>) {
    const response = await apiClient.put<ApiResponse<Tenant>>(`/v1/tenants/${id}`, data);
    return response.data;
  },

  async deleteTenant(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/v1/tenants/${id}`);
    return response.data;
  },

  async suspendTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/v1/tenants/${id}/suspend`);
    return response.data;
  },

  async activateTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/v1/tenants/${id}/activate`);
    return response.data;
  },

  async archiveTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/v1/tenants/${id}/archive`);
    return response.data;
  },

  async getTenantStats(id: string) {
    const response = await apiClient.get<ApiResponse<TenantStats>>(`/v1/tenants/${id}/stats`);
    return response.data;
  },
};
