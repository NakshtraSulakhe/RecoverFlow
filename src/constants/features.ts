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
    ],
  },
  {
    group: 'Customers',
    items: [
      { label: 'Tenants', path: '/tenants', icon: 'Building2', feature: FEATURE_KEYS.SETTINGS, roles: ['platform_owner', 'tenant_admin'] },
      { label: 'Users', path: '/users', icon: 'Users', feature: FEATURE_KEYS.SETTINGS, roles: ['platform_owner', 'tenant_admin'] },
      { label: 'All Customers', path: '/customers', icon: 'Users', feature: FEATURE_KEYS.CUSTOMERS },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Cases', path: '/cases', icon: 'Scale', feature: FEATURE_KEYS.RECOVERY },
      { label: 'Recovery Actions', path: '/recovery', icon: 'RefreshCw', feature: FEATURE_KEYS.RECOVERY },
      { label: 'Priority Scoring', path: '/priority-scoring', icon: 'TrendingUp', feature: FEATURE_KEYS.RECOVERY },
      { label: 'PTP Tracker', path: '/ptp-tracker', icon: 'Calendar', feature: FEATURE_KEYS.RECOVERY },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Smart Dialer', path: '/smart-dialer', icon: 'Phone', feature: FEATURE_KEYS.COMMUNICATION },
      { label: 'WhatsApp Recovery', path: '/whatsapp-recovery', icon: 'MessageSquare', feature: FEATURE_KEYS.COMMUNICATION },
      { label: 'Omnichannel Timeline', path: '/omnichannel', icon: 'History', feature: FEATURE_KEYS.COMMUNICATION },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Payments', path: '/payments', icon: 'CreditCard', feature: FEATURE_KEYS.PAYMENTS },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { label: 'Reports', path: '/reports', icon: 'BarChart3', feature: FEATURE_KEYS.REPORTS },
    ],
  },
  {
    group: 'AI',
    items: [
      { label: 'AI Assistant', path: '/ai', icon: 'Bot', feature: FEATURE_KEYS.AI_ASSISTANT },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'Settings', path: '/settings', icon: 'Settings', feature: FEATURE_KEYS.SETTINGS },
    ],
  },
];
