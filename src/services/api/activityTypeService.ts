/**
 * Activity Type API Service
 */

import { apiClient } from './client'

export interface ActivityType {
  id: string
  tenantId: string
  activityCode: string
  activityName: string
  description?: string
  icon?: string
  category?: string
  isSystem: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

class ActivityTypeService {
  async getActivityTypes() {
    const response = await apiClient.get<{ data: ActivityType[] }>('/activity-types')
    return response.data.data
  }

  async getActivityType(id: string) {
    const response = await apiClient.get<{ data: ActivityType }>(`/activity-types/${id}`)
    return response.data.data
  }

  async createActivityType(data: Partial<Omit<ActivityType, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem'>>) {
    const response = await apiClient.post<{ data: ActivityType }>('/activity-types', data)
    return response.data.data
  }

  async updateActivityType(id: string, data: Partial<Omit<ActivityType, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'isSystem' | 'activityCode'>>) {
    const response = await apiClient.put<{ data: ActivityType }>(`/activity-types/${id}`, data)
    return response.data.data
  }

  async deleteActivityType(id: string) {
    const response = await apiClient.delete(`/activity-types/${id}`)
    return response.data
  }
}

export const activityTypeService = new ActivityTypeService()
