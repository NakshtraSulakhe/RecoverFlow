import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams } from './types';

export interface Permission {
  id: string;
  module_code: string;
  permission_code: string;
  name: string;
  description?: string;
  permission_type: 'module' | 'page' | 'action' | 'feature';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const permissionService = {
  async getAllPermissions(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Permission[]>>('/permissions', { params });
    return response.data;
  },

  async getPermissionById(id: string) {
    const response = await apiClient.get<ApiResponse<Permission>>(`/permissions/${id}`);
    return response.data;
  },
};
