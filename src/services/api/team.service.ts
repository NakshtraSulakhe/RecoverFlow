import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams } from './types';

export interface Team {
  id: string;
  tenant_id: string;
  department_id?: string;
  name: string;
  code: string;
  description?: string;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const teamService = {
  async getAllTeams(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Team[]>>('/teams', { params });
    return response.data;
  },

  async getTeamById(id: string) {
    const response = await apiClient.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data;
  },

  async createTeam(data: Partial<Team>) {
    const response = await apiClient.post<ApiResponse<Team>>('/teams', data);
    return response.data;
  },

  async updateTeam(id: string, data: Partial<Team>) {
    const response = await apiClient.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data;
  },

  async deleteTeam(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/teams/${id}`);
    return response.data;
  },
};
