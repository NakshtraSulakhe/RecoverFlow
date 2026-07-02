import { apiClient } from './client';
import { ApiResponse, PaginationParams, FilterParams } from './types';

export interface Subscription {
  id: string;
  subscription_code: string;
  tenant_id: string;
  tenant_name?: string;
  tenant_code?: string;
  plan_code: string;
  plan_name: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  currency: string;
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export const subscriptionService = {
  async getAllSubscriptions(params?: PaginationParams & FilterParams) {
    const response = await apiClient.get<ApiResponse<Subscription[]>>('/v1/subscriptions', { params } as any);
    return response.data;
  },

  async getSubscriptionById(id: string) {
    const response = await apiClient.get<ApiResponse<Subscription>>(`/v1/subscriptions/${id}`);
    return response.data;
  },

  async createSubscription(data: Partial<Subscription>) {
    const response = await apiClient.post<ApiResponse<Subscription>>('/v1/subscriptions', data);
    return response.data;
  },

  async updateSubscription(id: string, data: Partial<Subscription>) {
    const response = await apiClient.put<ApiResponse<Subscription>>(`/v1/subscriptions/${id}`, data);
    return response.data;
  },

  async upgradeSubscription(id: string, data: { plan_code: string; plan_name: string; amount: number }) {
    const response = await apiClient.post<ApiResponse<Subscription>>(`/v1/subscriptions/${id}/upgrade`, data);
    return response.data;
  },

  async suspendSubscription(id: string) {
    const response = await apiClient.post<ApiResponse<Subscription>>(`/v1/subscriptions/${id}/suspend`);
    return response.data;
  },

  async activateSubscription(id: string) {
    const response = await apiClient.post<ApiResponse<Subscription>>(`/v1/subscriptions/${id}/activate`);
    return response.data;
  },

  async cancelSubscription(id: string) {
    const response = await apiClient.post<ApiResponse<Subscription>>(`/v1/subscriptions/${id}/cancel`);
    return response.data;
  },

  async renewSubscription(id: string) {
    const response = await apiClient.post<ApiResponse<Subscription>>(`/v1/subscriptions/${id}/renew`);
    return response.data;
  },
};
