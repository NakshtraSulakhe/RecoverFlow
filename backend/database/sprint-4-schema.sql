-- Sprint 4 Database Schema: Enhanced RBAC with Permission Matrix
-- This enhances Sprint 3 schema with a structured permission matrix

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Permission Actions Table (Standard Actions)
CREATE TABLE IF NOT EXISTS permission_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_code VARCHAR(50) UNIQUE NOT NULL,
    action_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert Standard Permission Actions
INSERT INTO permission_actions (action_code, action_name, description, sort_order) VALUES
('view', 'View', 'View and read access', 1),
('create', 'Create', 'Create new records', 2),
('edit', 'Edit', 'Edit existing records', 3),
('delete', 'Delete', 'Delete records', 4),
('assign', 'Assign', 'Assign records to users/teams', 5),
('approve', 'Approve', 'Approve requests/decisions', 6),
('export', 'Export', 'Export data', 7),
('import', 'Import', 'Import data', 8),
('configure', 'Configure', 'Configure settings', 9)
ON CONFLICT (action_code) DO NOTHING;

-- 3. Create Permission Matrix Table
-- This stores the matrix of module + action permissions
CREATE TABLE IF NOT EXISTS permission_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_code VARCHAR(100) NOT NULL,
    action_code VARCHAR(50) NOT NULL REFERENCES permission_actions(action_code),
    permission_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_code, action_code)
);

-- 4. Insert Permission Matrix for All Modules
-- Dashboard Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('dashboard', 'view', 'dashboard.view', 'View Dashboard', 'Access to dashboard'),
('dashboard', 'configure', 'dashboard.configure', 'Configure Dashboard', 'Configure dashboard widgets')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Customers Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('customers', 'view', 'customers.view', 'View Customers', 'View customer list'),
('customers', 'create', 'customers.create', 'Create Customers', 'Create new customers'),
('customers', 'edit', 'customers.edit', 'Edit Customers', 'Edit existing customers'),
('customers', 'delete', 'customers.delete', 'Delete Customers', 'Delete customers'),
('customers', 'export', 'customers.export', 'Export Customers', 'Export customer data'),
('customers', 'import', 'customers.import', 'Import Customers', 'Import customer data')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Loans Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('loans', 'view', 'loans.view', 'View Loans', 'View loan list'),
('loans', 'create', 'loans.create', 'Create Loans', 'Create new loans'),
('loans', 'edit', 'loans.edit', 'Edit Loans', 'Edit existing loans'),
('loans', 'delete', 'loans.delete', 'Delete Loans', 'Delete loans'),
('loans', 'export', 'loans.export', 'Export Loans', 'Export loan data'),
('loans', 'import', 'loans.import', 'Import Loans', 'Import loan data')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Cases Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('cases', 'view', 'cases.view', 'View Cases', 'View recovery cases'),
('cases', 'create', 'cases.create', 'Create Cases', 'Create new cases'),
('cases', 'edit', 'cases.edit', 'Edit Cases', 'Edit existing cases'),
('cases', 'delete', 'cases.delete', 'Delete Cases', 'Delete cases'),
('cases', 'assign', 'cases.assign', 'Assign Cases', 'Assign cases to agents'),
('cases', 'approve', 'cases.approve', 'Approve Cases', 'Approve case decisions'),
('cases', 'export', 'cases.export', 'Export Cases', 'Export case data')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Payments Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('payments', 'view', 'payments.view', 'View Payments', 'View payment list'),
('payments', 'create', 'payments.create', 'Create Payments', 'Record new payments'),
('payments', 'edit', 'payments.edit', 'Edit Payments', 'Edit payment records'),
('payments', 'approve', 'payments.approve', 'Approve Payments', 'Approve payment transactions'),
('payments', 'export', 'payments.export', 'Export Payments', 'Export payment data'),
('payments', 'import', 'payments.import', 'Import Payments', 'Import payment data')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Reports Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('reports', 'view', 'reports.view', 'View Reports', 'View reports'),
('reports', 'create', 'reports.create', 'Generate Reports', 'Generate reports'),
('reports', 'export', 'reports.export', 'Export Reports', 'Export reports'),
('reports', 'configure', 'reports.configure', 'Configure Reports', 'Configure report settings')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- AI Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('ai', 'view', 'ai.view', 'View AI Assistant', 'Access AI assistant'),
('ai', 'create', 'ai.generate', 'Generate AI Insights', 'Use AI features'),
('ai', 'configure', 'ai.configure', 'Configure AI', 'Configure AI settings')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Users Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('users', 'view', 'users.view', 'View Users', 'View user list'),
('users', 'create', 'users.create', 'Create Users', 'Create new users'),
('users', 'edit', 'users.edit', 'Edit Users', 'Edit existing users'),
('users', 'delete', 'users.delete', 'Delete Users', 'Delete users'),
('users', 'assign', 'users.assign', 'Assign Roles', 'Assign roles to users'),
('users', 'configure', 'users.reset_password', 'Reset Passwords', 'Reset user passwords')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Roles Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('roles', 'view', 'roles.view', 'View Roles', 'View role list'),
('roles', 'create', 'roles.create', 'Create Roles', 'Create new roles'),
('roles', 'edit', 'roles.edit', 'Edit Roles', 'Edit existing roles'),
('roles', 'delete', 'roles.delete', 'Delete Roles', 'Delete roles'),
('roles', 'create', 'roles.clone', 'Clone Roles', 'Clone existing roles'),
('roles', 'assign', 'roles.assign_permissions', 'Assign Permissions', 'Assign permissions to roles')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Permissions Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('permissions', 'view', 'permissions.view', 'View Permissions', 'View available permissions'),
('permissions', 'assign', 'permissions.assign', 'Assign Permissions', 'Assign permissions to roles')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Departments Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('departments', 'view', 'departments.view', 'View Departments', 'View department list'),
('departments', 'create', 'departments.create', 'Create Departments', 'Create new departments'),
('departments', 'edit', 'departments.edit', 'Edit Departments', 'Edit existing departments'),
('departments', 'delete', 'departments.delete', 'Delete Departments', 'Delete departments')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Teams Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('teams', 'view', 'teams.view', 'View Teams', 'View team list'),
('teams', 'create', 'teams.create', 'Create Teams', 'Create new teams'),
('teams', 'edit', 'teams.edit', 'Edit Teams', 'Edit existing teams'),
('teams', 'delete', 'teams.delete', 'Delete Teams', 'Delete teams'),
('teams', 'assign', 'teams.assign_members', 'Assign Members', 'Assign users to teams')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Settings Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('settings', 'view', 'settings.view', 'View Settings', 'View settings page'),
('settings', 'edit', 'settings.edit', 'Edit Settings', 'Edit settings'),
('settings', 'configure', 'settings.configure', 'Configure Settings', 'Configure system settings')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- Organization Module
INSERT INTO permission_matrix (module_code, action_code, permission_code, name, description) VALUES
('organization', 'view', 'organization.view', 'View Organization', 'View organization details'),
('organization', 'edit', 'organization.edit', 'Edit Organization', 'Edit organization details'),
('organization', 'configure', 'organization.configure', 'Configure Organization', 'Configure organization settings')
ON CONFLICT (module_code, action_code) DO NOTHING;

-- 5. Create Indexes
CREATE INDEX IF NOT EXISTS idx_permission_actions_action_code ON permission_actions(action_code);
CREATE INDEX IF NOT EXISTS idx_permission_matrix_module_code ON permission_matrix(module_code);
CREATE INDEX IF NOT EXISTS idx_permission_matrix_action_code ON permission_matrix(action_code);
CREATE INDEX IF NOT EXISTS idx_permission_matrix_permission_code ON permission_matrix(permission_code);

-- 6. Create Role Permission Matrix Junction Table
-- This replaces/enhances the role_permissions table to use the permission matrix
CREATE TABLE IF NOT EXISTS role_permission_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_matrix_id UUID NOT NULL REFERENCES permission_matrix(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(role_id, permission_matrix_id)
);

-- 7. Create Indexes for Role Permission Matrix
CREATE INDEX IF NOT EXISTS idx_role_permission_matrix_role_id ON role_permission_matrix(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permission_matrix_permission_matrix_id ON role_permission_matrix(permission_matrix_id);

-- 8. Update existing role_permissions to use the new matrix
-- This migrates existing permissions to the new matrix structure
DO $$
DECLARE
    v_role_permission RECORD;
    v_permission_matrix_id UUID;
BEGIN
    FOR v_role_permission IN 
        SELECT rp.role_id, p.module_code, p.permission_code
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
    LOOP
        -- Extract action from permission_code (e.g., "customers.view" -> "view")
        -- This is a simplified migration - in production you'd need more sophisticated mapping
        SELECT id INTO v_permission_matrix_id 
        FROM permission_matrix 
        WHERE module_code = v_role_permission.module_code 
        AND permission_code = v_role_permission.permission_code;
        
        IF v_permission_matrix_id IS NOT NULL THEN
            INSERT INTO role_permission_matrix (role_id, permission_matrix_id)
            VALUES (v_role_permission.role_id, v_permission_matrix_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- 9. Create Dashboard Configurations Table
CREATE TABLE IF NOT EXISTS dashboard_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    config_name VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, config_name)
);

-- 10. Insert Default Dashboard Configurations for System Roles
-- Tenant Admin Dashboard
INSERT INTO dashboard_configurations (role_id, config_name, config, is_default) VALUES
((SELECT id FROM roles WHERE code = 'tenant_admin'), 'default', 
 '{
   "widgets": [
     {"id": "org_info", "type": "organization_info", "position": {"x": 0, "y": 0, "w": 6, "h": 2}},
     {"id": "subscription", "type": "subscription_summary", "position": {"x": 6, "y": 0, "w": 6, "h": 2}},
     {"id": "kpi_users", "type": "kpi_card", "title": "Total Users", "metric": "users", "position": {"x": 0, "y": 2, "w": 3, "h": 2}},
     {"id": "kpi_depts", "type": "kpi_card", "title": "Departments", "metric": "departments", "position": {"x": 3, "y": 2, "w": 3, "h": 2}},
     {"id": "kpi_teams", "type": "kpi_card", "title": "Teams", "metric": "teams", "position": {"x": 6, "y": 2, "w": 3, "h": 2}},
     {"id": "kpi_roles", "type": "kpi_card", "title": "Roles", "metric": "roles", "position": {"x": 9, "y": 2, "w": 3, "h": 2}},
     {"id": "setup_checklist", "type": "setup_checklist", "position": {"x": 0, "y": 4, "w": 8, "h": 4}},
     {"id": "quick_actions", "type": "quick_actions", "position": {"x": 8, "y": 4, "w": 4, "h": 4}},
     {"id": "recent_activities", "type": "recent_activities", "position": {"x": 6, "y": 8, "w": 6, "h": 4}}
   ]
 }', true)
ON CONFLICT (role_id, config_name) DO NOTHING;

-- Recovery Manager Dashboard
INSERT INTO dashboard_configurations (role_id, config_name, config, is_default) VALUES
((SELECT id FROM roles WHERE code = 'recovery_manager'), 'default',
 '{
   "widgets": [
     {"id": "kpi_customers", "type": "kpi_card", "title": "Total Customers", "metric": "customers", "position": {"x": 0, "y": 0, "w": 3, "h": 2}},
     {"id": "kpi_loans", "type": "kpi_card", "title": "Active Loans", "metric": "loans", "position": {"x": 3, "y": 0, "w": 3, "h": 2}},
     {"id": "kpi_cases", "type": "kpi_card", "title": "Open Cases", "metric": "cases", "position": {"x": 6, "y": 0, "w": 3, "h": 2}},
     {"id": "kpi_collections", "type": "kpi_card", "title": "Collections", "metric": "collections", "position": {"x": 9, "y": 0, "w": 3, "h": 2}},
     {"id": "recovery_chart", "type": "recovery_chart", "position": {"x": 0, "y": 2, "w": 6, "h": 4}},
     {"id": "team_performance", "type": "team_performance", "position": {"x": 6, "y": 2, "w": 6, "h": 4}},
     {"id": "recent_cases", "type": "recent_cases", "position": {"x": 0, "y": 6, "w": 12, "h": 4}}
   ]
 }', true)
ON CONFLICT (role_id, config_name) DO NOTHING;

-- Recovery Agent Dashboard
INSERT INTO dashboard_configurations (role_id, config_name, config, is_default) VALUES
((SELECT id FROM roles WHERE code = 'recovery_agent'), 'default',
 '{
   "widgets": [
     {"id": "kpi_assigned", "type": "kpi_card", "title": "Assigned Cases", "metric": "assigned_cases", "position": {"x": 0, "y": 0, "w": 4, "h": 2}},
     {"id": "kpi_completed", "type": "kpi_card", "title": "Completed Today", "metric": "completed_today", "position": {"x": 4, "y": 0, "w": 4, "h": 2}},
     {"id": "kpi_pending", "type": "kpi_card", "title": "Pending Actions", "metric": "pending_actions", "position": {"x": 8, "y": 0, "w": 4, "h": 2}},
     {"id": "my_cases", "type": "my_cases", "position": {"x": 0, "y": 2, "w": 12, "h": 6}},
     {"id": "upcoming_tasks", "type": "upcoming_tasks", "position": {"x": 0, "y": 8, "w": 6, "h": 4}},
     {"id": "recent_activities", "type": "recent_activities", "position": {"x": 6, "y": 8, "w": 6, "h": 4}}
   ]
 }', true)
ON CONFLICT (role_id, config_name) DO NOTHING;

-- 11. Create Indexes for Dashboard Configurations
CREATE INDEX IF NOT EXISTS idx_dashboard_configurations_role_id ON dashboard_configurations(role_id);

-- 12. Create Module Configurations Table (for sidebar/route generation)
CREATE TABLE IF NOT EXISTS module_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_code VARCHAR(100) UNIQUE NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    route VARCHAR(255),
    description TEXT,
    is_core_module BOOLEAN DEFAULT false,
    required_subscription_tier VARCHAR(50),
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Insert Module Configurations
INSERT INTO module_configurations (module_code, module_name, category, icon, route, is_core_module, sort_order) VALUES
('dashboard', 'Dashboard', 'Overview', 'LayoutDashboard', '/app/dashboard', true, 1),
('organization', 'Organization', 'Administration', 'Building2', '/app/organization', true, 2),
('customers', 'Customers', 'Recovery', 'Users', '/app/customers', true, 3),
('loans', 'Loans', 'Recovery', 'FileText', '/app/loans', true, 4),
('cases', 'Cases', 'Recovery', 'Briefcase', '/app/cases', true, 5),
('payments', 'Payments', 'Recovery', 'CreditCard', '/app/payments', true, 6),
('reports', 'Reports', 'Analytics', 'BarChart3', '/app/reports', true, 7),
('ai', 'AI Assistant', 'AI', 'Bot', '/app/ai', false, 8),
('users', 'Users', 'Administration', 'Users', '/app/admin/users', true, 9),
('roles', 'Roles', 'Administration', 'Shield', '/app/admin/roles', true, 10),
('permissions', 'Permissions', 'Administration', 'KeyRound', '/app/admin/permissions', true, 11),
('departments', 'Departments', 'Administration', 'Network', '/app/admin/departments', true, 12),
('teams', 'Teams', 'Administration', 'UsersRound', '/app/admin/teams', true, 13),
('settings', 'Settings', 'Administration', 'Settings', '/app/settings', true, 14)
ON CONFLICT (module_code) DO NOTHING;

-- 14. Create Indexes for Module Configurations
CREATE INDEX IF NOT EXISTS idx_module_configurations_module_code ON module_configurations(module_code);
CREATE INDEX IF NOT EXISTS idx_module_configurations_category ON module_configurations(category);
CREATE INDEX IF NOT EXISTS idx_module_configurations_is_active ON module_configurations(is_active);
