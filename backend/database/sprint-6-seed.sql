-- =============================================
-- Sprint 6 Seed Data
-- =============================================

\c recoverflow_dev;

-- =============================================
-- Seed Default Case Statuses (System)
-- =============================================
-- Note: Tenant-specific statuses are not seeded, these are system templates
-- We'll seed a set of default statuses that tenants can customize
-- The seed is intended to help setup the initial data

-- =============================================
-- Seed Default Activity Types (System)
-- =============================================

-- =============================================
-- Seed Widget Registry
-- =============================================
INSERT INTO widget_registry (
    widget_code,
    widget_name,
    description,
    widget_type,
    component_name,
    default_config,
    allowed_roles,
    is_system,
    is_active
) VALUES
(
    'TOTAL_RECOVERY',
    'Total Recovery',
    'Displays total recovery amount for the period',
    'KPI',
    'TotalRecoveryWidget',
    '{"period": "month"}',
    '["TENANT_ADMIN", "RECOVERY_MANAGER"]',
    true,
    true
),
(
    'PENDING_CASES',
    'Pending Cases',
    'Shows count of pending cases',
    'KPI',
    'PendingCasesWidget',
    '{}',
    '["TENANT_ADMIN", "RECOVERY_MANAGER", "TEAM_LEADER"]',
    true,
    true
),
(
    'RECOVERY_RATE',
    'Recovery Rate',
    'Calculates recovery success rate',
    'KPI',
    'RecoveryRateWidget',
    '{"period": "month"}',
    '["TENANT_ADMIN", "RECOVERY_MANAGER"]',
    true,
    true
),
(
    'AGENT_PERFORMANCE',
    'Agent Performance',
    'Displays performance metrics for agents',
    'CHART',
    'AgentPerformanceWidget',
    '{"chartType": "bar"}',
    '["TENANT_ADMIN", "RECOVERY_MANAGER"]',
    true,
    true
),
(
    'ACTIVITY_FEED',
    'Activity Feed',
    'Shows recent activities',
    'ACTIVITY_FEED',
    'ActivityFeedWidget',
    '{"limit": 10}',
    '["TENANT_ADMIN", "RECOVERY_MANAGER", "TEAM_LEADER", "RECOVERY_AGENT"]',
    true,
    true
),
(
    'WORK_QUEUE',
    'Work Queue',
    'Displays current work queue',
    'WORK_QUEUE',
    'WorkQueueWidget',
    '{}',
    '["RECOVERY_AGENT", "TEAM_LEADER"]',
    true,
    true
)
ON CONFLICT (widget_code) DO NOTHING;
