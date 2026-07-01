import { apiClient } from './client';
import { ApiResponse, RecoveryCase, PromiseToPay, PaginationParams, FilterParams } from './types';

export const recoveryService = {
  async createCase(data: Partial<RecoveryCase>) {
    const response = await apiClient.post<ApiResponse<RecoveryCase>>('/recovery/cases', data);
    return response.data;
  },

  async getAllCases(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<RecoveryCase[]>>('/recovery/cases', { params } as any);
    return response.data;
  },

  async getCaseById(id: string) {
    const response = await apiClient.get<ApiResponse<RecoveryCase>>(`/recovery/cases/${id}`);
    return response.data;
  },

  async createPTP(data: Partial<PromiseToPay>) {
    const response = await apiClient.post<ApiResponse<PromiseToPay>>('/recovery/ptp', data);
    return response.data;
  },

  async getPTPById(id: string) {
    const response = await apiClient.get<ApiResponse<PromiseToPay>>(`/recovery/ptp/${id}`);
    return response.data;
  },
};
