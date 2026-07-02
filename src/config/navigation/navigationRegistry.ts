import { NavigationModule } from '../../types/navigation.types';

export const NAVIGATION_MODULES: NavigationModule[] = [
  {
    id: 'platform',
    name: 'Platform',
    icon: 'LayoutDashboard',
    order: 1,
    requiredRoles: ['platform_owner'],
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
      },
    ],
  },
  {
    id: 'tenant_management',
    name: 'Tenant Management',
    icon: 'Building2',
    order: 2,
    requiredRoles: ['platform_owner'],
    items: [
      {
        id: 'tenants',
        label: 'Tenants',
        path: '/platform/tenants',
        icon: 'Building2',
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        path: '/platform/subscriptions',
        icon: 'CreditCard',
      },
      {
        id: 'plans',
        label: 'Subscription Plans',
        path: '/platform/plans',
        icon: 'Star',
      },
    ],
  },
  {
    id: 'user_management',
    name: 'User Management',
    icon: 'Users',
    order: 3,
    requiredRoles: ['platform_owner'],
    items: [
      {
        id: 'users',
        label: 'Users',
        path: '/users',
        icon: 'Users',
      },
      {
        id: 'roles',
        label: 'Roles',
        path: '/roles',
        icon: 'Shield',
      },
      {
        id: 'permissions',
        label: 'Permissions',
        path: '/permissions',
        icon: 'Lock',
      },
    ],
  },
  {
    id: 'platform_operations',
    name: 'Platform Operations',
    icon: 'Activity',
    order: 4,
    requiredRoles: ['platform_owner'],
    items: [
      {
        id: 'audit_logs',
        label: 'Audit Logs',
        path: '/audit-logs',
        icon: 'FileText',
      },
      {
        id: 'system_health',
        label: 'System Health',
        path: '/system-health',
        icon: 'HeartPulse',
      },
    ],
  },
  {
    id: 'account',
    name: 'Account',
    icon: 'User',
    order: 5,
    requiredRoles: ['platform_owner'],
    items: [
      {
        id: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: 'User',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: 'Settings',
      },
    ],
  },
];

export const getNavigationModules = (): NavigationModule[] => {
  return NAVIGATION_MODULES.sort((a, b) => a.order - b.order);
};

export const getModuleById = (id: string): NavigationModule | undefined => {
  return NAVIGATION_MODULES.find(m => m.id === id);
};
