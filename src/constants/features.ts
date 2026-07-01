export const FEATURE_KEYS = {
  DASHBOARD: 'dashboard',
  CUSTOMERS: 'customers',
  LOANS: 'loans',
  RECOVERY: 'recovery',
  AI_ASSISTANT: 'ai_assistant',
  PAYMENTS: 'payments',
  REPORTS: 'reports',
  WORKFLOWS: 'workflows',
  COMMUNICATION: 'communication',
  LEGAL: 'legal',
  SETTINGS: 'settings',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  platform_owner: ['*'],
  tenant_admin: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.CUSTOMERS,
    FEATURE_KEYS.LOANS,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.AI_ASSISTANT,
    FEATURE_KEYS.PAYMENTS,
    FEATURE_KEYS.REPORTS,
    FEATURE_KEYS.WORKFLOWS,
    FEATURE_KEYS.COMMUNICATION,
    FEATURE_KEYS.LEGAL,
    FEATURE_KEYS.SETTINGS,
  ],
  recovery_manager: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.CUSTOMERS,
    FEATURE_KEYS.LOANS,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.AI_ASSISTANT,
    FEATURE_KEYS.PAYMENTS,
    FEATURE_KEYS.REPORTS,
    FEATURE_KEYS.WORKFLOWS,
    FEATURE_KEYS.COMMUNICATION,
  ],
  team_leader: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.CUSTOMERS,
    FEATURE_KEYS.LOANS,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.AI_ASSISTANT,
    FEATURE_KEYS.COMMUNICATION,
  ],
  recovery_agent: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.CUSTOMERS,
    FEATURE_KEYS.LOANS,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.AI_ASSISTANT,
    FEATURE_KEYS.COMMUNICATION,
  ],
  legal_officer: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.LEGAL,
    FEATURE_KEYS.REPORTS,
  ],
  qa: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.REPORTS,
  ],
  auditor: ['*'],
  read_only: [
    FEATURE_KEYS.DASHBOARD,
    FEATURE_KEYS.CUSTOMERS,
    FEATURE_KEYS.LOANS,
    FEATURE_KEYS.RECOVERY,
    FEATURE_KEYS.REPORTS,
  ],
};

export const NAVIGATION_ITEMS = [
  {
    group: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', feature: FEATURE_KEYS.DASHBOARD },
      { label: 'Global Search', path: '/search', icon: 'Search', feature: FEATURE_KEYS.DASHBOARD },
    ],
  },
  {
    group: 'Customers',
    items: [
      { label: 'Tenants', path: '/tenants', icon: 'Building2', feature: FEATURE_KEYS.SETTINGS, roles: ['platform_owner', 'tenant_admin'] },
      { label: 'Users', path: '/users', icon: 'Users', feature: FEATURE_KEYS.SETTINGS, roles: ['platform_owner', 'tenant_admin'] },
      { label: 'All Customers', path: '/customers', icon: 'UserCircle', feature: FEATURE_KEYS.CUSTOMERS },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Cases', path: '/cases', icon: 'Briefcase', feature: FEATURE_KEYS.RECOVERY },
      { label: 'Follow-ups', path: '/recovery', icon: 'PhoneCall', feature: FEATURE_KEYS.RECOVERY },
      { label: 'Workflows', path: '/workflows', icon: 'Workflow', feature: FEATURE_KEYS.WORKFLOWS },
    ],
  },
  {
    group: 'AI & Analytics',
    items: [
      { label: 'AI Assistant', path: '/ai-assistant', icon: 'Bot', feature: FEATURE_KEYS.AI_ASSISTANT },
      { label: 'Reports', path: '/reports', icon: 'BarChart3', feature: FEATURE_KEYS.REPORTS },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Messages', path: '/messages', icon: 'MessageSquare', feature: FEATURE_KEYS.COMMUNICATION },
      { label: 'Campaigns', path: '/campaigns', icon: 'Megaphone', feature: FEATURE_KEYS.COMMUNICATION },
    ],
  },
  {
    group: 'Payments',
    items: [
      { label: 'Payments', path: '/payments', icon: 'CreditCard', feature: FEATURE_KEYS.PAYMENTS },
      { label: 'Settlements', path: '/settlements', icon: 'FileText', feature: FEATURE_KEYS.PAYMENTS },
    ],
  },
  {
    group: 'Legal',
    items: [
      { label: 'Legal Cases', path: '/legal', icon: 'Scale', feature: FEATURE_KEYS.LEGAL },
      { label: 'Documents', path: '/documents', icon: 'FileText', feature: FEATURE_KEYS.LEGAL },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'Settings', path: '/settings', icon: 'Settings', feature: FEATURE_KEYS.SETTINGS },
    ],
  },
];
