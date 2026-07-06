import axiosInstance from '../axios/axios.config'

// Types
export interface Subscription {
  id: string
  subscription_code: string
  tenant_id: string
  tenant_name: string
  tenant_code: string
  plan_code: string
  plan_name: string
  billing_cycle: string
  amount: number
  currency: string
  status: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

// Subscription Service
export const subscriptionService = {
  // Get all subscriptions
  getAllSubscriptions: (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    return axiosInstance.get<ApiResponse<Subscription[]>>('/subscriptions', { params })
  },

  // Get subscription by ID
  getSubscriptionById: (id: string) => {
    return axiosInstance.get<ApiResponse<Subscription>>(`/subscriptions/${id}`)
  },

  // Create subscription
  createSubscription: (data: Partial<Subscription>) => {
    return axiosInstance.post<ApiResponse<Subscription>>('/subscriptions', data)
  },

  // Update subscription
  updateSubscription: (id: string, data: Partial<Subscription>) => {
    return axiosInstance.put<ApiResponse<Subscription>>(`/subscriptions/${id}`, data)
  },

  // Upgrade subscription
  upgradeSubscription: (id: string, data: { plan_code: string; plan_name: string; amount: number }) => {
    return axiosInstance.post<ApiResponse<void>>(`/subscriptions/${id}/upgrade`, data);
  },

  // Suspend subscription
  suspendSubscription: (id: string) => {
    return axiosInstance.post<ApiResponse<void>>(`/subscriptions/${id}/suspend`)
  },

  // Activate subscription
  activateSubscription: (id: string) => {
    return axiosInstance.post<ApiResponse<void>>(`/subscriptions/${id}/activate`)
  },

  // Cancel subscription
  cancelSubscription: (id: string) => {
    return axiosInstance.post<ApiResponse<void>>(`/subscriptions/${id}/cancel`)
  },

  // Renew subscription
  renewSubscription: (id: string) => {
    return axiosInstance.post<ApiResponse<void>>(`/subscriptions/${id}/renew`)
  }
}
