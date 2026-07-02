import { KPIDefinition } from '../../types/dashboard.types';

export const KPI_DEFINITIONS: Record<string, KPIDefinition[]> = {
  platform_owner: [
    { id: 'active_tenants', title: 'Active Tenants', icon: 'Building2', color: 'primary', dataSource: 'tenants.active' },
    { id: 'total_revenue', title: 'Total Revenue', icon: 'DollarSign', color: 'success', dataSource: 'analytics.total_revenue' },
    { id: 'system_health', title: 'System Health', icon: 'Shield', color: 'info', dataSource: 'system.health' },
    { id: 'api_usage', title: 'API Usage', icon: 'Zap', color: 'warning', dataSource: 'analytics.api_usage' },
    { id: 'new_signups', title: 'New Signups', icon: 'UserPlus', color: 'primary', dataSource: 'tenants.new_signups' },
    { id: 'churn_rate', title: 'Churn Rate', icon: 'TrendingDown', color: 'error', dataSource: 'analytics.churn_rate' },
  ],
  tenant_admin: [
    { id: 'total_customers', title: 'Total Customers', icon: 'Users', color: 'primary', dataSource: 'customers.total' },
    { id: 'active_cases', title: 'Active Cases', icon: 'Scale', color: 'secondary', dataSource: 'cases.active' },
    { id: 'total_recovered', title: 'Total Recovered', icon: 'DollarSign', color: 'success', dataSource: 'payments.total_recovered' },
    { id: 'recovery_rate', title: 'Recovery Rate', icon: 'TrendingUp', color: 'info', dataSource: 'analytics.recovery_rate' },
    { id: 'team_performance', title: 'Team Performance', icon: 'Target', color: 'warning', dataSource: 'analytics.team_performance' },
  ],
  recovery_manager: [
    { id: 'team_cases', title: 'Team Cases', icon: 'Scale', color: 'primary', dataSource: 'cases.team' },
    { id: 'recovery_rate', title: 'Recovery Rate', icon: 'TrendingUp', color: 'success', dataSource: 'analytics.recovery_rate' },
    { id: 'ptp_rate', title: 'PTP Rate', icon: 'Calendar', color: 'info', dataSource: 'analytics.ptp_rate' },
    { id: 'agent_performance', title: 'Agent Performance', icon: 'User', color: 'warning', dataSource: 'analytics.agent_performance' },
  ],
  team_leader: [
    { id: 'my_cases', title: 'My Cases', icon: 'Scale', color: 'primary', dataSource: 'cases.my' },
    { id: 'team_cases', title: 'Team Cases', icon: 'Users', color: 'secondary', dataSource: 'cases.team' },
    { id: 'today_calls', title: "Today's Calls", icon: 'Phone', color: 'info', dataSource: 'communications.calls_today' },
    { id: 'recovery_rate', title: 'Recovery Rate', icon: 'TrendingUp', color: 'success', dataSource: 'analytics.recovery_rate' },
  ],
  recovery_agent: [
    { id: 'my_cases', title: 'My Cases', icon: 'Scale', color: 'primary', dataSource: 'cases.my' },
    { id: 'today_calls', title: "Today's Calls", icon: 'Phone', color: 'info', dataSource: 'communications.calls_today' },
    { id: 'ptp_today', title: 'PTP Today', icon: 'Calendar', color: 'success', dataSource: 'payments.ptp_today' },
    { id: 'collections_today', title: 'Collections Today', icon: 'DollarSign', color: 'warning', dataSource: 'payments.collections_today' },
  ],
  legal_officer: [
    { id: 'legal_cases', title: 'Legal Cases', icon: 'Scale', color: 'error', dataSource: 'cases.legal' },
    { id: 'pending_hearings', title: 'Pending Hearings', icon: 'Calendar', color: 'warning', dataSource: 'legal.pending_hearings' },
    { id: 'cases_won', title: 'Cases Won', icon: 'Trophy', color: 'success', dataSource: 'legal.cases_won' },
    { id: 'documents_pending', title: 'Documents Pending', icon: 'FileText', color: 'info', dataSource: 'legal.documents_pending' },
  ],
  qa: [
    { id: 'cases_reviewed', title: 'Cases Reviewed', icon: 'CheckCircle', color: 'primary', dataSource: 'qa.cases_reviewed' },
    { id: 'quality_score', title: 'Quality Score', icon: 'Star', color: 'success', dataSource: 'qa.quality_score' },
    { id: 'compliance_rate', title: 'Compliance Rate', icon: 'Shield', color: 'info', dataSource: 'qa.compliance_rate' },
    { id: 'pending_reviews', title: 'Pending Reviews', icon: 'Clock', color: 'warning', dataSource: 'qa.pending_reviews' },
  ],
  auditor: [
    { id: 'total_audits', title: 'Total Audits', icon: 'Clipboard', color: 'primary', dataSource: 'audit.total' },
    { id: 'compliance_score', title: 'Compliance Score', icon: 'Shield', color: 'success', dataSource: 'audit.compliance_score' },
    { id: 'risk_findings', title: 'Risk Findings', icon: 'AlertTriangle', color: 'error', dataSource: 'audit.risk_findings' },
    { id: 'audit_coverage', title: 'Audit Coverage', icon: 'PieChart', color: 'info', dataSource: 'audit.coverage' },
  ],
  read_only: [
    { id: 'total_customers', title: 'Total Customers', icon: 'Users', color: 'primary', dataSource: 'customers.total' },
    { id: 'active_cases', title: 'Active Cases', icon: 'Scale', color: 'secondary', dataSource: 'cases.active' },
    { id: 'recovery_rate', title: 'Recovery Rate', icon: 'TrendingUp', color: 'success', dataSource: 'analytics.recovery_rate' },
  ],
};

export const getKPIsForRole = (role: string): KPIDefinition[] => {
  return KPI_DEFINITIONS[role] || [];
};

export const getKPIById = (role: string, kpiId: string): KPIDefinition | undefined => {
  const kpis = getKPIsForRole(role);
  return kpis.find(k => k.id === kpiId);
};
