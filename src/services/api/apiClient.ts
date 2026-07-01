import { axiosInstance } from '../axios'
import { ApiResponse, ApiError, PaginationParams } from '../axios/axios.types'
import { logger } from '../../utils/logger'

/**
 * Base API client with common methods
 */
class ApiClient {
  /**
   * GET request
   */
  async get<T>(url: string, params?: PaginationParams): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get(url, { params })
      return response.data
    } catch (error: any) {
      logger.error(`GET ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post(url, data)
      return response.data
    } catch (error: any) {
      logger.error(`POST ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put(url, data)
      return response.data
    } catch (error: any) {
      logger.error(`PUT ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch(url, data)
      return response.data
    } catch (error: any) {
      logger.error(`PATCH ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete(url)
      return response.data
    } catch (error: any) {
      logger.error(`DELETE ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * File upload
   */
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return response.data
    } catch (error: any) {
      logger.error(`Upload ${url} failed`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: error?.response?.data?.message || error?.message || 'An unexpected error occurred',
      code: error?.response?.data?.code,
      statusCode: error?.response?.status,
      details: error?.response?.data,
    }

    return apiError
  }
}

export const apiClient = new ApiClient()
