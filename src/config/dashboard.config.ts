/**
 * Dashboard Configuration
 * This file defines dashboard layouts for different roles
 * Used for dynamic dashboard generation
 */

export interface DashboardWidget {
  id: string;
  type: string;
  title?: string;
  metric?: string;
  position: { x: number; y: number; w: number; h: number };
  config?: any;
}

export interface DashboardConfig {
  role: string;
  widgets: DashboardWidget[];
}

export const DASHBOARD_CONFIGS: Record<string, DashboardConfig> = {
  tenant_admin: {
    role: 'tenant_admin',
    widgets: [
      {
        id: 'org_info',
        type: 'organization_info',
        position: { x: 0, y: 0, w: 6, h: 2 },
      },
      {
        id: 'subscription',
        type: 'subscription_summary',
        position: { x: 6, y: 0, w: 6, h: 2 },
      },
      {
        id: 'kpi_users',
        type: 'kpi_card',
        title: 'Total Users',
        metric: 'users',
        position: { x: 0, y: 2, w: 3, h: 2 },
      },
      {
        id: 'kpi_depts',
        type: 'kpi_card',
        title: 'Departments',
        metric: 'departments',
        position: { x: 3, y: 2, w: 3, h: 2 },
      },
      {
        id: 'kpi_teams',
        type: 'kpi_card',
        title: 'Teams',
        metric: 'teams',
        position: { x: 6, y: 2, w: 3, h: 2 },
      },
      {
        id: 'kpi_roles',
        type: 'kpi_card',
        title: 'Roles',
        metric: 'roles',
        position: { x: 9, y: 2, w: 3, h: 2 },
      },
      {
        id: 'setup_checklist',
        type: 'setup_checklist',
        position: { x: 0, y: 4, w: 8, h: 4 },
      },
      {
        id: 'quick_actions',
        type: 'quick_actions',
        position: { x: 8, y: 4, w: 4, h: 4 },
      },
      {
        id: 'recent_activities',
        type: 'recent_activities',
        position: { x: 6, y: 8, w: 6, h: 4 },
      },
    ],
  },
  recovery_manager: {
    role: 'recovery_manager',
    widgets: [
      {
        id: 'kpi_customers',
        type: 'kpi_card',
        title: 'Total Customers',
        metric: 'customers',
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: 'kpi_loans',
        type: 'kpi_card',
        title: 'Active Loans',
        metric: 'loans',
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        id: 'kpi_cases',
        type: 'kpi_card',
        title: 'Open Cases',
        metric: 'cases',
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        id: 'kpi_collections',
        type: 'kpi_card',
        title: 'Collections',
        metric: 'collections',
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        id: 'recovery_chart',
        type: 'recovery_chart',
        position: { x: 0, y: 2, w: 6, h: 4 },
      },
      {
        id: 'team_performance',
        type: 'team_performance',
        position: { x: 6, y: 2, w: 6, h: 4 },
      },
      {
        id: 'recent_cases',
        type: 'recent_cases',
        position: { x: 0, y: 6, w: 12, h: 4 },
      },
    ],
  },
  team_leader: {
    role: 'team_leader',
    widgets: [
      {
        id: 'kpi_team_cases',
        type: 'kpi_card',
        title: 'Team Cases',
        metric: 'team_cases',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_team_performance',
        type: 'kpi_card',
        title: 'Team Performance',
        metric: 'team_performance',
        position: { x: 4, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_pending',
        type: 'kpi_card',
        title: 'Pending Actions',
        metric: 'pending_actions',
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        id: 'team_overview',
        type: 'team_overview',
        position: { x: 0, y: 2, w: 12, h: 4 },
      },
      {
        id: 'team_members',
        type: 'team_members',
        position: { x: 0, y: 6, w: 6, h: 4 },
      },
      {
        id: 'team_assignments',
        type: 'team_assignments',
        position: { x: 6, y: 6, w: 6, h: 4 },
      },
    ],
  },
  recovery_agent: {
    role: 'recovery_agent',
    widgets: [
      {
        id: 'kpi_assigned',
        type: 'kpi_card',
        title: 'Assigned Cases',
        metric: 'assigned_cases',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_completed',
        type: 'kpi_card',
        title: 'Completed Today',
        metric: 'completed_today',
        position: { x: 4, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_pending',
        type: 'kpi_card',
        title: 'Pending Actions',
        metric: 'pending_actions',
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        id: 'my_cases',
        type: 'my_cases',
        position: { x: 0, y: 2, w: 12, h: 6 },
      },
      {
        id: 'upcoming_tasks',
        type: 'upcoming_tasks',
        position: { x: 0, y: 8, w: 6, h: 4 },
      },
      {
        id: 'recent_activities',
        type: 'recent_activities',
        position: { x: 6, y: 8, w: 6, h: 4 },
      },
    ],
  },
  legal_officer: {
    role: 'legal_officer',
    widgets: [
      {
        id: 'kpi_legal_cases',
        type: 'kpi_card',
        title: 'Legal Cases',
        metric: 'legal_cases',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_pending_review',
        type: 'kpi_card',
        title: 'Pending Review',
        metric: 'pending_review',
        position: { x: 4, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_approved',
        type: 'kpi_card',
        title: 'Approved Today',
        metric: 'approved_today',
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        id: 'legal_cases',
        type: 'legal_cases',
        position: { x: 0, y: 2, w: 12, h: 6 },
      },
      {
        id: 'approvals_queue',
        type: 'approvals_queue',
        position: { x: 0, y: 8, w: 12, h: 4 },
      },
    ],
  },
  qa: {
    role: 'qa',
    widgets: [
      {
        id: 'kpi_review_queue',
        type: 'kpi_card',
        title: 'Review Queue',
        metric: 'review_queue',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_reviewed_today',
        type: 'kpi_card',
        title: 'Reviewed Today',
        metric: 'reviewed_today',
        position: { x: 4, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_issues_found',
        type: 'kpi_card',
        title: 'Issues Found',
        metric: 'issues_found',
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        id: 'qa_dashboard',
        type: 'qa_dashboard',
        position: { x: 0, y: 2, w: 12, h: 6 },
      },
      {
        id: 'quality_metrics',
        type: 'quality_metrics',
        position: { x: 0, y: 8, w: 6, h: 4 },
      },
      {
        id: 'recent_reviews',
        type: 'recent_reviews',
        position: { x: 6, y: 8, w: 6, h: 4 },
      },
    ],
  },
  auditor: {
    role: 'auditor',
    widgets: [
      {
        id: 'kpi_audit_logs',
        type: 'kpi_card',
        title: 'Audit Logs',
        metric: 'audit_logs',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_compliance',
        type: 'kpi_card',
        title: 'Compliance Score',
        metric: 'compliance_score',
        position: { x: 4, y: 0, w: 4, h: 2 },
      },
      {
        id: 'kpi_risk_level',
        type: 'kpi_card',
        title: 'Risk Level',
        metric: 'risk_level',
        position: { x: 8, y: 0, w: 4, h: 2 },
      },
      {
        id: 'audit_trail',
        type: 'audit_trail',
        position: { x: 0, y: 2, w: 12, h: 6 },
      },
      {
        id: 'compliance_report',
        type: 'compliance_report',
        position: { x: 0, y: 8, w: 6, h: 4 },
      },
      {
        id: 'risk_assessment',
        type: 'risk_assessment',
        position: { x: 6, y: 8, w: 6, h: 4 },
      },
    ],
  },
  read_only: {
    role: 'read_only',
    widgets: [
      {
        id: 'kpi_overview',
        type: 'kpi_card',
        title: 'Overview',
        metric: 'overview',
        position: { x: 0, y: 0, w: 4, h: 2 },
      },
      {
        id: 'read_only_dashboard',
        type: 'read_only_dashboard',
        position: { x: 0, y: 2, w: 12, h: 8 },
      },
    ],
  },
};

/**
 * Get dashboard config by role
 */
export function getDashboardConfig(role: string): DashboardConfig | undefined {
  return DASHBOARD_CONFIGS[role];
}

/**
 * Get default dashboard config (fallback)
 */
export function getDefaultDashboardConfig(): DashboardConfig {
  return DASHBOARD_CONFIGS.tenant_admin;
}
