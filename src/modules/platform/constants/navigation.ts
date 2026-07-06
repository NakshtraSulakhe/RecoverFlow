import {
  Dashboard,
  Apartment,
  Paid,
  Receipt,
  People,
  Shield,
  Lock,
  AccountBalance,
  Analytics,
  MonitorHeart,
  Settings,
  Apps,
} from '@mui/icons-material'

export interface NavItem {
  path: string
  text: string
  icon: React.ComponentType<any>
  description?: string
  color?: string
  permission?: string
  featureFlag?: string
}

export const platformNavItems: NavItem[] = [
  {
    path: '/platform/dashboard',
    text: 'Dashboard',
    icon: Dashboard,
    description: 'Platform overview and analytics',
    color: 'primary',
  },
  {
    path: '/platform/tenants',
    text: 'Tenants',
    icon: Apartment,
    description: 'Manage all tenant organizations',
    color: 'secondary',
  },
  {
    path: '/platform/plans',
    text: 'Subscription Plans',
    icon: Paid,
    description: 'Create and manage subscription plans',
    color: 'success',
  },
  {
    path: '/platform/subscriptions',
    text: 'Subscriptions',
    icon: Receipt,
    description: 'Track and manage tenant subscriptions',
    color: 'info',
  },
  {
    path: '/platform/modules',
    text: 'Modules',
    icon: Apps,
    description: 'Manage available modules',
    color: 'primary',
  },
  {
    path: '/platform/users',
    text: 'Users',
    icon: People,
    description: 'Manage all platform users',
    color: 'warning',
  },
  {
    path: '/platform/roles',
    text: 'Roles',
    icon: Shield,
    description: 'Define user roles and permissions',
    color: 'error',
  },
  {
    path: '/platform/permissions',
    text: 'Permissions',
    icon: Lock,
    description: 'Manage granular access permissions',
    color: 'primary',
  },
  {
    path: '/platform/billing',
    text: 'Billing',
    icon: AccountBalance,
    description: 'Billing and payment management',
    color: 'secondary',
  },
  {
    path: '/platform/audit-logs',
    text: 'Audit Logs',
    icon: Analytics,
    description: 'View platform audit trails',
    color: 'success',
  },
  {
    path: '/platform/system-health',
    text: 'System Health',
    icon: MonitorHeart,
    description: 'Monitor system performance',
    color: 'info',
  },
  {
    path: '/platform/settings',
    text: 'Settings',
    icon: Settings,
    description: 'Platform configuration',
    color: 'warning',
  },
]

export const platformNavGroups = [
  { id: 'overview', label: 'Overview', items: platformNavItems.slice(0, 1) },
  { id: 'tenants', label: 'Tenant Management', items: platformNavItems.slice(1, 4) },
  { id: 'platform', label: 'Platform', items: platformNavItems.slice(4, 8) },
  { id: 'operations', label: 'Operations', items: platformNavItems.slice(8, 10) },
  { id: 'settings', label: 'Settings', items: platformNavItems.slice(10) },
].map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, label: item.text, id: item.path.replace(/\//g, '-') })),
}));

export const platformSettingsSections: NavItem[] = platformNavItems.filter(
  item => item.path !== '/platform/dashboard'
)
