
-- Add missing tables to RecoverFlow database

\c recoverflow_dev;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Add missing columns to tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS subdomain VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS gst_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS brand_color VARCHAR(20),
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- 2. Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_code VARCHAR(100) UNIQUE NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    max_users INTEGER DEFAULT 5,
    max_tenants INTEGER DEFAULT 1,
    features JSONB DEFAULT '{}',
    modules JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_code VARCHAR(100) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    plan_code VARCHAR(50) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'cancelled', 'expired')) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_code VARCHAR(100) UNIQUE NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  route VARCHAR(255),
  sort_order INT DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  is_core_module BOOLEAN NOT NULL DEFAULT FALSE,
  is_add_on BOOLEAN NOT NULL DEFAULT FALSE,
  requires_subscription_tier VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Create tenant_modules table
CREATE TABLE IF NOT EXISTS tenant_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  module_code VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  overrides_subscription BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, module_id)
);

-- 6. Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INTEGER DEFAULT 0,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    unit VARCHAR(50) DEFAULT 'count',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, metric_name, period_start, period_end)
);

-- 7. Create tenant_integrations table
CREATE TABLE IF NOT EXISTS tenant_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, integration_type, provider)
);

-- 8. Create tenant_branding table
CREATE TABLE IF NOT EXISTS tenant_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20),
    secondary_color VARCHAR(20),
    accent_color VARCHAR(20),
    login_background_url TEXT,
    email_footer TEXT,
    custom_css TEXT,
    custom_domain VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Add missing columns to audit_logs table
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS severity VARCHAR(50) DEFAULT 'info',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 10. Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_tenant_id ON usage_tracking(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_metric ON usage_tracking(metric_name);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_tenant_id ON tenant_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_type ON tenant_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_tenant_branding_tenant_id ON tenant_branding(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_tenants_archived ON tenants(archived_at);
CREATE INDEX IF NOT EXISTS idx_tenants_deleted ON tenants(deleted_at);
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_id ON tenant_modules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_modules_is_enabled ON tenant_modules(is_enabled);

-- 11. Insert default subscription plans
INSERT INTO subscription_plans (plan_code, plan_name, description, price_monthly, price_yearly, max_users, max_tenants, features, modules) VALUES
('starter', 'Starter', 'Essential features for small teams', 99.00, 990.00, 5, 1, 
 '{"basic_dashboard": true, "customer_management": true, "case_management": true, "basic_reports": true, "email_notifications": true}',
 '{"recovery": true, "customers": true, "reports": true}'),
('professional', 'Professional', 'Advanced features for growing teams', 299.00, 2990.00, 25, 5,
 '{"basic_dashboard": true, "customer_management": true, "case_management": true, "basic_reports": true, "email_notifications": true, "advanced_dashboard": true, "smart_dialer": true, "whatsapp_integration": true, "advanced_reports": true, "ai_predictions": true, "team_management": true}',
 '{"recovery": true, "customers": true, "communication": true, "analytics": true, "ai": true}'),
('enterprise', 'Enterprise', 'Full-featured solution for large organizations', 999.00, 9990.00, -1, -1,
 '{"basic_dashboard": true, "customer_management": true, "case_management": true, "basic_reports": true, "email_notifications": true, "advanced_dashboard": true, "smart_dialer": true, "whatsapp_integration": true, "advanced_reports": true, "ai_predictions": true, "team_management": true, "ai_assistant": true, "legal_management": true, "custom_workflows": true, "api_access": true, "white_label": true, "priority_support": true}',
 '{"recovery": true, "customers": true, "communication": true, "finance": true, "analytics": true, "ai": true, "administration": true}')
ON CONFLICT (plan_code) DO NOTHING;

-- 12. Insert default modules
INSERT INTO modules (module_code, module_name, category, description, sort_order, status, is_core_module, is_add_on) VALUES
('dashboard', 'Dashboard', 'Core', 'Main dashboard with key metrics', 1, 'active', true, false),
('tenants', 'Tenant Management', 'Platform', 'Manage tenant organizations', 2, 'active', true, false),
('users', 'User Management', 'Core', 'Manage system users', 3, 'active', true, false),
('customers', 'Customer Management', 'Recovery', 'Manage customer profiles', 4, 'active', true, false),
('loans', 'Loan Management', 'Recovery', 'Manage loan accounts', 5, 'active', true, false),
('cases', 'Case Management', 'Recovery', 'Manage recovery cases', 6, 'active', true, false),
('payments', 'Payment Tracking', 'Recovery', 'Track payments', 7, 'active', true, false),
('reports', 'Reports & Analytics', 'Analytics', 'Generate reports', 8, 'active', true, false),
('ai-assistant', 'AI Assistant', 'AI', 'AI-powered assistance', 9, 'active', false, true),
('billing', 'Billing & Subscriptions', 'Platform', 'Manage billing', 10, 'active', true, false),
('settings', 'Settings', 'Core', 'Application settings', 11, 'active', true, false)
ON CONFLICT (module_code) DO NOTHING;

-- 13. Assign modules to existing tenant
DO $$
DECLARE
    v_tenant_id UUID;
BEGIN
    SELECT id INTO v_tenant_id FROM tenants WHERE tenant_code = 'TESTORG';
    
    IF v_tenant_id IS NOT NULL THEN
        INSERT INTO tenant_modules (tenant_id, module_id, module_code, is_enabled, is_custom, overrides_subscription)
        SELECT v_tenant_id, id, module_code, true, false, false
        FROM modules
        WHERE is_core_module = true
        ON CONFLICT (tenant_id, module_id) DO NOTHING;
    END IF;
END $$;
