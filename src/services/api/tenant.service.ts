import { apiClient } from './client';
import { ApiResponse, Tenant, PaginationParams, FilterParams } from './types';

export interface TenantStats {
  users: number;
  customers: number;
  loans: number;
  cases: number;
}

export interface CreateTenantPayload extends Partial<Tenant> {
  admin_first_name?: string;
  admin_last_name?: string;
  admin_email?: string;
  admin_password?: string;
}

export const tenantService = {
  async createTenant(data: CreateTenantPayload) {
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

  async suspendTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/tenants/${id}/suspend`);
    return response.data;
  },

  async activateTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/tenants/${id}/activate`);
    return response.data;
  },

  async archiveTenant(id: string) {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/tenants/${id}/archive`);
    return response.data;
  },

  async getTenantStats(id: string) {
    const response = await apiClient.get<ApiResponse<TenantStats>>(`/tenants/${id}/stats`);
    return response.data;
  },
};
