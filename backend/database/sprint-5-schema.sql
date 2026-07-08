-- =============================================
-- Sprint 5: Dynamic Organization Configuration
-- Database Schema
-- =============================================

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Industry Templates
-- =============================================
CREATE TABLE IF NOT EXISTS industry_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_code VARCHAR(100) UNIQUE NOT NULL,
    industry_name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. Domain Packs (Core Engine)
-- =============================================
CREATE TABLE IF NOT EXISTS domain_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for system packs
    industry_code VARCHAR(100) REFERENCES industry_templates(industry_code),
    pack_code VARCHAR(100) NOT NULL,
    pack_name VARCHAR(255) NOT NULL,
    description TEXT,
    version INTEGER DEFAULT 1,
    is_system_pack BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    -- Pack Content (JSONB for flexibility)
    default_modules JSONB DEFAULT '[]',
    default_business_units JSONB DEFAULT '[]',
    default_workflows JSONB DEFAULT '[]',
    default_roles JSONB DEFAULT '[]',
    default_dashboard JSONB DEFAULT '[]',
    default_reports JSONB DEFAULT '[]',
    default_business_rules JSONB DEFAULT '[]',
    default_communication_templates JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, pack_code)
);

CREATE INDEX IF NOT EXISTS idx_domain_packs_tenant_id ON domain_packs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_domain_packs_industry_code ON domain_packs(industry_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_packs_system_unique ON domain_packs(industry_code, pack_code) WHERE tenant_id IS NULL;

-- =============================================
-- 3. Business Units (Replaces Departments)
-- =============================================
CREATE TABLE IF NOT EXISTS business_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES business_units(id) ON DELETE SET NULL,
    business_unit_code VARCHAR(100) NOT NULL,
    business_unit_name VARCHAR(255) NOT NULL,
    business_unit_type VARCHAR(50) NOT NULL DEFAULT 'DEPARTMENT', -- BRANCH, REGION, DIVISION, DEPARTMENT
    description TEXT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    -- Location
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, business_unit_code)
);

CREATE INDEX IF NOT EXISTS idx_business_units_tenant_id ON business_units(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_units_parent_id ON business_units(parent_id);

-- =============================================
-- 4. Workflow Templates
-- =============================================
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for system templates
    template_code VARCHAR(100) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_system_template BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, template_code)
);

CREATE INDEX IF NOT EXISTS idx_workflow_templates_tenant_id ON workflow_templates(tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflow_templates_system_unique ON workflow_templates(template_code) WHERE tenant_id IS NULL;

-- =============================================
-- 5. Workflow Stages
-- =============================================
CREATE TABLE IF NOT EXISTS workflow_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_template_id UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
    stage_code VARCHAR(100) NOT NULL,
    stage_name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    color VARCHAR(50) DEFAULT '#6366F1',
    icon VARCHAR(50),
    is_initial BOOLEAN DEFAULT false,
    is_final BOOLEAN DEFAULT false,
    -- Configuration
    allowed_next_stage_ids UUID[] DEFAULT '{}',
    auto_actions JSONB DEFAULT '[]',
    permissions JSONB DEFAULT '{}',
    sla_hours INTEGER,
    notifications JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_template_id, stage_code)
);

CREATE INDEX IF NOT EXISTS idx_workflow_stages_workflow_id ON workflow_stages(workflow_template_id);
CREATE INDEX IF NOT EXISTS idx_workflow_stages_order ON workflow_stages(order_index);

-- =============================================
-- 6. Business Rules
-- =============================================
CREATE TABLE IF NOT EXISTS business_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    rule_code VARCHAR(100) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- ASSIGNMENT, NOTIFICATION, ESCALATION, APPROVAL, REMINDER, LEGAL_TRIGGER, SETTLEMENT_TRIGGER, AUTO_CLOSE
    conditions JSONB NOT NULL DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, rule_code)
);

CREATE INDEX IF NOT EXISTS idx_business_rules_tenant_id ON business_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_rules_rule_type ON business_rules(rule_type);

-- =============================================
-- 7. Organization Configuration
-- =============================================
CREATE TABLE IF NOT EXISTS organization_configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    -- Setup Status
    organization_setup_completed BOOLEAN DEFAULT false,
    setup_current_step INTEGER DEFAULT 1,
    -- Organization Details
    logo_url TEXT,
    business_name VARCHAR(255),
    industry_code VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(100) DEFAULT 'UTC',
    currency VARCHAR(10) DEFAULT 'USD',
    -- Business Hours
    business_hours JSONB DEFAULT '{}',
    working_days JSONB DEFAULT '["monday", "tuesday", "wednesday", "thursday", "friday"]',
    holiday_calendar JSONB DEFAULT '[]',
    -- Approval Hierarchy
    approval_hierarchy JSONB DEFAULT '[]',
    -- SLA Config
    sla_config JSONB DEFAULT '{}',
    -- Default Language
    default_language VARCHAR(10) DEFAULT 'en',
    -- Applied Domain Pack
    applied_domain_pack_id UUID REFERENCES domain_packs(id) ON DELETE SET NULL,
    applied_workflow_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_org_config_tenant_id ON organization_configuration(tenant_id);

-- =============================================
-- 8. Dashboard Widget Configurations
-- =============================================
CREATE TABLE IF NOT EXISTS dashboard_widget_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSONB NOT NULL DEFAULT '{}',
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 2,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_tenant_id ON dashboard_widget_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_role_id ON dashboard_widget_configs(role_id);

-- =============================================
-- 9. Role-Business Unit Associations
-- =============================================
CREATE TABLE IF NOT EXISTS role_business_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, business_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_role_business_units_role_id ON role_business_units(role_id);
CREATE INDEX IF NOT EXISTS idx_role_business_units_business_unit_id ON role_business_units(business_unit_id);

-- =============================================
-- 10. Update Existing Tables
-- =============================================

-- Enhance tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS organization_configuration_id UUID REFERENCES organization_configuration(id) ON DELETE SET NULL;

-- Enhance users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL;

-- Enhance teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_org_config_id ON tenants(organization_configuration_id);
CREATE INDEX IF NOT EXISTS idx_users_business_unit_id ON users(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_teams_business_unit_id ON teams(business_unit_id);



-- =============================================
-- Sprint 5 Compatibility Upgrades
-- =============================================

ALTER TABLE industry_templates
ADD COLUMN IF NOT EXISTS default_business_units JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS default_workflows JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS default_modules JSONB DEFAULT '[]';

ALTER TABLE workflow_templates
ADD COLUMN IF NOT EXISTS industry_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS stages JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS transitions JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sla_config JSONB NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_workflow_templates_industry_code ON workflow_templates(industry_code);

ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS workflow_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tenants_workflow_template_id ON tenants(workflow_template_id);

ALTER TABLE roles
ADD COLUMN IF NOT EXISTS dashboard_layout JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS menu_items JSONB DEFAULT '[]';
