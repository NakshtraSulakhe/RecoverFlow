/**
 * Protected Route Guard
 * Redirects unauthenticated users to login
 */

import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const location = useLocation()
  const [isChecking, setIsChecking] = React.useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        // Auth check failed
      } finally {
        setIsChecking(false)
      }
    }

    verifyAuth()
  }, [checkAuth])

  if (isLoading || isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
