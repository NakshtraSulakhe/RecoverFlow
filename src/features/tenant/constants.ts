/**
 * Multi-Tenant Platform Constants
 */

export const TENANT_CONFIG = {
  // Subscription limits
  PLANS: {
    STARTER: {
      users: 5,
      branches: 1,
      storage: 10, // GB
      apiCalls: 10000, // per month
      aiCredits: 100,
    },
    PROFESSIONAL: {
      users: 50,
      branches: 10,
      storage: 100, // GB
      apiCalls: 100000, // per month
      aiCredits: 1000,
    },
    ENTERPRISE: {
      users: -1, // unlimited
      branches: -1,
      storage: -1,
      apiCalls: -1,
      aiCredits: -1,
    },
  },

  // Default settings
  DEFAULT_TIMEZONE: 'UTC',
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_DATE_FORMAT: 'MM/DD/YYYY',
  DEFAULT_TIME_FORMAT: '12h',

  // Security defaults
  DEFAULT_PASSWORD_POLICY: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventPersonalInfo: true,
    maxAgeDays: 90,
    historyCount: 5,
  },

  DEFAULT_SESSION_POLICY: {
    timeoutMinutes: 30,
    idleTimeoutMinutes: 15,
    maxConcurrentSessions: 5,
    rememberMeDays: 30,
  },

  // Storage limits
  STORAGE_UNITS: {
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  },
} as const

export const TENANT_ROUTES = {
  TENANT_PROFILE: '/settings/tenant',
  BRANCHES: '/settings/branches',
  DEPARTMENTS: '/settings/departments',
  TEAMS: '/settings/teams',
  DESIGNATIONS: '/settings/designations',
  LOCATIONS: '/settings/locations',
  BUSINESS_UNITS: '/settings/business-units',
  BRANDING: '/settings/branding',
  SUBSCRIPTION: '/settings/subscription',
  SETTINGS: '/settings/general',
  FEATURES: '/settings/features',
  SECURITY: '/settings/security',
  AUDIT: '/settings/audit',
} as const

export const TENANT_ERRORS = {
  TENANT_NOT_FOUND: 'Tenant not found',
  TENANT_SUSPENDED: 'Tenant account has been suspended',
  TENANT_EXPIRED: 'Tenant subscription has expired',
  LIMIT_EXCEEDED: 'You have exceeded your plan limit',
  FEATURE_NOT_AVAILABLE: 'This feature is not available in your plan',
  UNAUTHORIZED_TENANT_ACCESS: 'You do not have access to this tenant',
  INVALID_TENANT_CODE: 'Invalid tenant code',
  BRANDING_UPDATE_FAILED: 'Failed to update branding',
  SETTINGS_UPDATE_FAILED: 'Failed to update settings',
} as const

export const AUDIT_ACTIONS = {
  TENANT_CREATED: 'Tenant created',
  TENANT_UPDATED: 'Tenant updated',
  TENANT_SUSPENDED: 'Tenant suspended',
  TENANT_ACTIVATED: 'Tenant activated',
  BRANCH_CREATED: 'Branch created',
  BRANCH_UPDATED: 'Branch updated',
  BRANCH_DELETED: 'Branch deleted',
  DEPARTMENT_CREATED: 'Department created',
  DEPARTMENT_UPDATED: 'Department updated',
  DEPARTMENT_DELETED: 'Department deleted',
  TEAM_CREATED: 'Team created',
  TEAM_UPDATED: 'Team updated',
  TEAM_DELETED: 'Team deleted',
  USER_ADDED: 'User added',
  USER_REMOVED: 'User removed',
  ROLE_UPDATED: 'Role updated',
  BRANDING_UPDATED: 'Branding updated',
  SETTINGS_UPDATED: 'Settings updated',
  FEATURE_FLAG_UPDATED: 'Feature flag updated',
  SUBSCRIPTION_UPDATED: 'Subscription updated',
} as const

export const FEATURE_NAMES = {
  AI: 'AI Assistant',
  PAYMENTS: 'Payment Processing',
  LEGAL: 'Legal Management',
  REPORTS: 'Advanced Reports',
  WORKFLOWS: 'Workflow Automation',
  NOTIFICATIONS: 'Notifications',
  API: 'API Access',
  INTEGRATIONS: 'Third-party Integrations',
  ADVANCED_ANALYTICS: 'Advanced Analytics',
  CUSTOM_FIELDS: 'Custom Fields',
  MULTI_CURRENCY: 'Multi-Currency',
  MULTI_LANGUAGE: 'Multi-Language',
} as const
