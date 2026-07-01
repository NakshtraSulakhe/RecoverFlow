import { apiClient } from './client';
import { ApiResponse } from './types';

export interface AIAssistantResponse {
  summary: string;
  recommendations: string[];
  next_best_action: string;
  recovery_probability: number;
}

export interface PriorityScoreResponse {
  score: number;
  confidence: number;
  factors: Record<string, number>;
  recommendation: string;
}

export interface RiskScoreResponse {
  score: number;
  confidence: number;
  risk_level: string;
  factors: Record<string, number>;
  prediction: string;
}

export interface SummaryResponse {
  customer_summary: string;
  case_summary: string;
  key_insights: string[];
  suggested_actions: string[];
}

export const aiService = {
  async getAssistantResponse(caseId: string, query: string) {
    const response = await apiClient.post<ApiResponse<AIAssistantResponse>>('/ai/assistant', {
      case_id: caseId,
      query,
    });
    return response.data;
  },

  async calculatePriorityScore(caseId: string) {
    const response = await apiClient.post<ApiResponse<PriorityScoreResponse>>('/ai/priority-score', {
      case_id: caseId,
    });
    return response.data;
  },

  async calculateRiskScore(customerId: string) {
    const response = await apiClient.post<ApiResponse<RiskScoreResponse>>('/ai/risk-score', {
      customer_id: customerId,
    });
    return response.data;
  },

  async generateSummary(caseId: string) {
    const response = await apiClient.post<ApiResponse<SummaryResponse>>('/ai/summary', {
      case_id: caseId,
    });
    return response.data;
  },
};
