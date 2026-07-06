
-- Sprint 3 Database Schema: Organization Administration, Roles, Permissions & User Management
-- Run this to add all new tables and enhance existing ones

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(tenant_id, code)
);

-- 2. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(tenant_id, code)
);

-- 3. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for platform-wide roles
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false, -- Can't delete/edit system roles
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(tenant_id, code)
);

-- 4. Permissions Table (Defines all available permissions)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_code VARCHAR(100) NOT NULL,
    permission_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permission_type VARCHAR(50) NOT NULL DEFAULT 'action', -- module, page, action, feature
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_code, permission_code)
);

-- 5. Role Permissions Junction Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- 6. User Roles Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, role_id)
);

-- 7. Enhance Users Table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- 8. Create Indexes
CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON departments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_teams_tenant_id ON teams(tenant_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module_code ON permissions(module_code);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);

-- 9. Insert Default Permissions
INSERT INTO permissions (module_code, permission_code, name, description, permission_type) VALUES
-- Dashboard Module
('dashboard', 'dashboard.view', 'View Dashboard', 'Access to the dashboard', 'page'),
('dashboard', 'dashboard.widgets', 'Manage Widgets', 'Add/remove dashboard widgets', 'action'),
-- Customers Module
('customers', 'customers.view', 'View Customers', 'View customer list', 'page'),
('customers', 'customers.create', 'Create Customers', 'Create new customers', 'action'),
('customers', 'customers.edit', 'Edit Customers', 'Edit existing customers', 'action'),
('customers', 'customers.delete', 'Delete Customers', 'Delete customers', 'action'),
('customers', 'customers.export', 'Export Customers', 'Export customer data', 'action'),
-- Loans Module
('loans', 'loans.view', 'View Loans', 'View loan list', 'page'),
('loans', 'loans.create', 'Create Loans', 'Create new loans', 'action'),
('loans', 'loans.edit', 'Edit Loans', 'Edit existing loans', 'action'),
('loans', 'loans.delete', 'Delete Loans', 'Delete loans', 'action'),
('loans', 'loans.export', 'Export Loans', 'Export loan data', 'action'),
-- Cases Module
('cases', 'cases.view', 'View Cases', 'View recovery cases', 'page'),
('cases', 'cases.create', 'Create Cases', 'Create new cases', 'action'),
('cases', 'cases.edit', 'Edit Cases', 'Edit existing cases', 'action'),
('cases', 'cases.delete', 'Delete Cases', 'Delete cases', 'action'),
('cases', 'cases.assign', 'Assign Cases', 'Assign cases to agents', 'action'),
('cases', 'cases.approve', 'Approve Cases', 'Approve case decisions', 'action'),
-- Payments Module
('payments', 'payments.view', 'View Payments', 'View payment list', 'page'),
('payments', 'payments.create', 'Create Payments', 'Record new payments', 'action'),
('payments', 'payments.export', 'Export Payments', 'Export payment data', 'action'),
-- Reports Module
('reports', 'reports.view', 'View Reports', 'View reports', 'page'),
('reports', 'reports.generate', 'Generate Reports', 'Generate reports', 'action'),
('reports', 'reports.export', 'Export Reports', 'Export reports', 'action'),
-- AI Module
('ai', 'ai.view', 'View AI Assistant', 'Access AI assistant', 'page'),
('ai', 'ai.generate', 'Generate AI Insights', 'Use AI features', 'action'),
-- Users Module
('users', 'users.view', 'View Users', 'View user list', 'page'),
('users', 'users.create', 'Create Users', 'Create new users', 'action'),
('users', 'users.edit', 'Edit Users', 'Edit existing users', 'action'),
('users', 'users.delete', 'Delete Users', 'Delete users', 'action'),
('users', 'users.lock', 'Lock/Unlock Users', 'Lock/unlock user accounts', 'action'),
('users', 'users.reset_password', 'Reset Passwords', 'Reset user passwords', 'action'),
-- Roles & Permissions Module
('roles', 'roles.view', 'View Roles', 'View role list', 'page'),
('roles', 'roles.create', 'Create Roles', 'Create new roles', 'action'),
('roles', 'roles.edit', 'Edit Roles', 'Edit existing roles', 'action'),
('roles', 'roles.delete', 'Delete Roles', 'Delete roles', 'action'),
('roles', 'roles.clone', 'Clone Roles', 'Clone existing roles', 'action'),
('permissions', 'permissions.view', 'View Permissions', 'View available permissions', 'page'),
('permissions', 'permissions.assign', 'Assign Permissions', 'Assign permissions to roles', 'action'),
-- Departments Module
('departments', 'departments.view', 'View Departments', 'View department list', 'page'),
('departments', 'departments.create', 'Create Departments', 'Create new departments', 'action'),
('departments', 'departments.edit', 'Edit Departments', 'Edit existing departments', 'action'),
('departments', 'departments.delete', 'Delete Departments', 'Delete departments', 'action'),
-- Teams Module
('teams', 'teams.view', 'View Teams', 'View team list', 'page'),
('teams', 'teams.create', 'Create Teams', 'Create new teams', 'action'),
('teams', 'teams.edit', 'Edit Teams', 'Edit existing teams', 'action'),
('teams', 'teams.delete', 'Delete Teams', 'Delete teams', 'action'),
-- Settings Module
('settings', 'settings.view', 'View Settings', 'View settings page', 'page'),
('settings', 'settings.edit', 'Edit Settings', 'Edit settings', 'action')
ON CONFLICT (module_code, permission_code) DO NOTHING;

-- 10. Insert Default System Roles
INSERT INTO roles (tenant_id, name, code, description, is_system_role, is_active) VALUES
-- Platform-wide roles (tenant_id NULL)
(NULL, 'Platform Owner', 'platform_owner', 'Full access to platform features', true, true),
-- Tenant-specific roles (we'll add these per tenant in a separate step)
(NULL, 'Tenant Admin', 'tenant_admin', 'Full access to tenant features', true, true),
(NULL, 'Recovery Manager', 'recovery_manager', 'Manages recovery operations', true, true),
(NULL, 'Team Leader', 'team_leader', 'Leads a recovery team', true, true),
(NULL, 'Recovery Agent', 'recovery_agent', 'Performs recovery activities', true, true),
(NULL, 'Legal Officer', 'legal_officer', 'Handles legal aspects', true, true),
(NULL, 'QA', 'qa', 'Quality assurance', true, true),
(NULL, 'Auditor', 'auditor', 'Audit operations', true, true),
(NULL, 'Read Only', 'read_only', 'Read-only access', true, true)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- 11. Create permissions for default system roles
-- Platform Owner gets all permissions
DO $$
DECLARE
    v_platform_owner_role_id UUID;
    v_permission_id UUID;
BEGIN
    SELECT id INTO v_platform_owner_role_id FROM roles WHERE code = 'platform_owner';
    
    FOR v_permission_id IN SELECT id FROM permissions LOOP
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (v_platform_owner_role_id, v_permission_id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- Tenant Admin gets tenant-specific permissions
DO $$
DECLARE
    v_tenant_admin_role_id UUID;
    v_permission_id UUID;
BEGIN
    SELECT id INTO v_tenant_admin_role_id FROM roles WHERE code = 'tenant_admin';
    
    FOR v_permission_id IN SELECT id FROM permissions WHERE module_code != 'platform' LOOP
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (v_tenant_admin_role_id, v_permission_id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- Recovery Manager permissions
DO $$
DECLARE
    v_role_id UUID;
BEGIN
    SELECT id INTO v_role_id FROM roles WHERE code = 'recovery_manager';
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_id, id FROM permissions WHERE module_code IN ('dashboard', 'customers', 'loans', 'cases', 'payments', 'reports', 'teams', 'users', 'departments')
    ON CONFLICT DO NOTHING;
END $$;

-- Recovery Agent permissions
DO $$
DECLARE
    v_role_id UUID;
BEGIN
    SELECT id INTO v_role_id FROM roles WHERE code = 'recovery_agent';
    
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_id, id FROM permissions WHERE module_code IN ('dashboard', 'customers', 'loans', 'cases', 'payments') AND permission_code IN ('view', 'create', 'edit')
    ON CONFLICT DO NOTHING;
END $$;
