const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'recoverflow_dev',
  user: 'postgres',
  password: 'Nakshtra@13',
});

async function runMissingTablesMigration() {
  const client = await pool.connect();
  try {
    console.log('Connecting to database...');
    
    await client.query('BEGIN');
    
    console.log('Adding missing columns to tenants table...');
    await client.query(`
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
      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS business_type VARCHAR(100)
    `);
    
    console.log('Creating subscription_plans table...');
    await client.query(`
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
      )
    `);
    
    console.log('Creating subscriptions table...');
    await client.query(`
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
      )
    `);
    
    console.log('Creating modules table...');
    await client.query(`
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
      )
    `);
    
    console.log('Creating tenant_modules table...');
    await client.query(`
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
      )
    `);
    
    console.log('Inserting default subscription plans...');
    await client.query(`
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
      ON CONFLICT (plan_code) DO NOTHING
    `);
    
    console.log('Inserting default modules...');
    await client.query(`
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
      ON CONFLICT (module_code) DO NOTHING
    `);
    
    await client.query('COMMIT');
    console.log('✅ Missing tables migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMissingTablesMigration();
