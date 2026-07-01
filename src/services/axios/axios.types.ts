export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Array<{
    field?: string
    message: string
  }>
  metadata?: {
    total?: number
    page?: number
    pageSize?: number
    totalPages?: number
  }
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface ApiRequestConfig {
  skipGlobalErrorHandling?: boolean
  skipAuth?: boolean
  timeout?: number
}
