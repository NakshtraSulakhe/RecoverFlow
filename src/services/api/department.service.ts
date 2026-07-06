import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams } from './types';

export interface Department {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const departmentService = {
  async getAllDepartments(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Department[]>>('/departments', { params });
    return response.data;
  },

  async getDepartmentById(id: string) {
    const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },

  async createDepartment(data: Partial<Department>) {
    const response = await apiClient.post<ApiResponse<Department>>('/departments', data);
    return response.data;
  },

  async updateDepartment(id: string, data: Partial<Department>) {
    const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, data);
    return response.data;
  },

  async deleteDepartment(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/departments/${id}`);
    return response.data;
  },
};
