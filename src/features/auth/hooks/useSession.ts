/**
 * Session Management Hook
 * Handles session timeout, idle detection, and multi-tab sync
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { updateLastActivity } from '../../../redux/slices/authSlice'
import { AUTH_CONFIG, SESSION_EVENTS } from '../constants'
import { useAuth } from './useAuth'

export const useSession = () => {
  const dispatch = useAppDispatch()
  const { logout: logoutUser } = useAuth()
  
  const sessionTimeout = useAppSelector((state: any) => state.auth.sessionTimeout)
  const idleTimeout = useAppSelector((state: any) => state.auth.idleTimeout)
  const lastActivity = useAppSelector((state: any) => state.auth.lastActivity)
  const isAuthenticated = useAppSelector((state: any) => state.auth.isAuthenticated)

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Update last activity timestamp
   */
  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      dispatch(updateLastActivity())
      
      // Broadcast to other tabs
      localStorage.setItem(SESSION_EVENTS.LAST_ACTIVITY, Date.now().toString())
    }
  }, [isAuthenticated, dispatch])

  /**
   * Check for idle timeout
   */
  const checkIdleTimeout = useCallback(() => {
    if (!lastActivity || !isAuthenticated) return

    const now = Date.now()
    const lastActivityTime = new Date(lastActivity).getTime()
    const idleTime = now - lastActivityTime

    if (idleTime >= idleTimeout) {
      // Idle timeout reached
      logoutUser()
    }
  }, [lastActivity, idleTimeout, isAuthenticated, logoutUser])

  /**
   * Check for session timeout
   */
  const checkSessionTimeout = useCallback(() => {
    if (!lastActivity || !isAuthenticated) return

    const now = Date.now()
    const lastActivityTime = new Date(lastActivity).getTime()
    const sessionTime = now - lastActivityTime

    if (sessionTime >= sessionTimeout) {
      // Session timeout reached
      logoutUser()
    }
  }, [lastActivity, sessionTimeout, isAuthenticated, logoutUser])

  /**
   * Setup activity listeners
   */
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    const handleActivity = () => {
      updateActivity()
    }

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, updateActivity])

  /**
   * Setup idle timer
   */
  useEffect(() => {
    if (!isAuthenticated) return

    // Clear existing timer
    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current)
    }

    // Check idle timeout periodically
    idleTimerRef.current = setInterval(() => {
      checkIdleTimeout()
    }, AUTH_CONFIG.IDLE_CHECK_INTERVAL)

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current)
      }
    }
  }, [isAuthenticated, checkIdleTimeout])

  /**
   * Setup session timer
   */
  useEffect(() => {
    if (!isAuthenticated) return

    // Clear existing timer
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }

    // Check session timeout periodically
    sessionTimerRef.current = setInterval(() => {
      checkSessionTimeout()
    }, AUTH_CONFIG.IDLE_CHECK_INTERVAL)

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [isAuthenticated, checkSessionTimeout])

  /**
   * Setup multi-tab sync
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_EVENTS.LOGOUT) {
        // Another tab logged out
        logoutUser()
      } else if (e.key === SESSION_EVENTS.LAST_ACTIVITY) {
        // Update activity from another tab
        dispatch(updateLastActivity())
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [dispatch, logoutUser])

  /**
   * Broadcast logout to other tabs
   */
  const broadcastLogout = useCallback(() => {
    localStorage.setItem(SESSION_EVENTS.LOGOUT, Date.now().toString())
    localStorage.removeItem(SESSION_EVENTS.LOGOUT)
  }, [])

  return {
    updateActivity,
    checkIdleTimeout,
    checkSessionTimeout,
    broadcastLogout,
  }
}
