/**
 * Usage API Service
 */

import { apiClient } from './client';
import { ApiResponse } from './types';

export interface UsageTracking {
  id: string;
  tenant_id: string;
  metric_name: string;
  metric_value: number;
  period_start: string;
  period_end: string;
  unit: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UsageSummary {
  metric_name: string;
  total_value: number;
  unit: string;
  period_start: string;
  period_end: string;
}

export interface UsageDashboard {
  current_month_usage: UsageSummary[];
  active_users: number;
  total_customers: number;
  total_loans: number;
  total_cases: number;
  period: {
    start: Date;
    end: Date;
  };
}

class UsageService {
  /**
   * Record usage
   */
  async recordUsage(data: Partial<UsageTracking>) {
    const response = await apiClient.post<ApiResponse<UsageTracking>>('/usage', data);
    return response.data;
  }

  /**
   * Get tenant usage
   */
  async getTenantUsage(tenantId: string, params?: any) {
    const response = await apiClient.get<ApiResponse<UsageTracking[]>>(`/usage/tenant/${tenantId}`, { params });
    return response.data;
  }

  /**
   * Get usage summary
   */
  async getUsageSummary(tenantId: string, params?: any) {
    const response = await apiClient.get<ApiResponse<UsageSummary[]>>(`/usage/tenant/${tenantId}/summary`, { params });
    return response.data;
  }

  /**
   * Get usage dashboard
   */
  async getUsageDashboard(tenantId: string) {
    const response = await apiClient.get<ApiResponse<UsageDashboard>>(`/usage/tenant/${tenantId}/dashboard`);
    return response.data;
  }
}

export const usageService = new UsageService();
