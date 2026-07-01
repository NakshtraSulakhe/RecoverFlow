import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Lazy store access to avoid circular dependency
let store: any = null

export const setStore = (reduxStore: any) => {
  store = reduxStore
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Redux store if store is available
    if (store) {
      const state = store.getState()
      const token = state.auth?.accessToken

      // Add token to headers if available
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Add request ID for tracing
    if (config.headers) {
      config.headers['X-Request-ID'] = generateRequestId()
    }

    // Add timestamp
    config.metadata = { startTime: new Date() }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const endTime = new Date()
    const startTime = response.config.metadata?.startTime
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime()
      console.log(`Request to ${response.config.url} took ${duration}ms`)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Token refresh
    if (store && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = store.getState().auth?.refreshToken

        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          )

          const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data

          // Update Redux store with new tokens
          store.dispatch({
            type: 'auth/setTokens',
            payload: { accessToken, refreshToken: newRefreshToken, expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString() },
          })

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        try {
          const { logout } = await import('../../redux/slices/authSlice')
          store.dispatch(logout())
          window.location.href = '/login'
        } catch (e) {
          console.error('Logout failed:', e)
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.message)
      // Redirect to unauthorized page or show error
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.message)
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.message)
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Helper function to generate request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
  }
}

export default axiosInstance
