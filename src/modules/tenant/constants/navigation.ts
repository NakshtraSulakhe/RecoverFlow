import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  KeyRound,
  Network,
  UsersRound,
  UserCircle,
  MessageSquare,
  Phone,
  CreditCard,
  Gavel,
  Wallet,
  BarChart3,
  Bot,
  Workflow,
  Settings,
  Plug,
  Lock,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export interface TenantNavItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  moduleCode?: string;
  permission?: string;
  requiredRoles?: string[];
  requiredSubscriptions?: string[];
  isCore?: boolean;
  comingSoon?: boolean;
}

export interface TenantNavGroup {
  id: string;
  label: string;
  items: TenantNavItem[];
}

export const TENANT_NAV_GROUPS: TenantNavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        path: '/app/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        moduleCode: 'dashboard',
        isCore: true,
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      {
        id: 'organization',
        path: '/app/organization',
        label: 'Organization',
        icon: Building2,
        permission: 'settings.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'users',
        path: '/app/admin/users',
        label: 'Users',
        icon: Users,
        moduleCode: 'users',
        permission: 'users.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'roles',
        path: '/app/admin/roles',
        label: 'Roles',
        icon: Shield,
        permission: 'roles.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'permissions',
        path: '/app/admin/permissions',
        label: 'Permissions',
        icon: KeyRound,
        permission: 'permissions.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'departments',
        path: '/app/admin/departments',
        label: 'Departments',
        icon: Network,
        permission: 'departments.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'teams',
        path: '/app/admin/teams',
        label: 'Teams',
        icon: UsersRound,
        permission: 'teams.view',
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
    ],
  },
  {
    id: 'customer_management',
    label: 'Customer Management',
    items: [
      {
        id: 'customers',
        path: '/app/customers',
        label: 'Customers',
        icon: UserCircle,
        moduleCode: 'customers',
        permission: 'customers.view',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      {
        id: 'communication',
        path: '/app/communication',
        label: 'Communication Hub',
        icon: MessageSquare,
        moduleCode: 'communication',
        permission: 'communication.view',
        requiredSubscriptions: ['professional', 'enterprise'],
        comingSoon: true,
      },
      {
        id: 'dialer',
        path: '/app/dialer',
        label: 'Dialer',
        icon: Phone,
        moduleCode: 'communication',
        requiredSubscriptions: ['professional', 'enterprise'],
        comingSoon: true,
      },
    ],
  },
  {
    id: 'collections',
    label: 'Collections',
    items: [
      {
        id: 'loans',
        path: '/app/loans',
        label: 'Loans',
        icon: CreditCard,
        moduleCode: 'loans',
        permission: 'loans.view',
        comingSoon: true,
      },
      {
        id: 'recovery',
        path: '/app/recovery',
        label: 'Recovery Cases',
        icon: Gavel,
        moduleCode: 'cases',
        permission: 'cases.view',
        comingSoon: true,
      },
      {
        id: 'payments',
        path: '/app/payments',
        label: 'Payments',
        icon: Wallet,
        moduleCode: 'payments',
        permission: 'payments.view',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'ai_automation',
    label: 'AI & Automation',
    items: [
      {
        id: 'ai',
        path: '/app/ai',
        label: 'AI Assistant',
        icon: Bot,
        moduleCode: 'ai-assistant',
        requiredSubscriptions: ['professional', 'enterprise'],
        comingSoon: true,
      },
      {
        id: 'workflow',
        path: '/app/workflow',
        label: 'Workflows',
        icon: Workflow,
        moduleCode: 'ai-assistant',
        requiredSubscriptions: ['enterprise'],
        comingSoon: true,
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      {
        id: 'reports',
        path: '/app/reports',
        label: 'Reports & Analytics',
        icon: BarChart3,
        moduleCode: 'reports',
        permission: 'reports.view',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        id: 'settings',
        path: '/app/settings',
        label: 'Settings',
        icon: Settings,
        moduleCode: 'settings',
        isCore: true,
      },
      {
        id: 'integrations',
        path: '/app/organization?tab=integrations',
        label: 'Integrations',
        icon: Plug,
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'security',
        path: '/app/organization?tab=security',
        label: 'Security',
        icon: Lock,
        requiredRoles: ['tenant_admin'],
        isCore: true,
      },
      {
        id: 'audit',
        path: '/app/organization?tab=audit',
        label: 'Audit Logs',
        icon: FileText,
        requiredRoles: ['tenant_admin', 'auditor'],
        isCore: true,
      },
    ],
  },
];

/** @deprecated Use TENANT_NAV_GROUPS */
export const tenantNavItems = TENANT_NAV_GROUPS.flatMap((g) =>
  g.items.map((item) => ({
    path: item.path,
    text: item.label,
    icon: item.icon as React.ComponentType<any>,
  }))
);

export const tenantSettingsSections = tenantNavItems;
