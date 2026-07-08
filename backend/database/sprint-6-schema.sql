-- =============================================
-- Sprint 6: Dynamic Case Engine & Master Configuration
-- Database Schema
-- =============================================

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Case Status Master
-- =============================================
CREATE TABLE IF NOT EXISTS case_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    status_code VARCHAR(100) NOT NULL,
    status_name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(50) DEFAULT '#6366F1',
    icon VARCHAR(50),
    order_index INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50), -- NEW, IN_PROGRESS, PENDING, CLOSED
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, status_code)
);

CREATE INDEX IF NOT EXISTS idx_case_statuses_tenant_id ON case_statuses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_case_statuses_category ON case_statuses(category);

-- =============================================
-- 2. Activity Master
-- =============================================
CREATE TABLE IF NOT EXISTS activity_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    activity_code VARCHAR(100) NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50), -- COMMUNICATION, VISIT, PAYMENT, NOTE, LEGAL
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, activity_code)
);

CREATE INDEX IF NOT EXISTS idx_activity_types_tenant_id ON activity_types(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activity_types_category ON activity_types(category);

-- =============================================
-- 3. Case Types (Core Engine)
-- =============================================
CREATE TABLE IF NOT EXISTS case_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    case_type_code VARCHAR(100) NOT NULL,
    case_type_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50) DEFAULT '#6366F1',
    -- Configurations
    workflow_template_id UUID REFERENCES workflow_templates(id) ON DELETE SET NULL,
    assignment_rule_id UUID REFERENCES business_rules(id) ON DELETE SET NULL,
    priority_rule_id UUID REFERENCES business_rules(id) ON DELETE SET NULL,
    default_status_id UUID REFERENCES case_statuses(id) ON DELETE SET NULL,
    -- Requirements & Configs
    required_documents JSONB DEFAULT '[]',
    communication_templates JSONB DEFAULT '[]',
    sla_config JSONB DEFAULT '{}',
    custom_fields JSONB DEFAULT '[]', -- Dynamic form fields
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, case_type_code)
);

CREATE INDEX IF NOT EXISTS idx_case_types_tenant_id ON case_types(tenant_id);
CREATE INDEX IF NOT EXISTS idx_case_types_workflow_template ON case_types(workflow_template_id);

-- =============================================
-- 4. Dynamic Form Fields (Reusable)
-- =============================================
CREATE TABLE IF NOT EXISTS custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    field_code VARCHAR(100) NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    description TEXT,
    field_type VARCHAR(50) NOT NULL, -- TEXT, DROPDOWN, NUMBER, DATE, CHECKBOX, FILE_UPLOAD, SELECT_MULTIPLE, TEXTAREA, EMAIL, PHONE
    is_required BOOLEAN DEFAULT false,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    -- Field Config
    field_config JSONB DEFAULT '{}', -- { options: [], min: 0, max: 100, ... }
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, field_code)
);

CREATE INDEX IF NOT EXISTS idx_custom_fields_tenant_id ON custom_fields(tenant_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_field_type ON custom_fields(field_type);

-- =============================================
-- 5. Communication Templates
-- =============================================
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    template_code VARCHAR(100) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    channel VARCHAR(50) NOT NULL, -- SMS, EMAIL, WHATSAPP, LETTER, PUSH_NOTIFICATION
    subject VARCHAR(255), -- For email
    content TEXT NOT NULL, -- Can include variables like {{customer_name}}, {{case_number}}
    template_variables JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, template_code)
);

CREATE INDEX IF NOT EXISTS idx_communication_templates_tenant_id ON communication_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_communication_templates_channel ON communication_templates(channel);

-- =============================================
-- 6. Dashboard Widget Registry (Master)
-- =============================================
CREATE TABLE IF NOT EXISTS widget_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_code VARCHAR(100) UNIQUE NOT NULL,
    widget_name VARCHAR(255) NOT NULL,
    description TEXT,
    widget_type VARCHAR(50) NOT NULL, -- KPI, CHART, ACTIVITY_FEED, QUICK_ACTION, WORK_QUEUE, AI_RECOMMENDATION
    component_name VARCHAR(255) NOT NULL, -- React component name
    default_config JSONB DEFAULT '{}',
    allowed_roles VARCHAR[] DEFAULT '{}',
    is_system BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. Tenant Widget Configurations
-- =============================================
CREATE TABLE IF NOT EXISTS tenant_widget_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    widget_registry_id UUID NOT NULL REFERENCES widget_registry(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    widget_config JSONB NOT NULL DEFAULT '{}',
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 2,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, widget_registry_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_widget_configs_tenant_id ON tenant_widget_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_widget_configs_role_id ON tenant_widget_configs(role_id);
