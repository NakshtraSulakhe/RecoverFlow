import { DashboardConfig, WidgetType } from '../../types/dashboard.types';

export const DASHBOARD_CONFIGS: Record<string, DashboardConfig> = {
  platform_owner: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['active_tenants', 'total_revenue', 'system_health', 'api_usage'] } 
      },
      { 
        id: 'chart_revenue', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'revenue' } 
      },
      { 
        id: 'chart_tenant_growth', 
        type: WidgetType.CHART, 
        size: 'medium', 
        config: { chartType: 'bar', metric: 'tenant_growth' } 
      },
      { 
        id: 'work_queue_platform', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'platform_tasks' } 
      },
      { 
        id: 'ai_insights', 
        type: WidgetType.AI_RECOMMENDATION, 
        size: 'medium' 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  tenant_admin: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['total_customers', 'active_cases', 'total_recovered', 'recovery_rate'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'recovery' } 
      },
      { 
        id: 'chart_team_performance', 
        type: WidgetType.CHART, 
        size: 'medium', 
        config: { chartType: 'bar', metric: 'team_performance' } 
      },
      { 
        id: 'work_queue_admin', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'admin_tasks' } 
      },
      { 
        id: 'quick_actions', 
        type: WidgetType.QUICK_ACTION, 
        size: 'medium' 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  recovery_manager: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['team_cases', 'recovery_rate', 'ptp_rate', 'agent_performance'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'recovery' } 
      },
      { 
        id: 'chart_team_performance', 
        type: WidgetType.CHART, 
        size: 'medium', 
        config: { chartType: 'bar', metric: 'team_performance' } 
      },
      { 
        id: 'work_queue_recovery', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'team_cases' } 
      },
      { 
        id: 'quick_actions', 
        type: WidgetType.QUICK_ACTION, 
        size: 'medium' 
      },
      { 
        id: 'ai_recommendations', 
        type: WidgetType.AI_RECOMMENDATION, 
        size: 'medium' 
      },
    ],
  },
  team_leader: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['my_cases', 'team_cases', 'today_calls', 'recovery_rate'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'recovery' } 
      },
      { 
        id: 'work_queue_recovery', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'team_cases' } 
      },
      { 
        id: 'quick_actions', 
        type: WidgetType.QUICK_ACTION, 
        size: 'medium' 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  recovery_agent: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['my_cases', 'today_calls', 'ptp_today', 'collections_today'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'personal_recovery' } 
      },
      { 
        id: 'work_queue_recovery', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'my_cases' } 
      },
      { 
        id: 'quick_actions', 
        type: WidgetType.QUICK_ACTION, 
        size: 'medium' 
      },
      { 
        id: 'ai_recommendations', 
        type: WidgetType.AI_RECOMMENDATION, 
        size: 'medium' 
      },
    ],
  },
  legal_officer: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['legal_cases', 'pending_hearings', 'cases_won', 'documents_pending'] } 
      },
      { 
        id: 'work_queue_legal', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'legal_cases' } 
      },
      { 
        id: 'quick_actions', 
        type: WidgetType.QUICK_ACTION, 
        size: 'medium' 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  qa: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['cases_reviewed', 'quality_score', 'compliance_rate', 'pending_reviews'] } 
      },
      { 
        id: 'work_queue_recovery', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'pending_reviews' } 
      },
      { 
        id: 'chart_team_performance', 
        type: WidgetType.CHART, 
        size: 'medium', 
        config: { chartType: 'bar', metric: 'quality_trends' } 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  auditor: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['total_audits', 'compliance_score', 'risk_findings', 'audit_coverage'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'compliance_trends' } 
      },
      { 
        id: 'work_queue_recovery', 
        type: WidgetType.WORK_QUEUE, 
        size: 'large', 
        config: { queue: 'audit_tasks' } 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
  read_only: {
    layout: 'grid',
    widgets: [
      { 
        id: 'kpi_row_1', 
        type: WidgetType.KPI_CARD, 
        size: 'wide', 
        config: { kpis: ['total_customers', 'active_cases', 'recovery_rate'] } 
      },
      { 
        id: 'chart_recovery', 
        type: WidgetType.CHART, 
        size: 'large', 
        config: { chartType: 'area', metric: 'recovery' } 
      },
      { 
        id: 'activity_feed', 
        type: WidgetType.ACTIVITY_FEED, 
        size: 'large' 
      },
    ],
  },
};

export const getDashboardConfig = (role: string): DashboardConfig => {
  return DASHBOARD_CONFIGS[role] || DASHBOARD_CONFIGS.read_only;
};

export const dashboardRegistry = {
  platform_owner: 'PlatformOwnerDashboard',
  tenant_admin: 'TenantAdminDashboard',
  recovery_manager: 'RecoveryManagerDashboard',
  team_leader: 'TeamLeaderDashboard',
  recovery_agent: 'RecoveryAgentDashboard',
  legal_officer: 'LegalOfficerDashboard',
  qa: 'QADashboard',
  auditor: 'AuditorDashboard',
  read_only: 'ReadOnlyDashboard',
};
