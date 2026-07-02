-- Sprint 4: Tenant Management and Subscription Management Schema
-- Run this to add new tables and enhance existing ones

\c recoverflow_dev;

-- Enhanced Tenants table
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

-- Subscription Plans table
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

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    subscription_code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled, expired
    billing_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly, yearly
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    payment_method VARCHAR(50),
    last_payment_date TIMESTAMP,
    next_payment_date TIMESTAMP,
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage Tracking table
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

-- Tenant Integrations table
CREATE TABLE IF NOT EXISTS tenant_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL, -- dialer, sms, whatsapp, email, payment, ai
    provider VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, integration_type, provider)
);

-- Tenant Branding table
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

-- Enhanced Audit Logs table
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS severity VARCHAR(50) DEFAULT 'info',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
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

-- Insert default subscription plans
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
