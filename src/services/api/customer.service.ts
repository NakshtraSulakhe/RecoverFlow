import { apiClient } from './client';
import { ApiResponse, Customer, PaginationParams, FilterParams } from './types';

export const customerService = {
  async createCustomer(data: Partial<Customer>) {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },

  async getAllCustomers(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Customer[]>>('/customers', { params } as any);
    return response.data;
  },

  async getCustomerById(id: string) {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<Customer>) {
    const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },
};
