/**
 * Authentication Hook
 * Provides authentication state and actions
 */

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { login, logout, refreshTokens, getCurrentUser, clearAuth, setError, clearError } from '../../../redux/slices/authSlice'
import { LoginCredentials } from '../types'
import { AUTH_STORAGE_KEYS } from '../constants'
import { storage } from '../../../utils/storage'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const authState = useAppSelector((state: any) => state.auth)

  /**
   * Login user
   */
  const loginUser = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(login(credentials)).unwrap()
        
        // Store tokens in secure storage
        if (credentials.rememberMe) {
          storage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, result.accessToken)
          storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
          storage.set(AUTH_STORAGE_KEYS.USER, result.user)
        }
        
        return result
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  /**
   * Logout user
   */
  const logoutUser = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap()
    } catch (error) {
      // Proceed with logout even if API call fails
    } finally {
      // Clear storage
      storage.remove(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
      storage.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
      storage.remove(AUTH_STORAGE_KEYS.USER)
      storage.remove(AUTH_STORAGE_KEYS.REMEMBER_ME)
      
      // Clear Redux state
      dispatch(clearAuth())
      
      // Navigate to login
      navigate('/login')
    }
  }, [dispatch, navigate])

  /**
   * Refresh access token
   */
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = storage.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const result = await dispatch(refreshTokens(refreshToken as string)).unwrap()
      
      // Update storage
      storage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, result.accessToken)
      storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
      
      return result
    } catch (error) {
      // Refresh failed, logout user
      await logoutUser()
      throw error
    }
  }, [dispatch, logoutUser])

  /**
   * Get current user
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await dispatch(getCurrentUser()).unwrap()
      return user
    } catch (error) {
      throw error
    }
  }, [dispatch])

  /**
   * Check if user is authenticated
   */
  const checkAuth = useCallback(async () => {
    const token = storage.get(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    const user = storage.get(AUTH_STORAGE_KEYS.USER)
    
    if (!token || !user) {
      return false
    }

    try {
      await fetchCurrentUser()
      return true
    } catch (error) {
      // Token might be expired, try refresh
      try {
        await refreshAccessToken()
        return true
      } catch {
        return false
      }
    }
  }, [fetchCurrentUser, refreshAccessToken])

  /**
   * Set auth error
   */
  const setAuthError = useCallback((message: string, code: string) => {
    dispatch(setError({ message, code: code as any }))
  }, [dispatch])

  /**
   * Clear auth error
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    ...authState,
    login: loginUser,
    logout: logoutUser,
    refreshToken: refreshAccessToken,
    getCurrentUser: fetchCurrentUser,
    checkAuth,
    setError: setAuthError,
    clearError: clearAuthError,
  }
}
