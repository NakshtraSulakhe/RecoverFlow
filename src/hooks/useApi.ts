import { useState, useCallback } from 'react'
import { ApiResponse, ApiError } from '../services/axios'

interface UseApiOptions {
  skipGlobalErrorHandling?: boolean
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: () => Promise<void>
  reset: () => void
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An error occurred',
        statusCode: (err as any)?.response?.status,
      }
      setError(apiError)

      if (!options.skipGlobalErrorHandling) {
        // Handle global error here if needed
        console.error('API Error:', apiError)
      }
    } finally {
      setLoading(false)
    }
  }, [apiCall, options.skipGlobalErrorHandling])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
