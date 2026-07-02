export enum WidgetType {
  KPI_CARD = 'kpi_card',
  CHART = 'chart',
  WORK_QUEUE = 'work_queue',
  QUICK_ACTION = 'quick_action',
  AI_RECOMMENDATION = 'ai_recommendation',
  ACTIVITY_FEED = 'activity_feed',
  NOTIFICATION_CENTER = 'notification_center',
  METRIC_CARD = 'metric_card',
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  icon?: string;
  size: 'small' | 'medium' | 'large' | 'wide';
  requiredRoles?: string[];
  dataSource?: string;
  refreshInterval?: number;
  config?: Record<string, any>;
}

export interface DashboardConfig {
  layout: 'grid' | 'masonry' | 'flex';
  widgets: WidgetConfig[];
}

export interface KPIDefinition {
  id: string;
  title: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  dataSource?: string;
}

export interface RoleDashboardConfig {
  [role: string]: DashboardConfig;
}
