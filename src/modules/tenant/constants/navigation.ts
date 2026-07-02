import {
  Dashboard,
  People,
  AccountBalance,
  AssignmentTurnedIn,
  Chat,
  CreditCard,
  Assessment,
  SmartToy,
  Work,
  Settings,
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

export const tenantNavItems: NavItem[] = [
  {
    path: '/app/dashboard',
    text: 'Dashboard',
    icon: Dashboard,
    description: 'Tenant overview and analytics',
    color: 'primary',
  },
  {
    path: '/app/customers',
    text: 'Customers',
    icon: People,
    description: 'Manage customer accounts',
    color: 'secondary',
  },
  {
    path: '/app/loans',
    text: 'Loans',
    icon: AccountBalance,
    description: 'Track and manage loans',
    color: 'success',
  },
  {
    path: '/app/recovery',
    text: 'Recovery',
    icon: AssignmentTurnedIn,
    description: 'Debt recovery operations',
    color: 'error',
  },
  {
    path: '/app/communication',
    text: 'Communication',
    icon: Chat,
    description: 'Customer communication logs',
    color: 'info',
  },
  {
    path: '/app/payments',
    text: 'Payments',
    icon: CreditCard,
    description: 'Payment tracking',
    color: 'warning',
  },
  {
    path: '/app/reports',
    text: 'Reports',
    icon: Assessment,
    description: 'Reports and analytics',
    color: 'primary',
  },
  {
    path: '/app/ai',
    text: 'AI',
    icon: SmartToy,
    description: 'AI-powered insights',
    color: 'secondary',
  },
  {
    path: '/app/workflow',
    text: 'Workflow',
    icon: Work,
    description: 'Process automation',
    color: 'success',
  },
  {
    path: '/app/settings',
    text: 'Settings',
    icon: Settings,
    description: 'Tenant configuration',
    color: 'info',
  },
]

export const tenantSettingsSections: NavItem[] = tenantNavItems.filter(
  item => item.path !== '/app/dashboard'
)
