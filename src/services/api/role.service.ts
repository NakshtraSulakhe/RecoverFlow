import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams, Role, Permission } from './types';

export const roleService = {
  async getAllRoles(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Role[]>>('/roles', { params });
    return response.data;
  },

  async getRoleById(id: string) {
    const response = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
    return response.data;
  },

  async createRole(data: Partial<Role>) {
    const response = await apiClient.post<ApiResponse<Role>>('/roles', data);
    return response.data;
  },

  async updateRole(id: string, data: Partial<Role>) {
    const response = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/roles/${id}`);
    return response.data;
  },

  async cloneRole(id: string, newName: string, newCode: string) {
    const response = await apiClient.post<ApiResponse<Role>>(`/roles/${id}/clone`, {
      name: newName,
      code: newCode,
    });
    return response.data;
  },
};
