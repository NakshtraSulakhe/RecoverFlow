import { lazy } from 'react'

// Lazy loaded page components
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Tenants = lazy(() => import('../pages/tenants/Tenants'))
const Users = lazy(() => import('../pages/users/Users'))
const Customers = lazy(() => import('../pages/customers/Customers'))
const Cases = lazy(() => import('../pages/cases/Cases'))
const Recovery = lazy(() => import('../pages/recovery/Recovery'))
const Payments = lazy(() => import('../pages/payments/Payments'))
const Reports = lazy(() => import('../pages/reports/Reports'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const AI = lazy(() => import('../pages/ai/AI'))
const PriorityScoring = lazy(() => import('../pages/priority-scoring/PriorityScoring'))
const PTPTracker = lazy(() => import('../pages/ptp-tracker/PTPTracker'))
const SmartDialer = lazy(() => import('../pages/smart-dialer/SmartDialer'))
const WhatsAppRecovery = lazy(() => import('../pages/whatsapp-recovery/WhatsAppRecovery'))
const OmnichannelTimeline = lazy(() => import('../pages/omnichannel/OmnichannelTimeline'))

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const SessionExpired = lazy(() => import('../pages/auth/SessionExpired'))
const Unauthorized = lazy(() => import('../pages/auth/Unauthorized'))
const AccountLocked = lazy(() => import('../pages/auth/AccountLocked'))
const PasswordExpired = lazy(() => import('../pages/auth/PasswordExpired'))

// Tenant settings pages
const TenantProfile = lazy(() => import('../pages/settings/TenantProfile'))
const Subscription = lazy(() => import('../pages/settings/Subscription'))
const TenantSettings = lazy(() => import('../pages/settings/TenantSettings'))
const FeatureFlags = lazy(() => import('../pages/settings/FeatureFlags'))
const TenantSecurity = lazy(() => import('../pages/settings/TenantSecurity'))
const TenantAudit = lazy(() => import('../pages/settings/TenantAudit'))
const Branches = lazy(() => import('../pages/settings/Branches'))
const Departments = lazy(() => import('../pages/settings/Departments'))
const Teams = lazy(() => import('../pages/settings/Teams'))
const Designations = lazy(() => import('../pages/settings/Designations'))
const Locations = lazy(() => import('../pages/settings/Locations'))
const BusinessUnits = lazy(() => import('../pages/settings/BusinessUnits'))

// Public routes (no authentication required)
export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/session-expired',
    element: <SessionExpired />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/account-locked',
    element: <AccountLocked />,
  },
  {
    path: '/password-expired',
    element: <PasswordExpired />,
  },
]

// Protected routes (authentication required)
export const protectedRoutes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/tenants',
    element: <Tenants />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/customers',
    element: <Customers />,
  },
  {
    path: '/customers/:id',
    element: <Customers />,
  },
  {
    path: '/cases',
    element: <Cases />,
  },
  {
    path: '/cases/:id',
    element: <Cases />,
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '/payments',
    element: <Payments />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/ai',
    element: <AI />,
  },
  {
    path: '/priority-scoring',
    element: <PriorityScoring />,
  },
  {
    path: '/ptp-tracker',
    element: <PTPTracker />,
  },
  {
    path: '/smart-dialer',
    element: <SmartDialer />,
  },
  {
    path: '/whatsapp-recovery',
    element: <WhatsAppRecovery />,
  },
  {
    path: '/omnichannel',
    element: <OmnichannelTimeline />,
  },
  // Tenant settings routes
  {
    path: '/settings/tenant',
    element: <TenantProfile />,
  },
  {
    path: '/settings/subscription',
    element: <Subscription />,
  },
  {
    path: '/settings/general',
    element: <TenantSettings />,
  },
  {
    path: '/settings/features',
    element: <FeatureFlags />,
  },
  {
    path: '/settings/security',
    element: <TenantSecurity />,
  },
  {
    path: '/settings/audit',
    element: <TenantAudit />,
  },
  {
    path: '/settings/branches',
    element: <Branches />,
  },
  {
    path: '/settings/departments',
    element: <Departments />,
  },
  {
    path: '/settings/teams',
    element: <Teams />,
  },
  {
    path: '/settings/designations',
    element: <Designations />,
  },
  {
    path: '/settings/locations',
    element: <Locations />,
  },
  {
    path: '/settings/business-units',
    element: <BusinessUnits />,
  },
]

// Combined routes
export const routes = [...publicRoutes, ...protectedRoutes]
