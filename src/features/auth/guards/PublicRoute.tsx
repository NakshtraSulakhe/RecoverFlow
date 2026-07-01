/**
 * Public Route Guard
 * Redirects authenticated users to dashboard
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
