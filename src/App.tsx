import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { PublicRoute } from './components/routing/PublicRoute'
import { AuthLayout, PlatformLayout, TenantLayout } from './layouts'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const SessionExpired = lazy(() => import('./pages/auth/SessionExpired'))
const Unauthorized = lazy(() => import('./pages/auth/Unauthorized'))
const AccountLocked = lazy(() => import('./pages/auth/AccountLocked'))
const PasswordExpired = lazy(() => import('./pages/auth/PasswordExpired'))
const NotFound = lazy(() => import('./pages/auth/NotFound'))
const ServerError = lazy(() => import('./pages/auth/ServerError'))

// Platform pages
const PlatformDashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const TenantList = lazy(() => import('./modules/platform/pages/TenantList'))
const TenantForm = lazy(() => import('./modules/platform/pages/TenantForm'))
const TenantDetail = lazy(() => import('./modules/platform/pages/TenantDetail'))
const ModuleMaster = lazy(() => import('./pages/platform/ModuleMaster'))
const PlatformUsers = lazy(() => import('./pages/users/Users'))
const SubscriptionPlans = lazy(() => import('./pages/platform/Plans'))
const Subscriptions = lazy(() => import('./pages/platform/Subscriptions'))
const Roles = lazy(() => import('./pages/settings/Teams')) // Placeholder
const Permissions = lazy(() => import('./pages/settings/Departments')) // Placeholder
const PlatformBilling = lazy(() => import('./pages/settings/Subscription'))
const PlatformAudit = lazy(() => import('./pages/settings/TenantAudit'))
const PlatformHealth = lazy(() => import('./pages/settings/TenantSettings'))
const PlatformSettingsPage = lazy(() => import('./pages/settings/PlatformSettings'))

// Tenant pages
const TenantDashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const Customers = lazy(() => import('./pages/customers/Customers'))
const Loans = lazy(() => import('./pages/cases/Cases')) // Placeholder
const Recovery = lazy(() => import('./pages/recovery/Recovery'))
const Communication = lazy(() => import('./pages/priority-scoring/PriorityScoring')) // Placeholder
const Payments = lazy(() => import('./pages/payments/Payments'))
const Reports = lazy(() => import('./pages/reports/Reports'))
const AI = lazy(() => import('./pages/ai/AI'))
const Workflow = lazy(() => import('./pages/ptp-tracker/PTPTracker')) // Placeholder
const TenantSettingsPage = lazy(() => import('./pages/settings/Settings'))

// Common pages
const Profile = lazy(() => import('./pages/profile/Profile'))
const PriorityScoring = lazy(() => import('./pages/priority-scoring/PriorityScoring'))
const PTPTracker = lazy(() => import('./pages/ptp-tracker/PTPTracker'))

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
        <ThemeProvider>
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
                {/* Public Routes with AuthLayout */}
                <Route path="/" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/login" replace />} />
                  <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                  <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                  <Route path="session-expired" element={<PublicRoute><SessionExpired /></PublicRoute>} />
                  <Route path="unauthorized" element={<PublicRoute><Unauthorized /></PublicRoute>} />
                  <Route path="account-locked" element={<PublicRoute><AccountLocked /></PublicRoute>} />
                  <Route path="password-expired" element={<PublicRoute><PasswordExpired /></PublicRoute>} />
                </Route>

                {/* Platform Routes with PlatformLayout */}
                <Route path="/platform" element={
                  <ProtectedRoute>
                    <PlatformLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/platform/dashboard" replace />} />
                  <Route path="dashboard" element={<PlatformDashboard />} />
                  <Route path="tenants" element={<TenantList />} />
                  <Route path="tenants/new" element={<TenantForm />} />
                  <Route path="tenants/:id" element={<TenantDetail />} />
                  <Route path="tenants/:id/edit" element={<TenantForm />} />
                  <Route path="plans" element={<SubscriptionPlans />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="modules" element={<ModuleMaster />} />
                <Route path="users" element={<PlatformUsers />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="permissions" element={<Permissions />} />
                  <Route path="billing" element={<PlatformBilling />} />
                  <Route path="audit-logs" element={<PlatformAudit />} />
                  <Route path="system-health" element={<PlatformHealth />} />
                  <Route path="settings" element={<PlatformSettingsPage />} />
                </Route>

                {/* Tenant Routes with TenantLayout */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <TenantLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<TenantDashboard />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="loans" element={<Loans />} />
                  <Route path="recovery" element={<Recovery />} />
                  <Route path="communication" element={<Communication />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="ai" element={<AI />} />
                  <Route path="workflow" element={<Workflow />} />
                  <Route path="settings" element={<TenantSettingsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="priority-scoring" element={<PriorityScoring />} />
                  <Route path="ptp-tracker" element={<PTPTracker />} />
                </Route>

                {/* Fallback routes */}
                <Route path="*" element={<NotFound />} />
                <Route path="/server-error" element={<ServerError />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
