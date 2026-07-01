import { apiClient } from './client';
import { ApiResponse, Loan, PaginationParams, FilterParams } from './types';

export const loanService = {
  async createLoan(data: Partial<Loan>) {
    const response = await apiClient.post<ApiResponse<Loan>>('/loans', data);
    return response.data;
  },

  async getAllLoans(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Loan[]>>('/loans', { params } as any);
    return response.data;
  },

  async getLoanById(id: string) {
    const response = await apiClient.get<ApiResponse<Loan>>(`/loans/${id}`);
    return response.data;
  },
};
