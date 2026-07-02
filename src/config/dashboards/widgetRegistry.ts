import { WidgetConfig, WidgetType } from '../../types/dashboard.types';

export const WIDGET_REGISTRY: Record<string, WidgetConfig> = {
  // KPI Card Widgets
  kpi_customers: {
    id: 'kpi_customers',
    type: WidgetType.KPI_CARD,
    title: 'Total Customers',
    icon: 'Users',
    size: 'medium',
    dataSource: 'customers.count',
    refreshInterval: 300000, // 5 minutes
  },
  kpi_cases: {
    id: 'kpi_cases',
    type: WidgetType.KPI_CARD,
    title: 'Active Cases',
    icon: 'Scale',
    size: 'medium',
    dataSource: 'cases.active',
    refreshInterval: 300000,
  },
  kpi_recovered: {
    id: 'kpi_recovered',
    type: WidgetType.KPI_CARD,
    title: 'Total Recovered',
    icon: 'DollarSign',
    size: 'medium',
    dataSource: 'payments.total_recovered',
    refreshInterval: 300000,
  },
  kpi_recovery_rate: {
    id: 'kpi_recovery_rate',
    type: WidgetType.KPI_CARD,
    title: 'Recovery Rate',
    icon: 'TrendingUp',
    size: 'medium',
    dataSource: 'analytics.recovery_rate',
    refreshInterval: 300000,
  },
  kpi_tenants: {
    id: 'kpi_tenants',
    type: WidgetType.KPI_CARD,
    title: 'Active Tenants',
    icon: 'Building2',
    size: 'medium',
    dataSource: 'tenants.active',
    refreshInterval: 600000, // 10 minutes
    requiredRoles: ['platform_owner'],
  },
  kpi_system_health: {
    id: 'kpi_system_health',
    type: WidgetType.KPI_CARD,
    title: 'System Health',
    icon: 'Shield',
    size: 'medium',
    dataSource: 'system.health',
    refreshInterval: 60000, // 1 minute
    requiredRoles: ['platform_owner'],
  },

  // Chart Widgets
  chart_revenue: {
    id: 'chart_revenue',
    type: WidgetType.CHART,
    title: 'Revenue Trend',
    icon: 'DollarSign',
    size: 'large',
    dataSource: 'analytics.revenue_trend',
    refreshInterval: 300000,
    config: { chartType: 'area', metric: 'revenue' },
  },
  chart_recovery: {
    id: 'chart_recovery',
    type: WidgetType.CHART,
    title: 'Recovery Performance',
    icon: 'TrendingUp',
    size: 'large',
    dataSource: 'analytics.recovery_performance',
    refreshInterval: 300000,
    config: { chartType: 'area', metric: 'recovery' },
  },
  chart_team_performance: {
    id: 'chart_team_performance',
    type: WidgetType.CHART,
    title: 'Team Performance',
    icon: 'Users',
    size: 'medium',
    dataSource: 'analytics.team_performance',
    refreshInterval: 300000,
    config: { chartType: 'bar', metric: 'team_performance' },
  },
  chart_tenant_growth: {
    id: 'chart_tenant_growth',
    type: WidgetType.CHART,
    title: 'Tenant Growth',
    icon: 'Building2',
    size: 'medium',
    dataSource: 'analytics.tenant_growth',
    refreshInterval: 600000,
    config: { chartType: 'bar', metric: 'tenant_growth' },
    requiredRoles: ['platform_owner'],
  },

  // Work Queue Widgets
  work_queue_platform: {
    id: 'work_queue_platform',
    type: WidgetType.WORK_QUEUE,
    title: 'Platform Tasks',
    icon: 'ClipboardList',
    size: 'large',
    dataSource: 'tasks.platform',
    refreshInterval: 60000,
    requiredRoles: ['platform_owner'],
    config: { queue: 'platform_tasks' },
  },
  work_queue_admin: {
    id: 'work_queue_admin',
    type: WidgetType.WORK_QUEUE,
    title: 'Admin Tasks',
    icon: 'ClipboardList',
    size: 'large',
    dataSource: 'tasks.admin',
    refreshInterval: 60000,
    requiredRoles: ['tenant_admin'],
    config: { queue: 'admin_tasks' },
  },
  work_queue_recovery: {
    id: 'work_queue_recovery',
    type: WidgetType.WORK_QUEUE,
    title: 'My Cases',
    icon: 'Scale',
    size: 'large',
    dataSource: 'cases.my_cases',
    refreshInterval: 60000,
    config: { queue: 'my_cases' },
  },
  work_queue_legal: {
    id: 'work_queue_legal',
    type: WidgetType.WORK_QUEUE,
    title: 'Legal Cases',
    icon: 'Scale',
    size: 'large',
    dataSource: 'cases.legal',
    refreshInterval: 60000,
    requiredRoles: ['legal_officer'],
    config: { queue: 'legal_cases' },
  },

  // Quick Action Widgets
  quick_actions: {
    id: 'quick_actions',
    type: WidgetType.QUICK_ACTION,
    title: 'Quick Actions',
    icon: 'Zap',
    size: 'medium',
    config: {
      actions: [
        { id: 'add_customer', label: 'Add Customer', icon: 'UserPlus', path: '/customers/new' },
        { id: 'create_case', label: 'Create Case', icon: 'Plus', path: '/cases/new' },
        { id: 'record_payment', label: 'Record Payment', icon: 'DollarSign', path: '/payments/new' },
        { id: 'schedule_call', label: 'Schedule Call', icon: 'Phone', path: '/schedule-call' },
      ],
    },
  },

  // AI Recommendation Widgets
  ai_insights: {
    id: 'ai_insights',
    type: WidgetType.AI_RECOMMENDATION,
    title: 'AI Insights',
    icon: 'Brain',
    size: 'medium',
    dataSource: 'ai.insights',
    refreshInterval: 300000,
    requiredFeatures: ['ai_enabled'],
  },
  ai_recommendations: {
    id: 'ai_recommendations',
    type: WidgetType.AI_RECOMMENDATION,
    title: 'AI Recommendations',
    icon: 'Lightbulb',
    size: 'medium',
    dataSource: 'ai.recommendations',
    refreshInterval: 300000,
    requiredFeatures: ['ai_enabled'],
  },

  // Activity Feed Widgets
  activity_feed: {
    id: 'activity_feed',
    type: WidgetType.ACTIVITY_FEED,
    title: 'Recent Activity',
    icon: 'Activity',
    size: 'large',
    dataSource: 'activity.recent',
    refreshInterval: 60000,
  },

  // Notification Center Widgets
  notification_center: {
    id: 'notification_center',
    type: WidgetType.NOTIFICATION_CENTER,
    title: 'Notifications',
    icon: 'Bell',
    size: 'medium',
    dataSource: 'notifications.recent',
    refreshInterval: 60000,
  },
};

export const getWidgetConfig = (widgetId: string): WidgetConfig | undefined => {
  return WIDGET_REGISTRY[widgetId];
};

export const getWidgetsByType = (type: WidgetType): WidgetConfig[] => {
  return Object.values(WIDGET_REGISTRY).filter(w => w.type === type);
};

export const getWidgetsForRole = (role: string): WidgetConfig[] => {
  return Object.values(WIDGET_REGISTRY).filter(widget => {
    if (widget.requiredRoles && widget.requiredRoles.length > 0) {
      return widget.requiredRoles.includes(role);
    }
    return true;
  });
};
