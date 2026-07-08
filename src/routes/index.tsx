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
const Settings = lazy(() => import('../pages/settings/PlatformSettings'))
const AI = lazy(() => import('../pages/ai/AI'))
const PriorityScoring = lazy(() => import('../pages/priority-scoring/PriorityScoring'))
const PTPTracker = lazy(() => import('../pages/ptp-tracker/PTPTracker'))
const Profile = lazy(() => import('../pages/profile/Profile'))
const SetupWizard = lazy(() => import('../pages/setup/SetupWizard'))

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'))
const SessionExpired = lazy(() => import('../pages/auth/SessionExpired'))
const Unauthorized = lazy(() => import('../pages/auth/Unauthorized'))
const AccountLocked = lazy(() => import('../pages/auth/AccountLocked'))
const PasswordExpired = lazy(() => import('../pages/auth/PasswordExpired'))
const NotFound = lazy(() => import('../pages/auth/NotFound'))
const ServerError = lazy(() => import('../pages/auth/ServerError'))

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
const CaseStatuses = lazy(() => import('../pages/settings/CaseStatuses'))
const ActivityTypes = lazy(() => import('../pages/settings/ActivityTypes'))
const CaseTypes = lazy(() => import('../pages/settings/CaseTypes'))
const CustomFields = lazy(() => import('../pages/settings/CustomFields'))
const CommunicationTemplates = lazy(() => import('../pages/settings/CommunicationTemplates'))
const WorkflowTemplates = lazy(() => import('../pages/settings/WorkflowTemplates'))
const BusinessRules = lazy(() => import('../pages/settings/BusinessRules'))

// Public routes (no authentication required)
export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
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
    path: '/setup',
    element: <SetupWizard />,
  },
  {
    path: '/profile',
    element: <Profile />,
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
  {
    path: '/settings/case-statuses',
    element: <CaseStatuses />,
  },
  {
    path: '/settings/activity-types',
    element: <ActivityTypes />,
  },
  {
    path: '/settings/case-types',
    element: <CaseTypes />,
  },
  {
    path: '/settings/custom-fields',
    element: <CustomFields />,
  },
  {
    path: '/settings/communication-templates',
    element: <CommunicationTemplates />,
  },
  {
    path: '/settings/workflow-templates',
    element: <WorkflowTemplates />,
  },
  {
    path: '/settings/business-rules',
    element: <BusinessRules />,
  },
]

// Combined routes
export const routes = [...publicRoutes, ...protectedRoutes]
