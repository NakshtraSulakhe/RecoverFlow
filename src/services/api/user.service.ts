import { apiClient } from './client';
import { ApiResponse, User, PaginationParams, FilterParams } from './types';

export const userService = {
  async createUser(data: Partial<User>) {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  async getAllUsers(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', { params } as any);
    return response.data;
  },

  async getUserById(id: string) {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>) {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },
};
