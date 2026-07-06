/**
 * Module Configuration
 * This file defines all available modules in the system
 * Used for dynamic sidebar generation and route configuration
 */

export interface ModuleConfig {
  code: string;
  name: string;
  category: 'Overview' | 'Recovery' | 'Analytics' | 'AI' | 'Administration';
  icon: string;
  route: string;
  isCore: boolean;
  requiredSubscriptionTier?: 'basic' | 'professional' | 'enterprise';
  description?: string;
}

export const MODULES_CONFIG: ModuleConfig[] = [
  {
    code: 'dashboard',
    name: 'Dashboard',
    category: 'Overview',
    icon: 'LayoutDashboard',
    route: '/app/dashboard',
    isCore: true,
    description: 'Main dashboard with KPIs and overview',
  },
  {
    code: 'organization',
    name: 'Organization',
    category: 'Administration',
    icon: 'Building2',
    route: '/app/organization',
    isCore: true,
    description: 'Organization settings and configuration',
  },
  {
    code: 'customers',
    name: 'Customers',
    category: 'Recovery',
    icon: 'Users',
    route: '/app/customers',
    isCore: true,
    description: 'Customer management and profiles',
  },
  {
    code: 'loans',
    name: 'Loans',
    category: 'Recovery',
    icon: 'FileText',
    route: '/app/loans',
    isCore: true,
    description: 'Loan portfolio management',
  },
  {
    code: 'cases',
    name: 'Cases',
    category: 'Recovery',
    icon: 'Briefcase',
    route: '/app/cases',
    isCore: true,
    description: 'Recovery case management',
  },
  {
    code: 'payments',
    name: 'Payments',
    category: 'Recovery',
    icon: 'CreditCard',
    route: '/app/payments',
    isCore: true,
    description: 'Payment tracking and processing',
  },
  {
    code: 'reports',
    name: 'Reports',
    category: 'Analytics',
    icon: 'BarChart3',
    route: '/app/reports',
    isCore: true,
    description: 'Reports and analytics',
  },
  {
    code: 'ai',
    name: 'AI Assistant',
    category: 'AI',
    icon: 'Bot',
    route: '/app/ai',
    isCore: false,
    requiredSubscriptionTier: 'professional',
    description: 'AI-powered insights and recommendations',
  },
  {
    code: 'users',
    name: 'Users',
    category: 'Administration',
    icon: 'Users',
    route: '/app/admin/users',
    isCore: true,
    description: 'User management and provisioning',
  },
  {
    code: 'roles',
    name: 'Roles',
    category: 'Administration',
    icon: 'Shield',
    route: '/app/admin/roles',
    isCore: true,
    description: 'Role and permission management',
  },
  {
    code: 'permissions',
    name: 'Permissions',
    category: 'Administration',
    icon: 'KeyRound',
    route: '/app/admin/permissions',
    isCore: true,
    description: 'Permission matrix management',
  },
  {
    code: 'departments',
    name: 'Departments',
    category: 'Administration',
    icon: 'Network',
    route: '/app/admin/departments',
    isCore: true,
    description: 'Department management',
  },
  {
    code: 'teams',
    name: 'Teams',
    category: 'Administration',
    icon: 'UsersRound',
    route: '/app/admin/teams',
    isCore: true,
    description: 'Team management',
  },
  {
    code: 'settings',
    name: 'Settings',
    category: 'Administration',
    icon: 'Settings',
    route: '/app/settings',
    isCore: true,
    description: 'System settings and configuration',
  },
];

/**
 * Get module by code
 */
export function getModuleByCode(code: string): ModuleConfig | undefined {
  return MODULES_CONFIG.find(m => m.code === code);
}

/**
 * Get modules by category
 */
export function getModulesByCategory(category: ModuleConfig['category']): ModuleConfig[] {
  return MODULES_CONFIG.filter(m => m.category === category);
}

/**
 * Get core modules
 */
export function getCoreModules(): ModuleConfig[] {
  return MODULES_CONFIG.filter(m => m.isCore);
}

/**
 * Get modules by subscription tier
 */
export function getModulesBySubscriptionTier(tier: string): ModuleConfig[] {
  return MODULES_CONFIG.filter(m => {
    if (!m.requiredSubscriptionTier) return true;
    // Implement tier comparison logic
    return true; // Simplified for now
  });
}
