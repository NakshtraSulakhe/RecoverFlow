/**
 * Organization API Service
 */

import { apiClient } from '../api'
import { Branch, Department, Team, Designation, Location, BusinessUnit } from '../../features/tenant/types'

class OrganizationService {
  // Branch operations
  async getBranches(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/branches`)
    return response.data
  }

  async getBranch(tenantId: string, branchId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/branches/${branchId}`)
    return response.data
  }

  async createBranch(tenantId: string, data: Partial<Branch>) {
    const response = await apiClient.post(`/tenants/${tenantId}/branches`, data)
    return response.data
  }

  async updateBranch(tenantId: string, branchId: string, data: Partial<Branch>) {
    const response = await apiClient.put(`/tenants/${tenantId}/branches/${branchId}`, data)
    return response.data
  }

  async deleteBranch(tenantId: string, branchId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/branches/${branchId}/delete`)
    return response.data
  }

  // Department operations
  async getDepartments(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/departments`)
    return response.data
  }

  async getDepartment(tenantId: string, departmentId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/departments/${departmentId}`)
    return response.data
  }

  async createDepartment(tenantId: string, data: Partial<Department>) {
    const response = await apiClient.post(`/tenants/${tenantId}/departments`, data)
    return response.data
  }

  async updateDepartment(tenantId: string, departmentId: string, data: Partial<Department>) {
    const response = await apiClient.put(`/tenants/${tenantId}/departments/${departmentId}`, data)
    return response.data
  }

  async deleteDepartment(tenantId: string, departmentId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/departments/${departmentId}/delete`)
    return response.data
  }

  // Team operations
  async getTeams(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/teams`)
    return response.data
  }

  async getTeam(tenantId: string, teamId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/teams/${teamId}`)
    return response.data
  }

  async createTeam(tenantId: string, data: Partial<Team>) {
    const response = await apiClient.post(`/tenants/${tenantId}/teams`, data)
    return response.data
  }

  async updateTeam(tenantId: string, teamId: string, data: Partial<Team>) {
    const response = await apiClient.put(`/tenants/${tenantId}/teams/${teamId}`, data)
    return response.data
  }

  async deleteTeam(tenantId: string, teamId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/teams/${teamId}/delete`)
    return response.data
  }

  // Designation operations
  async getDesignations(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/designations`)
    return response.data
  }

  async createDesignation(tenantId: string, data: Partial<Designation>) {
    const response = await apiClient.post(`/tenants/${tenantId}/designations`, data)
    return response.data
  }

  async updateDesignation(tenantId: string, designationId: string, data: Partial<Designation>) {
    const response = await apiClient.put(`/tenants/${tenantId}/designations/${designationId}`, data)
    return response.data
  }

  async deleteDesignation(tenantId: string, designationId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/designations/${designationId}/delete`)
    return response.data
  }

  // Location operations
  async getLocations(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/locations`)
    return response.data
  }

  async createLocation(tenantId: string, data: Partial<Location>) {
    const response = await apiClient.post(`/tenants/${tenantId}/locations`, data)
    return response.data
  }

  async updateLocation(tenantId: string, locationId: string, data: Partial<Location>) {
    const response = await apiClient.put(`/tenants/${tenantId}/locations/${locationId}`, data)
    return response.data
  }

  async deleteLocation(tenantId: string, locationId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/locations/${locationId}/delete`)
    return response.data
  }

  // Business Unit operations
  async getBusinessUnits(tenantId: string) {
    const response = await apiClient.get(`/tenants/${tenantId}/business-units`)
    return response.data
  }

  async createBusinessUnit(tenantId: string, data: Partial<BusinessUnit>) {
    const response = await apiClient.post(`/tenants/${tenantId}/business-units`, data)
    return response.data
  }

  async updateBusinessUnit(tenantId: string, businessUnitId: string, data: Partial<BusinessUnit>) {
    const response = await apiClient.put(`/tenants/${tenantId}/business-units/${businessUnitId}`, data)
    return response.data
  }

  async deleteBusinessUnit(tenantId: string, businessUnitId: string) {
    const response = await apiClient.post(`/tenants/${tenantId}/business-units/${businessUnitId}/delete`)
    return response.data
  }
}

export const organizationService = new OrganizationService()
