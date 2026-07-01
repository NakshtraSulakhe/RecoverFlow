import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { PublicRoute } from './components/routing/PublicRoute'
import { FeatureGuard } from './components/routing/FeatureGuard'
import { NewMainLayout } from './layouts/NewMainLayout'
import { MainLayout } from './layouts/MainLayout'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { FEATURE_KEYS } from './constants/features'
import { publicRoutes, protectedRoutes } from './routes'

// Lazy load new dashboard
const NewDashboard = lazy(() => import('./pages/dashboard/NewDashboard'))

const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#09090b',
    }}
  >
    <CircularProgress sx={{ color: '#6366f1' }} />
  </Box>
)

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PublicRoute>{route.element}</PublicRoute>}
                />
              ))}

              {/* Protected Routes with New Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <NewMainLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <FeatureGuard featureKey={FEATURE_KEYS.DASHBOARD}>
                      <NewDashboard />
                    </FeatureGuard>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <FeatureGuard featureKey={FEATURE_KEYS.DASHBOARD}>
                      <NewDashboard />
                    </FeatureGuard>
                  }
                />
              </Route>

              {/* Protected Routes with Old Layout for existing pages */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                {protectedRoutes
                  .filter(route => route.path !== '/' && route.path !== '/dashboard')
                  .map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
