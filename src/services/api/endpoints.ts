/**
 * API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    MFA_SETUP: '/auth/mfa/setup',
    MFA_VERIFY: '/auth/mfa/verify',
  },

  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/password`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },

  // Tenants
  TENANTS: {
    LIST: '/tenants',
    CREATE: '/tenants',
    GET: (id: string) => `/tenants/${id}`,
    UPDATE: (id: string) => `/tenants/${id}`,
    DELETE: (id: string) => `/tenants/${id}`,
    CONFIG: (id: string) => `/tenants/${id}/config`,
    SUSPEND: (id: string) => `/tenants/${id}/suspend`,
    ACTIVATE: (id: string) => `/tenants/${id}/activate`,
    ARCHIVE: (id: string) => `/tenants/${id}/archive`,
    STATS: (id: string) => `/tenants/${id}/stats`,
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    CREATE: '/subscriptions',
    GET: (id: string) => `/subscriptions/${id}`,
    UPDATE: (id: string) => `/subscriptions/${id}`,
    UPGRADE: (id: string) => `/subscriptions/${id}/upgrade`,
    SUSPEND: (id: string) => `/subscriptions/${id}/suspend`,
    ACTIVATE: (id: string) => `/subscriptions/${id}/activate`,
    CANCEL: (id: string) => `/subscriptions/${id}/cancel`,
    RENEW: (id: string) => `/subscriptions/${id}/renew`,
  },

  // Usage
  USAGE: {
    RECORD: '/usage',
    TENANT: (id: string) => `/usage/tenant/${id}`,
    SUMMARY: (id: string) => `/usage/tenant/${id}/summary`,
    DASHBOARD: (id: string) => `/usage/tenant/${id}/dashboard`,
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers',
    GET: (id: string) => `/customers/${id}`,
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    SEARCH: '/customers/search',
    EXPORT: '/customers/export',
    IMPORT: '/customers/import',
    ADDRESSES: (id: string) => `/customers/${id}/addresses`,
    CONTACTS: (id: string) => `/customers/${id}/contacts`,
    DOCUMENTS: (id: string) => `/customers/${id}/documents`,
  },

  // Loans
  LOANS: {
    LIST: '/loans',
    CREATE: '/loans',
    GET: (id: string) => `/loans/${id}`,
    UPDATE: (id: string) => `/loans/${id}`,
    DELETE: (id: string) => `/loans/${id}`,
    EMI_SCHEDULE: (id: string) => `/loans/${id}/emi-schedule`,
    OUTSTANDING: (id: string) => `/loans/${id}/outstanding`,
    DISBURSE: (id: string) => `/loans/${id}/disburse`,
    RESTRUCTURE: (id: string) => `/loans/${id}/restructure`,
    WRITE_OFF: (id: string) => `/loans/${id}/write-off`,
  },

  // Recovery Cases
  CASES: {
    LIST: '/recovery/cases',
    CREATE: '/recovery/cases',
    GET: (id: string) => `/recovery/cases/${id}`,
    UPDATE: (id: string) => `/recovery/cases/${id}`,
    DELETE: (id: string) => `/recovery/cases/${id}`,
    ASSIGN: (id: string) => `/recovery/cases/${id}/assign`,
    ESCALATE: (id: string) => `/recovery/cases/${id}/escalate`,
    CLOSE: (id: string) => `/recovery/cases/${id}/close`,
    FOLLOW_UPS: (id: string) => `/recovery/cases/${id}/follow-ups`,
    ACTIVITIES: (id: string) => `/recovery/cases/${id}/activities`,
  },

  // Follow-ups
  FOLLOW_UPS: {
    LIST: '/recovery/follow-ups',
    CREATE: '/recovery/follow-ups',
    GET: (id: string) => `/recovery/follow-ups/${id}`,
    UPDATE: (id: string) => `/recovery/follow-ups/${id}`,
    DELETE: (id: string) => `/recovery/follow-ups/${id}`,
    COMPLETE: (id: string) => `/recovery/follow-ups/${id}/complete`,
    RESCHEDULE: (id: string) => `/recovery/follow-ups/${id}/reschedule`,
  },

  // Communications
  COMMUNICATIONS: {
    CALL_LOGS: '/communications/calls',
    SMS_HISTORY: '/communications/sms',
    EMAIL_HISTORY: '/communications/emails',
    WHATSAPP_HISTORY: '/communications/whatsapp',
    VISIT_LOGS: '/communications/visits',
    SEND_SMS: '/communications/sms/send',
    SEND_EMAIL: '/communications/emails/send',
    SEND_WHATSAPP: '/communications/whatsapp/send',
  },

  // Payments
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    GET: (id: string) => `/payments/${id}`,
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
    ALLOCATIONS: (id: string) => `/payments/${id}/allocations`,
    RECONCILE: '/payments/reconcile',
    REFUND: (id: string) => `/payments/${id}/refund`,
  },

  // Settlements
  SETTLEMENTS: {
    LIST: '/settlements',
    CREATE: '/settlements',
    GET: (id: string) => `/settlements/${id}`,
    UPDATE: (id: string) => `/settlements/${id}`,
    DELETE: (id: string) => `/settlements/${id}`,
    APPROVE: (id: string) => `/settlements/${id}/approve`,
    REJECT: (id: string) => `/settlements/${id}/reject`,
  },

  // Legal
  LEGAL_CASES: {
    LIST: '/legal/cases',
    CREATE: '/legal/cases',
    GET: (id: string) => `/legal/cases/${id}`,
    UPDATE: (id: string) => `/legal/cases/${id}`,
    DELETE: (id: string) => `/legal/cases/${id}`,
    HEARINGS: (id: string) => `/legal/cases/${id}/hearings`,
    DOCUMENTS: (id: string) => `/legal/cases/${id}/documents`,
    EXPENSES: (id: string) => `/legal/cases/${id}/expenses`,
  },

  // Documents
  DOCUMENTS: {
    LIST: '/documents',
    UPLOAD: '/documents/upload',
    GET: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
    SHARE: (id: string) => `/documents/${id}/share`,
  },

  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    GENERATE: (id: string) => `/reports/${id}/generate`,
    SCHEDULE: (id: string) => `/reports/${id}/schedule`,
    EXPORT: (id: string) => `/reports/${id}/export`,
  },

  // AI
  AI: {
    PREDICTIONS: '/ai/predictions',
    RECOMMENDATIONS: '/ai/recommendations',
    SUMMARIES: '/ai/summaries',
    RISK_SCORES: '/ai/risk-scores',
    CHAT: '/ai/chat',
    PROMPT_HISTORY: '/ai/prompt-history',
  },

  // Settings
  SETTINGS: {
    PROFILE: '/settings/profile',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
    PREFERENCES: '/settings/preferences',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    RECOVERY_OVERVIEW: '/dashboard/recovery-overview',
    PAYMENT_TRENDS: '/dashboard/payment-trends',
  },

  // Departments
  DEPARTMENTS: {
    LIST: '/departments',
    CREATE: '/departments',
    GET: (id: string) => `/departments/${id}`,
    UPDATE: (id: string) => `/departments/${id}`,
    DELETE: (id: string) => `/departments/${id}`,
  },

  // Teams
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
    GET: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
  },

  // Roles
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    GET: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    CLONE: (id: string) => `/roles/${id}/clone`,
  },

  // Permissions
  PERMISSIONS: {
    LIST: '/permissions',
    GET: (id: string) => `/permissions/${id}`,
  },
} as const
